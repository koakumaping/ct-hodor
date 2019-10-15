<template>
  <div class="ct-switch">
    <input type="checkbox" v-model="currentValue" :disabled="readonly">
  </div>
</template>

<script>
export default {
  name: 'CtSwitch',
  props: {
    readonly: Boolean,
    value: {
      type: [Number, Boolean],
      default: false,
    },
  },
  data() {
    return {
      currentValue: '',
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.currentValue = val
        this.$emit('input', val)
      },
    },
    currentValue(val) {
      this.$emit('input', val)
    },
  },
}
</script>

<style lang="stylus">
$color-bg = #F5F5F5
$color-main = #04b7a8
$color-border = #E0E0E0

.ct-switch
  & > input[type=checkbox]
    position: relative
    width: 52px
    height: 32px
    border: 1px solid $color-border
    outline: 0
    border-radius: 16px
    box-sizing: border-box
    background-color: $color-bg
    -webkit-transition: background-color 0.1s, border 0.1s
    -webkit-appearance: none
    &:checked
      border-color: $color-main
      background-color: $color-main
      &::before
        transform: scale(0)
      &::after
        transform: translateX(20px)
    &::before
      content: ''
      position: absolute
      top: 0
      left: 0
      width: 50px
      height: 30px
      border-radius: 15px
      background-color: #FDFDFD
      transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1)
    &::after
      content: ''
      position: absolute
      top: 0
      left: 0
      width: 30px
      height: 30px
      border-radius: 15px
      background-color: #FFFFFF
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4)
      transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35)
</style>
