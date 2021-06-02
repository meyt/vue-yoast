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

export function rateTitleLength (titleLength) {
  let rating
  switch (true) {
    case titleLength > 0 && titleLength <= 399:
    case titleLength > 600:
      rating = 'ok'
      break

    case titleLength >= 400 && titleLength <= 600:
      rating = 'good'
      break

    default:
      rating = 'bad'
      break
  }
  return rating
}

export function rateMetaDescLength (metaDescLength) {
  let rating
  switch (true) {
    case metaDescLength > 0 && metaDescLength < 120:
    case metaDescLength > 320:
      rating = 'ok'
      break

    case metaDescLength >= 120 && metaDescLength <= 320:
      rating = 'good'
      break

    default:
      rating = 'bad'
      break
  }
  return rating
}

export function getAssessorRatings () {
  return ['feedback', 'bad', 'ok', 'good']
}
