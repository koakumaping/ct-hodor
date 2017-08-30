/**
* 判断是否是String
*
* 用于判断当前输入是否是String
*
* @returns true  是String
* @returns false 不是String
*
* @date 2017-08-18
* @author Ping YF (koakumaping@163.com)
*/

const isString = (val) => Object.prototype.toString.call(val) === '[object String]'

export default isString