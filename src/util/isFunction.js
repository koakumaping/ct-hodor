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

const isFunction = (val) => Object.prototype.toString.call(val) === '[object Function]'

export default isFunction