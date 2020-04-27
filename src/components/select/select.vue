<template>
  <div class="ct-select"
    :style="{ width: width }"
    :class="selectCls"
    v-clickoutside="hideList"
    ref="ctSelect">
    <dl
      class="ct-select-name"
      @mouseover="handleMouseIn"
      @mouseout="handleMouseOut"
      v-on:click="toggleList"
      :title="name"
    >{{ name }}
      <faFont class="ct-select-arrow"
        v-show="!showClearBtn"
        name="angle-down">
      </faFont>
      <dl v-on:click.stop="clearValue">
        <faFont class="ct-select-arrow"
          v-show="showClearBtn"
          name="times-circle">
        </faFont>
      </dl>
    </dl>
    <div
      ref="ctSelectList"
      class="ct-select-list"
      :style="listStyle"
    >
      <ct-input
        v-model="searchName"
        placeholder="请输入搜索内容"
        v-if="filterable"
        ref="filterInput"
        style="margin-bottom: 4px;"
      />
      <ul ref="ctSelectUlList">
        <slot></slot>
      </ul>
    </div>

  </div>
</template>

<script>
import {
  getWindowHeight,
  hasClass,
  isArray,
  popover,
} from 'ct-util'

import clickoutside from '../../directives/clickoutside'
import Emitter from '../../mixins/emitter'
import formChild from '../../mixins/form-child'

