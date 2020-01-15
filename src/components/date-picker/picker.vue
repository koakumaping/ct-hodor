<template>
  <div
    ref="ctDatePicker"
    class="ct-date-picker"
    :style="{ width: width }"
    :class="{
      'is-readonly': isReadonly,
    }"
    @mouseover="handleMouseIn"
    @mouseout="handleMouseOut"
  >
    <div :class="[prefixCls + '-input', 'pointer']" @click="showPicker">
      <span v-if="currentValue">{{currentValue}}</span>
      <span v-else class="placeholder">{{ isReadonly ? '--' : placeholder}}</span>
      <faFont name="calendar" v-show="!showClearBtn"></faFont>
      <dl v-on:click.stop="clearValue">
        <faFont
          style="top: 11px;"
          v-show="showClearBtn"
          name="times-circle">
        </faFont>
      </dl>
    </div>

    <transition name="fade-in-linear" mode="out-in">
    <div
      :class="[prefixCls + '-warpper', topCls]"
      :style="ret"
      ref="ctDatePickerWarpper"
    >
      <div :class="[prefixCls + '-header', 'clear']">
        <span class="pointer left" :class="[prefixCls + '-header-prev-year']"
          @click="setPrevYear"
        >
          <i class="fa fa-angle-double-left" aria-hidden="true"></i>
        </span>
        <span class="pointer left" :class="[prefixCls + '-header-prev-month']"
          @click="setPrevMonth"
        >
          <i class="fa fa-angle-left" aria-hidden="true"></i>
        </span>

        <span class="pointer">{{ year }}年 </span>
        <span class="pointer">{{ getMonth }}月</span>
        <select class="year-list__select" v-model="year" @change="init()">
          <option v-for="y in yearList" :value="y.value" :key="y.key">{{ y.label }}</option>
        </select>
        <select class="month-list__select" v-model="month" @change="init()">
          <option v-for="m in monthList" :value="m.value" :key="m.key">{{ m.label }}</option>
        </select>

        <span class="pointer right" :class="[prefixCls + '-header-next-year']"
          @click="setNextYear"
        >
          <i class="fa fa-angle-double-right" aria-hidden="true"></i>
        </span>
        <span class="pointer right" :class="[prefixCls + '-header-next-month']"
          @click="setNextMonth"
        >
          <faFont name="angle-right"></faFont>
        </span>
      </div>
      <div :class="[prefixCls + '-body']">
        <div :class="[prefixCls + '-cells']">
          <div :class="[prefixCls + '-cells-header']">
            <span>日</span>
            <span>一</span>
            <span>二</span>
            <span>三</span>
            <span>四</span>
            <span>五</span>
            <span>六</span>
          </div>
          <span
            v-for="(cell, index) in cells" :key="cell.id"
            :class="getCellCls(cell)"
            @click="setSelectDate(cell.year, cell.month, cell.day, index)"
            >{{cell.day}}</span>
        </div>
      </div>
      <div :class="[prefixCls + '-actions', 'clear']" v-if="type === 'datetime'">
        <ct-time-picker
          class="left"
          v-model="hhmm"
          v-on:on-hour-change="handleHourChange"
          v-on:on-minutes-change="handleMinutesChange"
          place="top"
          :start="start"
          :end="end"
          :range="range"
        />
        <ctButton class="right" type="primary" @click="hidePicker">确定</ctButton>
      </div>
    </div>
    </transition>

  </div>
</template>

<script>
import {
  getWindowHeight,
  clone,
  popover,
  randomString,
} from 'ct-util'

import Emitter from '../../mixins/emitter'
import formChild from '../../mixins/form-child'
import clickoutside from '../../directives/clickoutside'

import {
  getFirstDayOfMonth,
  getDayCountOfMonth,
  getPrevMonth,
  getNextMonth,
  clearHours,
} from './util'

import ctTimePicker from '../time-picker'

const prefixCls = 'ct-date-picker'

