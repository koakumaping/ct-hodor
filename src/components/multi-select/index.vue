<template>
  <div
    class="ct-multi-select"
    :class="{
      'is-readonly': readonly !== undefined ? readonly : p.readonly,
    }"
    :style="{ width: `${width}px` }"
    ref="base"
  >
    <dl class="ct-multi-select__name"
      @click="showList"
      @mouseover="handleMouseIn"
      @mouseout="handleMouseOut"
    >
      <span :title="name">{{ name }}</span>
      <faFont class="ct-multi-select__arrow"
        v-show="!showClearBtn"
        name="angle-down">
      </faFont>
      <dl v-on:click.stop="clearValue">
        <faFont class="ct-multi-select__arrow"
          v-show="showClearBtn"
          name="times-circle">
        </faFont>
      </dl>
    </dl>
    <span>
    <ul ref="list" class="ct-multi-select__list" :style="listStyle">
      <li v-if="data.length === 0">暂无相关数据</li>
      <li
        v-for="line in data"
        :key="line.key"
        @click="handleClick(line)"
        :class="{
          'current': currentValue.indexOf(line.value) > -1,
          'disabled': line.disabled,
        }"
        :data-value="line.value"
      >
        <flex v-if="_.isArray(line.label)">
          <flex-item
            v-for="item in line.label"
            :key="`${item}_${_.randomString(4)}`"
            :title="item"
          >{{ $e(item) }}</flex-item>
        </flex>
        <span v-else :title="line.label">{{ line.label }}</span>
      </li>
    </ul>
    </span>
  </div>
</template>

<script>
import Emitter from '../../mixins/emitter'

export default {
  name: 'multi-select',
  mixins: [Emitter],
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: [String, Number],
      default: '请选择',
    },
    // 最多显示多少行
    max: {
      type: Number,
      default: 10,
    },
    width: {
      default: '',
    },
    value: {
      type: [String, Number, Object, Array],
      default: () => [],
    },
    // 可以清空
    clearable: Boolean,
    readonly: {
      type: [String, Number, Boolean],
      default: undefined,
    },
  },
  inject: ['p'],
  data() {
    return {
      visible: false,
      hover: false,
      ret: {
        visibility: 'hidden',
      },
      label: '',
      currentValue: '',
      modal: null,
    }
  },
  computed: {
    name: {
      cached: false,
      get() {
        return this.currentValue.length === 0 ? this.placeholder : this.label
      },
    },
    listStyle() {
      const _ret = this.ret
      _ret.maxHeight = `${this.max * 32}px`
      _ret.minWidth = this.width ? `${this.width}px` : this.$refs.base ? `${this.$refs.base.offsetWidth}px` : ''
      // 保证有一定的高度
      let length =
        this.data.length < this.max ?
        this.data.length :
        this.max
      if (length === 0) length = 1
      const height = length * 32

      _ret.height = `${height}px`
      _ret.zIndex = 10
      return _ret
    },
    showClearBtn() {
      if (!this.clearable) return false
      if (!this.hover) return false
      if (this.currentValue !== '') return true
      return false
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.currentValue = this._.isArray(val) ? val : []
        this.label = this.currentValue.length ? `已选中${val.length}项` : ''
        this.$emit('input', this.currentValue)
      },
    },
    currentValue(val) {
      this.label = `已选中${val.length}项`
      this.$emit('input', val)
      this.$emit('change', val)
      this.dispatch('ctFormLine', 'ct.form.change', this.currentValue)
    },
  },
  methods: {
    showList() {
      const base = this.$refs.base
      const _ret = this._.popover(base, this.$refs.list, {
        place: 'bottom-left',
      }, true)
      _ret.visibility = 'visible'
      _ret.position = 'absolute'
      let _top = _ret.top.replace('px', '') - 32
      if (_top + 200 > this._.getWindowHeight()) _top = this._.getWindowHeight() - 200
      _ret.top = `${_top}px`
      _ret.zIndex = '7'
      this.appendModal()
      this.ret = _ret
      document.body.appendChild(this.$refs.list)
    },
    hideList() {
      this.removeModal()
      this.ret.visibility = 'hidden'
    },
    appendModal() {
      if (!this.modal) {
        this.modal = document.createElement('div')
        this.modal.setAttribute('id', this._.randomString(12, true))
        this.modal.setAttribute('class', 'v-modal')
        this.modal.addEventListener('click', this.hideList)
      }
      window.document.body.appendChild(this.modal)
    },
    removeModal() {
      try {
        document.body.removeChild(this.modal)
      } catch (error) {
        (() => {})()
      }
    },
    handleClick(payload) {
      if (payload.disabled) return false
      payload = this._.clone(payload)
      const _index = this.currentValue.indexOf(payload.value)
      if (_index === -1) {
        this.currentValue.push(payload.value)
      } else {
        this.currentValue.splice(_index, 1)
      }
    },
    handleMouseIn() {
      if (!this.clearable) return false
      this.hover = true
    },
    handleMouseOut() {
      if (!this.clearable) return false
      this.hover = false
    },
    clearValue() {
      this.currentValue = []
      this.label = ''
    },
  },
  beforeDestroy() {
    try {
      this.removeModal()
    } catch (error) {
      (() => {})()
    }
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/var'
@import '../../assets/stylus/color'

.ct-multi-select.is-readonly
  position: relative
  &:before
    content: ''
    position: absolute
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 1
    cursor: not-allowed
  .ct-multi-select__name
    background-color: $background-disable

.ct-multi-select
  display: inline-block
  vertical-align: top
  font-size: 14px
  width: 100%
  .ct-multi-select__name
    padding: 0 24px 0 8px
    vertical-align: top
    display: inline-block
    width: 100%
    height: 32px
    line-height: 30px
    min-width: 50px
    border: 1px solid $border-color
    cursor pointer
    border-radius: 4px
    text-align: left
    background-color: #fff
    position: relative
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    &:hover,
    &.is-active
      border-color $color-main
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3)
  .ct-multi-select__arrow
    position: absolute
    top: -1px
    right: 8px
    transition all 0.3s
    display: block
    height: 32px
    line-height: 30px
    &:before
      font-size: 16px
      display: inline-block
      vertical-align: middle
      color: #ccc
.ct-multi-select__list
  background-color: #fff
  border-radius: 4px
  visibility: hidden
  position: fixed
  left: -9999px
  z-index: 7
  width: auto
  overflow: auto
  box-shadow: $box-shadow
  li
    background-color: #fff
    padding: 5px 8px 6px 9px
    line-height: 1.5
    cursor: pointer
    white-space: nowrap
    overflow: hidden
    transition: background .3s ease
    position: relative
    &.disabled
      background-color: $background-main
      &:hover
        cursor: not-allowed
        background-color: $background-main
    &.current
      color: $color-main
      background-color: #fff
      &:hover
        color: $color-main
        background-color $color-hover
      &:after
        content: ''
        position: absolute
        right: 23px
        top: 25px
        height: 11px
        width: 7px
        border-right: 2px solid $color-main
        border-bottom: 2px solid $color-main
        opacity: 1
        transform: translate3d(8px,-16px,0) rotateZ(45deg) scale(1)
    &:hover
      color #000
      background-color: $color-hover
    &.useless
      color #fff
      user-select none
      cursor default
      &:hover
        cursor default
        color #fff
        background-color #fff
</style>
