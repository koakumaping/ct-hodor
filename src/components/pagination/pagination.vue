<template>
  <div class="ct-pagination clear">
    <div class="left">
      <slot></slot>
    </div>
    <ul class="clear" v-if="this.total !== 0">
      <li
        class="ct-pagination-prev"
        :class="{ 'is-disabled': currentPage === 1 }"
        v-on:click="go(currentPage - 1)"
      >
        <iconFont name="back"></iconFont>
      </li>
      <li
        class="ct-pagination-first"
        v-if="currentPage > 3"
        v-on:click="go(1)"
      >1</li>
      <li
        class="ct-pagination-prev-five"
        v-if="currentPage > 4"
        v-on:click="go(currentPage - 5)"
      >...</li>

      <li
        v-for="page in pageList"
        :key="page"
        :class="[{ 'current': currentPage === page }, `ct-pagination-page-${page}`]"
        v-on:click="go(page)"
      >
        {{page}}
      </li>

      <li
        class="ct-pagination-next-five"
        v-if="pageLength > 5 && (currentPage + 3 < pageLength)"
        v-on:click="go(currentPage + 5)"
      >...</li>
      <li
        class="ct-pagination-last"
        v-if="pageLength > 5 && (currentPage + 2 < pageLength)"
        v-on:click="go(pageLength)"
      >{{pageLength}}</li>
      <li
        class="ct-pagination-next"
        :class="{ 'is-disabled': currentPage === pageLength }"
        v-on:click="go(currentPage + 1)"
      >
        <iconFont name="more"></iconFont>
      </li>
    </ul>
  </div>
</template>

<script>
import { clone } from 'ct-util'

export default {
  name: 'ctPagination',
  props: {
    total: {
      type: [Number, String],
      require: true,
      default: 0,
    },
    // 以ajax方式翻页
    ajax: Boolean,
    permission: Object,
  },
  data() {
    return {
      perPage: Number(window.localStorage.getItem('perPage')) || this.$perPage,
      currentPage: 1,
      linkName: '404s',
      pageLength: 0,
      pageList: [],
      searchList: [],
      query: {},
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    total(val) {
      this.setPageList()
    },
    permission: {
      deep: true,
      handler() {
        this.setSearchQuery()
      },
    },
  },
  methods: {
    init() {
      this.currentPage = Number(this.$route.query.page) || 1
      this.setPageList()
      this.setSearchQuery()
    },
    setPerPage() {
      this.$setPerPage(this.perPage)
    },
    setPageList() {
      this.pageLength = Math.ceil(this.total / this.perPage)
      this.pageList = []
      for (let i = 1; i < this.pageLength + 1; ++i) {
        if (this.currentPage < 4) {
          if (i <= 5) {
            this.pageList.push(i)
          }
        } else {
          if (i <= this.currentPage + 2 && i >= this.currentPage - 2) {
            this.pageList.push(i)
          }
        }
      }
    },
    setSearchQuery() {
      if (!permission) return false
      this.query = clone(this.$route.query)
      // 带上权限，避免分页切换时显示不需要显示的组件
      Object.assign(this.query, {
        permission: JSON.stringify(this.permission),
      })
    },
    go(index) {
      if (index === '' || index === window.undefined) {
        index = this.pageLength
      }
      if (index < 1) {
        index = 1
      }
      if (index > this.pageLength) {
        index = this.pageLength
      }
      // 当前页面不做跳转
      if (this.currentPage === index) {
        this.$notice.info({
          title: '提示',
          content: '你已经在该页面了',
        })
        return false
      }

      this.query.page = index
      // 保证t在末尾
      delete this.query.t
      this.query.t = +new Date()
      // 保证permission在末尾
      const _permission = this.query.permission
      delete this.query.permission
      this.query.permission = _permission

      if (this.ajax) {
        this.$emit('on-change', {
          index,
          query: this.query,
        })
        return
      }

      this.$router.push({ name: this.$route.name, query: this.query })
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/color'

.ct-pagination
  margin: 16px 0
  & > ul
    float: right
    & > li
      height: 28px
      line-height: 26px
      min-width: 28px
      display: block
      padding: 0 8px
      float: left
      text-align: center
      background-color: #fff
      border-radius: 4px
      border: 1px solid $border-color
      margin-right: 8px
      color: #000
      // transition: all 0.3s
      user-select: none
      cursor: pointer

      &:last-child
        margin-right: 0
      &.current,
      &:hover
        color: #fff
        border-color: $color-main
        background-color: $color-main
      &.current
        cursor: default

    .ct-pagination-prev,
    .ct-pagination-next
      color: #000
      background-position: center center
      background-repeat: no-repeat
      padding: 0 4px
      &:hover
        color: #fff
        border-color: $color-main
      &.is-disabled
        cursor: default
        &:hover
          color: #000
          background-color: #fff
          border-color: $border-color
</style>