export default {
  name: 'ctDatePicker',
  props: {
    value: String,
    type: {
      type: String,
      default: 'date',
    },
    autoclose: Boolean,
    disabledDate: {
      type: Function,
      default: () => false,
    },
    width: {
      default: '',
    },
    placeholder: {
      default: '请选择',
    },
    // 可以清空
    clearable: Boolean,
    start: {
      type: Number,
      default: 0,
    },
    end: {
      type: Number,
      default: 23,
    },
    range: {
      type: Number,
      default: 30,
    },
  },
  directives: { clickoutside },
  mixins: [Emitter, formChild],
  components: {
    ctTimePicker,
  },
  data() {
    return {
      prefixCls: `${prefixCls}`,
      date: '',
      year: '',
      month: '',
      day: '',
      hhmm: '00:00',
      cells: [],
      topCls: '',
      currentValue: '',
      hover: false,
      $ready: false,
      ret: {
        visibility: 'hidden',
      },
      id: randomString(12),
      modal: null,
    }
  },
  computed: {
    getMonth() {
      const month = this.month + 1
      if (month.toString().length === 1) {
        return `0${month}`
      }
      return month
    },
    getDay() {
      if (this.day.toString().length === 1) {
        return `0${this.day}`
      }
      return this.day
    },
    getHour() {
      if (this.hhmm) {
        return this.hhmm.split(':')[0]
      }
    },
    getMinutes() {
      if (this.hhmm) {
        return this.hhmm.split(':')[1]
      }
    },
    showClearBtn() {
      if (!this.clearable) return false
      if (!this.hover) return false
      if (this.currentValue !== '') {
        return true
      }
      return false
    },
    yearList() {
      const currentYear = new Date().getFullYear()
      const list = []
      for (let i = 0; i < 101; ++i) {
        const item = {
          key: randomString(5, true),
          label: currentYear + i,
          value: currentYear + i,
        }
        list.push(item)
      }

      return list
    },
    monthList() {
      const list = []
      for (let i = 0; i < 12; ++i) {
        const item = {
          key: randomString(5, true),
          label: i + 1,
          value: i,
        }
        list.push(item)
      }

      return list
    },
  },
  watch: {
    // value(val) {
    //   this.setCurrentValue(val)
    // },
    value: {
      immediate: true,
      handler(val) {
        this.setCurrentValue(val)
        this.$emit('input', val)
      },
    },
    currentValue(val) {
      this.$emit('input', val)
    },
  },
  mounted() {
    this.init(true)
  },
  methods: {
    init(flag = false) {
      if (flag) {
        this.setCurrentValue(this.value, true)
        this.getCells()
      } else {
        this.setDate()
        this.getCells()
      }
      this.$nextTick(() => {
        this.$ready = true
      })
    },
    setCurrentValue(value, init = false) {
      if (value !== this.currentValue) {
        this.currentValue = value
        this.set()
        // 清空时重新渲染下拉内容
        if (value === '') {
          this.setDate()
          this.getCells()
        }
      }
      if (init) this.set()
    },
    // 设置初始化时间
    set() {
      if (this.currentValue) {
        const dateReg = /^\d{4}-(0\d|1[0-2])-([0-2]\d|3[01])$/
        const dateTimeReg = /^\d{4}-(0\d|1[0-2])-([0-2]\d|3[01])( ([01]\d|2[0-3]):[0-5]\d)$/

        if (this.type === 'datetime') {
          if (!dateTimeReg.test(this.currentValue)) {
            console.error('ctDatePicker: date value error!')
          } else {
            this.hhmm = this.currentValue.split(' ')[1]
          }
        } else {
          if (!dateReg.test(this.currentValue)) {
            console.error('ctDatePicker: date value error!')
          }
        }

        this.date = new Date(this.currentValue.replace(new RegExp(/-/gm), '/'))
      } else {
        this.date = new Date()
        this.date.setHours(this.getHour)
        this.date.setMinutes(this.getMinutes)
      }
      this.year = this.date.getFullYear()
      this.month = this.date.getMonth()
      this.day = this.date.getDate()

      // 如果没有传入初始化值，则hour, minutes均为00
      // if (this.currentValue) {
      //   this.hour = this.date.getHours()
      //   this.minutes = this.date.getMinutes()
      // }
    },
    setDate() {
      this.date = new Date(this.year, this.month, 1)
    },
    getCells() {
      this.cells = []
      const today = clearHours(new Date())
      const day = getFirstDayOfMonth(this.date)

      const thisYear = this.date.getFullYear()
      const thisMonth = this.date.getMonth()

      const cellItem = {
        day: '',
        month: '',
        year: '',
        today: false,
        type: 'this-month',
        selected: false,
      }

      // 上个月的日期计算
      const prevMonth = getPrevMonth(thisMonth)
      let prevYear = thisYear
      if (thisMonth === 0) {
        prevYear = thisYear - 1
      }
      // 0的上一个月是11，不可能出现2的上一月是1(只有2月的天数跟年份有关系)，且年份也是上一年的情况
      // 所以这里的年份基本上是当前的年份，还是上一年的年份，没有什么区别
      // 但是按照逻辑，还是取的上一年
      const prevMonthAllDays = getDayCountOfMonth(prevMonth, prevYear)

      const prevMonthStartDay = prevMonthAllDays - (day - 1)
      for (let i = prevMonthStartDay; i <= prevMonthAllDays; ++i) {
        const _cellItem = clone(cellItem)
        _cellItem.day = i
        _cellItem.month = prevMonth
        _cellItem.year = prevYear
        _cellItem.type = 'prev-month'

        const time = clearHours(new Date(_cellItem.year, _cellItem.month, _cellItem.day))
        _cellItem.disabled = this.disabledDate(new Date(time))
        this.cells.push(_cellItem)
      }

      // 当月日期计算
      const thisMonthAllDays = getDayCountOfMonth(thisMonth, thisYear)
      for (let j = 1; j < thisMonthAllDays + 1; ++j) {
        // 此时渲染的日期
        const _cellItem = clone(cellItem)

        _cellItem.day = j
        _cellItem.month = thisMonth
        _cellItem.year = thisYear

        const time = clearHours(new Date(_cellItem.year, _cellItem.month, _cellItem.day))
        _cellItem.today = time === today
        // 此时渲染的日期如果跟选择的值相同，则判定为选中
        // 不需要对上个月跟下个月做此判断
        // 因为选中上个月或者下个月的时候会自动切换成该月
        _cellItem.selected = time === clearHours(new Date(this.currentValue ? this.currentValue.replace(new RegExp(/-/gm), '/') : ''))

        _cellItem.disabled = this.disabledDate(new Date(time))
        this.cells.push(_cellItem)
      }

      // 下月日期计算
      let nextYear = thisYear
      if (thisMonth === 11) {
        nextYear += 1
      }
      const nextMonth = getNextMonth(thisMonth, nextYear)
      const nextMonthEndDay = 42 - this.cells.length
      for (let k = 1; k < nextMonthEndDay + 1; ++k) {
        const _cellItem = clone(cellItem)
        _cellItem.day = k
        _cellItem.month = nextMonth
        _cellItem.year = nextYear
        _cellItem.type = 'next-month'

        const time = clearHours(new Date(_cellItem.year, _cellItem.month, _cellItem.day))
        _cellItem.disabled = this.disabledDate(new Date(time))
        this.cells.push(_cellItem)
      }
    },
    setSelectDate(year = '', month = '', day = '', index) {
      if (this.cells[index].disabled) {
        return false
      }
      this.year = year
      this.month = month
      this.day = day

      if (this.type === 'datetime') {
        this.currentValue = `${this.year}-${this.getMonth}-${this.getDay} ${this.hhmm}`
      } else {
        this.currentValue = `${this.year}-${this.getMonth}-${this.getDay}`
      }
      this.dateTimeEmit()
      // $emit是异步的，所以要放在$nextTick中重新初始化数据
      this.$nextTick(() => {
        this.init()
        if (this.autoclose || this.type === 'date') {
          this.hidePicker()
        }
      })
    },
    setPrevMonth() {
      if (this.month === 0) {
        this.month = 11
        this.year -= 1
      } else {
        this.month -= 1
      }
      this.init()
    },
    setNextMonth() {
      if (this.month === 11) {
        this.month = 0
        this.year += 1
      } else {
        this.month += 1
      }
      this.init()
    },
    setPrevYear() {
      this.year -= 1
      this.init()
    },
    setNextYear() {
      this.year += 1
      this.init()
    },
    getCellCls(cell) {
      return [
        `${prefixCls}-cell`,
        {
          [`${prefixCls}-cell-selected`]: cell.selected,
          [`${prefixCls}-cell-disabled`]: cell.disabled,
          [`${prefixCls}-cell-today`]: cell.today,
          [`${prefixCls}-cell-prev-month`]: cell.type === 'prev-month',
          [`${prefixCls}-cell-this-month`]: cell.type === 'this-month',
          [`${prefixCls}-cell-next-month`]: cell.type === 'next-month',
        },
      ]
    },
    dateTimeEmit() {
      if (this.currentValue) {
        this.$emit('input', this.currentValue)
        this.dispatch('ctFormLine', 'ct.form.change', this.currentValue)
      }
      this.$emit('change', this.currentValue)
    },
    handleHourChange(val) {
      if (this.$ready) {
        this.hhmm = `${val}:${this.hhmm.split(':')[1]}`
        this.currentValue = `${this.year}-${this.getMonth}-${this.getDay} ${this.hhmm}`
        this.dateTimeEmit()
      }
    },
    handleMinutesChange(val) {
      if (this.$ready) {
        this.hhmm = `${this.hhmm.split(':')[0]}:${val}`
        this.currentValue = `${this.year}-${this.getMonth}-${this.getDay} ${this.hhmm}`
        this.dateTimeEmit()
      }
    },
    showPicker() {
      if (this.isReadonly) return false
      this.getCells()
      const base = this.$refs.ctDatePicker
      const _ret = popover(base, this.$refs.ctDatePickerWarpper, {
        place: 'bottom-left',
      }, true)
      _ret.visibility = 'visible'
      _ret.position = 'absolute'
      let _top = _ret.top.replace('px', '') - 32
      if (_top + 300 > getWindowHeight()) _top = getWindowHeight() - 300
      _ret.top = `${_top}px`
      _ret.zIndex = '7'
      this.ret = _ret

      this.appendModal()
      document.body.appendChild(this.$refs.ctDatePickerWarpper)
    },
    hidePicker() {
      this.ret.visibility = 'hidden'
      this.removeModal()
    },
    appendModal() {
      if (!this.modal) {
        this.modal = document.createElement('div')
        this.modal.setAttribute('id', this.id)
        this.modal.setAttribute('class', 'v-modal')
        this.modal.addEventListener('click', this.hidePicker)
      }
      window.document.body.appendChild(this.modal)
    },
    removeModal() {
      try {
        if (this.modal) document.body.removeChild(this.modal)
      } catch (error) {
        (() => {})()
      }
    },
    clickoutside() {
      if (this.type === 'datetime') return false
      this.hidePicker()
    },
    handleMouseIn() {
      if (!this.clearable) return
      this.hover = true
    },
    handleMouseOut() {
      if (!this.clearable) return
      this.hover = false
    },
    clearValue() {
      this.$emit('input', '')
      this.currentValue = ''
      // chang回调
      this.$emit('change', '')
    },
    doDestroy() {
      this.removeModal()
      try {
        document.body.removeChild(this.$refs.ctDatePickerWarpper)
      } catch (error) {
        (() => {})()
      }
    },
  },
  beforeDestroy() {
    this.doDestroy()
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/var'
@import '../../assets/stylus/color'

.ct-date-picker
  position: relative
  background-color: #fff
  text-align: center
  border: 1px solid $border-color
  border-radius: 4px
  display: inline-block
  vertical-align: top
  width: 100%
  font-size: 14px
  &:hover
    border-color: $color-main
  &.is-readonly
    border: 0
    background-color: transparent
    .ct-date-picker-input
      height: 32px
      line-height: 32px
      padding-left: 0
      padding-right: 0
      cursor: default
      background-color: transparent
      .placeholder
        color: #000
      i
        display: none
  &.is-readonly:hover
    border-color: $border-color

  ^[0]-input
    font-size: $font-size
    width: 100%
    position: relative
    height: 30px
    line-height: 30px
    padding-left: 8px
    padding-right: 24px
    text-align: left
    i
      position: absolute
      right: 10px
      top: 10px
      color: #ccc
      font-size: 12px
    &::before
      cursor: pointer!important
    .placeholder
      color: $color-placeholder
  ^[0]-warpper
    background-color: #fff
    border-radius: 2px
    visibility: hidden
    position: fixed
    left: -9999px
    z-index: 7
    box-shadow: $box-shadow
    &^[0]-top
      top: -307px
    ^[0]-header
      height: 32px
      line-height: 32px
      border-bottom: 1px solid #e9eaec
      text-align: center
      span.pointer
        display: inline-block
        i
          color: #ccc
        &:hover i
          color: #333
      ^[2]-prev-year
        margin-left: 12px
        width: 16px
      ^[2]-next-year
        margin-right: 12px
        width: 16px
      ^[2]-prev-month
        margin-left: 8px
        width: 16px
      ^[2]-next-month
        margin-right: 8px
        width: 16px
    ^[0]-body
      ^[0]-cells
        width: 196px
        margin: 10px
        white-space: normal
        font-size: 0
        span
          font-size: 12px
          width: 28px
          height: 28px
          line-height: 24px
          display: inline-block
          text-align: center
          cursor: pointer
          border: 2px solid #fff
          position: relative
          user-select: none
          &^[0]-cell-disabled
            cursor: not-allowed
            color: #ccc
            background-color: #f7f7f7
            &:hover
              cursor: not-allowed
              color: #ccc
              background-color: #f7f7f7
          &^[0]-cell-selected
            background-color: $color-main
            color: #fff
            border-radius: 4px
            &:hover
              background-color: $color-main
          &:hover
            background-color: rgba(248, 138, 85, 0.30)
            border-radius: 4px
          ^[0]-cell-today:after
            content: ''
            display: block
            height: 6px
            width: 6px
            border-radius: 50%
            background-color: $color-main
            position: absolute
            top: 2px
            right: 2px
          ^[0]-cells-header > span
            color: #bbbec4
            cursor: default
            &:hover
              color: #bbbec4
              border: 2px solid #fff
              background-color: #fff
        ^[0]-cell-prev-month,
        ^[0]-cell-next-month
          color: #bbbec4
    ^[0]-actions
      padding: 10px
      border-top: 1px solid #e9eaec
      .btn
        min-width: 40px
        width: 40px
        padding: 0
    select.year-list__select
      min-width: 45px
      width: 45px
      display: block
      position: absolute
      top: 9px
      left: 70px
      opacity: 0
      cursor: pointer
    select.month-list__select
      min-width: 32px
      width: 32px
      display: block
      position: absolute
      top: 9px
      left: 116px
      opacity: 0
      cursor: pointer
</style>
