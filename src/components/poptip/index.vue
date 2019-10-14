<template>
  <div class="ct-poptip">
    <div class="ct-poptip-warp"
      @click="handleClick"
      @mouseover="handleMouseIn"
      @mouseout="handleMouseOut"
      ref="poptip"
    >
      <slot></slot>
    </div>
    <div class="ct-popover"
      :style="ret"
      :class="[`${prefixCls}-${place}`]"
      ref="popover"
    >
      <div class="ct-popover-warp">
        <slot name="content"></slot>
        <div class="ct-popover-close" @click="handleClose" v-if="isShowClose">
          <iconFont name="close"></iconFont>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const prefixCls = 'ct-popover'

export default {
  name: 'ctPoptip',
  props: {
    place: {
      default: 'left',
      validator: value => [
        'left',
        'right',
        'top',
        'bottom',
        'right-top',
        'left-top',
        'top-right',
        'top-left',
        'bottom-right',
        'bottom-left',
        'right-bottom',
        'left-bottom',
      ].indexOf(value) > -1,
    },
    isShowClose: false,
    trigger: {
      default: 'click',
      validator: value => ['hover', 'click'].indexOf(value) > -1,
    },
    width: [String, Number],
    value: [String, Number, Boolean],
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.currentValue = val
        this.$emit('input', val)
      },
    },
    currentValue(val) {
      if (val) {
        this.showPopover()
      } else {
        this.hidePopover()
      }
      this.$emit('input', val)
    },
  },
  data() {
    return {
      prefixCls: `${prefixCls}`,
      currentValue: false,
      ret: {
        visibility: 'hidden',
      },
      handleDocumentClick: null,
    }
  },
  methods: {
    handleClose() {
      if (this.isShowClose) this.currentValue = false
    },
    handleClick() {
      if (this.trigger === 'hover') return false
      this.show()
    },
    handleMouseIn() {
      if (this.trigger === 'click') return false
      this.show()
    },
    handleMouseOut() {
      if (this.trigger === 'click') return false
      this.hide()
    },
    show() {
      this.currentValue = true
    },
    hide() {
      if (!this.isShowClose) this.currentValue = false
    },
    showPopover() {
      this.bindEvent()
      const popover = this.$refs.popover
      const _ret = this._.popover(this.$refs.poptip, popover, {
        place: this.place,
      }, true)
      _ret.visibility = 'visible'
      _ret.position = 'absolute'
      _ret.zIndex = '9999'
      this.ret = _ret

      document.body.appendChild(popover)
    },
    hidePopover() {
      this.ret.visibility = 'hidden'
      this.cancelEvent()
    },
    bindEvent() {
      if (this.handleDocumentClick) return false
      if (this.trigger === 'hover') return false
      this.handleDocumentClick = this._.handleEvent('click', {
        onElement: document,
        withCallback: (event) => {
          if (this.$el.contains(event.target) || this.$refs.popover.contains(event.target)) {
            return false
          }
          if (this.ret.visibility !== 'hidden') this.hide()
        },
      })
    },
    cancelEvent() {
      if (this.handleDocumentClick) {
        this.handleDocumentClick.destroy()
        this.handleDocumentClick = null
      }
    },
  },
  beforeDestroy() {
    this.cancelEvent()
    try {
      document.body.removeChild(this.$refs.popover)
    } catch (error) {
      (() => {})()
    }
  },
}
</script>

<style lang="stylus">
.ct-poptip
  position relative
  display inline-block

.ct-action-bar
  .ct-poptip-warp
    margin-bottom 0!important

.ct-popover-warp
  .ct-popover-close
    float right
</style>
