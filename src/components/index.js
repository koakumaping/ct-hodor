import Vue from 'vue'

// 通用模块
import warpper from './warpper'

// 全局组件
import ctInput from './input'
import { ctButton, ctButtonGroup } from './button'
import { ctSelect, ctOption } from './select'
import { ctCheckbox, ctCheckboxGroup } from './checkbox'
import { ctTable, ctTableColumn } from './table'
import ctLoading from './normal/ctLoading'
import ctTimePicker from './time-picker'
import ctDatePicker from './date-picker'
import ctBar from './bar'

import ctPopover from './popover'
import ctDialog from './dialog'

import pageLoading from './pageLoading'
import tree from './tree'

// iconFont
import iconFont from './normal/iconFont'
import faFont from './normal/faFont'

import { ctForm, ctFormLine } from './form'
import { ctFormSearch, ctFormSearchLine } from './form-search'

// 布局
import { ctRow, ctCol } from './layout'

// 分页
import ctPagination from './pagination'

const components = [
  iconFont,
  faFont,
  warpper,
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
  tree,
  ctForm,
  ctFormLine,
  ctFormSearch,
  ctFormSearchLine,
  ctPagination,
  ctRow,
  ctCol,
]

components.map(component => {
  Vue.component(component.name, component)
  return false
})