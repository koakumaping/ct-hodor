<template>
  <i class="iconfont" :class="iconClass"></i>
</template>

<script>
export default {
  name: 'iconFont',
  props: {
    name: {
      type: String,
      default: '',
      required: true,
    },
  },
  computed: {
    iconClass() {
      return [`icon-${this.name}`]
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/css/iconfont.css'

.icon-font
  color #333
  font-size 16px
</style>
