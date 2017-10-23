<template>
  <div :class="[prefixCls, 'clear']">
    <ctSelect v-model="currentHour" width="54px" class="left" style="margin-right: 8px;" noFormEmit>
      <ctOption v-for="item in getHourList" :key="item.id" :label="item.label" :value="item.key"></ctOption>
    </ctSelect>
    <ctSelect v-model="currentMinutes" width="54px" class="left" noFormEmit>
      <ctOption v-for="item in getMinutesList" :key="item.id" :label="item.label" :value="item.key"></ctOption>
    </ctSelect>
  </div>
</template>

<script>
import { clone } from 'ct-util'
import { ctSelect, ctOption } from '../select'

const prefixCls = 'ct-time-picker'

export default {
  name: 'ctTimePicker',
  props: {
    hourList: {
      type: Array,
      default: () => [],
    },
    minutesList: {
      type: Array,
      default: () => [],
    },
    hour: {
      type: [String, Number],
      default: '00',
    },
    minutes: {
      type: [String, Number],
      default: '00',
    },
  },
  components: {
    ctSelect,
    ctOption,
  },
  computed: {
    getHour() {
      const hour = this.currentHour
      if (hour.toString().length === 1) {
        return `0${hour}`
      }
      return hour
    },
    getMinutes() {
      const minutes = this.currentMinutes
      if (minutes.toString().length === 1) {
        return `0${minutes}`
      }
      return minutes
    },
    getHourList() {
      if (this.hourList.length > 0) {
        return this.hourList
      }

      const _hourItem = {
        key: '',
        label: '',
      }

      const _hourList = []
      for (let i = 0; i < 24; ++i) {
        const item = clone(_hourItem)
        if (i < 10) {
          item.key = `0${i}`
          item.label = `0${i}`
        } else {
          item.key = i
          item.label = i
        }
        _hourList.push(item)
      }

      return _hourList
    },
    getMinutesList() {
      if (this.minutesList.length > 0) {
        return this.minutesList
      }

      const _minutesItem = {
        key: '',
        label: '',
      }

      const _minutesList = []
      for (let i = 0; i < 60; ++i) {
        const item = clone(_minutesItem)
        if (i < 10) {
          item.key = `0${i}`
          item.label = `0${i}`
        } else {
          item.key = i
          item.label = i
        }
        _minutesList.push(item)
      }

      return _minutesList
    },
  },
  watch: {
    hour(val) {
      this.currentHour = val
    },
    minutes(val) {
      this.currentMinutes = val
    },
    currentHour(val) {
      this.$emit('on-hour-change', this.getHour)
    },
    currentMinutes(val) {
      console.log(this.getMinutes)
      this.$emit('on-minutes-change', this.getMinutes)
    },
  },
  data() {
    return {
      prefixCls: `${prefixCls}`,
      currentHour: this.hour,
      currentMinutes: this.minutes,
    }
  },
}
</script>
