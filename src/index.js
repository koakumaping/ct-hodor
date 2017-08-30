// 通用模块
import warpper from './components/warpper'
import filterbar from './components/filterbar'
import toolbar from './components/toolbar'

// 全局组件
import ctInput from './components/normal/ctInput'
import { ctButton, ctButtonGroup } from './components/button'
import { ctSelect, ctOption } from './components/select'
import { ctCheckbox, ctCheckboxGroup } from './components/checkbox'
import { ctTable, ctTableColumn } from './components/table'
import ctLoading from './components/normal/ctLoading'
import ctTimePicker from './components/time-picker'
import ctDatePicker from './components/date-picker'
import ctBar from './components/bar'

import ctPopover from './components/popover'
import ctDialog from './components/dialog'

import pageLoading from './components/pageLoading'
import windows from './components/window'
import fullscreen from './components/fullscreen'
import tree from './components/tree'

// iconFont
import iconFont from './components/normal/iconFont'
import faFont from './components/normal/faFont'

import { ctForm, ctFormLine } from './components/form'
import { ctFormSearch, ctFormSearchLine } from './components/form-search'

// 布局
import { ctRow, ctCol } from './components/layout'

// 分页
import ctPagination from './components/pagination'

// 返回按钮
import backButton from './components/common/backButton'

const ctHodor = {
  iconFont,
  faFont,
  warpper,
  filterbar,
  toolbar,
  ctButton,
  ctButtonGroup,
  ctInput,
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
  windows,
  fullscreen,
  tree,
  ctForm,
  ctFormLine,
  ctFormSearch,
  ctFormSearchLine,
  ctPagination,
  ctRow,
  ctCol,
  backButton,
}

const install = function (Vue, opts = {}) {
  Object.keys(ctHodor).forEach((key) => {
      Vue.component(key, ctHodor[key])
  })
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

module.exports = Object.assign(ctHodor, {install});   // eslint-disable-line no-undef