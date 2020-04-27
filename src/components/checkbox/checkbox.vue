<template>
  <div class="ct-checkbox"
    :class="{ 'ct-checkbox-indeterminate': indeterminate, 'readonly': readonly, 'disabled': disabled }"
    :title="label"
  >
    <label @click="prevent">
      <span :class="{ 'checked': getChecked, 'radio': type === 'radio' }">
        <input v-if="type === 'checkbox'" type="checkbox" :value="content" v-model="currentValue">
        <input v-else type="radio" :value="content" v-model="currentValue">
      </span>
      {{ label }}
      <slot />
    </label>
  </div>
</template>

<script>
import emitter from '../../mixins/emitter'

export default {
  name: 'ctCheckbox',
  mixins: [emitter],
  props: {
    type: {
      default: 'checkbox',
      validator: value => ['checkbox', 'radio'].indexOf(value) > -1,
    },
    content: {
      default: '',
    },
    label: {
      default: '',
    },
    value: {
      default: '',
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    readonly: Boolean,
    disabled: Boolean,
  },
  data() {
    return {
      currentValue: this.value,
      isGroup: false,
      parent: null,
    }
  },
  mounted() {
    this.parent = this.findComponentUpward(this, 'ctCheckboxGroup')
    if (this.parent) {
      this.isGroup = true
    }
  },
  computed: {
    getChecked() {
      // 如果是group下的checkbox,则通过content是否存在于group中来判断是否选中
      if (this.parent) {
        return this.parent.value.indexOf(this.content) > -1
      }
      // 非group下的checkbox, content只用于type=radio的情况,用于识别选中了哪个radio
      if (this.type === 'checkbox') {
        return !!this.currentValue
      }
      return this.currentValue.toString() === this.content.toString()
    },
  },
  watch: {
    currentValue(val) {
      // 如果是group
      if (this.parent) {
        if (this.getChecked) {
          const index = this.parent.value.indexOf(this.content)
          this.parent.value.splice(index, 1)
        } else {
          this.parent.value.push(this.content)
        }
      } else {
        // 防止多次更新
        if (val === this.value) return false
        // 通过emit一个input事件来更新v-model数据
        this.$emit('input', val)
        this.$emit('change', val)
        if (!this.isGroup) this.dispatch('ctFormLine', 'ct.form.change', val)
      }
    },
    // value(val) {
    //   this.setCurrentValue(val)
    // },
    value: {
      immediate: true,
      handler(val) {
        // this.currentValue = val
        // this.$emit('input', val)
        this.setCurrentValue(val)
      },
    },
  },
  methods: {
    prevent(e) {
      if (this.readonly || this.disabled) e.preventDefault()
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return
      this.currentValue = value
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/color'

.ct-checkbox
  position: relative
  display: inline-block
  user-select: none
  height: 16px
  line-height: 16px
  font-size: 14px
  &.readonly:before,
  &.disabled:before
    content: ''
    position: absolute
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 1
    cursor: not-allowed
  &.readonly label
    cursor: default
    color: #ccc
  &.disabled:before
    cursor: not-allowed
  &.disabled label
    cursor: not-allowed
    color: #ccc
    & > span
      border-color: #cccccc
      background-color: #d3d3d3
  label
    display block
    position: relative
    -webkit-tap-highlight-color: #fff
    user-select: none
    padding-left: 20px
    margin-bottom: 0
    cursor: pointer
    line-height: 16px
    & > span
      display inline-block
      margin: 1px 0 0 -20px
      width: 14px
      height: 14px
      border-radius: 0
      -webkit-appearance: none
      outline: none
      transition: all ease .2s
      -webkit-user-select: none
      border: 1px solid #d3d3d3
      vertical-align: top
      background: #fff
      transition: all 0.3s
      &.radio
        border-radius 50%
        &.checked
          background-color #fff
        &.checked::after
          border-radius 50%
          border 0
          transform none
          height 8px
          width 8px
          background-color $color-main
          top 4px
          left 3px
      &:hover
        border-color: #c4c4c4
        -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2)
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2)
      &.checked
        border-color: $color-main
        background-color: $color-main
        user-select: none
        &::after
          content: ''
          position: absolute
          left: -3px
          top: 18px
          height: 9px
          width: 5px
          border-right: 2px solid #fff
          border-bottom: 2px solid #fff
          opacity: 1
          transform: translate3d(8px,-16px,0) rotateZ(45deg) scale(1)
    input[type=checkbox],
    input[type=radio]
      display inline-block
      height 0
      width 0
      user-select none
      position absolute
      left -9999px
  &.ct-checkbox-indeterminate
    label > span
      border-color: $color-main
      background-color: $color-main
      user-select: none
      &::after
        content: ''
        position: absolute
        left: -2px
        top: 15px
        height: 10px
        width: 6px
        border-right: 2px solid #fff
        opacity: 1
        transform: translate3d(6px,-14px,0) rotateZ(90deg) scale(1)
</style>
