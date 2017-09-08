<template>
  <div class="ct-dialog" v-show="visible" :class="sizeCls" aria-hidden="true">
    <div class="ct-dialog-bg" @click="shark"></div>
    <div class="ct-dialog-warp" ref="dialogWarp">
      <div class="ct-dialog-container" :style="customWidthStyle">
        <div class="ct-dialog-box clear"
          :style="customHeightStyle"
          :class="boxCls"
          ref="container"
        >
          <div class="ct-dialog-close" @click="handleClose" v-if="canClose">
            <iconFont name="close"></iconFont>
          </div>
          <div class="ct-dialog-title">{{title}}</div>
          <div class="ct-dialog-content"
            :class="[$slots.footer ? 'has-footer' : '']"
          >
            <slot></slot>
          </div>
          <div class="ct-dialog-footer clear" v-if="$slots.footer">
            <div class="right">
              <slot name="footer"></slot>
            </div>
          </div>
          <!-- <div class="ct-dialog-clear"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  throttle,
  isNumber,
  addResizeListener,
  removeResizeListener,
} from 'ct-util'

const prefixCls = 'ct-dialog'

export default {
  name: 'ctDialog',
  props: {
    title: {
      type: [String, Number],
    },
    visible: {
      type: Boolean,
      default: false,
    },
    size: {
      default: 'default',
      validator: value => ['small', 'default', 'big', 'large'].indexOf(value) > -1,
    },
    beforeClose: Function,
    // 是否显示右上角的关闭按钮，默认显示
    canClose: {
      type: Boolean,
      default: true,
    },
    width: [String, Number],
    height: [String, Number],
    fullscreen: Boolean,
  },
  data() {
    return {
      prefxiCls: `${prefixCls}`,
      windowWidth: document.body.clientWidth,
      windowHeight: document.body.clientHeight,
      dialogHeight: 'auto',
      resizeHandleEvent: null,
      closeAnimation: '',
      animation: 'zoom',
      customHeightStyle: {},
    }
  },
  computed: {
    sizeCls() {
      return [`${this.prefxiCls}-${this.size}`]
    },
    boxCls() {
      return [this.animation, this.closeAnimation]
    },
    customWidthStyle() {
      const ret = {}
      if (this.width) {
        const _width = Number(this.width)
        ret.width = `${_width}px`
        ret.marginLeft = `${this.windowWidth / 2 - _width / 2}px`
      }

      return ret
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.$emit('on-open')
        this.$nextTick(() => {
          this.calcHeight()
        })
      } else {
        this.$emit('on-hide')
      }
    },
  },
  mounted() {
    this.resizeHandleEvent = throttle(() => {
      this.calcHeight()
    }, 10)

    addResizeListener(this.$refs.dialogWarp, this.resizeHandleEvent)
  },
  methods: {
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    hide() {
      console.log('hide')
      this.$emit('update:visible', false)
      this.$emit('on-close', false)
    },
    shark() {
      // 避免重复执行
      if (this.closeAnimation) return
      // 清除开始动画
      this.animation = ''
      this.closeAnimation = 'shark'
      this.closesT = window.setTimeout(() => {
        this.closeAnimation = ''
      }, 400)
      this.$emit('on-bg-click')
    },
    calcHeight() {
      const ret = {}
      if (this.fullscreen) {
        this.dialogHeight = document.body.clientHeight
      } else if (this.height) {
        this.dialogHeight = Number(this.height)
      } else if (this.$refs.container && this.$refs.container.clientHeight) {
        this.dialogHeight = this.$refs.container.clientHeight
      }

      ret.height = `${this.dialogHeight}${isNumber(this.dialogHeight) ? 'px' : ''}`

      let marginTop = this.windowHeight / 2 - this.dialogHeight / 2
      if (marginTop < 0) marginTop = 0
      ret.marginTop = `${marginTop}${isNumber(marginTop) ? 'px' : ''}`
      this.customHeightStyle = ret
    },
  },
  beforeDestroy() {
    if (this.resizeHandleEvent) {
      removeResizeListener(this.$refs.dialogWarp, this.resizeHandleEvent)
    }
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/dialog.styl'
</style>