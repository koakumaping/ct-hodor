<template>
  <div class="ct-flexbox-item hidden" :style="styl">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FlexItem',
  props: {
    basis: {
      type: [String, Number],
      default: '',
    },
    grow: {
      type: [String, Number],
      default: 1,
    },
    shrink: {
      type: [String, Number],
      default: '',
    },
  },
  computed: {
    styl() {
      const ret = {
        'flex-shrink': this.shrink,
        'flex-grow': this.grow,
        'flex-basis': this.basis,
      }

      return ret
    },
  },
}
</script>

<style lang="stylus">
.ct-flexbox-item
  flex: 1
  margin-left: 8px
  min-width: 10px
  &:first-child
    margin-left: 0
</style>
