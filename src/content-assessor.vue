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
import debounce from 'debounce'
import { Paper, ContentAssessor, interpreters, string } from 'yoastseo'
import { getAssessorRatings, getI18n } from './utils.js'

const removeHtmlBlocks = string.removeHtmlBlocks
const scoreToRating = interpreters.scoreToRating
const ratings = getAssessorRatings()

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
      contentAssessor: null
    }
  },
  computed: {
    items () {
      const res = []
      ratings.forEach((rating) => {
        const items = this.assessorResultsByRating[rating]
        if (typeof items === 'undefined') return
        items.forEach((item) => {
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
      this._debouncedRefresh()
    },
    locale (newVal, oldVal) {
      if (newVal !== oldVal) this._debouncedRefresh()
    },
    overallContentScore () {
      this.$emit('update:overallScore', {
        score: this.overallContentScore,
        rating: this.overallContentRating
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
      this.contentAssessor = new ContentAssessor(this.i18n, { marker: this.marker })
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
</script>

<style>
</style>
