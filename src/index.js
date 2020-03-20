// 通知
const ctNotification = require('./components/notification').default
const warpper = require('./components/warpper.vue').default
const ctInput = require('./components/input').default
const ctTag = require('./components/tag').default

// 全局组件
const { ctButton, ctButtonGroup } = require('./components/button')
const { ctSelect, ctOption } = require('./components/select')
const { ctCheckbox, ctCheckboxGroup } = require('./components/checkbox')
const { ctTable, ctTableColumn } = require('./components/table')
const ctLoading = require('./components/normal/ctLoading.vue').default
const ctTimePicker = require('./components/time-picker').default
const ctDatePicker = require('./components/date-picker').default
const ctBar = require('./components/bar').default
const SingleSelect = require('./components/single-select').default
const RemoteSelect = require('./components/remote-select').default
const FilterSelect = require('./components/filter-select').default

const { SingleBlock, MultiBlock } = require('./components/block')

const ctPopover = require('./components/popover').default
const ctDialog = require('./components/dialog').default

const pageLoading = require('./components/pageLoading.vue').default
const tree = require('./components/tree').default

// iconFont
const iconFont = require('./components/normal/iconFont.vue').default
const faFont = require('./components/normal/faFont.vue').default

const { ctForm, ctFormLine } = require('./components/form')
const { ctFormSearch, ctFormSearchLine } = require('./components/form-search')

// 布局
const { ctRow, ctCol } = require('./components/layout')
const { flex, flexItem, WhiteSpace } = require('./components/layout')

// 分页
const ctPagination = require('./components/pagination').default

const ctActionBar = require('./components/actionbar').default
const ctFilterbar = require('./components/filterbar').default
const ctSide = require('./components/side').default
const ctCard = require('./components/card').default

const ctSpin = require('./components/spin').default

const popup = require('./components/popup').default
const ctPoptip = require('./components/poptip').default

const ctSwitch = require('./components/switch').default

const { ctTabs, ctTabPane } = require('./components/tabs')

const multiSelect = require('./components/multi-select').default
const listCard = require('./components/list-card').default

const ctDivider = require('./components/divider').default

const treeSelect = require('./components/tree-select').default

const spinner = require('./components/spinner').default

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
  SingleSelect,
  RemoteSelect,
  FilterSelect,
  SingleBlock,
  MultiBlock,
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
  flex,
  flexItem,
  WhiteSpace,
  ctNotification,
  ctActionBar,
  ctFilterbar,
  ctSide,
  ctCard,
  ctSpin,
  popup,
  ctPoptip,
  ctSwitch,
  ctTabs,
  ctTabPane,
  multiSelect,
  listCard,
  ctDivider,
  treeSelect,
  spinner,
}

const {
  sync,
  display,
  popover,
  clickoutside,
  waves,
  focus,
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
  Vue.directive('focus', focus)
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

Object.assign(components, { install })
module.exports = components