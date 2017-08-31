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
      required: true,
    },
  },
  computed: {
    colCls() {
      return [`ct-${this.span}`]
    },
    gutterStyle() {
      const parent = this.findComponentUpward(this, 'ctRow')
      let gutter = 0
      if (parent) {
        gutter = parent.gutter
      }
      const ret = {}
      ret.paddingLeft = `${gutter / 2}px`
      ret.paddingRight = ret.paddingLeft
      return ret
    },
  },
}
</script>