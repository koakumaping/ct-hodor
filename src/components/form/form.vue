<template>
  <form class="form">
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: 'ctForm',
  props: {
    labelWidth: {
      type: String,
      default: '8em',
    },
    labelPosition: {
      type: String,
      default: 'right',
    },
    // 是否显示分号，默认显示
    semicolon: {
      type: Boolean,
      default: true,
    },
    model: Object,
    rules: Object,
    showMessage: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    rules() {
      this.validate()
    },
  },
  data() {
    return {
      fields: [],
    }
  },
  created() {
    // 监听增加验证规则
    this.$on('ct.form.addField', (field) => {
      if (field) {
        this.fields.push(field)
      }
    })
    // 监听移除验证规则
    this.$on('ct.form.removeField', (field) => {
      if (field.prop) {
        this.fields.splice(this.fields.indexOf(field), 1)
      }
    })
  },
  methods: {
    resetFields() {
      if (!this.model) {
        if (process.env.NODE_ENV !== 'production') console.warn('[Form]model is required for resetFields to work.')
        return
      }
      this.fields.forEach(field => {
        field.resetField()
      })
    },
    validate(callback) {
      if (!this.model) {
        console.warn('[Form]model is required for validate to work!')
        return
      }
      let valid = true
      let count = 0
      // 如果需要验证的fields为空，调用验证时立刻返回callback
      if (this.fields.length === 0 && callback) {
        callback(true)
      }
      this.fields.forEach((field, index) => {
        field.validate('', errors => {
          if (errors) {
            valid = false
          }
          if (typeof callback === 'function' && ++count === this.fields.length) {
            callback(valid)
          }
        })
      })
    },
    validateField(prop, cb) {
      const field = this.fields.filter((_field) => _field.prop === prop)[0]
      if (!field) {
        throw new Error('must call validateField with valid prop string!')
      }
      field.validate('', cb)
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/color'

.form
  display: block
  border-radius: 4px
  font-size: 12px
  color: #000
  .form-title
    height 28px
    line-height 28px
    margin-bottom 8px
    font-size 0
    .title
      font-size 12px
      display inline-block
      // padding-right: 12px
      min-width: 6em
      margin-right 12px
      &.active
        color: $color-main
        border-bottom 1px solid $color-main
    .btn
      margin-right 8px
  &.form-group
    padding: 8px
    & > section
      padding: 8px
      border: 1px solid #ccc
      border-radius: 1px
  .section
    margin-bottom 12px
    transition: all 0.3s
    font-size: 14px
    &.is-required > label::before
      content: "*"
      color: $color-red
      margin-right: 4px
    & > label
      display block
      padding: 5px 0
      position: relative
      & > .text-red
        position: absolute
        right: 4px
        top: 0
    & > .form-content
      display block
      line-height: 32px
      position: relative
      .ct-form-content-error
        font-size: 12px
        color: $color-red
        line-height: 1
        margin-top: 3px
        position: absolute
        top: 100%
        left: 0
    // TODO del
    // & > label + .form-content
    //   margin-left: 6em
.form-action
  margin: 0 auto
  padding: 8px 0
  font-size: 0
  .btn
    margin-right: 8px
    &:last-child
      margin-right: 0

// 错误提示
.form section.is-error
  margin-bottom: 20px
  .form-content
    > .ct-input > input,
    > .ct-input > textarea,
    > .ct-date-picker > .ct-date-picker-input > .ct-input > input,
    > .ct-select > .ct-select-name
      border-color: $color-red
    > .ct-date-picker > .ct-date-picker-input > .ct-input::before
      cursor pointer!important
</style>
