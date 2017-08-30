<template>
  <i class="fa" :class="iconClass" aria-hidden="true"></i>
</template>

<script>
export default {
  name: 'faFont',
  props: {
    name: {
      type: String,
      default: '',
      required: true,
    },
  },
  computed: {
    iconClass() {
      return [`fa-${this.name}`]
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/css/font-awesome.css'

.icon-font
  color #333
  font-size 16px
</style>
