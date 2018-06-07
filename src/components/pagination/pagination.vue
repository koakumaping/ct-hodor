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
        :key="page.key"
        :class="[{ 'current': currentPage === page.value }, `ct-pagination-page-${page.value}`]"
        v-on:click="go(page.value)"
      >
        {{ page.label }}
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
        <iconFont name="more" />
      </li>
            <li
        class="ct-pagination-total"
        v-on:click="reload()"
      >
        总计 {{ total }} 条数据
      </li>
    </ul>
  </div>
</template>

<script>
import { clone, randomString } from 'ct-util'

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
    // 第几页， ajax用
    page: {
      type: Number,
      default: 1,
    },
    // 每页数量， ajax用
    size: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      perPage: Number(window.localStorage.getItem('perPage')) || this.$perPage,
      currentPage: 1,
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
    page(val) {
      this.currentPage = val
    },
  },
  methods: {
    init() {
      if (this.ajax) {
        this.currentPage = this.page
        this.perPage = this.size
      } else {
        this.currentPage = Number(this.$route.query.page) || this.page || 1
      }

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
            this.pageList.push({
              key: randomString(12, true),
              label: i,
              value: i,
            })
          }
        } else {
          if (i <= this.currentPage + 2 && i >= this.currentPage - 2) {
            this.pageList.push({
              key: randomString(12, true),
              label: i,
              value: i,
            })
          }
        }
      }
    },
    setSearchQuery() {
      this.query = clone(this.$route.query)
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
      this.setSearchQuery()
      this.query.page = index
      // 保证t在末尾
      delete this.query.t
      this.query.t = +new Date()

      if (this.ajax) {
        this.currentPage = index
        this.$emit('change', {
          index,
          query: this.query,
        })
        this.setPageList()
        return false
      }

      this.$router.push({ name: this.$route.name, query: this.query })
    },
    reload() {
      this.$emit('reload')
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/var'
@import '../../assets/stylus/color'

.ct-pagination
  font-size: $font-size
  margin-top: 16px
  & > ul
    float: right
    & > li
      height: 32px
      line-height: 30px
      min-width: 32px
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