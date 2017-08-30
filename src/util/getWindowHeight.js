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

const getWindowHeight = () => {
  let windowHeight = 0

  if (document.compatMode === 'CSS1Compat') {
    windowHeight = document.documentElement.clientHeight
  } else {
    windowHeight = document.body.clientHeight
  }
  return windowHeight
}

export default getWindowHeight