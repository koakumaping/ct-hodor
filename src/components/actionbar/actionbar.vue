<template>
  <div class="ct-action-bar clear">
    <div class="ct-action-bar__left">
      <slot name="left"></slot>
      <slot></slot>
    </div>
    <div class="ct-action-bar__right text-right clear">
      <div class="ct-action-bar__right-content">
        <slot name="right"></slot>
        <ctButton v-if="extra && $slots.right" @click="toggle">高级搜索</ctButton>
        <ctButton v-if="!hiddenSearchBtn && $slots.right" @click="doSearch" type="primary">搜索</ctButton>
      </div>
      <div class="ct-action-bar__right-action">
        <slot name="btn"></slot>
      </div>
    </div>
    <ctFilterbar ref="filterbar" @on-show="showExtra = true" @on-hide="showExtra = false">
      <slot name="extra"></slot>
    </ctFilterbar>
  </div>
</template>

<script>
import { ctButton } from '../button'
import ctFilterbar from '../filterbar'

export default {
  name: 'ctActionBar',
  components: {
    ctButton,
    ctFilterbar,
  },
  props: {
    hiddenSearchBtn: Boolean,
    extra: Boolean,
  },
  data() {
    return {
      showExtra: false,
    }
  },
  methods: {
    doSearch() {
      this.$emit('on-search', this.showExtra)
    },
    toggle() {
      this.$refs.filterbar.show()
      this.$nextTick(() => {
        this.$emit('on-change', this.showExtra)
      })
    },
  },
}
</script>

<style lang="stylus">
.ct-action-bar
  margin-bottom 8px
  font-size 0
  display -webkit-box /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
  display -moz-box /* 老版本语法: Firefox (buggy) */
  display -ms-flexbox /* 混合版本语法: IE 10 */
  display -webkit-flex /* 新版本语法: Chrome 21+ */
  display flex /* 新版本语法: Opera 12.1, Firefox 22+ */
  > .ct-action-bar__left
    flex 0 0 auto

  > .ct-action-bar__left > *,
  > .ct-action-bar__left > div > *,
  > .ct-action-bar__right > div > *
    display inline-block!important
    vertical-align middle
    margin-bottom 8px

  > .ct-action-bar__left > *
    margin-right 8px!important

  > .ct-action-bar__right
    flex 1 1 auto

  > .ct-action-bar__right > div > *
    margin-left 8px!important

  > .ct-action-bar__right > .ct-action-bar__right-content,
  > .ct-action-bar__right > .ct-action-bar__right-action
    display inline-block
    text-align left

</style>