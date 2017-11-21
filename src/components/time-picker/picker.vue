<template>
  <div :class="[prefixCls, 'clear']">
    <ctSelect v-model="currentHour" width="54px" class="left" style="margin-right: 8px;" noFormEmit :place="place">
      <ctOption v-for="item in getHourList" :key="item" :label="item" :value="item"></ctOption>
    </ctSelect>
    <ctSelect v-model="currentMinutes" width="54px" class="left" noFormEmit :place="place">
      <ctOption v-for="item in getMinutesList" :key="item" :label="item" :value="item"></ctOption>
    </ctSelect>
  </div>
</template>

<script>
import { ctSelect, ctOption } from '../select'

const prefixCls = 'ct-time-picker'

export default {
  name: 'ctTimePicker',
  props: {
    value: {
      type: String,
      default: '00:00',
    },
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
    split: Boolean,
    place: {
      type: String,
      default: 'top',
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
      const _hourList = []
      for (let i = this.start; i <= this.end; ++i) {
        let item
        if (i < 10) {
          item = `0${i}`
        } else {
          item = i.toString()
        }
        _hourList.push(item)
      }

      return _hourList
    },
    getMinutesList() {
      const _minutesList = []
      let i = 0
      while (i < 60) {
        let item
        if (i < 10) {
          item = `0${i}`
        } else {
          item = i.toString()
        }
        _minutesList.push(item)
        i += this.range
      }
      // 初始化默认值
      return _minutesList
    },
    currentValue() {
      return `${this.getHour}:${this.getMinutes}`
    },
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal === oldVal) return false
      this.setCurrentValue()
    },
    currentHour(newVal, oldVal) {
      if (newVal === oldVal) return false
      this.$emit('on-hour-change', this.getHour)
      this.update()
    },
    currentMinutes(newVal, oldVal) {
      if (newVal === oldVal) return false
      this.$emit('on-minutes-change', this.getMinutes)
      this.update()
    },
  },
  mounted() {
    // 初始化默认值
    if (!this.currentHour && !(this.getHourList.includes(this.currentHour))) {
      this.currentHour = this.getHourList[0]
    }
    if (!this.currentMinutes &&
      !(this.getMinutesList.includes(this.currentMinutes))
    ) {
      this.currentMinutes = this.getMinutesList[0]
    }
    // 如果有默认值，取默认值
    this.setCurrentValue()

    this.$nextTick(() => {
      this.init()
    })
  },
  data() {
    return {
      prefixCls: `${prefixCls}`,
      currentHour: this.hour,
      currentMinutes: this.minutes,
      _ready: false,
    }
  },
  methods: {
    init() {
      this._ready = true
      this.update()
    },
    setCurrentValue() {
      if (this.value) {
        const _hour = this.value.split(':')[0]
        const _minutes = this.value.split(':')[1]

        this.currentHour = this.getHourList.includes(_hour) ? _hour : this.getHourList[0]
        this.currentMinutes = this.getMinutesList.includes(_minutes) ?
          _minutes : this.getMinutesList[0]
      }
    },
    update() {
      if (!this._ready) return false
      this.$emit('input', this.currentValue)
    },
  },
}
</script>
