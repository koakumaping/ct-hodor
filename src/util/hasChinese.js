/**
* 判断是否包含中文
*
* 用于判断当前输入是否包含中文
*
* @returns true  包含中文
* @returns false 不包含中文
*
* @date 2016-11-28
* @author Ping YF (koakumaping@163.com)
*/

const hasChinese = (val) => {
  if (escape(val).indexOf('%u') > -1) {
    return true
  }
  return false
}

export default hasChinese