const util = {

  /**
  * 判断是否是PC端
  *
  * 用于判断当前浏览器是否是PC端
  *
  * @returns true  是PC端
  * @returns false 不是PC端
  *
  * @date 2016-04-01
  * @author Ping YF (koakumaping@163.com)
  */
  isPC: () => {
    const userAgentInfo = window.navigator.userAgent
    const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    let flag = true
    for (let v = 0; v < Agents.length; ++v) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    return flag
  },

  /**
  * 判断是否是数字
  *
  * 用于判断当前输入是否是数字
  *
  * @returns true  是数字
  * @returns false 不是数字
  *
  * @date 2016-04-01
  * @author Ping YF (koakumaping@163.com)
  */

  isNumber: (val) => !isNaN(val),

  /**
  * 判断是否是数组
  *
  * 用于判断当前输入是否是数组
  *
  * @returns true  是数组
  * @returns false 不是数组
  *
  * @date 2016-09-18
  * @author Ping YF (koakumaping@163.com)
  */

  isArray: (val) => Object.prototype.toString.call(val) === '[object Array]',

  /**
  * 判断是否是Object
  *
  * 用于判断当前输入是否是Object
  *
  * @returns true  是Object
  * @returns false 不是Object
  *
  * @date 2016-09-18
  * @author Ping YF (koakumaping@163.com)
  */

  isObject: (val) => Object.prototype.toString.call(val) === '[object Object]',
  /**
  * 判断是否是Function
  *
  * 用于判断当前输入是否是Function
  *
  * @returns true  是Function
  * @returns false 不是Function
  *
  * @date 2016-11-28
  * @author Ping YF (koakumaping@163.com)
  */

  isFunction: (val) => Object.prototype.toString.call(val) === '[object Function]',

  /**
  * Check whether the object has the property.
  *
  * @param {Object} obj
  * @param {String} key
  * @return {Boolean}
  *
  * @date 2016-09-23
  * @author Ping YF (koakumaping@163.com)
  */
  hasOwn: (obj, key) => Object.prototype.hasOwnProperty.call(obj, key),

  /**
  * 混合 properties 到对应的 Object.
  *
  * @param {Object} to
  * @param {Object} from
  */
  extend: (to, from) => {
    const sto = to
    const keys = Object.keys(from)
    let i = keys.length
    while (i--) {
      sto[keys[i]] = from[keys[i]]
    }
    return sto
  },

  /**
  * 查询在Array中的位置
  *
  * @param {Array} arr
  * @param {*} obj
  *
  * @date 2016-09-23
  * @author Ping YF (koakumaping@163.com)
  */
  indexOf: (arr, obj) => {
    let i = arr.length
    while (i--) {
      if (arr[i] === obj) return i
    }
    return -1
  },

  /**
  * camelCase
  *
  * @param {String, Number} name
  *
  * @date 2016-09-23
  * @author Ping YF (koakumaping@163.com)
  */
  /*eslint-disable */
  camelCase: (name) => {
    return name.replace(/([\:\-\_]+(.))/g, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }).replace(/^moz([A-Z])/, 'Moz$1')
  },

  /*eslint-enable */
  /**
  * 深度拷贝
  *
  * copy
  * @param {Object} obj
  *
  * @returns Object
  * @returns Object
  *
  * @date 2016-05-13
  * @author Ping YF (koakumaping@163.com)
  */
  clone: (obj) => {
    let newobj
    let str

    if (typeof obj !== 'object') {
      return
    } else if (window.JSON) {
      str = JSON.stringify(obj)
      newobj = JSON.parse(str)
    } else {
      for (const i in obj) {
        if ({}.hasOwnProperty.call(obj, i)) {
          newobj[i] = typeof obj[i] === 'object' ?
          this.clone(obj[i]) : obj[i]
        }
      }
    }

    return newobj
  },

  /**
  * 文档高度
  *
  * getDocumentTop
  *
  * @returns {Number}
  *
  * @date 2016-09-23
  * @author Ping YF (koakumaping@163.com)
  */
  getDocumentTop: () => {
    let scrollTop = 0
    let bodyScrollTop = 0
    let documentScrollTop = 0

    if (document.body) {
      bodyScrollTop = document.body.scrollTop
    }

    if (document.documentElement) {
      documentScrollTop = document.documentElement.scrollTop
    }

    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop
    return scrollTop
  },
  /**
  * 可视窗口高度
  *
  * getWindowHeight
  *
  * @returns {Number}
  *
  * @date 2016-09-23
  * @author Ping YF (koakumaping@163.com)
  */
  getWindowHeight: () => {
    let windowHeight = 0

    if (document.compatMode === 'CSS1Compat') {
      windowHeight = document.documentElement.clientHeight
    } else {
      windowHeight = document.body.clientHeight
    }
    return windowHeight
  },
  /**
  * 滚动条滚动高度
  *
  * getScrollHeight
  *
  * @returns {Number}
  *
  * @date 2016-09-23
  * @author Ping YF (koakumaping@163.com)
  */
  getScrollHeight: () => {
    let scrollHeight = 0
    let bodyScrollHeight = 0
    let documentScrollHeight = 0

    if (document.body) {
      bodyScrollHeight = document.body.scrollHeight
    }
    if (document.documentElement) {
      documentScrollHeight = document.documentElement.scrollHeight
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ?
    bodyScrollHeight : documentScrollHeight
    return scrollHeight
  },
  /**
  * 页面滚动至底部
  *
  * onScrollToBottom
  *
  *
  * @date 2016-09-23
  * @author Ping YF (koakumaping@163.com)
  */
  onScrollToBottom: (callback) => {
    if (this.getScrollHeight() === this.getDocumentTop() + this.getWindowHeight()) {
      callback()
    }
  },

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
  hasClass: (elemet, cls) => {
    const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`)
    if (elemet.className.match(reg)) {
      return true
    }
    return false
  },

  /**
  * 给element添加className
  *
  * 用于给element添加className
  *
  * @date 2017-07-05
  * @author Ping YF (koakumaping@163.com)
  */
  addClass: (elemet, cls) => {
    const el = elemet

    if (el.className) {
      el.className = `${el.className} ${cls}`
    } else {
      el.className = cls
    }

    return false
  },

  /**
  * 给element移除className
  *
  * 用于给element添加className
  *
  * @date 2017-07-05
  * @author Ping YF (koakumaping@163.com)
  */
  removeClass: (elemet, cls) => {
    const el = elemet
    el.className = el.className.replace(` ${cls}`, '')
    return false
  },

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
  getStyle: (element, styleName) => {
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
  },

  /**
  * 给element添加event
  *
  * 用于给element添加event
  *
  * @returns Function
  *
  * @date 2017-07-31
  * @author Ping YF (koakumaping@163.com)
  */
  handleEvent: (eventName, { onElement, withCallback, useCapture = false } = {}, thisArg) => {
    const element = onElement || document.documentElement
    function handler(event) {
      if (typeof withCallback === 'function') {
        withCallback.call(thisArg, event)
      }
    }

    handler.destroy = function handleDestroy() {
      return element.removeEventListener(eventName, handler, useCapture)
    }

    element.addEventListener(eventName, handler, useCapture)
    return handler

    // 当你需要绑定某个元素的时候
    // const handleClick = handleEvent('click', {
    //     onElement: element,
    //     withCallback: (event) => {
    //         console.log('Hondo!')
    //     }
    // })
    // 当你不想用的时候
    // handleClick.destroy()
  },

  /**
  * 判断两个Object是否相同
  *
  * 用于判断两个Object是否相同
  *
  * @returns true  相同
  * @returns false 不同
  *
  * @date 2017-07-21
  * @author Ping YF (koakumaping@163.com)
  */
  sameObject: (a, b) => {
    let tag = true
    if (!a || !b) return false
    for (const x in a) {
      if (!b[x]) return false
      if (typeof (a[x]) === 'object') {
        tag = this.sameObj(a[x], b[x])
      } else {
        if (a[x] !== b[x]) return false
      }
    }
    return tag
  },

  /**
  * 格式化金额
  *
  * 用于格式化金额为三位一个分割
  *
  * @returns String
  *
  * @date 2017-08-07
  * @author Ping YF (koakumaping@163.com)
  */
  formatMoney: (value) => {
    // 先提取整数部分
    const res = value.toString().replace(/\d+/, (n) =>
      n.replace(/(\d)(?=(\d{3})+$)/g, ($1) => `${$1},`),
    )
    return res
  },
}

export default util
