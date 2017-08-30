<template>
  <div class="clock">
    <div class="hour">
      <dl>{{time[0]}}</dl>
      <p>HOURS</p>
    </div>
    <div class="minutes">
      <dl>{{time[1]}}</dl>
      <p>MINUTES</p>
    </div>
    <div class="seconds">
      <dl>{{time[2]}}</dl>
      <p>SECONDS</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'clock',
  data() {
    return {
      time: ['--', '--', '--'],
      timeInterval: '',
    }
  },
  created() {
    this.timeInterval = window.setInterval(() => {
      this.getCurrentTime()
    }, 1000)
  },
  methods: {
    getCurrentTime() {
      const date = new Date()
      function process(value) {
        value = value.toString()
        return value.length > 1 ? value : `0${value}`
      }

      this.time = [process(date.getHours()), process(date.getMinutes()), process(date.getSeconds())]
    },
  },
  beforeRouteLeave(to, from, next) {
    window.clearInterval(this.timeInterval)
    next()
  },
}
</script>

<style lang="stylus">
.clock
  display: inline-block
  padding-bottom: 8px
  .hour
    padding-left: 0
  & > div
    display: inline-block
    font-size: 28px
    font-weight: 100
    padding: 0 8px 8px 8px
    text-align: center
    p
      font-size: 12px
</style>