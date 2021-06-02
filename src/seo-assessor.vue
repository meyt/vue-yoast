<template>
  <div class="vue-yoast vue-yoast-assessor vue-yoast-content-assessor">
    <div v-for="(item, index) in items" :key="index" :class="item._class" >
      <slot name="item" v-bind:item="item">
        <span class="vue-yoast-assessor-badge">&nbsp;</span>
        <span class="vue-yoast-assessor-text" v-html="item.text"></span>
      </slot>
    </div>
  </div>
</template>

<script>
import { SeoAssessor, Paper } from 'yoastseo'
import removeHtmlBlocks from 'yoastseo/src/stringProcessing/htmlParser.js'
import scoreToRating from 'yoastseo/src/interpreters/scoreToRating.js'
import { getAssessorRatings, getI18n } from './utils.js'
import debounce from 'debounce'
const ratings = getAssessorRatings()

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    titleWidth: {
      type: Number,
      default: 320
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
      overallSeoScore: null,
      overallSeoRating: null,
      seoAssessor: null
    }
  },
  computed: {
    items () {
      const res = []
      ratings.forEach((rating) => {
        const items = this.assessorResultsByRating[rating]
        if (typeof items === 'undefined') return
        items.forEach((item) => {
          if (item.text.length === 0) return
          item._class = [
            'vue-yoast-assessor-item',
            'vue-yoast-assessor-item-' + item.rating
          ]
          res.push(item)
        })
      })
      return res
    }
  },
  watch: {
    title (newVal, oldVal) {
      if (newVal !== oldVal) this._debouncedRefresh()
    },
    titleWidth (newVal, oldVal) {
      if (newVal !== oldVal) this._debouncedRefresh()
    },
    description (newVal, oldVal) {
      if (newVal !== oldVal) this._debouncedRefresh()
    },
    keyword (newVal, oldVal) {
      if (newVal !== oldVal) this._debouncedRefresh()
    },
    url (newVal, oldVal) {
      if (newVal !== oldVal) this._debouncedRefresh()
    },
    text (newVal, oldVal) {
      if (newVal !== oldVal) this._debouncedRefresh()
    },
    translations (newVal) {
      this.i18n = getI18n(newVal)
      this.refresh()
    },
    locale (newVal, oldVal) {
      if (newVal !== oldVal) this._debouncedRefresh()
    },
    overallSeoScore () {
      this.$emit('update:overallScore', {
        score: this.overallSeoScore,
        rating: this.overallSeoRating
      })
    }
  },
  created () {
    this._debouncedRefresh = debounce(this.refresh, 1000)
  },
  mounted () {
    this.i18n = getI18n(this.translations)
    this.refresh()
  },
  methods: {
    refreshPaper () {
      const text = removeHtmlBlocks(this.text)
      this.paper = new Paper(text, {
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
      this.seoAssessor = new SeoAssessor(this.i18n, { marker: this.marker })
      this.seoAssessor.assess(this.paper)
      this.overallSeoScore = this.seoAssessor.calculateOverallScore()
      this.overallSeoRating = scoreToRating(this.seoAssessor.calculateOverallScore() / 10)
      this.assessorResults = []
      this.assessorResultsByRating = {}
      this.seoAssessor.results.forEach(item => {
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
      this.$emit('update:results', this.assessorResults)
      this.$emit('update:resultsByRating', this.assessorResultsByRating)
    }
  }
}
</script>
