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
import isArray from './isArray'

const isNumber = (val) => {
  if (val === '' || val === undefined) return false
  if (isArray(val)) return false
  return !isNaN(val)
}

export default isNumber