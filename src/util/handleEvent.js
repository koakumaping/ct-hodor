/**
* 给element添加event
*
* 用于给element添加event
*
* @returns Function
*
* @date 2017-07-31
* @author Ping YF (koakumaping@163.com)
*/
const handleEvent = (eventName, { onElement, withCallback, useCapture = false } = {}, thisArg) => {
  const element = onElement || document.documentElement
  function handler(event) {
    if (typeof withCallback === 'function') {
      withCallback.call(thisArg, event)
    }
  }

  handler.destroy = function handleDestroy() {
    return element.removeEventListener(eventName, handler, useCapture)
  }

  element.addEventListener(eventName, handler, useCapture)
  return handler
}

export default handleEvent

/*
当你需要绑定某个元素的时候
const handleClick = handleEvent('click', {
    onElement: element,
    withCallback: (event) => {
        console.log('Hondo!')
    }
})
当你不想用的时候
handleClick.destroy()
*/