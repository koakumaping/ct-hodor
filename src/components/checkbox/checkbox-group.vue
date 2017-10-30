<template>
  <div class="ct-checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
import emitter from '../../mixins/emitter'

export default {
  name: 'ctCheckboxGroup',
  mixins: [emitter],
  props: {
    value: {
      type: [Array, String, Number],
    },
  },
  data() {
    return {
      currentValue: '',
    }
  },
  watch: {
    value(val) {
      this.setCurrentValue(val)
    },
  },
  methods: {
    setCurrentValue(value) {
      if (value === this.currentValue) return
      this.currentValue = value
      this.$emit('input', this.currentValue)
      this.$emit('on-change', this.currentValue)
      this.dispatch('ctFormLine', 'ct.form.change', this.currentValue)
    },
  },
}
</script>
