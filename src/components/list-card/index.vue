<template>
  <div
    class="ct-list-card border-arround left"
    :class="{ 'ct-list-card_btn': $slots.btn }"
    :style="{
      width: _.isNumber(width) ? `${width}px` : width,
      minHeight: _.isNumber(height) ? `${height}px` : height,
    }"
  >
    <slot name="btn" />
    <div class="ct-card-meta">
      <div class="ct-card-meta-avatar" v-if="$slots.avatar">
        <slot name="avatar" />
      </div>
      <div class="ct-card-meta-detail">
        <div class="ct-card-meta-title" v-if="$slots.default">
          <a><slot /></a>
        </div>
        <div class="ct-card-meta-description" v-if="$slots.desc">
          <div>
            <slot name="desc" />
          </div>
        </div>
      </div>
    </div>
    <ul class="ct-card-actions clear" v-if="$slots.actions">
      <slot name="actions" />
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ListCard',
  props: {
    width: [String, Number],
    height: [String, Number],
  },
}
</script>

<style lang="stylus">
.ct-card-list
  .ct-list-card
    margin-bottom: 12px
    margin-left: 0
    margin-right: 12px

.ct-list-card
  padding: 20px
  min-height: 188px
  &:hover
    box-shadow: 0 2px 8px rgba(0, 0, 0, .09)
    border-color: rgba(0, 0, 0, .09)
  &.ct-list-card_btn
    border: 0
    padding: 0
    height: 188px
  .ct-button
    background-color: #fff
    border-color: #d9d9d9
    border-radius: 2px
    color: rgba(0,0,0,.45)
    width: 100%
    height: 100%

.ct-card-meta
  margin: -4px 0
  zoom: 1
  .ct-card-meta-avatar
    padding-right: 16px
    float: left
    img
      width: 48px
      height: 48px
      border-radius: 48px
  .ct-card-meta-detail
    overflow: hidden
    > div:not(:last-child)
      margin-bottom: 8px
    .ct-card-meta-title
      margin-bottom: 12px
      font-size: 16px
      text-overflow: ellipsis
      overflow: hidden
      white-space: nowrap
      color: rgba(0,0,0,.85)
      font-weight: 500
      > a
        color: rgba(0,0,0,.85)
        display: inline-block
        max-width: 100%
    .ct-card-meta-description
      color: rgba(0,0,0,.45)
      > div
        min-height: 64px
        line-height: 1.5
        position: relative
        width: 100%
        display: inline-block
        display: -webkit-box
        font-size: 14px

.ct-card-actions
  background: #f7f9fa
  border-top: 1px solid #e8e8e8
  zoom: 1
  list-style: none
  margin: 21px -20px -20px
  padding: 0
  display: flex
  > li
    float: left
    text-align: center
    margin: 8px 0
    color: rgba(0, 0, 0, .45)
    cursor: pointer
    flex: 1
  > li:not(:last-child)
    border-right: 1px solid #e8e8e8
</style>
