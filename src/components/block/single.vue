<template>
  <div class="ct-single-block clear" :class="{ 'is-readonly': isReadonly }">
    <span v-if="data.length > 0">
      <div
        class="ct-single-block__item left"
        v-for="item in data"
        :key="item.key"
      >
        <ct-button
          v-if="!isReadonly"
          :type="item.value === currentValue ? 'primary' : ''"
          @click="handleClick(item.value, item)"
          :data-value="item.value"
          :readonly="isReadonly"
        >{{item.label}}</ct-button>
        <span
          class="text-only"
          v-if="isReadonly && item.value === currentValue"
          type="text"
        >
          {{item.label}}
        </span>
      </div>
    </span>
    <span v-else>{{ isReadonly ? '--' : '无数据' }}</span>
  </div>
</template>

<script>
import Emitter from '../../mixins/emitter'
import formChild from '../../mixins/form-child'

export default {
  name: 'SingleBlock',
  mixins: [Emitter, formChild],
  props: {
    span: {
      type: String,
      default: '8',
    },
    data: {
      type: Array,
      default: function d() { return [] },
    },
    value: [String, Number, Array],
    clearable: Boolean,
  },
  computed: {
    cls() {
      return [`ct-${this.span}`]
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.currentValue = val
        this.$emit('input', val)
      },
    },
    currentValue(val) {
      this.$emit('input', val)
      this.$emit('change', val)
      this.dispatch('ctFormLine', 'ct.form.change', this.currentValue)
    },
  },
  data() {
    return {
      currentValue: '',
    }
  },
  methods: {
    handleClick(payload, item) {
      if (this.isReadonly) return false
      if ((this.currentValue === item.value) && !this.clearable) return false
      if (this.currentValue && this.currentValue === payload) {
        this.currentValue = ''
      } else {
        this.currentValue = payload
      }
      this.$emit('click', item)
    },
  },
}
</script>

<style lang="stylus">
.ct-single-block
  font-size: 0
  &.is-readonly
    .ct-single-block__item
      padding: 0
      height: 32px
      line-height: 32px
  .ct-single-block__item
    padding-right: 8px
    padding-bottom: 8px
    .text-only
      font-size: 14px
.form .section .ct-single-block__item
  padding-bottom: 0
</style>
