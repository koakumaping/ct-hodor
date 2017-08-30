<template>
  <div class="login-warp">
    <ctForm v-show="!mobileVisible" labelWidth="0" ref="loginForm" :model="form" :rules="rules">
      <ctFormLine prop="username" class="login-section">
        <ctInput placeholder="请输入用户名"
          width="100%"
          v-model.trim="form.username"
          name="username"
        ></ctInput>
      </ctFormLine>
      <ctFormLine prop="password" class="login-section">
        <ctInput placeholder="请输入密码"
          width="100%"
          type="password"
          name="password"
          v-model.trim="form.password"
        ></ctInput>
      </ctFormLine>
      <ctFormLine class="login-captcha login-section" prop="captcha">
        <ctInput placeholder="请输入验证码"
          width="100%"
          v-model.trim="form.captcha"
          :maxlength="4"
          :enter="login"
        ></ctInput>
        <canvas ref="captcha" width="80" height="30" @click="getCaptcha"></canvas>
      </ctFormLine>
      <ctFormLine class="login-actions">
        <ctButton type="primary" @click="login" :loading="loading">{{loginBtnText}}</ctButton>
        <ctButton
          v-if="type === 'dialog'"
          style="margin-top: 16px"
          v-on:click="returnToLoginPage"
        >返回登录页</ctButton>
      </ctFormLine>
      <div class="clear" style="margin-top: 16px;">
        <!-- <ctCheckbox class="left">记住密码</ctCheckbox> -->
        <span class="right pointer">忘记密码</span>
      </div>
    </ctForm>

    <ctForm v-show="mobileVisible" labelWidth="0" ref="mobileForm" :model="mobileForm" :rules="mobileRules">
      <div class="login-mobile text-left">
        {{mobileContent}}
      </div>
      <ctFormLine class="login-section" prop="code">
        <ctInput placeholder="请输入手机验证码"
          width="100%"
          v-model.trim="mobileForm.code"
          :maxlength="4"
          autofocus
          :enter="mobileLogin"
        ></ctInput>
      </ctFormLine>
      <ctFormLine class="login-actions">
        <ctButton
          type="primary"
          v-on:click="mobileLogin()"
          :loading="mobileLoading"
        >提交</ctButton>
        <ctButton
          style="margin-top: 16px"
          v-on:click="goLogin"
        >返回登录界面</ctButton>
      </ctFormLine>
    </ctForm>
  </div>
</template>

<script>
import captcha from './captcha'

