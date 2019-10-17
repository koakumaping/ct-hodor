<template>
  <div class="ct-divider ct-divider-vertical"></div>
</template>

<script>
export default {
  name: 'ctDivider',
}
</script>

<style lang="stylus">
.ct-divider
  font-family "Helvetica Neue For Number", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif
  font-size 14px
  line-height 1.5
  color rgba(0, 0, 0, 0.65)
  -webkit-box-sizing border-box
  box-sizing border-box
  margin 0
  padding 0
  list-style none
  background #e8e8e8
  &.ct-divider-vertical
    margin 0 8px
    display inline-block
    height 0.9em
    width 1px
    vertical-align middle
    position relative
    top -0.06em
</style>