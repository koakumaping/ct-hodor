<template>
  <div class="ct-tabs" :class="tabsCls" :style="tabsStyl">
    <div class="ct-tabs-content" v-if="position === 'bottom'">
      <slot></slot>
    </div>
    <div class="ct-tabs-nav" ref="nav">
      <div class="ct-tabs-item"
        ref="tabs"
        v-for="(item, index) in tabList"
        :key="item._uid"
        :class="{ 'active text-main': currentIndex === index, 'disabled': tabList[index].disabled }"
        @click="setActivePane(index)"
      >
        {{item.$attrs.label}}
      </div>
      <div class="ct-tabs__active-bar" :style="activeBarStyl"></div>
    </div>
    <div class="ct-tabs-content" v-if="position !== 'bottom'">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { popover } from 'ct-util'

export default {
  name: 'ct-tabs',
  props: {
    value: {
      type: [String, Number],
      default: 0,
    },
    position: {
      type: String,
      default: 'top',
      validator: value => ['top', 'bottom', 'left', 'right'].indexOf(value) > -1,
    },
    height: [String, Number],
  },
  data() {
    return {
      currentIndex: 0,
      tabList: [],
      activeBarStyl: {},
    }
  },
  computed: {
    tabsCls() {
      return `ct-tabs__${this.position}`
    },
    tabsStyl() {
      const ret = {
        height: `${this.height}px`,
      }
      return ret
    },
    // activeBarStyl: {
    //   cache: false,
    //   get() {
    //     console.log('activeBarStyl')
    //     let width = ''
    //     let left = ''
    //     let top = ''
    //     let transform = ''
    //     const $el = this.$refs.tabs
    //     if (!$el) return {}
    //     if (this.position === 'top' || this.position === 'bottom') {
    //       width = $el[this.currentIndex].clientWidth

    //       const _ret = popover($el[this.currentIndex], this.$refs.nav, {
    //         place: 'right',
    //       })
    //       left = _ret.left.replace(/px/g, '') - width
    //       transform = `translateX(${left}px)`
    //     } else {
    //       top = this.currentIndex * 40
    //       transform = `translateY(${top}px)`
    //     }

    //     const ret = {
    //       width: `${width}px`,
    //       transform: transform,
    //     }

    //     return ret
    //   },
    // },
  },
  mounted() {
    this.$nextTick(() => {
      this.calcActiveStyle()
    })
  },
  methods: {
    calcActiveStyle() {
      let width = ''
      let left = ''
      let top = ''
      let transform = ''
      const $el = this.$refs.tabs
      if (!$el || this._.isEmpty($el)) {
        this.activeBarStyl = {}
        return false
      }
      if (this.position === 'top' || this.position === 'bottom') {
        width = $el[this.currentIndex].clientWidth

        const _ret = popover($el[this.currentIndex], this.$refs.nav, {
          place: 'right',
        })
        left = _ret.left.replace(/px/g, '') - width
        transform = `translateX(${left}px)`
      } else {
        top = this.currentIndex * 40
        transform = `translateY(${top}px)`
      }

      const ret = {
        width: `${width}px`,
        transform: transform,
      }

      this.activeBarStyl = ret
    },
    setCurrentIndex(payload) {
      if (this.currentIndex === payload) return false
      this.currentIndex = payload
      this.$emit('change', payload)
    },
    addPane(payload) {
      this.tabList.push(payload)
      this.setActivePane(this.value)
    },
    removePane(payload) {
      let removeIndex = this.tabList.indexOf(payload)
      if (removeIndex === -1) return false
      this.tabList.splice(removeIndex, 1)
      if (this.currentIndex === removeIndex) removeIndex -= 1
      if (removeIndex < 0 || removeIndex > this.tabList.length) removeIndex = 0
      if (this.currentIndex === 0) removeIndex = 0
      this.setActivePane(removeIndex)
    },
    setActivePane(index) {
      if (this.tabList[index] && this.tabList[index].disabled) return false
      this.setCurrentIndex(index)
      this.tabList.forEach((child, _index) => {
        this.tabList[_index].active = false
        if (_index === index) this.tabList[_index].active = true
      })
      this.calcActiveStyle()
      this.$emit('input', index)
    },
  },
}
</script>

<style lang="stylus">
.ct-tabs
  background-color #fff
  overflow hidden
  > .ct-tabs-nav
    position relative
    font-size 0
    margin-bottom 8px
    &:after
      content ''
      position absolute
      left 0
      bottom 0
      width 100%
      height 2px
      background-color #e5e7ea
      z-index 1
    > .ct-tabs-item
      padding 0 20px
      height 41px
      box-sizing border-box
      line-height 40px
      display inline-block
      list-style none
      font-size 14px
      cursor pointer
    > .ct-tabs__active-bar
      position absolute
      bottom 0
      left 0
      height 2px
      background-color: #EE6B5D
      z-index 2
      transition transform .3s cubic-bezier(.645,.045,.355,1)
      list-style none

  // > .ct-tabs-content
  //   overflow auto

  &.ct-tabs__left
    > .ct-tabs-nav
      float left
      margin-right 8px
      &:after
        left auto
        right 0
        height 100%
        width 2px
        bottom auto
        top 0
      > .ct-tabs-item
        display block
        text-align right
      > .ct-tabs__active-bar
        left auto
        right 0
        top 0
        bottom auto
        width 2px
        height 40px

  &.ct-tabs__right
    > .ct-tabs-nav
      float right
      margin-left 8px
      &:after
        left 0
        right auto
        height 100%
        width 2px
        bottom auto
        top 0
      > .ct-tabs-item
        display block
        text-align right
      > .ct-tabs__active-bar
        left 0
        right auto
        top 0
        bottom auto
        width 2px
        height 40px

  &.ct-tabs__left,
  &.ct-tabs__right
    > .ct-tabs-nav
      margin-bottom 0
      height 100%
      > .ct-tabs-item
        height 40px
    > .ct-tabs-content
      height 100%
      // position relative
      // overflow hidden
</style>
