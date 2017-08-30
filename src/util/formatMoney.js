/**
* 格式化金额
*
* 用于格式化金额为三位一个逗号分割
*
* @returns String
*
* @date 2017-08-21
* @author Ping YF (koakumaping@163.com)
*/

// 可能有兼容性问题
const formatMoney = (money) => money.toLocaleString('en-US')

export default formatMoney