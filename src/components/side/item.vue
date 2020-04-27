<template>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:after-enter="afterEnter"
    v-on:before-leave="beforeLeave"
    v-on:leave="leave"
    v-on:after-leave="afterLeave"
  >
    <dt class="side-menu-item" v-show="data.expand">
      <dd>
        <span
          v-for="item in data.children"
          :key="item.id"
        >
          <router-link
            v-if="item.routerName"
            :to="{ name: item.routerName }"
            :target="item.target"
          >
            {{ item.name }}<span v-if="showCount(item)" class="side-menu-count">({{ count(item) }})</span>
          </router-link>
          <a v-else-if="item.href" :href="item.href" :target="item.target" @click.stop="go(item)">{{ item.name }}<span>{{ count(item) }}</span></a>
          <router-link v-else to="404">{{ item.name }}（未配置）</router-link>
        </span>
      </dd>
    </dt>
  </transition>
</template>

<script>
import { addClass, removeClass, isEmptyObject, hasOwn } from 'ct-util'

export default {
  name: 'sideItem',
  props: {
    data: {
      type: Object,
      default: function d() {
        return {
          expand: false,
          children: [],
        }
      },
    },
    countList: {
      type: Object,
      default: function d() {
        return {}
      },
    },
  },
  methods: {
    // 计算数量显示
    count(payload) {
      const countList = this.countList
      if (isEmptyObject(countList)) return ''
      if (hasOwn(countList, payload.routerName)) return countList[payload.routerName]
      return ''
    },
    showCount(payload) {
      const countList = this.countList
      if (isEmptyObject(countList)) return false
      if (hasOwn(countList, payload.routerName)) return true
      return false
    },
    go(payload) {
      window.location.href = item.router + item.href
    },
    beforeEnter(el) {
      addClass(el, 'collapse-transition')
      if (!el.dataset) el.dataset = {}

      el.dataset.oldPaddingTop = el.style.paddingTop
      el.dataset.oldPaddingBottom = el.style.paddingBottom

      el.style.height = '0'
      el.style.paddingTop = 0
      el.style.paddingBottom = 0
    },
    enter(el) {
      el.dataset.oldOverflow = el.style.overflow
      if (el.scrollHeight !== 0) {
        el.style.height = `${el.scrollHeight}px`
        el.style.paddingTop = el.dataset.oldPaddingTop
        el.style.paddingBottom = el.dataset.oldPaddingBottom
      } else {
        el.style.height = ''
        el.style.paddingTop = el.dataset.oldPaddingTop
        el.style.paddingBottom = el.dataset.oldPaddingBottom
      }

      el.style.overflow = 'hidden'
    },
    afterEnter(el) {
      // for safari: remove class then reset height is necessary
      removeClass(el, 'collapse-transition')
      el.style.height = ''
      el.style.overflow = el.dataset.oldOverflow
    },
    beforeLeave(el) {
      if (!el.dataset) el.dataset = {}
      el.dataset.oldPaddingTop = el.style.paddingTop
      el.dataset.oldPaddingBottom = el.style.paddingBottom
      el.dataset.oldOverflow = el.style.overflow

      el.style.height = `${el.scrollHeight}px`
      el.style.overflow = 'hidden'
    },
    leave(el) {
      if (el.scrollHeight !== 0) {
        // for safari: add class after set height, or it will jump to zero height suddenly, weired
        addClass(el, 'collapse-transition')
        el.style.height = 0
        el.style.paddingTop = 0
        el.style.paddingBottom = 0
      }
    },
    afterLeave(el) {
      removeClass(el, 'collapse-transition')
      el.style.height = ''
      el.style.overflow = el.dataset.oldOverflow
      el.style.paddingTop = el.dataset.oldPaddingTop
      el.style.paddingBottom = el.dataset.oldPaddingBottom
    },
  },
}
</script>