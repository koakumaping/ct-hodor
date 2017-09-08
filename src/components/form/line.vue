<template>
  <section class="clear"
    :class="{
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-required': isRequired || required,
    }"
  >
    <label v-if="label" :style="labelStyle">
      {{getLabel}}
    </label>
    <div class="form-content clear" :style="contentStyle">
      <slot></slot>
      <div class="ct-form-content-error" v-if="validateState === 'error' && showMessage && form.showMessage">{{validateMessage}}</div>
    </div>
  </section>
</template>

<script>
import { isNumber } from 'ct-util'
import AsyncValidator from 'async-validator'
import Emitter from '../../mixins/emitter'

function getPropByPath(obj, path) {
  let tempObj = obj
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')
  const keyArr = path.split('.')
  let i = 0
  for (let len = keyArr.length; i < len - 1; ++i) {
    const key = keyArr[i]
    if (key in tempObj) {
      tempObj = tempObj[key]
    } else {
      throw new Error('please transfer a valid prop path to form item!')
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj[keyArr[i]],
  }
}

export default {
  name: 'ctFormLine',
  mixins: [Emitter],
  props: {
    label: {
      type: [String, Number],
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    prop: String,
    rules: [Object, Array],
    error: String,
    validateStatus: String,
    showMessage: {
      type: Boolean,
      default: true,
    },
    labelWidth: [String, Number],
    semicolon: Boolean,
  },
  data() {
    return {
      initialValue: '',
      validateState: '',
      validateMessage: '',
      validateDisabled: false,
      validator: {},
      isNested: false,
    }
  },
  watch: {
    error(value) {
      this.validateMessage = value
      this.validateState = value ? 'error' : ''
    },
    validateStatus(value) {
      this.validateState = value
    },
  },
  computed: {
    form() {
      let parent = this.$parent || this.$root
      let parentName = parent.$options.name
      // 直到找到ctForm为止，所以不能滥用
      while (parentName !== 'ctForm') {
        parent = parent.$parent || parent.$root
        parentName = parent.$options.name
      }

      return parent
    },
    getLabel() {
      if (this.form.semicolon) {
        return `${this.label}：`
      }
      if (this.semicolon === false) return this.label
      return this.label
    },
    labelStyle() {
      const ret = {}
      // 如果label位置为top，则返回空
      if (this.form.labelPosition !== 'top') {
        ret.float = 'left'
        ret.width = this.form.labelWidth
        if (isNumber(this.labelWidth) || this.labelWidth) ret.width = this.labelWidth
      }
      if (this.form.labelPosition === 'right') {
        ret.textAlign = 'right'
        ret.paddingRight = '12px'
      }
      return ret
    },
    contentStyle() {
      const ret = {}
      // 如果label位置为top，则返回空
      if (this.form.labelPosition !== 'top') {
        ret.marginLeft = this.form.labelWidth
      } else {
        ret.lineHeight = '1.5'
      }

      if (isNumber(this.labelWidth) || this.labelWidth) ret.marginLeft = this.labelWidth
      return ret
    },
    fieldValue: {
      cache: false,
      get() {
        const model = this.form.model
        if (!model || !this.prop) return
        let path = this.prop
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.')
        }
        return getPropByPath(model, path).v
      },
    },
    isRequired() {
      const rules = this.getRules()
      let isRequired = false
      if (rules && rules.length) {
        rules.every(rule => {
          if (rule.required) {
            isRequired = true
            return false
          }
          return true
        })
      }
      return isRequired
    },
  },
  mounted() {
    if (!this.prop) return false
    this.dispatch('ctForm', 'ct.form.addField', [this])
    let initialValue = this.fieldValue
    if (Array.isArray(initialValue)) {
      initialValue = [].concat(initialValue)
    }
    // Object.defineProperty(this, 'initialValue', {
    //   value: initialValue
    // })
    this.initialValue = initialValue

    const rules = this.getRules()
    if (rules.length === 0) return false

    this.$on('ct.form.blur', this.onFieldBlur)
    this.$on('ct.form.change', this.onFieldChange)
  },
  beforeDestroy() {
    this.dispatch('ctForm', 'ct.form.removeField', [this])
  },
  methods: {
    validate(trigger, callback = () => {}) {
      const rules = this.getFilteredRule(trigger)
      if (!rules || rules.length === 0) {
        callback()
        return true
      }
      this.validateState = 'validating'
      const descriptor = {}
      descriptor[this.prop] = rules
      const validator = new AsyncValidator(descriptor)
      const model = {}
      model[this.prop] = this.fieldValue
      validator.validate(model, { firstFields: true }, (errors, fields) => {
        this.validateState = !errors ? 'success' : 'error'
        this.validateMessage = errors ? errors[0].message : ''
        callback(this.validateMessage)
      })
    },
    resetField() {
      console.log('resetField')
      this.validateState = ''
      this.validateMessage = ''
      const model = this.form.model
      const value = this.fieldValue
      let path = this.prop
      console.log('path', this.prop)
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }
      const prop = getPropByPath(model, path)
      if (Array.isArray(value)) {
        this.validateDisabled = true
        prop.o[prop.k] = [].concat(this.initialValue)
      } else {
        this.validateDisabled = true
        prop.o[prop.k] = this.initialValue
      }
    },
    getRules() {
      let formRules = this.form.rules
      const selfRuels = this.rules
      formRules = formRules ? formRules[this.prop] : []
      return [].concat(selfRuels || formRules || [])
    },
    getFilteredRule(trigger) {
      const rules = this.getRules()
      return rules.filter((rule) => !rule.trigger || rule.trigger.indexOf(trigger) !== -1)
    },
    onFieldBlur() {
      this.validate('blur')
    },
    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false
        return
      }
      this.validate('change')
    },
  },
}
</script>
