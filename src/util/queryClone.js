/**
* 用来复制$route.query，过滤掉空的
* @param query {Number}  要复制的要复制的query
*
* @return {Object}     返回一个过滤过的query
*/
import isArray from './isArray'

export default function queryClone(query) {
  const _query = {}
  for (const i in query) {
    if (Object.hasOwnProperty.call(query, i)) {
      if (query[i] !== '') {
        if (isArray(query[i])) {
          _query[i] = query[i].toString() + ',' // 末尾加逗号，保证数组能够被正确还原成数组
        } else {
          _query[i] = query[i]
        }
      }
    }
  }

  return _query
}