<template>
  <div class="side" :class="{ 'side-small': !!!visible }">
    <!-- <div class="side-name">{{name}}</div> -->
    <nav>
      <dl v-for="(row, index) in list" :key="row.id">
        <dt class="side-menu" :class="{ 'side-menu-expand': row.expand }"
        v-on:click="toggleMenu(index)">
          <iconFont :name="row.icon"></iconFont>
          <span>{{row.name}}</span>
        </dt>
        <sideItem :data="row"></sideItem>        
      </dl>
    </nav>
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
  width: 214px
  background: $bg-color
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.12), 0 16px 16px rgba(0, 0, 0, 0.24)
  height: 100%
  z-index: 9
  transition: all 0.3s

  .side-name
    height: 50px
    line-height: 50px
    text-align: center
    font-size: 18px
    overflow: hidden
  nav
    padding: 0 0 32px 0
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

    dd > .router-link-active,
    .side-menu:focus,
    a:focus
      outline: 0
      color: #fff
      background-color: $color-main

    .side-menu
      font-weight: 400
      font-size: 15px
      padding: 16px 16px
      cursor: pointer
      background-image: url(../../assets/img/more.png)
      background-position: center right
      background-position-x: 190px
      background-repeat: no-repeat
      transition: all 0.3s
      line-height: 1
      &:hover
        color: #fff
        .side-menu-icon
          display: none
        img[alt=icon-active]
          display: inline-block
      &.side-menu-expand
        background-image: url(../../assets/img/more-unfold.png)

      .iconfont
        height: 16px
        width: 16px
        vertical-align: middle
        display: inline-block
      .side-menu-icon
        height: 16px
        width: 16px
        vertical-align: middle
      img[alt=icon-active]
        display: none

      span
        padding-left: 14px
        font-size: 16px
        vertical-align: middle
        display: inline-block
  
    .side-menu-item
      display: block
      overflow: hidden
      a
        line-height: 37px
        padding: 0
        padding-left: 60px
        padding-bottom: 1px
        &:hover
          background-color: $color-main
      .side-menu-sub-icon
        height: 14px
        width: 14px
        vertical-align: middle

.side.side-small
  transform translateX(-214px + 49)
  nav
    transform translateX(214px - 49)
  &:hover
    transform translateX(0)
    nav
      transform translateX(0)
    .side-menu span
      display inline-block
    .side-menu-item
      display block
  .side-menu span
      display none
  .side-menu-item
    display none

@keyframes menu-span-fade
  0%
    opacity 0
  70%
    opacity 0
  100%
    opacity 1
</style>
