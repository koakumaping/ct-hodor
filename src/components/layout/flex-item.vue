<template>
  <div class="ct-flexbox-item hidden">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FlexItem',
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
