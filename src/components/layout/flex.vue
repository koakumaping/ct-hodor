<template>
  <div class="ct-flexbox"
    :class="[
      `ct-flexbox-justify-${justify}`,
      `ct-flexbox-align-${align}`,
    ]"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'flex',
  props: {
    align: {
      type: String,
      default: 'center',
    },
    justify: {
      type: String,
      default: 'center',
    },
  },
}
</script>

<style lang="stylus">
.ct-flexbox
  display: flex
  text-align: left
  align-items: center

  &.ct-flexbox-align-start
    align-items: start
  &.ct-flexbox-align-end
    align-items: end
  &.ct-flexbox-align-center
    align-items: center
  &.ct-flexbox-align-baseline
    align-items: baseline
  &.ct-flexbox-align-stretch
    align-items: stretch

  &.ct-flexbox-justify-start
    justify-content: flex-start
  &.ct-flexbox-justify-end
    align-items: flex-end
  &.ct-flexbox-justify-center
    justify-content: center
  &.ct-flexbox-justify-between
    justify-content: space-between
  &.ct-flexbox-justify-around
    align-items: space-around
</style>
