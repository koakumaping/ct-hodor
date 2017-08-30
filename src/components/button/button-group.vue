<template>
  <div class="ct-button-group clear">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ctButtonGroup',
}
</script>

<style lang="stylus">
.ct-button-group
  & > .ct-button,
  & > a > .ct-button
    float: left
    margin-right: 8px
    &:last-child
      margin-right: 0
</style>