import Dialog from './dialog'

function show(message, callback) {
  /* eslint-disable no-new */
  new Dialog('alert', {
    title: '提示',
    content: message || '系统错误',
    confirmButton: '确定',
    onConfirm: function cb() {
      if (callback) {
        this.destory()
        callback()
      }
    },
  })
}

export default show
