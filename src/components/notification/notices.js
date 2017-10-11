let seed = 0
const closeTime = 5000
const now = Date.now()

function getUuid() {
  return `${now}_${seed++}`
}

class Notice {
  constructor(...args) {
    this.store = args[0]
  }

  _open(options) {
    // 生成唯一的key
    const key = getUuid()
    let time = Number(options.closeTime)
    if (isNaN(time)) {
      time = closeTime
    }
    options.key = key
    // 添加到notice list，然后渲染
    this.store.commit('ADD_NOTICE', options)
    // 倒计时为0时不自动关闭
    if (time === 0) return false
    window.setTimeout(() => {
      // 通过key删除
      this.store.commit('DEL_NOTICE', key)
    }, time)
  }

  info(options) {
    options.type = 'info'
    this._open(options)
  }

  success(options) {
    options.type = 'success'
    this._open(options)
  }

  warn(options) {
    options.type = 'warn'
    this._open(options)
  }

  error(options) {
    options.type = 'error'
    this._open(options)
  }
}

export default Notice