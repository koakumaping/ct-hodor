<template>
  <div class="topbar clear" :class="{ 'topbar-expand': side }">
    <div class="topbar-menu left" v-on:click="toggleSide">
      <iconFont name="category"></iconFont>
    </div>
    <div class="topbar-left clear">
      <div class="topbar-tab"
        v-for="item in list"
        :key="item.id"
        v-on:click="changePlatform(item.name)"
        :class="{ 'active': name === item.name }"
      >
        {{item.name}}
      </div>
    </div>
    <div class="topbar-right clear">
      <section class="topbar-block">
        <span>{{ userInfo.name }}</span>
        <div class="topbar-dropdown">
          <div class="topbar-user-list clear">
            <a @click="showLogin">
              <iconFont name="account"></iconFont>
              <span>个人信息</span>
            </a>
            <a @click="showPage('password')">
              <iconFont name="edit"></iconFont>
              <span>修改密码</span>
            </a>
            <a @click="showPage('home')">
              <iconFont name="set"></iconFont>
              <span>首页设置</span>
            </a>
            <a>
              <iconFont name="code"></iconFont>
              <span>更多</span>
            </a>
          </div>
          <div class="topbar-dropdown-action border-top">
            <a @click="logout">退出平台</a>
          </div>
        </div>
      </section>

      <section class="topbar-block">
        <iconFont name="remind1"></iconFont>
        <span class="topbar-message-count">2</span>

        <div class="topbar-dropdown">
          <div class="topbar-message">
            <div class="topbar-message-head clear">
              <span>站内消息</span>
              <a class="right">消息接收管理</a>
            </div>
            <ul class="topbar-message-list">
              <li>
                <a href="">
                  <div class="text-main hidden" title="这是一条消息">这是一条消息</div>
                  <div>2017-08-01 14:24</div>
                </a>
              </li>
              <li>
                <a href="">
                  <div class="text-main hidden" title="这是一条标题特别特别特别特别特别特别长的消息啊消息">这是一条标题特别特别特别特别特别特别长的消息啊消息</div>
                  <div>2017-08-01 14:24</div>
                </a>
              </li>
            </ul>
            <div class="topbar-dropdown-action">
              <a href="">查看更多</a>
            </div>
          </div>
        </div>
      </section>

      <section class="topbar-block">
        <router-link :to="{name: '404'}">支持</router-link>
        <div class="topbar-dropdown">
          <ul class="topbar-dropdown-list">
            <li>
              <router-link :to="{name: '404'}">帮助文档</router-link>
            </li>
            <li>
              <a @click="showSuggest">提交建议</a>
            </li>
            <li>
              <router-link :to="{name: '404'}">FAQ</router-link>
            </li>
          </ul>
        </div>
      </section>

      <ctDialog title="提交建议"
        :visible.sync="suggestFormVisible"
        :width="480"
      >
        <suggestForm @on-save="hideSuggest"></suggestForm>
      </ctDialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import passwordForm from '@/components/common/password'
import suggestForm from '@/views/help/suggest'
import sideList from './data'

