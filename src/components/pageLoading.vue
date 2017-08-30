<template>
  <div class="page-loading" v-show="$store.getters.loading">
    <span :style="{marginLeft: $store.getters.side ? '112px' : ''}"></span>
  </div>
</template>

<script>
export default {
  name: 'pageLoading',
}
</script>

<style lang="stylus">
@import '../assets/stylus/var'
@import '../assets/stylus/color'

.page-loading
  position: absolute
  left: 0
  top: 0
  right: 0
  bottom: 0
  background-color: rgba(255, 255, 255, 0.6)
  filter: blur(.5px)
  span
    position: absolute
    top: 50%
    left: 50%
    margin-left: -10px
    margin-top: -10px
    display: block
    border-radius: 50%
    background-color: $color-main
    width: 20px
    height: 20px
    animation: spin-bounce 1s 0s ease-in-out infinite

@keyframes spin-bounce {
  0% {
    transform: scale(0);
  }
  100% {
      transform: scale(1);
      opacity: 0;
  }
}
</style>