// 通知
const ctNotification = require('./components/notification').default
const warpper = require('./components/warpper.vue')
const ctInput = require('./components/input').default
const ctTag = require('./components/tag').default

// 全局组件
const { ctButton, ctButtonGroup } = require('./components/button')
const { ctSelect, ctOption } = require('./components/select')
const { ctCheckbox, ctCheckboxGroup } = require('./components/checkbox')
const { ctTable, ctTableColumn } = require('./components/table')
const ctLoading = require('./components/normal/ctLoading.vue')
const ctTimePicker = require('./components/time-picker').default
const ctDatePicker = require('./components/date-picker').default
const ctBar = require('./components/bar').default

const ctPopover = require('./components/popover').default
const ctDialog = require('./components/dialog').default

const pageLoading = require('./components/pageLoading.vue')
const tree = require('./components/tree').default

// iconFont
const iconFont = require('./components/normal/iconFont.vue')
const faFont = require('./components/normal/faFont.vue')

const { ctForm, ctFormLine } = require('./components/form')
const { ctFormSearch, ctFormSearchLine } = require('./components/form-search')

// 布局
const { ctRow, ctCol } = require('./components/layout')

// 分页
const ctPagination = require('./components/pagination').default

const ctActionBar = require('./components/actionbar').default
const ctFilterbar = require('./components/filterbar').default
const ctSide = require('./components/side').default

const components = {
  iconFont,
  faFont,
  warpper,
  ctButton,
  ctButtonGroup,
  ctInput,
  ctTag,
  ctSelect,
  ctOption,
  ctCheckbox,
  ctCheckboxGroup,
  ctTable,
  ctTableColumn,
  ctLoading,
  ctTimePicker,
  ctDatePicker,
  ctBar,
  ctPopover,
  ctDialog,
  pageLoading,
  tree,
  ctForm,
  ctFormLine,
  ctFormSearch,
  ctFormSearchLine,
  ctPagination,
  ctRow,
  ctCol,
  ctNotification,
  ctActionBar,
  ctFilterbar,
  ctSide,
}

const {
  sync,
  display,
  popover,
  clickoutside,
  waves,
} = require('./directives')

// const util = require('ct-util')

const install = function _install(Vue, opts = {}) {
  /* istanbul ignore if */
  if (install.installed) return

  Object.keys(components).forEach((key) => {
    Vue.component(key, components[key])
  })

  // Vue.prototype.$util = util
  Vue.prototype.$notices = require('./components/notification/notices').default

  Vue.directive('sync', sync)
  Vue.directive('display', display)
  Vue.directive('popover', popover)
  Vue.directive('clickoutside', clickoutside)
  Vue.directive('waves', waves)
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

Object.assign(components, { install })
module.exports = components