export default {
  name: 'topbar',
  data() {
    return {
      platformList: [
        'home',
        'personelMatters',
        'finance',
        'recruit',
      ],
      constPlatform: {
        home: '工作平台',
        personelMatters: '人事系统',
        finance: '财务系统',
        recruit: '招聘系统',
      },
      name: '',
      routerName: '',
      suggestFormVisible: false,
      list: [],
      constList: sideList,
      testMenu: {
        name: '测试页面',
        expand: false,
        icon: 'smile',
        children: [
          {
            name: '首页',
            routerName: 'testIndex',
          },
          {
            name: 'API',
            routerName: 'api',
          },
        ],
      },
      user: {
        id: '',
        name: '',
        deptid: '',
        deptname: '',
      },
    }
  },
  computed: mapGetters([
    'userInfo',
    'side',
  ]),
  watch: {
    $route() {
      if (this.name === this.getName(this.getPlatform())) return
      this.routerName = this.$route.name
      this.setPlatform()
    },
  },
  components: {
    passwordForm,
    suggestForm,
  },
  mounted() {
    this.getList()
  },
  methods: {
    ...mapActions([
      'toggleSide',
      'getSideList',
      'setSideList',
      'setUserInfo',
    ]),
    setCookies() {
      for (const key in this.user) {
        if (this.$util.hasOwn(this.user, key)) {
          const value = this.user[key]
          if (value) {
            this.$cookie.set(key, value, { expires: 5 })
          } else {
            this.$cookie.remove(key)
          }
        }
      }
    },
    getPlatform() {
      const routerPath = this.$route.path
      if (routerPath !== '/') {
        return routerPath.split('/')[1]
      }
      return 'home'
    },
    getName(engName) {
      let name = ''
      for (const key in this.constPlatform) {
        if (engName === key) {
          name = this.constPlatform[key]
        }
      }
      return name
    },
    setName() {
      return new Promise((resolve, reject) => {
        this.name = this.getName(this.getPlatform())
        resolve()
      })
    },
    async setPlatform() {
      await this.setName()
      if (this.name) {
        this.getCurrentSideList(this.name)
      } else {
        this.$notice.error({
          title: '获取失败',
          content: 'hordo...',
        })
      }
    },
    changePlatform(name) {
      switch (name) {
        case '工作平台':
          this.showPage('home')
          break
        case '人事系统':
          this.showPage('attendanceList')
          break
        case '财务系统':
          this.showPage('404')
          break
        case '招聘系统':
          this.showPage('404')
          break
        default:
          this.showPage('home')
      }
    },
    showPage(routerName) {
      this.routerName = routerName
      this.setPlatform()
      this.$router.push({ name: routerName, query: { t: +new Date() } })
    },
    showSuggest() {
      this.suggestFormVisible = true
    },
    hideSuggest() {
      this.suggestFormVisible = false
    },
    showLogin() {
      this.$store.commit('SET_NEED_LOGIN', true)
    },
    getList() {
      this.routerName = this.$route.name
      const form = {}
      const sucessCallback = (response) => {
        this.list = response.data.sys
        this.user = response.data.user
        this.setCookies()
        this.setUserInfo(this.user)
        this.setPlatform()
      }

      const failCallback = (response) => {
        console.log(response)
      }

      this.$request('sideList', { data: form, type: 'GET' }, sucessCallback, failCallback)
    },
    getSystem(name, list) {
      let module = []
      for (let i = 0, l = list.length; i < l; ++i) {
        const system = list[i]
        if (system.name === name) {
          module = system
        }
      }
      return module
    },
    filterSideList(systemList, constSystemList) {
      const list = systemList.modules
      const constList = constSystemList
      let _sideItem = {}
      const _sideList = []

      for (let i = 0, l = list.length; i < l; ++i) {
        const p = list[i]
        _sideItem = this.getConstSystemParent(p.name, constSystemList)
        if (p.child && p.child.length > 0) {
          p.child.forEach((item) => {
            const child = this.getConstSystemChild(p.name, item.name, constList)
            // console.log(item.name, child)
            if (child) {
              // console.log('child.routerName', child.routerName, this.$route.name)
              if (child.routerName === this.routerName) {
                _sideItem.expand = true
              } else if (child.routerName === this.$route.meta.parentRouterName) {
                // 还原不存在于菜单中的，也可以说成是三级菜单或者更深层次的菜单的还原
                _sideItem.expand = true
              }
              _sideItem.children.push(child)
            }
          })
        }
        _sideList.push(_sideItem)
        _sideItem = {}
      }

      // 在开发环境添加测试相关菜单
      if (this.routerName === 'home' && process.env.NODE_ENV === 'development') {
        _sideList.push(this.testMenu)
      }

      return _sideList
    },
    getConstSystemParent(parentName, constSystemList) {
      // console.log(parentName, childName, constSystemList)
      const list = constSystemList.children
      let parentItem = ''
      list.forEach((parent) => {
        if (parent.name === parentName) {
          parentItem = this.$util.clone(parent)
          parentItem.children = []
        }
      })
      return parentItem
    },
    getConstSystemChild(parentName, childName, constSystemList) {
      const list = constSystemList.children
      let childItem = ''
      list.forEach((parent) => {
        if (parent.name === parentName) {
          parent.children.forEach((child) => {
            if (child.name === childName) {
              childItem = child
            }
          })
        }
      })

      return childItem
    },
    getCurrentSideList(name = '工作平台') {
      // 接口返回
      const systemList = this.getSystem(name, this.list)
      // 系统固定
      const constSystemList = this.getSystem(name, this.constList)

      // 设置菜单列表
      this.setSideList(this.filterSideList(systemList, constSystemList))
    },
    logout() {
      window.sessionStorage.clear()
      // 主动退出登录，不做页面还原
      this.$router.replace('/login')
    },
  },
}
</script>

