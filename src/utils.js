import Jed from 'jed'

export function getI18n (translations) {
  const defaultTranslations = {
    domain: 'js-text-analysis',
    // eslint-disable-next-line camelcase
    locale_data: {
      'js-text-analysis': {
        '': {}
      }
    }
  }
  // Use default object to prevent Jed from erroring out.
  translations = translations || defaultTranslations
  return new Jed(translations)
}

export default {
  getI18n
}
