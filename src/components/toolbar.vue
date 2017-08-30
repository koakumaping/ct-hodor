<template>
  <div class="toolbar border-bottom clear relative">
    <div class="toolbar-title left">{{title}}</div>
    <div class="toolbar-right right" v-on:click="toggleFilterBar">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'toolbar',
  data() {
    return {
      showRight: true,
    }
  },
  props: ['title'],
  methods: {
    showFilter() {
      const $right = document.getElementById('toolbarRight')
      if ($right) {
        $right.className = 'toolbar-right toolbar-right-hidden right'
      }

      const $warp = document.getElementById('warp')
      if ($warp) {
        $warp.className = 'has-filter-bar'
      }

      const $filter = document.getElementById('filterBar')
      if ($filter) {
        $filter.className = 'filter-bar border-left filter-bar-show'
      }
    },
    ...mapActions([
      'toggleFilterBar',
    ]),
  },
}
</script>

<style lang="stylus">
@import "../assets/stylus/color.styl"

.toolbar
  height: 64px
  line-height: 64px
  width: 100%
  font-size: 18px
  padding-left: 16px
  padding-right: 16px
  background-color: #fff
  .toolbar-right
    font-size: 14px
    color: $color-main
    cursor: pointer
  .toolbar-right-hidden
    display: none
</style>