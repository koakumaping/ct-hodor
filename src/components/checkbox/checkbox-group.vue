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
    value: Array,
    default: () => [],
  },
  watch: {
    value(val) {
      this.$emit('on-change', val)
      this.dispatch('ctFormLine', 'ct.form.change', val)
    },
  },
}
</script>
