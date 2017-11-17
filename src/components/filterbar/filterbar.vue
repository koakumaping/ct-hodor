<template>
  <div class="ct-filterbar-warp"
    :class="filterbarCls"
  >
    <div class="ct-filterbar-bg" @click="hide()"></div>
    <div class="ct-filterbar">
      <div class="ct-fliterbar-title">高级搜索</div>
      <div class="ct-fliterbar-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'filterbar',
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    filterbarCls() {
      return [
        this.visible ? 'ct-filterbar-visible' : undefined,
      ]
    },
  },
  methods: {
    show() {
      this.visible = true
      this.$emit('on-show')
    },
    hide() {
      this.visible = false
      this.$emit('on-hide')
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/var'

.ct-filterbar-warp
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: -1
  visibility: hidden
  height: 0
  width: 0
  overflow: hidden
  &.ct-filterbar-visible
    z-index: 8
    visibility: visible
    height: auto
    width: auto
    > .ct-filterbar
      transform: translate3d(0, 0, 0)
  .ct-filterbar-bg
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    opacity: 0.2
    background-color: rgba(0, 0, 0, 0)
    transition: all 0.3s
  .ct-filterbar
    height: 100%
    width: 240px
    padding-top: 56px
    position: absolute
    right: 0
    top: 0
    z-index: 9
    background-color: #fff
    box-shadow: $box-shadow
    transform: translate3d(240px, 0, 0)
    transition: all 0.3s
    .ct-fliterbar-title
      padding: 16px 8px
      font-size: 16px
      position: absolute
      background: #fff
      top: 0
      left: 0
      width: 100%
      z-index: 2
    .ct-fliterbar-content
      padding: 0 8px 8px 8px
      overflow: auto
      position: absolute
      top: 56px
      left: 0
      right: 0
      bottom: 0
      z-index: 1
      & > .ct-form-search
        margin: 0
        .search-line
          width: 100%
          display: block
          .title
            float: none
            padding: 0
            padding-bottom: 2px
            text-align: left
          .content
            padding: 0
            margin-left: 0
            > .ct-button
              width: 100%
</style>