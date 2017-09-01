<template>
  <div :class="prefixCls" v-clickoutside="hidePicker" ref="ctDatePicker" :style="{width: width}">
    <div :class="[prefixCls + '-input', 'pointer']" @click="showPicker">
      <ctInput v-model="value" readonly :active="visiable"></ctInput>
      <i class="fa fa-calendar" aria-hidden="true"></i>
    </div>

    <transition name="fade-in-linear" mode="out-in">
    <div :class="[prefixCls + '-warpper', topCls]" v-show="visiable">
      <div :class="[prefixCls + '-float']">
      <div :class="[prefixCls + '-float', 'left']">
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

          <span class="pointer">{{year}}年 </span>
          <span class="pointer">{{getMonth}}月</span>

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
        <div :class="[prefixCls + '-actions', 'clear']">
          <ctTimePicker
            v-if="type === 'datetime'"
            class="left"
            :hour="getHour"
            :minutes="getMinutes"
            v-on:on-hour-change="handleHourChange"
            v-on:on-minutes-change="handleMinutesChange"
          ></ctTimePicker>
          <ctButton class="right" type="primary" @click="hidePicker">确定</ctButton>
        </div>
      </div>
      </div>
    </div>
    </transition>

  </div>
</template>

<script>
import Emitter from '@/mixins/emitter'
import clickoutside from '@/directives/clickoutside'

import {
  getFirstDayOfMonth,
  getDayCountOfMonth,
  getPrevMonth,
  getNextMonth,
  clearHours,
} from './util'

import {
  getWindowHeight,
  clone,
} from 'ct-util'

import ctTimePicker from '../time-picker'

const prefixCls = 'ct-date-picker'

export default {
  name: 'ctDatePicker',
  props: {
    value: {
      default: '',
    },
    type: {
      type: String,
      default: 'date',
    },
    autoclose: {
      type: Boolean,
      default: false,
    },
    disabledDate: {
      type: Function,
      default: () => false,
    },
    width: {
      default: '',
    },
  },
  directives: { clickoutside },
  mixins: [Emitter],
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
      hour: '00',
      minutes: '00',
      cells: [],
      visiable: false,
      topCls: '',
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
      if (this.date) {
        const hour = this.date.getHours()
        if (hour.toString().length === 1) {
          return `0${hour}`
        }
        return hour
      }
    },
    getMinutes() {
      if (this.date) {
        const minutes = this.date.getMinutes()
        if (minutes.toString().length === 1) {
          return `0${minutes}`
        }
        return minutes
      }
    },
  },
  watch: {
    value() {
      this.set()
    },
  },
  mounted() {
    this.init(true)
  },
  methods: {
    init(flag = false) {
      if (flag) {
        this.set()
      }

      this.setDate()
      this.getCells()
    },
    set() {
      if (this.value) {
        const dateReg = /^\d{4}-(0\d|1[0-2])-([0-2]\d|3[01])$/
        const dateTimeReg = /^\d{4}-(0\d|1[0-2])-([0-2]\d|3[01])( ([01]\d|2[0-3]):[0-5]\d)$/

        if (this.type === 'datetime') {
          if (!dateTimeReg.test(this.value)) {
            console.error('ctDatePicker: date value error!')
          }
        } else {
          if (!dateReg.test(this.value)) {
            console.error('ctDatePicker: date value error!')
          }
        }

        this.date = new Date(this.value)
      } else {
        this.date = new Date()
      }
      this.year = this.date.getFullYear()
      this.month = this.date.getMonth()
      this.day = this.date.getDate()

      // 如果没有传入初始化值，则hour, minutes均为00
      // if (this.value) {
      //   this.hour = this.date.getHours()
      //   this.minutes = this.date.getMinutes()
      // }
    },
    setDate() {
      this.date = new Date(this.year, this.month, this.day)
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
      const thisMonthAllDays = getDayCountOfMonth(thisMonth)
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
        _cellItem.selected = time === clearHours(new Date(this.value))

        _cellItem.disabled = this.disabledDate(new Date(time))
        this.cells.push(_cellItem)
      }

      // 下月日期计算
      let nextYear = thisYear
      if (thisMonth === 11) {
        nextYear += 1
      }
      const nextMonth = getNextMonth(thisMonth)
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
        this.dateTimeEmit()
      } else {
        const datatime = `${this.year}-${this.getMonth}-${this.getDay}`
        this.$emit('input', datatime)
        this.dispatch('ctFormLine', 'ct.form.change', datatime)
      }
      // $emit是异步的，所以要放在$nextTick中重新初始化数据
      this.$nextTick(() => {
        this.init()
        if (this.autoclose) {
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
      const datetime = `${this.year}-${this.getMonth}-${this.getDay} ${this.hour}:${this.minutes}`
      this.$emit('input', datetime)
      this.dispatch('ctFormLine', 'ct.form.change', datetime)
    },
    handleHourChange(val) {
      this.hour = val
      this.dateTimeEmit()
    },
    handleMinutesChange(val) {
      this.minutes = val
      this.dateTimeEmit()
    },
    showPicker() {
      const windowHeight = getWindowHeight()
      const elToBottom = this.$refs.ctDatePicker.getBoundingClientRect().bottom
      const maxHeight = 286
      if (windowHeight - elToBottom - maxHeight <= 0) {
        this.topCls = `${prefixCls}-top`
      } else {
        this.topCls = ''
      }
      this.visiable = true
      this.getCells()
    },
    hidePicker() {
      this.visiable = false
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/color'

.ct-date-picker
  position: relative
  background-color: #fff
  text-align: center
  border-radius: 4px
  display: block
  ^[0]-input
    position: relative
    i
      position: absolute
      right: 10px
      top: 10px
      color: #ccc
    input
      padding-right: 24px
  .ct-input
    display: block
  ^[0]-warpper
    background-color: #fff
    border-radius: 4px
    position: absolute
    top: 34px
    z-index: 3
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2)
    &^[0]-top
      top: -290px
    ^[0]-header
      height: 32px
      line-height: 32px
      border-bottom: 1px solid #e9eaec
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
        margin: 10px 10px 0 10px
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
</style>
