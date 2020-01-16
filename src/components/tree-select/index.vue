<template>
  <ct-button
    class="ct-tree-select-item"
    arrow
    @click="show = true"
    :loading="loading"
    :readonly="isReadonly"
    :type="isReadonly ? 'text' : ''"
  >
    <span v-if="displayMethod === 'count'">
      <slot />
      {{ `已选择${labelCount}项` }}
    </span>

    <span v-if="currentValue && currentValue.length === 0 && displayMethod === 'normal'">{{ label || placeholder }}</span>

    <span
      v-if="currentValue && currentValue.length !== 0 && displayMethod === 'normal' && labelCount > 0"
      v-for="(item, index) in currentValue"
      :key="item.key + index"
    >
      <small v-if="index !== 0 && !item.replaced">,</small>
      <small v-if="index !== 0 && item.replaced"> </small>
      {{ item.labelList }}
    </span>
    <popup v-model="show">
      <white-space />
      <ct-button-group style="padding: 0 8px">
        <ct-button @click="show = false" type="primary" v-if="singleSelection">关闭</ct-button>
        <ct-button @click="handleClick" type="primary" v-else>确定</ct-button>
        <ct-button @click="clear">清除</ct-button>
      </ct-button-group>
      <ul class="ct-tree-select__nav clear">
        <li
          class="ct-tree-select__nav-item left pointer"
          v-for="(item, index) in navList"
          :key="item.key"
          @click="goIndex(item, index)"
        >{{ item.label }}<span v-if="navList.length > 1 && index !== navList.length - 1">&ensp;/&ensp;</span></li>
      </ul>
      <ul class="ct-tree-select__list clear">
        <li class="ct-tree-select__list-item clear" v-if="!singleSelection">
          <div class="ct-24">
            <div class="ct-tree-select_checkbox" :class="{ 'is-checked': allChecked, 'disabled': allDisabled }">
              <label @click="selectAllItem">
                <span :class="{ 'checked': allChecked }">
                  <input type="checkbox" :value="allChecked">
                </span>
                全选
              </label>
            </div>
          </div>
        </li>
        <li
          v-for="item in list"
          :key="randomString(5) + item.key"
          :label="item.label"
          :value="item.id"
          class="ct-tree-select__list-item clear"
        >
          <div :class="[isFolder(item) ? 'ct-20' : 'ct-24']">
            <div class="ct-tree-select_checkbox" :class="{ 'is-checked': item.checked, 'disabled': item.disable }" v-if="showCheckbox(item)">
              <label @click="prevent($event, item)">
                <span :class="{ 'checked': item.checked }">
                  <input type="checkbox" v-model="item.checked" @change="itemChanged(item)">
                </span>
                {{ item.label }}
              </label>
            </div>
            <div v-if="showFolder(item)" @click="singleSelect(item)" class="pointer">
              <fa-font name="folder" v-if="isFolder(item)"/>
              <fa-font name="file" v-else/>
              {{ item.label }}
            </div>
          </div>
          <div class="ct-4 text-center pointer" @click="goNextLevel(item)" v-if="isFolder(item)">
            <fa-font name="map-signs"></fa-font> 下级</div>
        </li>
        <span v-if="data.length === 0">没有数据可供选择</span>
      </ul>
      <white-space />

    </popup>
  </ct-button>
</template>

<script>
import { randomString } from 'ct-util'
import WhiteSpace from '../layout/white-space'
import formChild from '../../mixins/form-child'

