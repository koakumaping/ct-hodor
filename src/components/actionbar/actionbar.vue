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
</style>