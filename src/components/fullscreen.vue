<template>
<transition name="fade-in-linear" mode="out-in">
  <div class="fullscreen" v-show="visiable">
    <div class="fullscreen-bg"></div>
    <div class="fullscreen-warpper" :style="{width: width}">
      <div class="fullscreen-slot">
        <div class="fullscreen-header">
          <div class="fullscreen-header-warp">
            <div class="fullscreen-header-close" @click="close">
              <i class="fa fa-times" aria-hidden="true"></i>
            </div>
            <div class="fullscreen-header-title">{{title}}</div>
          </div>
        </div>
        <div class="fullscreen-content" v-if="visiable">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
  export default {
    name: 'fullscreen',
    props: {
      title: {
        default: '',
      },
      width: {
        default: '',
      },
      // 显示fullscreen的触发方式
      trigger: {
        type: String,
        default: 'click',
        validator: value => ['click', 'focus', 'hover', 'manual'].indexOf(value) > -1,
      },
    },
    data() {
      return {
        visiable: false,
        el: [],
        handle: [],
      }
    },
    watch: {
      el(val) {
        this.destoryList()
        this.handleList()
      },
    },
    methods: {
      close() {
        this.visiable = false
        this.$emit('on-close')
      },
      handleList() {
        this.el.forEach((element) => {
          this.handle.push(
            this.$util.handleEvent(this.trigger, {
              onElement: element,
              withCallback: (event) => {
                this.visiable = true
                this.$emit('on-open')
              },
            }),
          )
        })
      },
      destoryList() {
        this.handle.forEach((element) => {
          element.destroy()
        })
      },
    },
    destroyed() {
      // if (this.handle !== '') {
      //   this.handle.destroy()
      // }
    },
  }
</script>

<style lang="stylus">
@import '../assets/stylus/var'
@import "../assets/stylus/color"

.fullscreen
  // padding: 24px
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 10
  overflow: hidden
  .fullscreen-bg
    position: fixed
    top: 0
    left: 0 
    right: 0
    bottom: 0
    opacity: 0.2
    -webkit-transition: all .4s
    transition: all .4s
    background-color: rgba(255, 255, 255, 1)
    z-index: -1
  .fullscreen-warpper
    height: 100%
    width: 100%
    margin: 0 auto
    position: relative
    overflow: auto
    box-shadow: 0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0, 0, 0, .2),0 1px 8px 0 rgba(0, 0, 0, .12)
    .fullscreen-slot
      height 100%
      overflow: auto
      background-color $background-main
    .fullscreen-header
      z-index: 1
      vertical-align: baseline
      height: 48px
      line-height: 48px
      color: #7B8594
      padding: 0 12px
      width: 100%
      position absolute
      top 0
      // border-bottom 1px solid $border-color
      overflow hidden
      .fullscreen-header-warp
        width 100%
        background-color $background-main
      .fullscreen-header-close
        display: inline-block
        font-size: 18px
        cursor: pointer
        padding-right: 8px
      .fullscreen-header-title
        display: inline-block
        font-size: 16px
    
    .fullscreen-content
      overflow: auto
      padding-top: 48px
      height: 100%
</style>