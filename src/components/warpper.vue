<template>
  <div class="warpper">
    <slot>
      如果没有分发内容则显示我。
    </slot>
  </div>
</template>

<script>
export default {
  name: 'warpper',
}
</script>

<style lang="stylus">
  .warpper
    min-height: 100%
    height: 100%
    // overflow: auto
</style>
