import axios from 'axios'
import cookie from 'js-cookie'
import { decode64 } from './base64'
import { getAPI } from '../apis/url'
import store from '../store'

import isFunction from './isFunction'
import hasOwn from './hasOwn'

function request(name = '', config = { data: '', type: 'POST', send: 'JSON', params: {} }, successCallback, failCallback, finalCallback) {
  const apiItem = getAPI(name)
  let url = apiItem.url || name

  if (!config.type) {
    config.type = 'POST'
  } else {
    config.type = config.type.toUpperCase()
  }

  if (!config.send) {
    config.send = 'JSON'
  }

  if (!config.params) {
    config.params = {}
  }

  const token = window.sessionStorage.getItem('token') || ''

  const callback = (response) => {
    if (isFunction(finalCallback)) {
      finalCallback(response)
    }
  }

  const passCallback = (response) => {
    const results = response.data
    results.errcode = Number(results.errcode)
    if (hasOwn(results, 'data')) {
      try {
        results.data = window.unescape(decode64(results.data))
        results.data = JSON.parse(results.data)
      } catch (e) {
        // 防止eslint报错
        (() => {})()
      }
    }

    if (results.errcode === 0) {
      console.log(apiItem.name, results.data)
      if (isFunction(successCallback)) {
        successCallback(results)
        callback(results)
      }
    } else if ([5, 7, 8].indexOf(results.errcode) > -1) {
      console.log(apiItem.name, results)
      // 6 表示需要短信验证，这边排除掉先
      // show('请重新登录')
      let reason = '登录超时'
      if (results.errcode !== 5) {
        reason = `原因：${results.err}`
      }
      window.notice.error({
        title: '请重新登录',
        content: reason,
      })
      callback(results)
      store.commit('SET_NEED_LOGIN', true)
      // const route = router.resolve(window.location).route
      // router.replace(`/login?from=${route.name}`)
    } else {
      console.log(apiItem.name, results)
      // 不需要短信认证时直接提示错误信息
      if (results.errcode !== 6) {
        // show(results.err)
        window.notice.error({
          title: '错误信息',
          content: results.err,
        })
      }
      if (isFunction(failCallback)) {
        failCallback(results)
      }
      callback(results)
    }
  }

  const errorCallback = (error) => {
    console.log(error)
    // show(`请重试！错误信息：${error}！`)
    window.notice.error({
      title: '错误信息',
      content: `请重试：${error}！`,
    })
    callback(error)
  }

  // 如果查询不到则直接访问该地址
  if (!apiItem.url) {
    url = url.indexOf('http://') > -1 ? url : `http://${url}`
    const errorMessage = `can not find ${name}\`s request url, now ask ${url}`
    console.log(errorMessage)
  }

  let formdata
  if (config.send !== 'JSON') {
    formdata = new window.FormData()
    for (const item in config.data) {
      if ({}.hasOwnProperty.call(config.data, item)) {
        formdata.append(item, config.data[item])
      }
    }
  } else {
    formdata = config.data
  }

  const header = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Token': cookie.get('masterKey'),
      // 'Access-Token': window.sessionStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  }

  // 在url中添加appKey
  const params = {
    appkey: token,
  }

  const get = () => {
    Object.assign(params, config.data)

    console.log(`${apiItem.name || url} get:`, config.data)

    axios({
      method: 'get',
      url: `${url}`,
      params,
      headers: header.headers,
    })
    .then(passCallback)
    .catch(errorCallback)
  }

  const del = () => {
    Object.assign(params, config.data)

    console.log(`${apiItem.name || url} delete:`, config.data)

    axios({
      method: 'delete',
      url: `${url}`,
      params,
      headers: header.headers,
    })
    .then(passCallback)
    .catch(errorCallback)
  }

  const post = () => {
    console.log(`${apiItem.name || url} post:`, formdata)
    Object.assign(params, config.params)
    console.log(params)
    axios({
      method: 'post',
      url: `${url}`,
      data: formdata,
      params,
      headers: header.headers,
    })
    .then(passCallback)
    .catch(errorCallback)
  }

  const put = () => {
    console.log(`${apiItem.name || url} put:`, formdata)
    Object.assign(params, config.params)
    axios({
      method: 'put',
      url: `${url}`,
      data: formdata,
      params,
      headers: header.headers,
    })
    .then(passCallback)
    .catch(errorCallback)
  }

  const send = () => {
    switch (config.type) {
      case 'GET':
        get()
        break
      case 'POST':
        post()
        break
      case 'PUT':
        put()
        break
      case 'DELETE':
        del()
        break
      default:
        post()
    }
  }

  send()
}

export default request
