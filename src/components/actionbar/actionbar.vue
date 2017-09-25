<template>
  <div class="ct-action-bar clear">
    <div class="left">
      <slot name="left"></slot>
      <slot></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ctActionBar',
}
</script>

<style lang="stylus">
.ct-action-bar
  margin-bottom 8px
  font-size 0
  > .left > *
  > .right > *
    display inline-block
    margin-right 8px
    &:last-child
      margin-right 0
</style>