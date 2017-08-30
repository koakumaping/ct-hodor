/**
* 深度拷贝
*
* copy
* @param {Object} obj
*
* @returns Object
*
* @date 2016-05-13
* @author Ping YF (koakumaping@163.com)
*/
export default function clone(obj) {
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
        clone(obj[i]) : obj[i]
      }
    }
  }

  return newobj
}