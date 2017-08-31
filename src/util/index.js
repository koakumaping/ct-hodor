import debounce from './debounce'
import throttle from './throttle'
import scrollbarWidth from './scrollbarWidth'
import notices from './notices'
import popover from './popover'
import { decode64, encode64 } from './base64'

// dom监听
import { addResizeListener, removeResizeListener } from './resize-event'
import handleEvent from './handleEvent'

// 判断类
import isPC from './isPC'
import isFunction from './isFunction'
import isArray from './isArray'
import isObject from './isObject'
import isString from './isString'
import isNumber from './isNumber'
import hasChinese from './hasChinese'

// 操作类
import clone from './clone'
import queryClone from './queryClone'

// 判断类
import hasOwn from './hasOwn'

// dom
import {
  hasClass,
  addClass,
  removeClass,
  getStyle,
  setStyle,
} from './dom'

// get
import getWindowHeight from './getWindowHeight'

// date
import {
  getYear,
  getMonth,
  getRealMonth,
  getDate,
  getDayOfMonth,
  getFirstDayOfMonth,
  getDayCountOfMonth,
  getPrevMonth,
  getNextMonth,
  clearHours,
  getYYYYMMDD,
} from './date'

export {
  decode64,
  encode64,
  notices,
  popover,
  debounce,
  throttle,
  scrollbarWidth,
  addResizeListener,
  removeResizeListener,
  handleEvent,
  isPC,
  isFunction,
  isArray,
  isObject,
  isString,
  isNumber,
  hasChinese,
  clone,
  queryClone,
  hasOwn,
  hasClass,
  addClass,
  removeClass,
  getStyle,
  setStyle,
  getWindowHeight,
  getYear,
  getMonth,
  getRealMonth,
  getDate,
  getDayOfMonth,
  getFirstDayOfMonth,
  getDayCountOfMonth,
  getPrevMonth,
  getNextMonth,
  clearHours,
  getYYYYMMDD,
}