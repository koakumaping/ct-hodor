<template>
  <div class="filter-bar border-left" :style="{transform: $store.getters.filterbar ? 'translateX(0)' : ''}">
    <div class="filter-bar-title border-bottom clear relative">
      <div class="left">
        <svg class="filter-bar-close left" width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"
        v-on:click="toggleFilterBar">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill-rule="evenodd"></path>
      </svg>
      <span>过滤条件</span>
    </div>
  </div>
  <div class="filter-bar-content">
    <slot></slot>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'filterbar',
  methods: {
    hideFilter() {
      const $right = document.getElementById('toolbarRight')
      if ($right) {
        $right.className = 'toolbar-right right'
      }

      const $warp = document.getElementById('warp')
      if ($warp) {
        $warp.className = ''
      }
      const $filter = document.getElementById('filterBar')
      if ($filter) {
        $filter.className = 'filter-bar border-left'
      }
    },
    ...mapActions([
      'toggleFilterBar',
    ]),
  },
}
</script>

<style lang="stylus">
@import "../assets/stylus/color"
.filter-bar
  position: fixed
  right: 0
  top: 48px
  width: 240px
  height: 100%
  transform: translateX(240px)
  transition: all ease-out 0.3s
  background-color: #fff
  &.filter-bar-show
    transform: translateX(0)

  .filter-bar-title
    font-size: 14px
    font-weight: lighter
    height: 64px
    line-height: 64px
    padding-left: 16px
    padding-right: 8px

  .filter-bar-close
    width: 24px
    height: 24px
    margin-top: 20px
    margin-right: 10px
    fill: $color-main
    cursor: pointer

  .filter-bar-content
    padding: 24px
    overflow: auto
    .fliter-bar-line
      dl
        font-family: 'Roboto',sans-serif
        margin-bottom: 5px
      .fliter-bar-line-data
        margin-bottom: 12px
        position: relative
        .filter-bar-select
          height: 29px
          width: 191px
          padding: 1px 8px
          border: 1px solid #d9d9d9
          i.fa
            position: absolute
            right: 8px
            top: 6px
        select
          position: absolute
          top: 0
          height: 29px
          line-height: 29px
          padding: 1px 8px
    .fliter-bar-action
      padding-top: 12px
      dl
        padding-right: 8px
        &:last-child
          padding: 0
        .btn
          width: 100%
</style>