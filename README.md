# ct-hodor
## install
```bash
npm install ct-hodor
```
## usage
```javascript
import ctHodor from 'ct-hodor'
import 'ct-hodor/dist/ctHodor.css'
Vue.use(ctHodor)

// 配置notice组件
const notice = new Vue.prototype.$notices(store)
window.notice = notice
```

## config vue template
```html
<template>
  <div id="root">
    <router-view></router-view>
    <ctNotification></ctNotification>
  </div>
</template>
```

## notice usage
### vuex
```javascript
const notice = {
  state: {
    list: [],
    timer: '',
  },
  mutations: {
    ADD_NOTICE: (state, payload) => {
      state.list.push(payload)
    },
    DEL_NOTICE: (state, key) => {
      const notices = state.list
      const l = notices.length
      for (let i = 0; i < l; ++i) {
        if (notices[i].key === key) {
          notices.splice(i, 1)
          break
        }
      }
    },
  },
}

export default notice
```

### usage
```javascript
window.notice.info({
  title: '提示信息',
  content: '内容',
})

window.notice.warn({
  title: '提示信息',
  content: '内容',
})

window.notice.success({
  title: '提示信息',
  content: '内容',
})

window.notice.error({
  title: '提示信息',
  content: '内容',
})
```