
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
    titleWidth: {
      type: Number,
      default: 0
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
  }
}
