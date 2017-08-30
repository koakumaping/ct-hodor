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

const isArray = (val) => Object.prototype.toString.call(val) === '[object Array]'

export default isArray