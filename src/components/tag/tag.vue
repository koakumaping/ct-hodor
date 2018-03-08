<template>
  <span
    class="ct-tag"
    :class="[type ? 'ct-tag-' + type : '', {'is-hit': hit}]"
    :style="{backgroundColor: color}"
  >
    <slot></slot>
    <div
      class="ct-tag-close"
      v-if="closeable"
      @click="handleClose"
    >
      <iconFont name="close"/>
    </div>
  </span>
</template>
<script>
export default {
  name: 'ctTag',
  props: {
    closeable: Boolean,
    type: {
      type: String,
      default: 'primary',
    },
    hit: Boolean,
    color: String,
  },
  methods: {
    handleClose(event) {
      this.$emit('close', event)
    },
  },
}
</script>

<style lang="stylus">
.ct-tag
  display: inline-block
  padding: 0 5px
  height: 32px
  line-height: 30px
  font-size: 14px
  color: #fff
  border-radius: 4px
  box-sizing: border-box
  border: 1px solid transparent
  white-space: nowrap
  .ct-tag-close
    display: inline
    cursor: pointer
    line-height: 1
  &.ct-tag-success
    background-color: rgba(18,206,102,.1)
    border-color: rgba(18,206,102,.2)
    color: #13ce66
  &.ct-tag-warning
    background-color: rgba(247,186,41,.1)
    border-color: rgba(247,186,41,.2)
    color: #f7ba2a
  &.ct-tag-danger
    background-color: rgba(255,73,73,.1)
    border-color: rgba(255,73,73,.2)
    color: #ff4949
  &.ct-tag-primary
    background-color: rgba(32,160,255,.1)
    border-color: rgba(32,160,255,.2)
    color: #20a0ff
  &.ct-tag-gray
    background-color: #e4e8f1
    border-color: #e4e8f1
    color: #48576a
</style>