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

const isObject = (val) => Object.prototype.toString.call(val) === '[object Object]'

export default isObject