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
  margin: 0 -16px 16px -16px
  box-shadow: 0 0 2px rgba(0,0,0,0.3)
  .ct-bar-warp
    background-color: #fff
    position: relative
    padding: 4px 16px
    .ct-bar-title
      float: left
      padding-right: 16px
      font-size: 14px
      line-height: 24px
    .ct-bar-content
      line-height: 24px
    .ct-bar-actions
      float: right
      // padding-right: 8px
      .ct-button
        margin-right: 8px
        padding: 3px 4px 4px 4px
        border: 0;
        &:last-child
          margin-right: 0
</style>

