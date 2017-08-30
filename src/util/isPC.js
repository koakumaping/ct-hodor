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

const isPC = () => {
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
}

export default isPC