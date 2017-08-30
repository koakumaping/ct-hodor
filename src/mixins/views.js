import {
  queryClone,
  isString,
  isNumber,
  hasChinese,
  isArray,
} from '@/util'

export default {
  data() {
    return {
      list: [],
      total: 0,
      permission: {},
    }
  },
  computed: {
    searchQuery() {
      const _query = queryClone(this.$route.query)
      delete _query.t
      _query.t = +new Date()
      _query.currentpage = 1
      _query.pagesize = this.$perPage
      // 还原当前页码
      if (this.$route.query.page) {
        _query.currentpage = this.$route.query.page
      }
      return _query
    },
    urlQuery() {
      return queryClone(this.$route.query)
    },
  },
  created() {
    this.restorePermisson()
  },
  methods: {
    clearSearch() {
      this.doSearch({})
    },
    restoreSearch(query) {
      const searchQuery = queryClone(this.$route.query)
      for (const key in searchQuery) {
        if (searchQuery[key] && isString(searchQuery[key]) && searchQuery[key].indexOf(',') > -1) {
          searchQuery[key] = searchQuery[key].split(',')
          // 去除空值
          searchQuery[key] = searchQuery[key].filter(item => item !== undefined && item !== null && item !== '')
        }
        if (isNumber(searchQuery[key])) {
          searchQuery[key] = Number(searchQuery[key])
        }
      }
      delete searchQuery.permission
      Object.assign(query, searchQuery)
    },
    restorePermisson() {
      if (this.$route.query.permission) {
        Object.assign(this.permission, JSON.parse(this.$route.query.permission))
        console.log('restorePermisson', this.permission)
      }
    },
    doSearch(query) {
      const searchQuery = queryClone(query)
      // 保证t在末尾
      delete searchQuery.t
      delete searchQuery.page
      searchQuery.t = +new Date()
      this.$router.push({ name: this.$route.name, query: searchQuery })
    },
    reload() {
      this.$router.replace({ name: this.$route.name, query: this.searchQuery })
    },
    requestQuery(searchForm) {
      const _query = Object.assign({}, searchForm, this.urlQuery)
      for (const key in _query) {
        const str = _query[key]
        if (str && isString(str)) {
          // 删除原先数组加在最后的逗号
          if (str.charAt(str.length - 1) === ',') {
            _query[key] = _query[key].substring(0, _query[key].length - 1)
          }
          // 中文做特殊处理
          if (hasChinese(_query[key])) {
            _query[key] = encodeURI(_query[key], 'UTF-8')
          }
        }
        if (isArray(str)) {
          _query[key] = _query[key].toString()
        }
      }
      // 保证t在末尾
      delete _query.t
      _query.t = +new Date()
      _query.currentpage = 1
      _query.pagesize = this.$perPage
      // 还原当前页码
      if (this.$route.query.page) {
        _query.currentpage = this.$route.query.page
      }
      return _query
    },
  },
}