export default {
  name: 'loginForm',
  props: {
    type: {
      default: 'page',
      validator: value => ['page', 'dialog'].indexOf(value) > -1,
    },
  },
  data() {
    const validateCaptcha = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value !== this.cc) {
        this.getCaptcha()
        callback(new Error('验证码不正确，请重新输入新生成的验证码!'))
      } else {
        callback()
      }
    }
    return {
      loginBtnText: '登录',
      loading: false,
      mobileVisible: false,
      mobileLoading: false,
      mobileContent: '本次登陆需要手机二次验证',
      form: {
        username: '',
        password: '',
        captcha: '',
      },
      mobileForm: {
        code: '',
      },
      // 要存的用户数据
      user: {
        // 短信认证时用
        id: this.$cookie.get('id'),
        // 短信认证成功后得到
        // 没有后要重新发送短信获取
        masterKey: this.$cookie.get('masterKey'),
      },
      // 浏览器关闭后消失，存sessionStorage里
      // 登录成功后得到
      token: '',
      to: this.$route.query.from || 'index',
      rules: {
        username: { required: true, message: '请输入用户名', trigger: 'blur' },
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' },
        ],
        captcha: { validator: validateCaptcha, trigger: 'blur' },
      },
      mobileRules: {
        code: { required: true, message: '请输入手机验证码', trigger: 'blur' },
      },
    }
  },
  mounted() {
    window.localStorage.clear()
    this.getCaptcha()
  },
  methods: {
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
      this.$cookie.remove('CheckCode')
    },
    goIndex() {
      this.setCookies()
      window.sessionStorage.setItem('token', this.token)
      // 如果是弹窗打开，则不做跳转
      if (this.type === 'dialog') {
        this.$store.commit('SET_NEED_LOGIN', false)
        this.$emit('on-success', false)
        return false
      }
      this.$notice.success({
        title: '登录成功',
        content: '欢迎',
      })
      this.$router.push({ name: this.to })
    },
    goLogin() {
      this.$refs.mobileForm.resetFields()
      this.code = ''
      this.form.password = ''
      this.form.captcha = ''
      this.mobileForm.code = ''
      this.loginBtnText = '登录'
      this.getCaptcha()
      this.loading = false
      this.mobileVisible = false
    },
    returnToLoginPage() {
      window.sessionStorage.clear()
      this.$router.go({ name: 'login' })
    },
    getCaptcha() {
      this.cc = captcha(this.$refs.captcha)
    },
    setLoginBtnText() {
      this.loginBtnText = '重试'
    },
    login() {
      if (this.loading) return
      let canLogin = false
      this.loading = true
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          canLogin = true
          this.$notice.info({
            title: '验证通过',
            content: '正在登录，请稍后',
            closeTime: 1000,
          })
        } else {
          this.$notice.error({
            title: '提交失败',
            content: '请检查填写的数据',
          })
          this.loading = false
          this.setLoginBtnText()
        }
      })

      if (!canLogin) return
      const formdata = {
        logname: this.form.username,
        psd: this.form.password,
        verificationcode: this.form.captcha,
        ctaatoken: this.user.masterKey || '',
      }

      this.$cookie.set('CheckCode', this.form.captcha)

      const successCallback = (response) => {
        this.token = response.data
        this.goIndex()
      }

      const failCallback = (response) => {
        if (response.errcode === 6) {
          this.mobileVisible = true
          this.mobileContent = response.err
          this.user.id = response.data
          this.$notice.warn({
            title: '提示',
            content: '请注意查收短信',
            closeTime: 5000,
          })
        }
        this.setLoginBtnText()
      }

      const finalCallback = () => {
        if (this.mobileVisible) return false
        window.setTimeout(() => {
          this.loading = false
        }, 1000)
      }

      this.$request('login', { data: formdata },
        successCallback, failCallback, finalCallback)
    },
    mobileLogin() {
      if (this.mobileLoading) return
      let canLogin = false
      this.mobileLoading = true
      this.$refs.mobileForm.validate((valid) => {
        if (valid) {
          canLogin = true
          this.$notice.info({
            title: '验证通过',
            content: '正在登录，请稍后',
            closeTime: 1000,
          })
        } else {
          this.$notice.error({
            title: '提交失败',
            content: '请检查填写的数据',
          })
          this.mobileLoading = false
        }
      })

      if (!canLogin) return
      const formdata = {
        userid: this.user.id,
        verificationcode: this.mobileForm.code,
      }

      const successCallback = (response) => {
        // accesstoken放入请求的Headers["Access-Token"]属性里
        this.user.masterKey = response.data.accesstoken
        // token作为url中的appKey
        this.token = response.data.token
        this.goIndex()
      }

      const failCallback = (response) => {}

      const finalCallback = () => {
        this.mobileLoading = false
      }

      this.$request('smsAccess', { data: formdata },
        successCallback, failCallback, finalCallback)
    },
  },
}
</script>

<style lang="stylus">
.ct-dialog-content .login-warp
  padding: 0
  box-shadow: none
.login-warp
  padding: 16px 16px
  background-color: #fff
  margin: 0 auto
  text-align: center
  // border-radius: 4px
  box-shadow: 0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0, 0, 0, .2),0 1px 8px 0 rgba(0, 0, 0, .12)

  .login-section
    margin-bottom: 16px

  .login-captcha
    canvas
      position: absolute
      right: 2px
      top: 3px
      user-select: none
      cursor: pointer
    .ct-input > input
      padding-right: 96px
  .login-actions
    text-align: right
    .ct-button
      width: 100%
      padding: 10px 0
      font-size: 14px

  .login-header
    width: 100%;
    height: 96px;
    margin-left: auto
    margin-right: auto
    margin-bottom: 20px
    overflow hidden
    img
      width: 100%

  .ct-input > input,
  .login-input
    height: 36px
    width: 100%
    direction: ltr
    font-size: 14px
    border-radius: 4px

  .login-find
    padding-top: 10px
  
  .login-mobile
    font-size: 14px
    margin-bottom: 8px

</style>
