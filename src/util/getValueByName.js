import hasOwn from './hasOwn'

function getValueByName(obj = {}, name) {
  if (hasOwn(obj, name)) {
    return obj[name]
  }
  return ''
}

export default getValueByName