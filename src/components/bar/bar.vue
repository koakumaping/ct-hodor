<template>
  <div class="ct-bar">
    <div class="ct-bar-warp clear">
      <div class="ct-bar-title left">
        <span>{{$route.meta.name}}</span>
      </div>
      <div class="ct-bar-content left">
        <slot name="content"></slot>
      </div>
      <div class="ct-bar-actions right clear">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ctBar',
}
</script>

<style lang="stylus">
@import '../../assets/stylus/color'

.ct-bar
  margin: 0 -16px
  // box-shadow: 0 0 2px rgba(0,0,0,0.3)
  .ct-bar-warp
    background-color: transparent
    position: relative
    padding: 0 16px
    .ct-bar-title
      float: left
      padding-right: 16px
      font-size: 14px
      line-height: 42px
    .ct-bar-content
      line-height: 42px
    .ct-bar-actions
      float: right
      // padding-right: 8px
      .ct-button
        padding: 0
        margin-left: 10px
        border: 0
        background-color: transparent
        height: 42px
        line-height: 42px
        &:last-child
          margin-right: 0
</style>

