<template>
  <transition name="fade-in-linear" mode="out-in">
    <div class="ct-popover"
      :style="popStyle"
      :class="[`${prefixCls}-${place}`]"
      aria-hidden="true"
      v-clickoutside
    >
      <div class="ct-popover-warp">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import { popover, handleEvent } from 'ct-util'

const prefixCls = 'ct-popover'

export default {
  name: 'ctPopover',
  props: {
    place: {
      default: 'left',
      validator: value => [
        'left',
        'right',
        'top',
        'bottom',
        'top-right',
        'top-left',
        'bottom-right',
        'bottom-left',
      ].indexOf(value) > -1,
    },
    trigger: {
      default: 'hover',
      validator: value => ['hover', 'click'].indexOf(value) > -1,
    },
    inbody: Boolean,
  },
  data() {
    return {
      prefixCls: `${prefixCls}`,
      el: '',
      ret: {
        left: '-9999px',
      },
      handleFocus: '',
      handleBlur: '',
      handlePopoverFocus: '',
      handlePopoverBlur: '',
      handleClick: '',
      handleDocumentClick: '',
      _timer: '',
      openDelay: '0',
      hasInit: false,
    }
  },
  computed: {
    popStyle() {
      return this.ret
    },
  },
  // watch: {
  //   el(val) {
  //     if (!val) return
  //     this.init()
  //   },
  // },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (!this.el) return
      if (this.trigger === 'hover') {
        this.setHover()
      } else {
        this.setClick()
      }
    },
    show(el) {
      if (el) this.el = el
      window.clearTimeout(this._timer)
      if (this.openDelay) {
        this._timer = setTimeout(() => {
          this.set()
        }, this.openDelay)
      } else {
        this.set()
      }
      if (this.trigger === 'click') {
        this.handleDocumentClick = handleEvent('click', {
          onElement: document,
          withCallback: (event) => {
            this.documentClick(event)
          },
        })
      }
    },
    hide(delay = 200) {
      window.clearTimeout(this._timer)
      this._timer = window.setTimeout(() => {
        this.reset()
      }, delay)
      if (this.trigger === 'click' && this.handleDocumentClick) {
        this.handleDocumentClick.destroy()
      }
    },
    toggle() {
      console.log('toggle')
      if (this.ret.left === '-9999px') {
        this.set()
      } else {
        this.reset()
      }
    },
    reset() {
      this.ret = {
        left: '-9999px',
      }
    },
    set() {
      this.ret = popover(this.el, this, {
        place: this.place,
      }, this.inbody)
      // display: none时无法获得元素宽度,高度,所以这边用visible: hidden
      this.ret.visibility = 'visible'
    },
    setHover() {
      this.handleFocus = handleEvent('mouseenter', {
        onElement: this.el,
        withCallback: (event) => {
          this.show()
        },
      })
      this.handleBlur = handleEvent('mouseleave', {
        onElement: this.el,
        withCallback: (event) => {
          this.hide()
        },
      })

      this.handlePopoverFocus = handleEvent('mouseenter', {
        onElement: this.$el,
        withCallback: (event) => {
          this.show()
        },
      })
      this.handlePopoverBlur = handleEvent('mouseleave', {
        onElement: this.$el,
        withCallback: (event) => {
          this.hide()
        },
      })
    },
    setClick() {
      this.handleClick = handleEvent('click', {
        onElement: this.el,
        withCallback: (event) => {
          this.toggle()
        },
      })
    },
    documentClick(e) {
      if (!this.el) return
      if (this.el.contains(e.target) || this.$el.contains(e.target)) return
      this.reset()
    },
  },
  beforeDestroy() {
    if (!this.el) return
    this.el = ''
    this.ret = {}
    if (this.trigger === 'hover') {
      if (this.handleFocus) this.handleFocus.destroy()
      if (this.handleBlur) this.handleBlur.destroy()
      if (this.handlePopoverFocus) this.handlePopoverFocus.destroy()
      if (this.handlePopoverBlur) this.handlePopoverBlur.destroy()
    } else {
      if (this.handleClick) this.handleClick.destroy()
    }
    if (this.handleDocumentClick) this.handleDocumentClick.destroy()
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/color'

.ct-popover
  visibility:hidden
  position: fixed
  left: -9999px
  line-height: 1.5
  font-size: 12px
  .ct-popover-warp
    background: #fff
    padding: 6px 8px
    border-radius: 4px
    border: 1px solid $border-color
    position: relative
    box-shadow: 0 1px 6px rgba(0,0,0,.2)
    &:before
      content: ''
      position: absolute
      width: 8px
      height: 8px
      background-color: #fff
      border-top: 1px solid $border-color
      border-left: 1px solid $border-color

.ct-popover
  &.ct-popover-left
    padding-right: 8px
    .ct-popover-warp:before
      right: -4px
      top: 50%
      margin-top: -5px
      transform: rotateZ(135deg)
  &.ct-popover-right
    padding-left: 8px
    .ct-popover-warp:before
      left: -4px
      top: 50%
      margin-top: -5px
      transform: rotateZ(-45deg)
  &.ct-popover-top
  padding-bottom: 8px
  .ct-popover-warp:before
    bottom: -4px
    left: 50%
    margin-left: -5px
    transform: rotateZ(-135deg)

  &.ct-popover-top-left
    padding-right: 8px
    .ct-popover-warp:before
      right: -4px
      top: 12px
      margin-top: -5px
      transform: rotateZ(135deg)
  &.ct-popover-top-right
    padding-left: 8px
    .ct-popover-warp:before
      left: -4px
      top: 12px
      margin-top: -5px
      transform: rotateZ(-45deg)

  &.ct-popover-bottom
    padding-top: 8px
    .ct-popover-warp:before
      top: -4px
      left: 50%
      margin-left: -5px
      transform: rotateZ(45deg)
  &.ct-popover-bottom-left
    padding-top: 8px
    .ct-popover-warp:before
      top: -4px
      left: 12px
      margin-left: -5px
      transform: rotateZ(45deg)
  &.ct-popover-bottom-right
    padding-top: 8px
    .ct-popover-warp:before
      top: -4px
      left: 12px
      margin-left: -5px
      transform: rotateZ(45deg)
</style>