<template>
  <div :class="colCls" :style="gutterStyle">
    <slot></slot>
  </div>
</template>

<script>
import Emitter from '../../mixins/emitter'

export default {
  name: 'ctCol',
  mixins: [Emitter],
  props: {
    span: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      currentSpan: '',
    }
  },
  computed: {
    colCls() {
      return [`ct-${this.currentSpan}`]
    },
    gutterStyle() {
      const parent = this.findComponentUpward(this, 'ctRow')
      let gutter = 16
      if (parent) {
        gutter = parent.gutter
      }
      const ret = {}
      ret.paddingLeft = `${gutter / 2}px`
      ret.paddingRight = ret.paddingLeft
      return ret
    },
  },
  mounted() {
    const parent = this.findComponentUpward(this, 'ctRow')
    if (parent && parent.span) this.currentSpan = parent.span
    if (this.span) this.currentSpan = this.span
  },
}
</script>