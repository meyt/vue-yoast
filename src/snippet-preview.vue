<template>
  <div class="vue-yoast vue-yoast-snippet-preview">
    <div class="vue-yoast-snippet-preview-title">
      <span ref="title" v-text="title" />
    </div>
    <div class="vue-yoast-snippet-preview-url">
      <span ref="url" v-text="baseUrl + url"/>
    </div>
    <div class="vue-yoast-snippet-preview-description">
      <span ref="description" v-text="description_"/>
    </div>
  </div>
</template>

<script>
import { rateTitleLength, rateMetaDescLength } from './utils.js'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    metaHeight: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: Object,
      default () {
        return {
          title: 'This is an example title',
          metaDesc: 'This is meta description',
          urlPath: 'example-post/'
        }
      }
    },
    defaultValue: {
      type: Object,
      default () {
        return {
          title: '',
          metaDesc: ''
        }
      }
    },
    addTrailingSlash: {
      type: Boolean,
      default: true
    },
    metaDescriptionDate: {
      type: String,
      default: ''
    },
    previewMode: {
      type: String,
      default: 'desktop'
    },
    baseUrl: {
      type: String,
      default: 'http://example.com/'
    },
    hasProgressSupport: {
      type: Boolean,
      default: true
    },
    maxTitleWidth: {
      type: Number,
      default: 600
    },
    maxDescriptionLength: {
      type: Number,
      default: 320
    }
  },
  computed: {
    description_ () {
      const desc = this.description
      const maxLength = this.maxDescriptionLength
      const more = desc.length > maxLength ? ' ...' : ''
      return desc.substr(0, maxLength) + more
    }
  },
  watch: {
    title () {
      this.onTitleUpdated()
    },
    description () {
      this.$emit('update:descriptionLengthPercent', (this.description.length / this.maxDescriptionLength) * 100)
    }
  },
  methods: {
    titleRate () {
      const el = this.$refs.title
      if (el) {
        return rateTitleLength(this.$refs.title.offsetWidth)
      }
      return ''
    },
    descriptionRate () {
      return rateMetaDescLength(this.description.length)
    },
    onTitleUpdated () {
      const w = this.$refs.title.offsetWidth
      this.$emit('update:titleWidth', w)
      this.$emit('update:titleLengthPercent', (w / this.maxTitleWidth) * 100)
    }
  },
  mounted () {
    this.onTitleUpdated()
  }
}
</script>
