<template>
  <div class="ct-multi-block clear" :class="{ 'is-readonly': isReadonly }">
    <div
      class="ct-multi-block__item left"
      :class="cls"
      v-for="item in data"
      :key="item.key"
    >
      <ct-button
        v-if="!isReadonly"
        :type="currentValue.indexOf(item.value) > -1 ? 'primary' : ''"
        :readonly="isReadonly || item.disabled"
        @click="set(item)"
        :data-value="item.value"
      >{{item.label}}</ct-button>
      <span
        class="text-only"
        v-if="isReadonly && currentValue.indexOf(item.value) > -1"
        type="text"
      >
        {{item.label}}
      </span>
    </div>
  </div>
</template>

<script>
import Emitter from '../../mixins/emitter'
import formChild from '../../mixins/form-child'

export default {
  name: 'MultiBlock',
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
    value: {
      type: Array,
      default: function d() { return [] },
    },
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
        this.currentValue = this._.isArray(val) ? val : []
        this.$emit('input', this.currentValue)
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
      currentValue: [],
    }
  },
  methods: {
    set(payload) {
      const currentValue = this.currentValue
      const index = currentValue.indexOf(payload.value)
      if (index > -1) {
        currentValue.splice(index, 1)
      } else {
        currentValue.push(payload.value)
      }
    },
  },
}
</script>

<style lang="stylus">
.ct-multi-block
  margin-right: -8px
  &.is-readonly
    .ct-multi-block__item
      width: auto
  .ct-multi-block__item
    padding-right: 8px
    padding-bottom: 8px
    .ct-button
      width: 100%
    .text-only
      font-size: 14px
</style>
