<template>
  <div class="side" :class="{ 'side-small': !visible }">
    <!-- <div class="side-name">{{name}}</div> -->
    <nav>
      <dl v-for="(row, index) in list" :key="row.id">
        <dt class="side-menu" :class="{ 'side-menu-expand': row.expand }"
        v-on:click="toggleMenu(index)">
          <iconFont :name="row.icon"></iconFont>
          <span>{{row.name}}</span>
          <iconFont name="more" class="right"></iconFont>
        </dt>
        <sideItem :data="row" :countList="countList"></sideItem>        
      </dl>
    </nav>
    <div class="side-collapse" @click="handleCollapse()">
      <iconFont name="back"></iconFont>
      <span v-if="visible">收起侧边栏</span>
      <span v-else>展开侧边栏</span>
    </div>
  </div>
</template>

<script>
import sideItem from './item'

export default {
  name: 'side',
  components: { sideItem },
  props: {
    list: {
      type: Array,
      default: function d() {
        return []
      },
    },
    visible: Boolean,
    collapse: {
      type: Boolean,
      default: true,
    },
    countList: {
      type: Object,
      default: function d() {
        return {}
      },
    },
  },
  methods: {
    toggleMenu(index) {
      this.list.forEach((currentValue, no, array) => {
        if (no !== index) {
          this.list[no].expand = false
        }
      })
      this.list[index].expand = !this.list[index].expand
    },
    handleCollapse() {
      this.$emit('on-collapse', this.visible)
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/color'

$text-color = #fff
$bg-color = #323D59
$menu-bg-color = #2B3654

.side
  position: absolute
  top: 0
  left: 0
  overflow: hidden
  color: $text-color
  width: 200px
  background: $bg-color
  // box-shadow: 0 0 8px rgba(0, 0, 0, 0.12), 0 16px 16px rgba(0, 0, 0, 0.24)
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35)
  height: 100%
  padding-top: 48px
  z-index: 5
  transition: all 0.3s

  .side-collapse
    width: 100%
    height: 42px
    line-height: 42px
    position: absolute
    bottom: 0
    cursor: pointer
    padding-left: 16px
    background: $bg-color
    &:hover
      color: $color-main
    .iconfont
      font-size: 15px
      transition: all 0.3s
    span
      margin-left: 16px
      font-size: 14px
  .side-name
    height: 50px
    line-height: 50px
    text-align: center
    font-size: 18px
    overflow: hidden
  nav
    padding: 0 0 42px 0
    transform: translateZ(0)
    height: 100%
    overflow: auto
    transition: all 0.3s
    &::-webkit-scrollbar
      width: 8px

    /*滚动条的滑块按钮*/
    &::-webkit-scrollbar-thumb
      height: 56px;
      background: rgba(136, 136, 136, 0.4)

    & > dl
      margin-bottom: 2px
    a
      color: inherit
      background-color: $menu-bg-color
      display: block
      font-weight: 400
      letter-spacing: 0.1px
      padding: 10px 0 10px 60px
      white-space: nowrap
      transition: all 0.2s

    dd > span >.router-link-active,
    .side-menu:focus,
    a:focus
      outline: 0
      background-color: $color-main

    .side-menu
      font-weight: 400
      font-size: 15px
      padding: 16px 16px
      cursor: pointer
      transition: all 0.3s
      line-height: 1
      &:hover
        color: #fff
        .side-menu-icon
          display: none
        img[alt=icon-active]
          display: inline-block
      &.side-menu-expand
        .icon-more
          transform: rotateZ(90deg)

      .iconfont
        height: 16px
        width: 16px
        vertical-align: middle
        display: inline-block
        &.icon-more
          transition: all 0.3s
      .side-menu-icon
        height: 16px
        width: 16px
        vertical-align: middle
      img[alt=icon-active]
        display: none

      span
        padding-left: 14px
        font-size: 14px
        vertical-align: middle
        display: inline-block
  
    .side-menu-item
      display: block
      overflow: hidden
      a
        font-size: 12px
        line-height: 37px
        padding: 0
        padding-left: 58px
        padding-bottom: 1px
        border-left: 2px solid transparent
        transition: background-color 0.3s
        &.router-link-active:hover
          color: #fff!important
        &:hover
          color: $color-main
          border-color: $color-main
      .side-menu-sub-icon
        height: 14px
        width: 14px
        vertical-align: middle

.side.side-small
  transform translateX(-200px + 50)
  .side-collapse,
  nav
    transform translateX(200px - 50)
  .side-collapse
    .iconfont::before
      display inline-block
      transform rotateZ(180deg)
    span
      display none
  .side-menu span
      display none
  .side-menu-item
    display none

  &:hover
    transform translateX(0)
    .side-collapse,
    nav
      transform translateX(0)
    .side-menu span
      display inline-block
    .side-menu-item
      display block
    .side-collapse
      span
        display inline-block

@keyframes menu-span-fade
  0%
    opacity 0
  70%
    opacity 0
  100%
    opacity 1
</style>