export default {
  name: 'ctSelect',
  directives: { clickoutside },
  mixins: [Emitter, formChild],
  props: {
    width: {
      default: '',
    },
    value: {
      type: [String, Number, Object, Array],
    },
    // 多选
    multiple: Boolean,
    // 可以清空
    clearable: Boolean,
    placeholder: [String, Number],
    // 最多显示多少行
    maxItem: {
      type: Number,
      default: 8,
    },
    place: {
      default: 'bottom',
      validator: value => ['top', 'bottom'].indexOf(value) > -1,
    },
    noFormEmit: Boolean,
    // 搜索
    filterable: Boolean,
    // 调用远程接口
    remote: Boolean,
  },
  data() {
    return {
      visible: false,
      index: '',
      optionName: '',
      name: '请选择',
      currentValue: this.multiple ? [] : '',
      hover: false,
      optionList: [],
      defaultName: '请选择',
      ret: {
        left: '-9999px',
      },
      searchName: '',
      unwatch: null,
      focused: false,
    }
  },
  computed: {
    selectCls: {
      cache: false,
      get() {
        return [
          this.multiple ? 'is-multiple' : undefined,
          this.visible ? 'is-active' : undefined,
          this.isReadonly ? 'is-readonly' : undefined,
        ]
      },
    },
    listStyle() {
      const _ret = this.ret
      _ret.maxHeight = `${this.maxItem * 32}px`
      // 保证有一定的高度
      let length =
        this.optionList.length < this.maxItem ?
        this.optionList.length :
        this.maxItem

      if (this.filterable) length += 1

      let height = length * 32
      if (this.filterable) height += 4

      _ret.height = `${height}px`
      _ret.zIndex = 10
      return _ret
    },
    showClearBtn() {
      if (!this.clearable) return false
      if (!this.hover) return false
      if (this.multiple && this.currentValue.length > 0) {
        return true
      }
      if (!this.multiple && this.currentValue !== '') {
        return true
      }
      return false
    },
    listOverflow() {
      const windowHeight = getWindowHeight()
      const elToBottom = this.$refs.ctSelect.getBoundingClientRect().bottom
      const maxHeight = 32 * this.maxItem

      if (windowHeight - elToBottom - (maxHeight + 8) <= 0) {
        return true
      }
      return false
    },
  },
  watch: {
    optionList(newVal, oldVal) {
      this.update()
    },
    value: {
      immediate: true,
      handler(val) {
        this.setCurrentValue(val)
        this.$emit('input', val)
      },
    },
    currentValue(val) {
      this.$emit('input', val)
      this.$emit('change', val)
      this.update()
    },
  },
  mounted() {
    this.update()
    this.$on('selected', (payload) => {
      if (this.multiple) {
        const _index = this.currentValue.indexOf(payload)
        if (_index === -1) {
          this.currentValue.push(payload)
        } else {
          this.currentValue.splice(_index, 1)
        }
      } else {
        this.currentValue = payload
      }
    })

    this.$on('remove-option', (payload) => {
      if (this.multiple) {
        this.currentValue = this.currentValue.filter(
          (element) => element.value !== payload)
        // this.$emit('input', this.currentValue)
        return false
      }

      // 如果当前选中的项跟要移除的项的值不同，则不更新currentValue
      // 如果当前选中的项跟要移除的项的值相同，则更新currentValue为空,即移除选中值
      let hasCurrentValue = false
      this.optionList.forEach((element) => {
        if (element.value === this.currentValue && this.currentValue !== payload) {
          hasCurrentValue = true
        }
      })
      if (hasCurrentValue) {
        this.update()
      }
      // this.$emit('input', '')
    })
  },
  methods: {
    toggleList() {
      if (this.isReadonly) return false
      this.visible = !this.visible
      if (this.filterable && this.visible) {
        this.unwatch = this.$watch('searchName', (val) => {
          console.log('emit remote', val)
          this.$emit('remote', val)
        })
      }
      this.updateOptionPosition()
      this.scrollToCurrent()
    },
    hideList() {
      if (!this.visible) return
      if (this.filterable && this.unwatch) {
        this.unwatch()
        this.unwatch = null
        this.searchName = ''
      }
      this.visible = false
      this.updateOptionPosition()
    },
    scrollToCurrent() {
      if (this.multiple) return
      this.$nextTick(() => {
        if (!this.visible) return
        const parent = this.$refs.ctSelectList
        const ul = this.$refs.ctSelectUlList
        const children = ul.children
        for (let i = 0, l = children.length; i < l; ++i) {
          if (hasClass(children[i], 'current')) {
            parent.scrollTop = i * 32
          }
        }
      })
    },
    setCurrentValue(payload = this.value) {
      if (this.multiple) {
        if (!isArray(payload)) {
          // console.warn('multiple select v-model must be Array.')
          this.currentValue = []
        } else {
          this.currentValue = payload
        }
      } else {
        if (isArray(payload)) {
          // console.warn('multiple select v-model can not Array.')
          this.currentValue = ''
        } else {
          this.currentValue = payload
        }
      }
      // chang回调
      // this.$emit('change', this.value)
    },
    clearAllSelected() {
      for (let i = 0, l = this.optionList.length; i < l; ++i) {
        this.optionList[i].selected = false
      }
    },
    singleSelect() {
      this.clearAllSelected()
      let hasSelectedOption = false
      for (let i = 0, l = this.optionList.length; i < l; ++i) {
        if (this.currentValue === this.optionList[i].value) {
          this.optionList[i].selected = true
          // this.name = this.optionList[i].label
          this.updateEmptyName(this.optionList[i].label)
          this.updateSelectStatus()
          hasSelectedOption = true
        }
      }
      // 防止optionList更新后，name显示不正确
      if (hasSelectedOption === false) this.updateEmptyName()
    },
    multipleSelect() {
      for (let i = 0, l = this.optionList.length; i < l; ++i) {
        if (this.currentValue.indexOf(this.optionList[i].value) > -1) {
          this.optionList[i].selected = true
        } else {
          this.optionList[i].selected = false
        }
      }

      this.updateSelectStatus()
      // 更新name
      const _length = this.currentValue.length
      if (_length) {
        this.name = `已选择${this.currentValue.length}项`
        return false
      }
      this.updateEmptyName()
    },
    updateEmptyName(name) {
      let _name = this.defaultName
      if (name) _name = name
      if (this.placeholder) _name = this.placeholder
      this.name = _name
    },
    updateSelectStatus() {
      // 更新option选中项
      this.broadcast('ctOption', 'update-selected', this.currentValue)
      if (!this.noFormEmit) this.dispatch('ctFormLine', 'ct.form.change', this.currentValue)
    },
    update() {
      // this.setCurrentValue()
      if (!this.multiple) {
        this.singleSelect()
      } else {
        this.multipleSelect()
      }
    },
    handleMouseIn() {
      if (!this.clearable) return
      this.hover = true
    },
    handleMouseOut() {
      if (!this.clearable) return
      this.hover = false
    },
    updateOptionPosition() {
      if (this.visible) {
        this.ret = popover(this.$el, this, {
          place: this.place,
        })
        // 处理下top，保证list能正好覆盖住ct-select
        let _top = this.ret.top.replace('px', '')
        if (this.place === 'bottom') _top -= this.$el.offsetHeight
        if (this.place === 'top' || this.listOverflow) {
          let _maxItem = this.optionList.length
          if (_maxItem > this.maxItem) _maxItem = this.maxItem
          // 排除自己的高度跟select的高度
          _maxItem -= 2
          _top -= 32 * _maxItem
        }
        this.ret.top = `${_top}px`
        // display: none时无法获得元素宽度,高度,所以这边用visible: hidden
        this.ret.visibility = 'visible'
        this.ret.minWidth = `${this.$el.offsetWidth}px`
        if (this.filterable) this.focused = true
      } else {
        this.ret = {
          left: '-9999px',
        }
      }
    },
    clearValue() {
      if (this.multiple) {
        this.currentValue = []
      } else {
        this.currentValue = ''
      }
      // this.$emit('input', this.currentValue)
      // chang回调
      // this.$emit('change', this.value)
      this.updateEmptyName()
      this.updateSelectStatus()
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/var'
@import '../../assets/stylus/color'

.ct-select.is-readonly
  position: relative
  &:hover > .ct-select-name
    border: 0
    box-shadow: none
  .ct-select-name
    padding: 0
    line-height: 32px
    border: 0
    cursor: default
    i
      display: none
.ct-select
  display: inline-block
  vertical-align: top
  font-size: $font-size
  width: 100%

  // z-index: 2
  &:hover > .ct-select-name
    border-color: $color-main
  .ct-select-name
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
      border-color: $color-main
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3)
  & > select
    width: 100%
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
    opacity: 0
    // 兼容IE
    height: 26px
  .ct-select-arrow
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
    // &.arrow-up
    //   background-position-y 0
    //   transform rotateZ(180deg)
  .ct-select-list
    min-width: 100%
    position: fixed
    left: 9999px
    top: 0
    border-radius: 4px
    overflow auto
    z-index: 2
    visibility: hidden
    box-shadow: $box-shadow
    &.ct-select-list-top
      bottom: 34px
      top: inherit
    ul
      background-color: #fff
      border-radius: 4px
      // overflow: auto
      li
        background-color: #fff
        padding: 5px 8px 6px 8px
        line-height: 1.5
        cursor: pointer
        white-space: nowrap
        overflow: hidden
        transition: background .3s ease
        position: relative
        &.is-disabled
          background-color: $background-main
          &:hover
            cursor: not-allowed
            background-color: $background-main
        &.current
          color #fff
          background-color $color-main
          &:hover
            color #fff
            background-color $color-main
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

  &.is-multiple
    .ct-select-list
      li.current
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
</style>