<template>
  <span>
    <transition name="popup">
      <div class="v-modal" v-show="currentValue" @click="click" ref="modal"/>
    </transition>
    <transition :name="`popup-float-${position}`">
      <div
        class="ct-popup"
        :class="[`ct-popup-${position}`]"
        ref="popup"
        v-show="currentValue"
        :style="styl"
      >
        <slot v-if="currentValue"/>
      </div>
    </transition>
  </span>
</template>

<script>
export default {
  name: 'popup',
  props: {
    value: Boolean,
    position: {
      type: String,
      default: 'right',
    },
    height: {
      type: String,
      default: '',
    },
    maxHeight: {
      type: String,
      default: '70%',
    },
    width: {
      type: String,
      default: '',
    },
    maxWidth: {
      type: String,
      default: '100%',
    },
  },
  data() {
    return {
      currentValue: false,
      opend: false,
      id: this._.randomString(12),
      modal: null,
    }
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
      this.$emit('input', val)
      if (val) {
        this.show()
      } else {
        this.hide()
      }
    },
  },
  computed: {
    styl() {
      const ret = {}
      let height = this.height
      if (this.position === 'left' || this.position === 'right') height = '100%'
      // if (this.position === 'top' || this.position === 'bottom') ret.height = height
      if (height) ret.height = height
      ret.maxHeight = height || this.maxHeight
      ret.width = this.width ? `${this.width}px` : ''
      ret.maxWidth = ret.width || this.maxWidth
      return ret
    },
  },
  methods: {
    show() {
      if (!this.opend) {
        this.opend = true
        document.body.appendChild(this.$refs.modal)
        document.body.appendChild(this.$refs.popup)
      }
    },
    hide() {
      this.$emit('hide')
    },
    toggle() {
      this.currentValue = !this.currentValue
    },
    click() {
      this.currentValue = false
    },
  },
  beforeDestroy() {
    if (this.opend) {
      document.body.removeChild(this.$refs.modal)
      document.body.removeChild(this.$refs.popup)
    }
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/color'

.ct-popup
  position: absolute
  left: 0
  bottom: 0
  z-index: 9
  width: 100%
  height: auto
  max-height: 100%
  overflow-y: auto
  background-color: $background-main
  backface-visibility: hidden
  transition: transform .2s ease-in-out
  &.ct-popup-right
    width: 375px
    height: 100%
    left: auto
    bottom: auto
    top: 0
    right: 0
    max-height: 100%
    box-shadow: -4px 3px 9px rgba(0,21,41,0.08)

.popup-float-bottom-enter,
.popup-float-bottom-leave-active
  transform: translate3d(0, 100%, 0)

.popup-float-right-enter,
.popup-float-right-leave-active
  transform: translate3d(100%, 0, 0)

.popup-enter,
.popup-leave-active
  opacity: 0
</style>
