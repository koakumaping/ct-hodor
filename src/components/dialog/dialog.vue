<template>
  <span>
    <div class="ct-dialog" v-show="visible" :class="sizeCls" aria-hidden="true" ref="ctDialog">
      <div class="ct-dialog-bg" @click="shark"></div>
      <div class="ct-dialog-warp">
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
              :class="[$slots.footer ? 'has-footer' : '', fullScreen ? 'fullscreen' : '']"
              :style="contentStyle"
              ref="dialogContent"
            >
              <slot v-if="visible"></slot>
            </div>
            <div class="ct-dialog-footer clear" v-if="$slots.footer">
              <div class="right">
                <slot name="footer"></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <slot name="reference"></slot>
  </span>
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
    // visible: {
    //   type: Boolean,
    //   default: false,
    // },
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
    fullScreen: Boolean,
  },
  data() {
    return {
      prefxiCls: `${prefixCls}`,
      visible: false,
      windowWidth: document.body.clientWidth,
      // windowHeight: document.body.clientHeight,
      dialogHeight: 'auto',
      resizeHandleEvent: null,
      closeAnimation: '',
      animation: 'zoom',
      customHeightStyle: {},
    }
  },
  computed: {
    windowHeight: {
      cache: false,
      get() {
        if (this.$refs.ctDialog) return this.$refs.ctDialog.clientHeight
        return ''
      },
    },
    sizeCls() {
      return [`${this.prefxiCls}-${this.size}`]
    },
    boxCls() {
      return [this.animation, this.closeAnimation]
    },
    contentStyle() {
      const ret = {}
      if (this.fullScreen) {
        ret.height = this.windowHeight ? `${this.windowHeight - 60}px` :
          isNumber(this.dialogHeight) ? `${this.dialogHeight - 60}px` : ''
      }
      return ret
    },
    customWidthStyle: {
      cache: false,
      get() {
        const ret = {}
        if (this.fullScreen) {
          ret.width = '90%'
          ret.marginLeft = '5%'
          ret.paddingTop = '58px'
        }

        if (this.width) {
          ret.width = `${this.width}${isNumber(this.width) ? 'px' : ''}`
          ret.margin = '0 auto'
          // ret.marginLeft = isNumber(this.width) ?
          //   `${this.windowWidth / 2 - this.width / 2}px` :
          //   `${(100 - this.width.replace('%', '')) / 2}%`
        }
        return ret
      },
    },
  },
  mounted() {
    this.resizeHandleEvent = throttle(() => {
      this.calcHeight()
    }, 10)

    addResizeListener(this.$refs.dialogContent, this.resizeHandleEvent)
  },
  methods: {
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    show() {
      // this.$emit('update:visible', true)
      this.$emit('on-open', true)
      this.visible = true
      document.body.appendChild(this.$refs.ctDialog)
    },
    hide() {
      this.$emit('on-close', false)
      this.visible = false
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
      if (this.height) {
        this.dialogHeight = Number(this.height)
      } else if (this.$refs.container && this.$refs.container.clientHeight) {
        this.dialogHeight = this.$refs.container.clientHeight
      }

      ret.height = `${this.dialogHeight}${isNumber(this.dialogHeight) ? 'px' : ''}`

      if (!this.height) {
        ret.height = ''
      }

      let marginTop = 0
      if (!this.fullScreen) {
        marginTop = this.windowHeight / 2 - this.dialogHeight / 2
        if (marginTop < 0) marginTop = 0
      } else {
        ret.minHeight = '100%'
      }

      ret.marginTop = `${marginTop}${isNumber(marginTop) ? 'px' : ''}`
      this.customHeightStyle = ret
    },
    doDestroy() {
      try {
        document.body.removeChild(this.$refs.ctDialog)
      } catch (error) {
        (() => {})()
      }
    },
  },
  beforeDestroy() {
    if (this.resizeHandleEvent) {
      removeResizeListener(this.$refs.dialogContent, this.resizeHandleEvent)
    }
    this.doDestroy()
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/dialog.styl'
</style>