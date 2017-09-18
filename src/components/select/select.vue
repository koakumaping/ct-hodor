<template>
  <div class="ct-select"
    :style="{width: width}"
    :class="selectCls"
    v-clickoutside="hideList"
    ref="ctSelect">
    <dl
      class="ct-select-name"
      @mouseover="handleMouseIn"
      @mouseout="handleMouseOut"
      v-on:click="toggleList"
    >{{name}}
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
      :class="[topCls, 'ct-select-list']"
      :style="listStyle"
    >
      <ul>
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

export default {
  name: 'ctSelect',
  directives: { clickoutside },
  mixins: [Emitter],
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
    emptyName: [String, Number],
    // 最多显示多少行
    maxItem: {
      type: Number,
      default: 8,
    },
    place: {
      default: 'bottom',
      validator: value => ['left', 'right', 'top', 'bottom'].indexOf(value) > -1,
    },
  },
  data() {
    return {
      visible: false,
      index: '',
      optionName: '',
      topCls: '',
      name: '请选择',
      currentValue: this.multiple ? [] : '',
      hover: false,
      optionList: [],
      defaultName: '请选择',
      ret: {
        left: '-9999px',
      },
    }
  },
  computed: {
    selectCls() {
      return [
        this.multiple ? 'is-multiple' : undefined,
        this.visible ? 'is-active' : undefined,
      ]
    },
    listStyle() {
      const _ret = this.ret
      _ret.maxHeight = `${this.maxItem * 32}px`
      // 保证有一定的高度
      if (this.optionList.length < this.maxItem) {
        _ret.height = `${this.optionList.length * 32}px`
      } else {
        _ret.height = `${this.maxItem * 32}px`
      }
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
  },
  watch: {
    value(newVal, oldVal) {
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
        this.$emit('input', this.currentValue)
        return false
      }
      this.$emit('input', payload)
    })
    this.$on('remove-option', (payload) => {
      if (this.multiple) {
        this.currentValue = this.currentValue.filter(
          (element) => element.value !== payload)
        this.$emit('input', this.currentValue)
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
        return
      }
      this.$emit('input', '')
    })
  },
  methods: {
    toggleList() {
      const windowHeight = getWindowHeight()
      const elToBottom = this.$refs.ctSelect.getBoundingClientRect().bottom
      const maxHeight = 32 * this.maxItem
      if (windowHeight - elToBottom - (maxHeight + 8) <= 0) {
        this.topCls = 'ct-select-list-top'
      } else {
        this.topCls = ''
      }
      this.visible = !this.visible
      this.updateOptionPosition()
      this.scrollToCurrent()
    },
    hideList() {
      this.visible = false
      this.updateOptionPosition()
    },
    scrollToCurrent() {
      if (this.multiple) return
      this.$nextTick(() => {
        if (!this.visible) return
        const parent = this.$refs.ctSelectList
        const children = parent.children
        for (let i = 0, l = children.length; i < l; ++i) {
          if (hasClass(children[i], 'current')) {
            parent.scrollTop = i * 32
          }
        }
      })
    },
    setCurrentValue() {
      if (this.multiple) {
        if (!isArray(this.value)) {
          console.warn('multiple select v-model must be Array.')
          this.currentValue = []
        } else {
          this.currentValue = this.value
        }
      } else {
        if (isArray(this.value)) {
          console.warn('multiple select v-model can not Array.')
          this.currentValue = ''
        } else {
          this.currentValue = this.value
        }
      }
      // chang回调
      this.$emit('on-change', this.value)
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
      if (!hasSelectedOption) this.updateEmptyName()
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
      if (this.emptyName) _name = this.emptyName
      this.name = _name
    },
    updateSelectStatus() {
      // 更新option选中项
      this.broadcast('ctOption', 'update-selected', this.currentValue)
      this.dispatch('ctFormLine', 'ct.form.change', this.currentValue)
    },
    update() {
      this.setCurrentValue()
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
        _top -= this.$el.offsetHeight
        this.ret.top = `${_top}px`
        // display: none时无法获得元素宽度,高度,所以这边用visible: hidden
        this.ret.visibility = 'visible'
        this.ret.minWidth = `${this.$el.offsetWidth}px`
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
      this.$emit('input', this.currentValue)
      // chang回调
      this.$emit('on-change', this.value)
      this.updateEmptyName()
      this.updateSelectStatus()
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/var'
@import '../../assets/stylus/color'

.ct-select
  display: inline-block
  vertical-align: top
  font-size: 12px
  width: 100%
  // z-index: 2
  .ct-select-name
    padding: 0 8px 0 8px
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
    &:hover,
    &.is-active
      border-color $color-main
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
      li
        background-color: #fff
        padding: 7px 8px
        line-height: 1.5
        cursor: pointer
        white-space: nowrap
        overflow: hidden
        transition: background .3s ease
        position: relative
        &.current
          color #fff
          background-color $color-main
          &:hover
            color #fff
            background-color $color-main
        &:hover
          color #333
          background-color: $color-hover
  &.is-multiple
    .ct-select-list
      li.current
        color: $color-main
        background-color: #fff
        &:hover
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