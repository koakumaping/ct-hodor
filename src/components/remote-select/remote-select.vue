<template>
  <div
    class="ct-remote-select"
    v-clickoutside="hideList"
    :style="{ width: `${width}px` }"
    :class="{
      'is-readonly': isReadonly,
    }"
    ref="base"
    @mouseover="handleMouseIn"
    @mouseout="handleMouseOut"
  >
    <dl
      class="ct-remote-select__name"
      @click="showList"
      v-show="!visible"
    >
      <span :title="name">{{ name }}</span>
    </dl>

    <input
      v-show="visible"
      v-model="searchName"
      placeholder="请输入搜索内容"
      type="text"
      ref="input"
    />

    <fa-font class="ct-remote-select__arrow" name="angle-down" v-show="!showClearBtn"/>
    <dl v-on:click.stop="clearValue">
      <fa-font class="ct-remote-select__arrow"
        v-show="showClearBtn"
        name="times-circle">
      </fa-font>
    </dl>

    <ul ref="list" class="ct-remote-select__list" :style="listStyle" v-show="visible" v-if="!bigData">
      <li v-if="data.length === 0 && searchName !== ''">{{ loading ? '查询中' : '暂无相关数据' }}</li>
      <li
        v-for="line in data"
        :key="`${line.key}_${_.randomString(10)}`"
        @click="handleClick(line)"
        :data-value="line.value"
      >
        <flex v-if="_.isArray(line.label)">
          <flex-item
            v-for="(item, index) in line.label"
            :key="`${item}_${_.randomString(6)}`"
            v-if="level !== '' ? index < level : true"
          ><span :title="$e(item)">{{ $e(item) }}</span></flex-item>
        </flex>
        <span v-else :title="line.label">{{ line.label }}</span>
      </li>
    </ul>
    <ul ref="list" class="ct-remote-select__list" :style="listStyle" v-show="visible" v-if="bigData">
      <li v-if="data.length === 0 && searchName !== ''">{{ loading ? '查询中' : '暂无相关数据' }}</li>
      <table class="ct-remote-select__table">
        <tr
          v-for="line in data"
          :key="`${line.key}_${_.randomString(10)}`"
          @click="handleClick(line)"
          :data-value="line.value"
        >
          <td
            v-for="(item, index) in line.label"
            :key="`${item}_${_.randomString(6)}`"
            v-if="level !== '' ? index < level : true"
            :title="item"
          >{{ $e(item) }}</td>
        </tr>
      </table>
    </ul>
  </div>
</template>

<script>
import Emitter from '../../mixins/emitter'
import formChild from '../../mixins/form-child'

export default {
  name: 'RemoteSelect',
  mixins: [Emitter, formChild],
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
    maxItem: {
      type: Number,
      default: 8,
    },
    width: {
      default: '',
    },
    value: {
      type: [String, Number, Object, Array],
    },
    loading: Boolean,
    level: {
      type: [String, Number],
      default: '',
    },
    // 分割符号
    dot: {
      type: String,
      default: '-',
    },
    // 自动获取一次数据
    initData: Boolean,
    // 大量数据的显示方式
    bigData: Boolean,
    // 可以清空
    clearable: Boolean,
  },
  data() {
    return {
      visible: false,
      hover: false,
      searchName: '',
      unwatch: null,
      ret: {
        visibility: 'hidden',
      },
      label: '',
      currentValue: '',
    }
  },
  computed: {
    name: {
      cached: false,
      get() {
        return this.label || this.placeholder
      },
    },
    listStyle() {
      const _ret = this.ret
      _ret.maxHeight = `${this.maxItem * 32}px`
      _ret.minWidth = this.width ? `${this.width}px` : this.$refs.base ? `${this.$refs.base.offsetWidth}px` : ''
      // 保证有一定的高度
      let length =
        this.data.length < this.maxItem ?
        this.data.length :
        this.maxItem
      if (length === 0 && this.searchName !== '') length = 1
      const height = length * 32

      _ret.height = `${height}px`
      _ret.zIndex = 10
      return _ret
    },
    showClearBtn() {
      if (this.isReadonly) return false
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
        this.currentValue = val
        this.$emit('input', val)
      },
    },
    currentValue(val) {
      this.$emit('input', val)
      this.dispatch('ctFormLine', 'ct.form.change', this.currentValue)
    },
  },
  methods: {
    showList() {
      if (this.isReadonly) return false
      const base = this.$refs.base
      const _ret = this._.popover(base, this.$refs.list, {
        place: 'bottom-left',
      }, true)
      _ret.visibility = 'visible'
      _ret.position = 'absolute'
      let _top = this._.toNumber(_ret.top.replace('px', '')) + 4
      if (_top + 200 > this._.getWindowHeight()) _top = this._.getWindowHeight() - 200
      _ret.top = `${_top}px`
      _ret.zIndex = '7'
      this.appendModal()
      this.ret = _ret
      document.body.appendChild(this.$refs.list)

      this.visible = true
      this.unwatch = this.$watch('searchName', (val) => {
        this.$emit('change', val)
      })
      this.$nextTick(() => {
        this.$refs.input.focus()
      })

      if (this.initData) this.$emit('change', '')
    },
    hideList() {
      if (this.visible && this.unwatch) this.unwatch()
      this.data.length = 0
      this.removeModal()
      this.ret.visibility = 'hidden'
      this.visible = false
      this.unwatch = null
      this.searchName = ''
    },
    handleClick(payload) {
      const item = this._.clone(payload)
      this.currentValue = item.value
      if (this._.isArray(item.label)) {
        if (this.level === '') {
          this.label = item.label[0]
        } else {
          this.label = item.label
            .filter(item => { if (item !== '') return item })
            .slice(0, this.level).toString().replace(/,/g, this.dot)
        }
      } else {
        this.label = item.label
      }
      // 增加text用于select的时候直接获取需要的文本
      item.text = this.label

      this.$emit('select', item)
      this.hideList()
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
    handleMouseIn() {
      if (!this.clearable || this.isReadonly) return false
      this.hover = true
    },
    handleMouseOut() {
      if (!this.clearable || this.isReadonly) return false
      this.hover = false
    },
    clearValue() {
      this.currentValue = ''
      this.label = ''
      this.$emit('clear')
    },
  },
  beforeDestroy() {
    try {
      this.label = ''
      this.removeModal()
    } catch (error) {
      (() => {})()
    }
    try {
      window.document.body.removeChild(this.$refs.list)
    } catch (error) {
      (() => {})()
    }
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/var'
@import '../../assets/stylus/color'

.ct-remote-select__table
  td
    padding: 4px
    cursor: pointer
  tr:hover
    color: $color-main
    background-color: $color-hover

.ct-remote-select
  display: inline-block
  vertical-align: top
  font-size: 14px
  width: 100%
  position: relative
  &.is-readonly
    .ct-remote-select__name
      padding: 0
      line-height: 32px
      border: 0
      cursor: default
      background-color: transparent
      &:hover
        border: 0
        box-shadow: none
    i
      display: none

  .ct-remote-select__name
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
  .ct-remote-select__arrow
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
  input
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
    border-radius: 4px
    vertical-align: baseline
    -webkit-tap-highlight-color: rgba(0,0,0,0)
    &:hover,
    &:focus
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3)
      outline: none
      border: 1px solid $color-main

.ct-remote-select__list
  background-color: #fff
  border-radius: 4px
  position: fixed
  visibility: hidden
  top: 36px
  left: -9999px
  width: auto
  overflow: auto
  box-shadow: $box-shadow
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

</style>
