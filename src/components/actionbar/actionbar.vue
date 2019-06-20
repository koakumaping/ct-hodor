<template>
  <div class="ct-action-bar clear">
    <div class="ct-action-bar__left">
      <slot name="left"></slot>
      <slot></slot>
    </div>
    <div class="ct-action-bar__right text-right clear">
      <div class="ct-action-bar__right-content">
        <slot name="right"></slot>
        <ctButton v-if="$slots.extra" @click="toggle" icon="filter"></ctButton>
        <ctButton v-if="!hiddenSearchBtn && $slots.right" @click="doSearch" type="primary" icon="search"></ctButton>
      </div>
      <div class="ct-action-bar__right-action">
        <slot name="btn"></slot>
      </div>
    </div>
    <ctFilterbar ref="filterbar" @show="showExtra = true" @hide="showExtra = false">
      <ctFormSearch>
        <slot name="extra"></slot>
        <ctFormSearchLine>
          <ctButton type="primary" @click="doSearch">搜索</ctButton>
        </ctFormSearchLine>
        <ctFormSearchLine v-if="clearable">
          <ctButton @click="doClear">清空</ctButton>
        </ctFormSearchLine>
      </ctFormSearch>
    </ctFilterbar>
  </div>
</template>

<script>
import { ctButton } from '../button'
import ctFilterbar from '../filterbar'
import { ctFormSearch, ctFormSearchLine } from '../form-search'

export default {
  name: 'ctActionBar',
  components: {
    ctButton,
    ctFilterbar,
    ctFormSearch,
    ctFormSearchLine,
  },
  props: {
    hiddenSearchBtn: Boolean,
    clearable: Boolean,
  },
  data() {
    return {
      showExtra: false,
    }
  },
  methods: {
    doSearch() {
      this.$emit('on-search')
    },
    doClear() {
      this.$emit('on-clear')
    },
    toggle() {
      this.$refs.filterbar.show()
      this.$nextTick(() => {
        this.$emit('change', this.showExtra)
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