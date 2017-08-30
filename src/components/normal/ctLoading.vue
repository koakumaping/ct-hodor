<template>
  <div class="ct-loading" v-show="loading">
    <div class="ct-loading-spinners">
      <div class="ct-loading-folding-cube">
        <div class="ct-loading-cube1 ct-loading-cube"></div>
        <div class="ct-loading-cube2 ct-loading-cube"></div>
        <div class="ct-loading-cube4 ct-loading-cube"></div>
        <div class="ct-loading-cube3 ct-loading-cube"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ctLoading',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../../assets/stylus/var'
@import '../../assets/stylus/color'

.ct-loading-spinners
  width: 100%
  height: 60px
  padding: 0
  margin: 0
  list-style: none
  text-align: left
  font-size: 0

  .ct-loading-folding-cube
    margin: 0 auto
    width: 40px
    height: 40px
    position: relative
    -webkit-transform: rotateZ(45deg) translateY(14px)
    transform: rotateZ(45deg) translateY(14px)

  .ct-loading-folding-cube .ct-loading-cube
    float: left
    width: 50%
    height: 50%
    position: relative
    -webkit-transform: scale(1.1)
    -ms-transform: scale(1.1)
    transform: scale(1.1)

  .ct-loading-folding-cube .ct-loading-cube:before
    content: ''
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: #333
    -webkit-animation: ct-loading-foldCubeAngle 2.4s infinite linear both
    animation: ct-loading-foldCubeAngle 2.4s infinite linear both
    -webkit-transform-origin: 100% 100%
    -ms-transform-origin: 100% 100%
    transform-origin: 100% 100%

  .ct-loading-folding-cube .ct-loading-cube2
    -webkit-transform: scale(1.1) rotateZ(90deg)
    transform: scale(1.1) rotateZ(90deg)

  .ct-loading-folding-cube .ct-loading-cube3
    -webkit-transform: scale(1.1) rotateZ(180deg)
    transform: scale(1.1) rotateZ(180deg)

  .ct-loading-folding-cube .ct-loading-cube4
    -webkit-transform: scale(1.1) rotateZ(270deg)
    transform: scale(1.1) rotateZ(270deg)

  .ct-loading-folding-cube .ct-loading-cube2:before
    -webkit-animation-delay: 0.3s
    animation-delay: 0.3s

  .ct-loading-folding-cube .ct-loading-cube3:before
    -webkit-animation-delay: 0.6s
    animation-delay: 0.6s

  .ct-loading-folding-cube .ct-loading-cube4:before
    -webkit-animation-delay: 0.9s
    animation-delay: 0.9s

@keyframes ct-loading-foldCubeAngle
  0%,
  10%
    -webkit-transform: perspective(140px) rotateX(-180deg)
    -ms-transform: perspective(140px) rotateX(-180deg)
    transform: perspective(140px) rotateX(-180deg)
    opacity: 0

  25%,
  75%
    -webkit-transform: perspective(140px) rotateX(0deg)
    -ms-transform: perspective(140px) rotateX(0deg)
    transform: perspective(140px) rotateX(0deg)
    opacity: 1

  90%,
  100%
    -webkit-transform: perspective(140px) rotateY(180deg)
    -ms-transform: perspective(140px) rotateY(180deg)
    transform: perspective(140px) rotateY(180deg)
    opacity: 0

</style>