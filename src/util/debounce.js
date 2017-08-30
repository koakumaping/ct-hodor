/**
*
* @param fn {Function}   实际要执行的函数
* @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
*
* @return {Function}     返回一个“去弹跳”了的函数
*/

function debounce(fn, delay) {
  // 定时器，用来 setTimeout
  let timer
  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return function _debounce(...args) {
    // 保存函数调用时的上下文和参数，传递给 fn
    const context = this
    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    window.clearTimeout(timer)

    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = window.setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}

export default debounce

/*
DOM 事件里的 debounce 概念其实是从机械开关和继电器的“去弹跳”（debounce）衍生 出来的，基本思路就是把多个信号合并为一个信号。

在 JavaScript 中，debounce 函数所做的事情就是，强制一个函数在某个连续时间段内只执行一次，哪怕它本来会被调用多次。
我们希望在用户停止某个操作一段时间之后才执行相应的监听函数，而不是在用户操作的过程当中，浏览器触发多少次事件，就执行多少次监听函数。

比如，在某个 3s 的时间段内连续地移动了鼠标，浏览器可能会触发几十（甚至几百）个 mousemove 事件，
不使用 debounce 的话，监听函数就要执行这么多次；如果对监听函数使用 100ms 的“去弹跳”，
那么浏览器只会执行一次这个监听函数，而且是在第 3.1s 的时候执行的。

$(document).on('mouvemove', debounce(function(e) {}, 250))
*/