export default {
  name: 'TreeSelect',
  mixins: [formChild],
  components: {
    WhiteSpace,
  },
  props: {
    label: {
      type: [String, Number],
      default: '请选择',
    },
    data: {
      type: Array,
      default: function d() {
        return []
      },
    },
    loading: {
      type: [Boolean],
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    singleSelection: Boolean,
    // 任何节点都能被选中
    anySelection: Boolean,
    // 不返回选中的children
    noChildren: Boolean,
    // 显示方式
    displayMethod: {
      type: String,
      default: 'normal',
    },
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.list = val
      },
    },
  },
  computed: {
    labelCount() {
      if (!this.label) return 0
      if (this.label.indexOf(' ') === -1 && this.label.indexOf(',') === -1) return 1

      let spaceLength = 0
      let dotLength = 0

      if (this.label.indexOf(' ') > 0) {
        spaceLength = this.label.split(' ').length
      }
      if (this.label.indexOf(',') > 0) {
        dotLength = this.label.split(',').length
      }

      return spaceLength + dotLength
    },
    allChecked: {
      cache: false,
      get() {
        return this.list.filter(item => !item.disable).length ===
          this.list.filter(item => item.checked).length
      },
    },
    allDisabled: {
      cache: false,
      get() {
        return this.list.filter(item => item.disable).length ===
          this.list.length
      },
    },
  },
  data() {
    return {
      show: false,
      currentValue: [],
      id: '',
      list: [],
      oldList: [],
      navList: [
        {
          key: '9r38vkjdx84w90okjxcjv09u039w5890cxkjfkvlj',
          value: '',
          parentId: '',
          label: '根目录',
        },
      ],
    }
  },
  methods: {
    randomString(length, flag = false) {
      return randomString(length, flag)
    },
    prevent(e, payload) {
      if (payload.readonly || payload.disable) e.preventDefault()
    },
    selectAllItem(e) {
      e.preventDefault()
      const checkStatus = !this.allChecked
      if (this.allDisabled && checkStatus) return false
      if (this.anySelection) {
        this.list.forEach(item => {
          if (item.disable) return false
          item.checked = checkStatus
          this.itemChanged(item)
        })
        return false
      }
      this.list.forEach(item => {
        if (item.disable) return false
        if (item.children && item.children.length > 0) return false
        item.checked = checkStatus
        this.itemChanged(item)
      })
    },
    isFolder(item) {
      if (this._.hasOwn(item, 'children')) return true
      if (item.children && item.children.length === 0) return true
      return false
    },
    showCheckbox(item) {
      if (this.singleSelection) return false
      if (!this.singleSelection && !this.isFolder(item)) return true
      if (!this.anySelection) return false
      return true
    },
    showFolder(payload) {
      if (this.singleSelection) return true
      if (!this.singleSelection && !this.anySelection && this.isFolder(payload)) return true
      return false
    },
    goIndex(item, index) {
      if (index === this.navList.length - 1) return false
      this.$nextTick(() => {
        this.navList = this.navList.slice(0, index + 1)
      })
      const id = item.value
      if (id) {
        this.getListById(id)
      } else {
        this.list = this.data
      }
    },
    goPrevLevel(payload) {
      this.list = this._.clone(this.oldList)
    },
    goNextLevel(payload) {
      // if (payload.checked) return false
      this.navList.push(payload)
      this.oldList = this._.clone(this.list)
      this.list = payload.children
    },
    getListById(id) {
      this.id = id
      this.walkList(this.data).then(res => {
        this.list = res
      })
    },
    walkList(list = []) {
      return new Promise((resolve, reject) => {
        for (let i = 0, l = list.length; i < l; ++i) {
          const item = list[i]
          if (item.value === this.id) {
            console.log(item, item.children)
            resolve(item.children)
            return false
          } else if (this._.hasOwn(item, 'children') && item.children.length > 0) {
            this.walkList(item.children).then(res => {
              resolve(res)
            })
          }
        }
      })
    },
    singleSelect(payload) {
      if (payload.disable) {
        payload.checked = false
        return false
      }
      this.itemChanged(payload)
      if (!this.anySelection && this.isFolder(payload)) {
        this.goNextLevel(payload)
        return false
      }
      const _item = this._.clone(payload)
      delete _item.checked
      delete _item.children
      this.currentValue = [_item]
      this.$emit('change', this.currentValue)
      this.show = false
    },
    handleClick() {
      // 取选中的id列表
      const _list = []
      const walkList = (list = this.data) => {
        for (let i = 0, l = list.length; i < l; ++i) {
          const item = list[i]
          if (item.checked) {
            const _item = this._.clone(item)
            delete _item.checked
            delete _item.children
            _list.push(_item)
          }
          if (!this.noChildren) {
            if (this._.hasOwn(item, 'children') && item.children.length > 0) {
              walkList(item.children)
            }
          } else {
            if (!item.checked && this._.hasOwn(item, 'children') && item.children.length > 0) {
              walkList(item.children)
            }
          }
        }
      }

      walkList(this.data)
      if (this.singleSelection && _list.length > 1) {
        this.$n.warn('只能选择一项')
        return false
      }

      // 缩略需要显示的labelList
      // 先获取最大level
      let levelMax = 0
      _list.forEach(line => {
        const level = line.labelList.replace('-' + line.label).split('-').length + 1
        if (level > levelMax) levelMax = level
      })

      let labelListForReplace = ''
      let labelText = ''
      for (let i = 0, l = _list.length; i < l; ++i) {
        const item = _list[i]
        const labelListLength = item.labelListFull.replace('-' + item.label).split('-').length + 1
        if (i !== 0) {
          const prevLabelList = _list[i - 1].labelListFull.replace(_list[i - 1].label).split('-')
          labelListForReplace = prevLabelList.slice(0, levelMax - 1).toString().replace(/,/g, '-') + '-'
        }
        if (i !== 0 && labelListLength === levelMax) {
          item.labelList = item.labelList.replace(labelListForReplace, '')
          item.replaced = false
          if (item.labelList !== item.labelListFull) {
            item.replaced = true
            item.labelList = item.label
          }
        }

        if (i === 0) {
          labelText += item.labelListFull
        } else {
          const comma = item.replaced ? ' ' : ','
          labelText = labelText + comma + item.labelList
        }
      }

      console.log(labelText)
      this.currentValue = _list
      this.show = false
      this.$emit('change', this.currentValue)
      this.$emit('confirm', labelText)
    },
    itemChanged(payload) {
      const labelList = this.navList.filter(item => item.label !== '根目录').map(item => item.label)
      labelList.push(payload.label)
      console.log(labelList)
      payload.labelList = labelList.toString().replace(/,/g, '-')
      payload.labelListFull = payload.labelList
      payload.replaced = false
    },
    clear() {
      const walkList = (list = this.data) => {
        for (let i = 0, l = list.length; i < l; ++i) {
          const item = list[i]
          if (item.checked) item.checked = false
          if (this._.hasOwn(item, 'children') && item.children.length > 0) {
            walkList(item.children)
          }
        }
      }

      walkList()

      this.navList = [
        {
          key: '9r38vkjdx84w90okjxcjv09u039w5890cxkjfkvlj',
          value: '',
          parentId: '',
          label: '根目录',
        },
      ]

      this.currentValue = []
      if (!this.singleSelect) this.$emit('change', [])
      if (this.singleSelect) {
        this.$emit('change', [{
          key: '',
          label: '',
          labelList: '',
          labelListFull: '',
          value: '',
        }])
      }
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/color.styl'

.ct-tree-select_checkbox
  cursor: pointer
  position: relative
  display: inline-block
  width: 100%
  user-select: none
  font-size: 14px
  &.is-checked
    color: #ccc
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
    display: block
    position: relative
    -webkit-tap-highlight-color: #fff
    user-select: none
    padding-left: 20px
    margin-bottom: 0
    cursor: pointer
    line-height: 16px
    padding: 8px 0
    & > span
      display: inline-block
      margin: 1px 0 0 0
      width: 14px
      height: 14px
      border-radius: 50%
      -webkit-appearance: none
      outline: none
      transition: all ease .2s
      -webkit-user-select: none
      border: 1px solid #d3d3d3
      vertical-align: top
      background: #fff
      transition: all 0.3s
      &.checked
        border-color: $color-main
        background-color: $color-main
        user-select: none
        &::after
          content: ''
          position: absolute
          left: -4px
          top: 27px
          height: 9px
          width: 5px
          border-right: 2px solid #fff
          border-bottom: 2px solid #fff
          opacity: 1
          transform: translate3d(8px,-16px,0) rotateZ(45deg) scale(1)
    input[type=checkbox],
    input[type=radio]
      display: inline-block
      height: 0
      width: 0
      user-select: none
      position: absolute
      left: -9999px

.ct-tree-select__list
  .ct-tree-select__list-item
    line-height: 32px
    padding: 0 8px

.ct-tree-select__nav
  padding: 4px
  padding-top: 8px
  .ct-tree-select__nav-item
    &:last-child
      color: #ccc
</style>
