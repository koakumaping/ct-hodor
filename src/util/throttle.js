/**
*
* @param fn {Function}   实际要执行的函数
* @param delay {Number}  执行间隔，单位是毫秒（ms）
*
* @return {Function}     返回一个“节流”函数
*/

function throttle(fn, threshhold = 250) {
  // 默认间隔为 250ms
  // 记录上次执行的时间
  let last
  // 定时器
  let timer
  // 返回的函数，每过 threshhold 毫秒就执行一次 fn 函数
  return function _throttle(...args) {
    // 保存函数调用时的上下文和参数，传递给 fn
    const context = this
    const now = +new Date()
    // 如果距离上次执行 fn 函数的时间小于 threshhold，那么就放弃
    // 执行 fn，并重新计时
    if (last && now < last + threshhold) {
      window.clearTimeout(timer)
      // 保证在当前时间区间结束后，再执行一次 fn
      timer = window.setTimeout(() => {
        last = now
        fn.apply(context, args)
      }, threshhold)
    // 在时间区间的最开始和到达指定间隔的时候执行一次 fn
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}

export default throttle
/*
throttle 的概念理解起来更容易，就是固定函数执行的速率，即所谓的“节流”。

正常情况下，mousemove 的监听函数可能会每 20ms（假设）执行一次，如果设置 200ms 的“节流”，
那么它就会每 200ms 执行一次。比如在 1s 的时间段内，正常的监听函数可能会执行 50（1000/20） 次，=
“节流” 200ms 后则会执行 5（1000/200） 次。

$(document).on('mouvemove', throttle(function(e) {}, 250))
 */