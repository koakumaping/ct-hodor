<template>
  <button class="ct-button"
    v-waves
    type="button"
    @click="handleClick"
    :style="{ width: width }"
    :autofocus="autofocus"
    :class="[
      type ? 'ct-button-' + type : '',
      size ? 'ct-button-' + size : '',
      {
        'is-disabled': disabled,
        'is-loading': loading,
        'is-plain': plain,
        'icon-only': icon && !$slots.default,
      }
    ]"
  >
    <faFont name="spinner" v-if="loading"></faFont>
    <faFont :name="icon" v-if="icon && !loading"></faFont>
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'ctButton',
  props: {
    type: {
      type: [String],
      default: 'default',
    },
    routerName: String,
    routerQuery: {
      type: Object,
      default: function d() {
        return {}
      },
    },
    size: {
      type: [String],
      default: 'normal',
    },
    width: {
      default: '',
    },
    // 使用fontawesome
    icon: {
      type: [String],
      default: '',
    },
    disabled: {
      type: [Boolean],
      default: false,
    },
    loading: {
      type: [Boolean],
      default: false,
    },
    // true时显示默认样式，hover之后显示带颜色的样式
    plain: {
      type: [Boolean],
      default: false,
    },
    // 聚焦
    autofocus: {
      type: [Boolean],
      default: false,
    },
  },
  methods: {
    handleClick(event) {
      if (this.disabled) return false
      if (this.routerName) {
        if (this.routerName.includes('http://')) {
          window.location.href = this.routerName
          return false
        }
        this.$router.push({ name: this.routerName, query: this.routerQuery })
      } else {
        this.$emit('click', event)
      }
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/var'
@import '../../assets/stylus/color'

.ct-button
  display: inline-block
  vertical-align: top
  line-height: 1
  white-space: nowrap
  cursor: pointer
  background: #fff
  border-width: 1px
  border: 1px solid $border-color
  color: #1f2d3d
  -webkit-appearance: none
  text-align: center
  box-sizing: border-box
  outline: none
  margin: 0
  user-select: none
  padding: 8px 16px
  font-size: $font-size
  border-radius: 4px
  position: relative
  transition: 0.2s all ease-in
  &.ct-button-small
    padding: 2px 7px
    font-size: 12px
    &:hover
      border-color: $color-main
  // 用于列表显示
  ul
    > li
      padding: 2px 0
      line-height: 1.2
  &.icon-only
    font-size: 16px
    padding: 7px 16px 6px 16px
  > a
    display: block
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
  & > .fa-spinner
    animation: spin 1.5s linear infinite
  &:hover,
  &:active
    color: $color-main
    border-color: $color-main
  &.is-loading
    position: relative
    pointer-events: none
    &:before
      pointer-events: none
      content: ''
      position: absolute
      left: -1px
      top: -1px
      right: -1px
      bottom: -1px
      border-radius: inherit
      background-color: hsla(0,0%,100%,.35)
  &^[0]-primary
    color: #fff
    background-color: $color-main
    border-color: $color-main
    &^[0].is-disabled,
    &^[0].is-disabled:hover,
    &^[0].is-disabled:active
      color: #bfcbd9
      cursor: not-allowed
      background-image: none
      background-color: #eef1f6
      border-color: #d1dbe5
    &.ct-button-small
      border-color: $color-main
    &:hover
      background-color: #687f8e
      border-color: #687f8e
    &:active
      background-color: #687f8e
      border-color: #687f8e
  &^[0]-reversed
    color: $color-main
    border-color: $color-main
    &:hover
      color: #687f8e
      border-color: #687f8e
    &:active
      color: #687f8e
      border-color: #687f8e
  &^[0]-dashed
    border-style: dashed
    border-color: #d9d9d9
    &:hover
      color: #687f8e
      border-color: #687f8e
    &:active
      color: #687f8e
      border-color: #687f8e
  &^[0]-text
    color: #000
    border-color: transparent
    background-color: transparent
    border: 0
    &^[0].is-disabled,
    &^[0].is-disabled:hover,
    &^[0].is-disabled:active
      color: #bfcbd9
      cursor: not-allowed
      background-image: none
      background-color: transparent
      border-color: transparent
      transform: translateY(0)
    &.ct-button-small
      border: 0
    &:hover
      color: #687f8e
      border: 0
  &^[0].is-disabled,
  &^[0].is-disabled:hover,
  &^[0].is-disabled:active
    background-color: #fff
    border-color: #d1dbe5
    color: #bfcbd9
    cursor: not-allowed
    transform: translateY(0)

@keyframes spin
    0%
      transform: rotate(0deg)
    100%
      transform: rotate(359deg)

</style>
