<template>
  <div class="ct-white-space"
  :class="[ 'ct-white-space-' + size ]">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'WhiteSpace',
  props: {
    size: {
      type: String,
      default: 'md',
    },
  },
}
</script>

<style lang="stylus">
.ct-white-space
  &.ct-white-space-xs
    padding: 1.5px 0
  &.ct-white-space-sm
    padding: 3px 0
  &.ct-white-space-md
    padding: 4.5px 0
  &.ct-white-space-lg
    padding: 7.5px 0
  &.ct-white-space-xl
    padding: 10.5px 0
</style>
