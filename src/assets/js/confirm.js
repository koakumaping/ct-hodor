import Dialog from './ju-dialog'

function confirm(message, callback) {
    /* eslint-disable no-new */
    new Dialog('confirm', {
        title: '提示',
        content: message || '系统错误',
        confirmButton: '确定',
        cancelButton: '取消',
        onConfirm: function cb() {
            if (callback) {
                callback()
            } else {
                this.destory()
            }
        },
    })
}

export default confirm
