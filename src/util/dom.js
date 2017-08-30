import isObject from './isObject'
import hasOwn from './hasOwn'
import camelCase from './camelCase'

/**
* 判断是否有该className
*
* 用于判断当前className是否存在
*
* @returns true  有
* @returns false 没有
*
* @date 2017-07-05
* @author Ping YF (koakumaping@163.com)
*/
export const hasClass = (elemet, cls) => {
  const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`)
  if (elemet.className.match(reg)) {
    return true
  }
  return false
}

/**
* 给element添加className
*
* 用于给element添加className
*
* @date 2017-07-05
* @author Ping YF (koakumaping@163.com)
*/
export const addClass = (elemet, cls) => {
  const el = elemet

  if (el.className) {
    el.className = `${el.className} ${cls}`
  } else {
    el.className = cls
  }

  return false
}

/**
* 给element移除className
*
* 用于给element添加className
*
* @date 2017-07-05
* @author Ping YF (koakumaping@163.com)
*/
export const removeClass = (elemet, cls) => {
  const el = elemet
  el.className = el.className.replace(` ${cls}`, '')
  return false
}

/**
* 获取element的styleName对应的值
*
* 用于获取element的styleName对应的值
*
* @returns {String, Number}
*
* @date 2017-08-04
* @author Ping YF (koakumaping@163.com)
*/
export const getStyle = (element, styleName) => {
  if (!element || !styleName) return null
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const computed = document.defaultView.getComputedStyle(element, '')
    return element.style[styleName] || computed ? computed[styleName] : null
  } catch (e) {
    return element.style[styleName]
  }
}

/**
* 设置element的styleName对应的值
*
* 用于设置element的styleName对应的值
*
* @date 2017-08-04
* @author Ping YF (koakumaping@163.com)
*/
export const setStyle = (element, styleName, value) => {
  if (!element || !styleName) return

  if (isObject(styleName)) {
    for (const prop in styleName) {
      if (hasOwn(styleName, prop)) {
        setStyle(element, prop, styleName[prop])
      }
    }
  } else {
    styleName = camelCase(styleName)
    if (styleName === 'opacity') {
      element.style.filter = window.isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')'
      element.style[styleName] = value
    }
  }
}