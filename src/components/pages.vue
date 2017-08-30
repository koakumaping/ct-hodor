<template>
  <div class="ct-pages clear">
    <ul class="clear">
      <li
        class="ct-pages-prev"
        v-show="currentPage !== 1 && pageLength > 1"
        v-on:click="go(currentPage - 1)"
      >
        .
      </li>
      <li
        v-for="page in pageList"
        :key="page"
        :class="{ 'active': currentPage === page }"
        v-on:click="go(page)"
      >
        {{page}}
      </li>
      <li
        class="ct-pages-next"
        v-show="currentPage !== pageLength && pageLength > 1"
        v-on:click="go(currentPage + 1)"
      >
        .
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'pages',
  props: {
    perPage: {
      type: Number,
      require: true,
      default: 10,
    },
    currentPage: {
      type: Number,
      require: true,
      default: 1,
    },
    total: {
      type: Number,
      require: true,
      default: 0,
    },
  },
  data() {
    return {
      linkName: '404s',
      pageLength: 0,
      pageList: [],
      searchList: [],
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    currentPage(val) {
      this.setPageList()
    },
    total(val) {
      this.setPageList()
    },
  },
  methods: {
    init() {
      this.setPageList()
    },
    setPerPage() {
      console.log(this.perPage)
      this.$setPerPage(this.perPage)
    },
    setPageList() {
      this.pageLength = Math.ceil(this.total / this.perPage)
      console.log('pageLength > ', this.pageLength)
      this.pageList = []
      for (let i = 1; i < this.pageLength + 1; ++i) {
        if (this.currentPage < 4) {
          if (i <= this.currentPage + 2) {
            this.pageList.push(i)
          }
        } else {
          if (i <= this.currentPage + 2 && i >= this.currentPage - 2) {
            this.pageList.push(i)
          }
        }
      }
    },
    setSearchList() {
      const list = Object.keys(this.$route.query)
      for (let i = 0; i < list.length; ++i) {
        if (list[i] !== 'page') {
          this.searchList.push(`&${list[i]}=${this.$route.query[list[i]]}`)
        }
      }
    },
    getUrl(index) {
      return `${this.$route.path}?page=${index}${this.searchList.join('')}`
    },
    go(index) {
      this.$emit('on-change', index)
    },
  },
}
</script>

<style lang="stylus">
@import '../assets/stylus/color'

.ct-pages
  margin: 16px 20px
  & > ul
    float: right
    & > li
      height: 28px
      line-height: 28px
      min-width: 28px
      display: block
      float: left
      text-align: center
      background-color: #fff
      border-radius: 4px
      // border: 1px solid $border-color
      margin-right: 8px
      color: #94adc0
      // transition: all 0.3s
      user-select: none
      cursor: pointer

      &:last-child
        margin-right: 0
      &.active,
      &:hover
        color: #fff
        border-color: $color-main
        background-color: $color-main

    .ct-pages-prev,
    .ct-pages-next
      color: #fff
      background-position: center center
      background-repeat: no-repeat
      &:hover
        color: $color-main

    .ct-pages-prev
      background-image: url(../assets/img/back.png)
      &:hover
        background-image: url(../assets/img/back-active.png)
    .ct-pages-next
      background-image: url(../assets/img/more.png)
      &:hover
        background-image: url(../assets/img/more-active.png)

</style>