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
