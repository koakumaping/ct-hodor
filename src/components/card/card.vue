<template>
  <div class="ct-card">
    <div class="ct-card-head clear" v-if="label">
      <div class="ct-card-head-warp">
        <div class="ct-card-head-title">
          {{label}}
          <div class="ct-card-head-title-slot">
            <slot name="title"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="ct-card-body clear">
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ctCard',
  props: {
    label: String,
  },
}
</script>

<style lang="stylus">
.ct-card
  font-size: 14px
  line-height: 1.5
  color: rgba(0, 0, 0, 0.65)
  margin: 0
  padding: 0
  list-style: none
  background: #fff
  border-radius: 2px
  position: relative
  transition: all .3s
  margin-bottom: 16px
  .ct-card-head
    background: #fff
    border-bottom: 1px solid #e5e7ea
    padding: 0 24px
    border-radius: 2px 2px 0 0
    zoom: 1
    margin-bottom: -1px
    min-height: 48px
    .ct-card-head-warp
      display: flex
      .ct-card-head-title
        font-size: 16px
        padding: 16px 0
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        color: rgba(0, 0, 0, 0.85)
        font-weight: 500
        display: inline-block
        flex: 1
        .ct-card-head-title-slot
          display inline-block
          padding-left 16px
  .ct-card-body
    padding: 24px
    zoom: 1
</style>
