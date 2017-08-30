<template>
  <div class="ct-select"
    :style="{width: width}"
    :class="{ 'active': view }"
    v-on:click="toggleList"
    v-clickoutside="hideList"
    ref="ctSelect">
    <dl>{{getName}}</dl>
    <dl class="ct-select-arrow" :class="{ 'arrow-up': view }"></dl>

    <div>
      <transition
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:after-enter="afterEnter"
        v-on:before-leave="beforeLeave"
        v-on:leave="leave"
        v-on:after-leave="afterLeave"
      >
        <dl
          :class="[topCls, 'ct-select-list', 'left']"
          v-show="view"
        >
          <ul>
            <li v-for="(item, index) in list"
              v-bind:value="item.key"
              :key="item.key"
              v-on:click="setCurrentValue(item.key, index)"
              :class="{ 'current': item.key == currentValue }"
            >{{item.value}}</li>
          </ul>
        </dl>
      </transition>
    </div>
  </div>
</template>

<script>
import clickoutside from '@/directives/clickoutside'
import ct from '@/mixins/collapse-transition'

export default {
  name: 'ctSelect',
  directives: { clickoutside },
  mixins: [ct],
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    width: {
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
  },
  watch: {
    value(val) {
      this.setCurrentValue(val)
    },
  },
  data() {
    return {
      view: false,
      index: '',
      currentValue: this.value,
      optionName: '',
      topCls: '',
    }
  },
  mounted() {
    if (this.currentValue && this.list.length > 0) {
      console.log(this.list)
      this.list.forEach((element, index, array) => {
        if (element.key.toString() === this.currentValue.toString()) {
          this.index = index
          this.optionName = element.value
        }
      })
    }
  },
  methods: {
    toggleList() {
      const windowHeight = this.$util.getWindowHeight()
      const elToBottom = this.$refs.ctSelect.getBoundingClientRect().bottom
      const maxHeight = (32 * 5) + 6
      console.log(windowHeight - elToBottom - maxHeight)
      if (windowHeight - elToBottom - maxHeight <= 0) {
        this.topCls = 'ct-select-list-top'
      } else {
        this.topCls = ''
      }
      this.view = !this.view
    },
    hideList() {
      this.view = false
    },
    setCurrentValue(value, index) {
      if (value === this.currentValue) return false
      this.currentValue = value
      this.index = index
      // 通过emit一个input事件来更新v-model数据
      this.$emit('input', value)
      // chang回调
      this.$emit('on-change', value)
    },
  },
  computed: {
    getName() {
      let name = '请选择'
      if (this.index !== '') {
        name = this.list[this.index].value
        this.optionName = name
      }
      return name
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/color'

.ct-select
  display: inline-block
  position: relative
  height: 28px
  line-height: 27px
  min-width: 46px
  padding: 0 16px 0 8px
  border: 1px solid #d9d9d9
  border-top: 1px solid #c0c0c0
  border-radius: 4px
  text-align: left
  background-color: #fff
  font-size: 12px
  vertical-align: baseline
  cursor pointer
  &.active
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
  & > .ct-select-arrow
    position: absolute
    top: 6px
    right: 8px
    font-size: 16px
    height 12px
    width 12px
    background url(../../assets/img/select-arrow.png) center 1px no-repeat
    transition all 0.3s
    &.arrow-up
      background-position-y 0
      transform rotateZ(180deg)
  .ct-select-list
    min-width: 100%
    position absolute
    left: 0
    top: 32px
    border-radius: 4px
    overflow hidden
    box-shadow 0 1px 6px rgba(0, 0, 0, .2)
    z-index 1
    &.ct-select-list-top
      bottom: 34px
      top: inherit
    ul
      max-height: 32px * 5
      overflow auto
    li
      background-color: #fff
      padding: 7px 8px
      line-height: 1.5
      cursor: pointer
      white-space: nowrap
      overflow: hidden
      transition: background .3s ease
      &.current
        color #fff
        background-color $color-main
      &:hover
        color #333
        background-color: $color-hover
</style>