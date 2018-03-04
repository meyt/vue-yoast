import YoastSeo from 'yoastseo'
import removeHtmlBlocks from 'yoastseo/js/stringProcessing/htmlParser.js'
import scoreToRating from 'yoastseo/js/interpreters/scoreToRating.js'
import {getI18n} from './utils.js'
import debounce from 'debounce'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    titleWidth: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: ''
    },
    keyword: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    locale: {
      type: String,
      default: 'en_US'
    },
    marker: {
      type: [Object, null],
      default () {
        return null
      }
    },
    permalink: {
      type: String,
      default: ''
    },
    translations: {
      type: Object,
      default () {
        return null
      }
    },
    resultFilter: {
      type: Function,
      default (result) {
        return result
      }
    }
  },
  data () {
    return {
      assessorResults: [],
      assessorResultsByRating: {},
      overallContentScore: null,
      overallContentRating: null,
      contentAssessor: null,
      debouncedRefresh: debounce(this.refresh, 1000)
    }
  },
  watch: {
    title (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.debouncedRefresh()
      }
    },
    description (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.debouncedRefresh()
      }
    },
    keyword (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.debouncedRefresh()
      }
    },
    url (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.debouncedRefresh()
      }
    },
    text (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.debouncedRefresh()
      }
    },
    translations (newVal) {
      this.i18n = getI18n(newVal)
      this.refresh()
    },
    locale (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.debouncedRefresh()
      }
    },
    overallContentScore () {
      this.$emit('update:overallScore', {
        score: this.overallContentScore,
        rating: this.overallContentRating
      })
    }
  },
  mounted () {
    this.i18n = getI18n(this.translations)
    this.refresh()
  },
  methods: {
    refreshPaper () {
      const text = removeHtmlBlocks(this.text)
      this.paper = new YoastSeo.Paper(text, {
        keyword: this.keyword,
        description: this.description,
        url: this.url,
        title: this.title,
        titleWidth: this.titleWidth,
        locale: this.locale,
        permalink: this.permalink
      })
    },
    refresh () {
      this.refreshPaper()
      this.contentAssessor = new YoastSeo.ContentAssessor(this.i18n, { marker: this.marker })
      this.contentAssessor.assess(this.paper)
      this.overallScore = this.contentAssessor.calculateOverallScore()
      this.overallRating = scoreToRating(this.contentAssessor.calculateOverallScore() / 10)
      this.assessorResults = []
      this.assessorResultsByRating = {}
      this.contentAssessor.results.forEach(item => {
        const result = this.resultFilter({
          rating: scoreToRating(item.score),
          socre: item.score,
          text: item.text
        })
        this.assessorResults.push(result)
        if (this.assessorResultsByRating.hasOwnProperty(result.rating)) {
          this.assessorResultsByRating[result.rating].push(result)
        } else {
          this.assessorResultsByRating[result.rating] = [result]
        }
      })
      this.$emit('update', {
        results: this.assessorResults,
        resultsByRating: this.assessorResultsByRating,
        overallScore: this.overallScore,
        overallRating: this.overallRating
      })
    }
  }
}
