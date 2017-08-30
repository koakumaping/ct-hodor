import ctInput from './components/normal/ctInput'
import * as util from './util'

const ctHodor = {
  ctInput,
  util,
}

const install = function install(Vue, opts = {}) {
  Object.keys(ctHodor).forEach((key) => {
    Vue.component(key, ctHodor[key])
  })
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

module.exports = Object.assign(ctHodor, { install }) // eslint-disable-line no-undef