<style lang="stylus">
@import "../../assets/stylus/var.styl"
@import "../../assets/stylus/color.styl"

.topbar
  padding-left: 49px
  vertical-align: baseline
  height: 50px
  line-height: 50px
  width: 100%
  position: fixed
  top: 0
  left: 0
  right: 0
  z-index: 8
  background-color: #fff
  border-bottom: 1px solid $border-color
  transition: all 0.3s
  min-width: $min-width
  // -webkit-box-shadow: 0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0, 0, 0, .2),0 1px 8px 0 rgba(0, 0, 0, .12)
  // box-shadow: 0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0, 0, 0, .2),0 1px 8px 0 rgba(0, 0, 0, .12)
  &.topbar-expand
    padding-left: 214px
    .topbar-menu
      i.iconfont::before
        display inline-block
        transform rotateZ(180deg)
  & > div
    height: inherit
    line-height: inherit

  .topbar-menu
    padding: 0 13px
    margin-right -1px
    cursor: pointer
    transition: all 0.3s
    font-size 0
    i.iconfont::before
      display inline-block
      font-size 24px
      color $text-color
      transition all 0.3s
    &:hover
      fill: $color-blue
      svg.icon
        fill: $color-blue

  .topbar-left
    float: left
    font-size: 14px
    margin-left: 20px
    .topbar-tab
      line-height: 47px
      float: left
      margin: 0 16px
      padding: 1px 16px 0 16px
      color: $text-color
      border-bottom: 2px solid transparent
      text-rendering: optimizeLegibility
      cursor: pointer
      transition: color 0.3s linear
      &.active,
      &:hover
        color: $color-blue
        border-bottom: 2px solid $color-blue

  .topbar-right
    float: right
    color: $text-color
    font-size: 14px
    .topbar-block
      height: 49px
      line-height: 49px
      letter-spacing: 1px
      padding: 0 16px
      text-align: center
      float: right
      margin-right: -1px
      // border-right: 1px solid $border-color
      transition: all 0.3s
      cursor pointer
      position: relative
      &:hover
        color $color-blue
        background-color #f5f5f5
        .topbar-message-count
          background-color $color-blue
        .topbar-dropdown
          visibility: visible
          opacity: 1
      .icon-remind1::before
        display inline-block
        animation ring 0.3s infinite
      .topbar-message-count
        padding 2px 5px
        border-radius 4px
        background-color $text-color
        color #fff
        margin-left 4px
      .topbar-dropdown
        position: absolute
        right: 1px
        top: 49px
        z-index: 1
        padding-top: 1px
        visibility: hidden
        opacity: 0
        line-height: 1.5
        color: #333
        font-size 12px
        text-align left
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2)
        transition opacity 0.15s, visibility 0s
        cursor: default
        .topbar-dropdown-action
          height 50px
          line-height 50px
          background-color #fff
          text-align center
          border-color #e5e7ea
          &:hover
            background-color #f5f5f5
          a
            display block
            height 100%
        .topbar-user-list
          padding: 16px 15px
          width: 270px
          background-color: #fff

          & > a
            display: block
            width: 80px
            height: 80px
            float: left
            text-align center
            cursor: pointer
            &:hover
              background-color: #f5f5f5
            i.iconfont
              color $text-color
              font-size 20px
              width 40px
              height 40px
              line-height 40px
              display block
              margin 8px auto 4px
            span
              text-rendering optimizeLegibility
        .topbar-message
          width 300px
          .topbar-message-head
            text-align left
            height 50px
            line-height 50px
            background-color #f5f5f5
            padding 0 16px
            .right
              color $color-blue
          .topbar-message-list
            background-color #fff
            li
              height 60px
              border-bottom 1px solid $border-color
              transition background-color 0.3s
              &:hover
                background-color #f5f5f5
              a
                display block
                height 100%
                padding 10px
                color #666
                .text-main
                  color $color-blue
        .topbar-dropdown-list
          background-color #fff
          padding 8px 0
          min-width 140px 
          li
            height 40px
            line-height 40px
            padding 0 10px
            transition background-color 0.3s
            &:hover
              color $color-blue
              background-color #f5f5f5
            a
              height 100%
              width 100%
              display block
              text-rendering optimizeLegibility

.topbar-overlay
  position: absolute
  left: 0
  right: 0
  top: 0
  bottom: 0
  background-color: transparent
  z-index: 11

@keyframes ring
  0%
    transform rotateZ(4deg)
  100%
    transform rotateZ(-4deg)
</style>