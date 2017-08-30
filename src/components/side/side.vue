<template>
  <div class="side" :class="{ 'side-small': !side }">
    <!-- <div class="side-name">OA功能演示</div> -->
    <nav>
      <dl v-for="(row, index) in sideList" :key="row.id">
        <dt class="side-menu" :class="{ 'side-menu-expand': row.expand }"
        v-on:click="toggleMenu(index)">
          <iconFont :name="row.icon"></iconFont>
          <span>{{row.name}}</span>
        </dt>
        <transition
          v-on:before-enter="beforeEnter"
          v-on:enter="enter"
          v-on:after-enter="afterEnter"
          v-on:before-leave="beforeLeave"
          v-on:leave="leave"
          v-on:after-leave="afterLeave"
        >
          <dt class="side-menu-sub" v-show="row.expand">
            <dd v-on:click="setTime">
              <router-link v-for="item in row.children" :key="item.id"
                :to="{ name: item.routerName }">
                <span>{{item.name}}</span>
              </router-link>
            </dd>
          </dt>
        </transition>
      </dl>
    </nav>
    <!-- <div class="side-actions clear">
      <p class="left">v{{$store.getters.version}}</p>
      <router-link :to="{ name: '404' }" class="help" title="帮助"></router-link>
      <router-link :to="{ name: '404' }" class="cry" title="反馈"></router-link>
    </div> -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ct from '@/mixins/collapse-transition'

export default {
  name: 'side',
  mixins: [ct],
  computed: mapGetters([
    'sideList',
    'side',
  ]),
  data() {
    return {
      time: +new Date(),
    }
  },
  methods: {
    ...mapActions([
      'toggleSide',
      'toggleMenu',
    ]),
    setTime() {
      this.time = +new Date()
    },
  },
}
</script>

<style lang="stylus">
$text-color = #94ADC0

.side
  position: absolute
  top: 0
  left: 0
  overflow: hidden
  color: $text-color
  width: 214px
  background: #303548
  height: 100%
  z-index: 9
  transition: all 0.3s
  .side-name
    height: 50px
    line-height: 50px
    padding-left: 36px
    font-size: 18px
    overflow: hidden
  nav
    padding: 0 0 32px 0
    transform: translateZ(0)
    height: 100%
    overflow: auto
    transition: all 0.3s
    & > dl
      margin-bottom: 2px
    a
      color: inherit
      border-left: 2px solid transparent
      background-color: #2C3144
      display: block
      font-weight: 400
      letter-spacing: 0.1px
      padding: 12px 24px 12px 60px
      white-space: nowrap
      transition: all 0.2s

    dd > .router-link-active,
    .side-menu:focus,
    a:focus
      outline: 0
      color: #fff
      border-color: #02AADB
      background-color: #3E445C

    .side-menu
      border-left: 2px solid transparent
      font-weight: 400
      font-size: 15px
      padding: 16px 20px 16px 20px
      cursor: pointer
      background-color: #333A4D
      background-image: url(../../assets/img/more.png)
      background-position: center right
      background-position-x: 190px
      background-repeat: no-repeat
      transition: all 0.3s
      line-height: 1
      &:hover
        color: #fff
        .side-menu-icon
          display: none
        img[alt=icon-active]
          display: inline-block
      &.side-menu-expand
        background-image: url(../../assets/img/more-unfold.png)

      .iconfont
        height: 16px
        width: 16px
        vertical-align: middle
        display: inline-block
      .side-menu-icon
        height: 16px
        width: 16px
        vertical-align: middle
      img[alt=icon-active]
        display: none

      span
        padding-left: 20px
        vertical-align: middle
  
    .side-menu-sub
      display: block
      overflow: hidden
      a:hover
        background-color: #3E445C
      .side-menu-sub-icon
        height: 14px
        width: 14px
        vertical-align: middle
      span
        vertical-align: middle
        padding-left: 6px
        text-rendering: optimizeLegibility
    // .side-menu-expand + .side-menu-sub
    //   display: block

  .side-actions
    // display: none
    position: absolute
    bottom: 8px
    left: 0
    right: 0
    height: 16px
    padding: 0 16px
    text-align: right
    a
      height: 16px
      width: 16px
      display: inline-block
    .help
      margin-right: 8px
      background: url(../../assets/img/help.png) center center no-repeat
      &:hover
        background: url(../../assets/img/help-active.png) center center no-repeat
    .cry
      background: url(../../assets/img/cry.png) center center no-repeat
      &:hover
        background: url(../../assets/img/cry-active.png) center center no-repeat

.side.side-small
  // transform: translateX(-214px)
  transform translateX(-214px + 49)
  nav
    transform translateX(214px - 49 - 7)
  &:hover
    transform translateX(0)
    nav
      transform translateX(0)
    .side-menu span
      display inline-block
    .side-menu-sub
      display block
  .side-menu span
      display none
  .side-menu-sub
    display none

@keyframes menu-span-fade
  0%
    opacity 0
  70%
    opacity 0
  100%
    opacity 1
</style>
