/*eslint-disable */
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/

const camelCase = (name) => name.replace(SPECIAL_CHARS_REGEXP,
  (_, separator, letter, offset) => offset ? letter.toUpperCase() : letter)
  .replace(MOZ_HACK_REGEXP, 'Moz$1')
/*eslint-enable */
export default camelCase