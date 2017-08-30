<template>
  <div class="ct-row" :style="gutterStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ctRow',
  props: {
    gutter: [String, Number],
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
