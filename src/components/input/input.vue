<template>
  <div class="ct-input"
    :style="{ width: currentWidth }"
    :class="{ 'active': active, 'has-addon-prepend': $slots.prepend, 'has-addon-append': $slots.append }"
  >
    <span class="ct-input-addon" v-if="$slots.prepend">
      <slot name="prepend" />
    </span>
    <input v-if="type === 'text'" type="text"
      :value="currentValue" 
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder"
      :name="name"
      spellcheck="false"
      :maxlength="maxlength"
      :autofocus="autofocus"
      v-on:keyup.enter="enter"
    >
    <input v-if="type === 'password'" type="password" class="ct-input"
      :value="currentValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder"
      :name="name"
      spellcheck="false"
      v-on:keyup.enter="enter"
    >
    <textarea class="ct-textarea"
      v-if="type === 'textarea'"
      :value="currentValue" 
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder"
      :name="name"
      spellcheck="false"
      v-on:keyup.enter="enter"
    />
    <span class="ct-input-addon" v-if="$slots.append">
      <slot name="append" />
    </span>
  </div>
</template>

<script>
import { isNumber } from 'ct-util'
import Emitter from '../../mixins/emitter'

export default {
  name: 'ctInput',
  mixins: [Emitter],
  props: {
    value: {
      type: [String, Number, Boolean],
      default: '',
    },
    type: {
      default: 'text',
    },
    width: {
      default: '',
    },
    placeholder: {
      default: '',
    },
    name: [String, Number],
    active: {
      type: Boolean,
      default: false,
    },
    maxlength: Number,
    autofocus: {
      default: null,
    },
    // 回车键操作
    enter: {
      type: Function,
      default: () => {},
    },
  },
  watch: {
    value(val) {
      this.setCurrentValue(val)
    },
  },
  computed: {
    currentWidth() {
      return `${this.width}${isNumber(this.width) ? 'px' : ''}`
    },
  },
  data() {
    return {
      currentValue: this.value,
    }
  },
  methods: {
    setCurrentValue(value) {
      if (value === this.currentValue) return
      this.currentValue = value
    },
    handleInput(event) {
      let value = event.target.value
      if (this.number) value = Number.isNaN(Number(value)) ? value : Number(value)
      this.setCurrentValue(value)
      // 通过emit一个input事件来更新v-model数据
      this.$emit('input', this.currentValue)
      // chang回调
      this.$emit('on-change', event)
    },
    handleFocus(event) {
      this.$emit('on-focus', event)
    },
    handleBlur(event) {
      this.$emit('on-blur', event)
      this.dispatch('ctFormLine', 'ct.form.blur', this.currentValue)
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/var'
@import '../../assets/stylus/color'

.ct-input
  display: inline-block
  vertical-align: top
  width: 100%
  position: relative
  &.active,
  &:hover
    > input,
    > textarea
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3)
      outline: none
      border: 1px solid $color-main
  &.has-addon-prepend,
  &.has-addon-append
    display: inline-table
    border-collapse: separate
    line-height: normal
  &.has-addon-prepend > input
    border-top-left-radius: 0
    border-bottom-left-radius: 0
    display: table-cell
  &.has-addon-append > input
    border-top-right-radius: 0
    border-bottom-right-radius: 0
    display: table-cell
  .ct-input-addon
    font-size: $font-size
    text-align: center
    position: relative
    display: table-cell
    width: 1px
    padding: 0 11px
    vertical-align: middle
    border: 1px solid $border-color
    border-radius: 4px
    &:first-child
      border-top-right-radius: 0
      border-bottom-right-radius: 0
      border-right: 0
    &:last-child
      border-top-left-radius: 0
      border-bottom-left-radius: 0
      border-left: 0
.ct-input[readonly=readonly]:before
  content: ''
  position: absolute
  left: 0
  right: 0
  top: 0
  bottom: 0
  z-index: 1
  cursor: not-allowed
  // .ct-input-readonly
  //   display: block

.ct-input > input
  font-size: $font-size
  color: #000
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
             SimSun, sans-serif
  font-family: "Segoe UI", Roboto,
             "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
             SimSun, sans-serif, "NSimSun", "SimSun"
  padding: 4px 8px
  background-color: #fff
  display: block
  height: 32px
  line-height: 1
  width: 100%
  border: 1px solid $border-color
  // border-top: 1px solid #c0c0c0
  border-radius: 4px
  vertical-align: baseline
  -webkit-tap-highlight-color: rgba(0,0,0,0)
  &:hover,
  &:focus
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3)
    outline: none
    border: 1px solid $color-main

.ct-textarea
  width: 100%
  line-height: 1.5
  padding: 4px 8px
  border: 1px solid $border-color
  // border-top: 1px solid #c0c0c0
  border-radius: 4px
  display: inline-block
  vertical-align: top
  min-height: 62px
  &:focus
    -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,0.3)
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.3)
    outline: none
    border: 1px solid $color-main
</style>