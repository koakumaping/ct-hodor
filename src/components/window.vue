<template>
  <div class="window" v-show="canView">
    <div class="window-bg" v-on:click="changeView"></div>
    <div class="window-warpper" :style="{width: width}">
      <div class="window-slot">
        <div class="window-header">
          <div class="window-header-close" v-on:click="changeView">
            <i class="fa fa-times" aria-hidden="true"></i>
          </div>
          <div class="window-header-title">{{title}}</div>
        </div>
        <div class="window-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'window',
    props: {
      show: {
        default: true,
      },
      title: {
        default: '',
      },
      width: {
        default: '',
      },
    },
    watch: {
      show(val) {
        this.canView = val
      },
    },
    data() {
      return {
        canView: this.show,
      }
    },
    methods: {
      changeView() {
        this.canView = !this.canView
        this.$emit('update:show', this.canView)
      },
    },
  }
</script>

<style lang="stylus">
@import '../assets/stylus/var'
@import "../assets/stylus/color"
.window
  padding: 0
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 14
  overflow: hidden
  .window-bg
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    opacity: 0.2
    -webkit-transition: all .4s
    transition: all .4s
    background-color: rgba(0, 0, 0, 1)
    z-index: -1
  .window-warpper
    height: 100%
    width: 900px
    margin: 0 auto
    padding: 60px 0
    position: relative
    overflow: auto
    .window-slot
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3)
      overflow: auto
    .window-header
      background-color: #fff
      z-index: 1
      vertical-align: baseline
      height: 48px
      line-height: 48px
      color: #7B8594
      padding: 0 12px
      width: 100%
      border-radius: 4px 4px 0 0
      .window-header-close
        display: inline-block
        font-size: 18px
        cursor: pointer
        padding-right: 8px
      .window-header-title
        display: inline-block
        font-size: 16px
    
    .window-content
      background-color: #fff
      padding: 16px 16px 48px 16px
      min-height: 300px
      overflow: auto

@media screen and ( max-width: 760px )
  .window
    padding: 0
    .window-warpper
      width: 100%
</style>