<template>
  <div class="ct-notice-warp">
    <div class="ct-notice"
      v-for="item in $store.getters.noticeList"
      :key="item.key"
      :class="[`${prefixCls}-${item.type}`]"
    >
      <div class="ct-notice-content">
        <div class="ct-notice-tittle hidden">{{item.title ? item.title : '提示'}}</div>
        <div class="ct-notice-html" v-html="item.content"></div>
      </div>
      <faFont name="info-circle" v-if="item.type === 'info'"></faFont>
      <faFont name="check-circle" v-if="item.type === 'success'"></faFont>
      <faFont name="exclamation-circle" v-if="item.type === 'warn'"></faFont>
      <faFont name="times-circle" v-if="item.type === 'error'"></faFont>

      <iconFont name="close" @click.native="handleClose(item.key)" :data-key="item.key"></iconFont>
    </div>
  </div>
</template>

<script>
const prefixCls = 'ct-notice'

export default {
  name: 'ctNotice',
  data() {
    return {
      prefixCls: `${prefixCls}`,
    }
  },
  methods: {
    handleClose(key) {
      this.$store.commit('DEL_NOTICE', key)
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/common'
@import '../../assets/stylus/var'
@import '../../assets/stylus/color'

.ct-notice
  margin-bottom: 10px
  padding: 16px
  border-radius: 4px
  border-left: 4px solid
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2)
  background: #fff
  line-height: 1
  position: relative
  overflow: hidden
  animation: notice 0.3s
  .ct-notice-content
    padding-left: 51px
    .ct-notice-tittle
      margin-bottom: 8px
      font-size: 14px
      font-weight: 700
      color: #333
      padding-right: 10px
    .ct-notice-html
      font-size: 12px
      line-height: 1.5
      text-align: justify
      color: #495060
  .fa
    position: absolute
    top: 14px
    font-size: 32px
  .iconfont
    position: absolute
    top: 14px
    right: 16px
    cursor: pointer
    opacity: 0.2
    transition: opacity 0.3s
    &:hover
      opacity: 1
// 类型
.ct-notice-info
  border-color: $color-blue
  .fa
    color: $color-blue
.ct-notice-success
  border-color: $color-green
  .fa
    color: $color-green
.ct-notice-warn
  border-color: $color-orange
  .fa
    color: $color-orange
.ct-notice-error
  border-color: $color-red
  .fa
    color: $color-red

.ct-notice-warp
  position: fixed
  width: 335px
  top: 60px
  right: 0
  margin-right: 24px
  z-index: 20

@keyframes notice
  0%
    transform: translateX(18px)
  100%
    transform: translateX(0)
</style>
