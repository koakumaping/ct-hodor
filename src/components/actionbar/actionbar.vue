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
  margin-bottom 16px
  font-size 0
  > .left > *,
  > .left > div > *,
  > .right > div > *
    display inline-block!important
    margin-right 8px!important
    vertical-align middle
    &:last-child
      margin-right 0!important
</style>