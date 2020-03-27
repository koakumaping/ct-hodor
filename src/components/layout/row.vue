<template>
  <div class="ct-row" :style="gutterStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ctRow',
  props: {
    gutter: {
      type: Number,
      default: 16,
    },
    span: {
      type: [String, Number],
      default: 8,
    },
  },
  computed: {
    gutterStyle() {
      const ret = {}

      if (this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`
        ret.marginRight = ret.marginLeft
      }
      return ret
    },
  },
}
</script>
