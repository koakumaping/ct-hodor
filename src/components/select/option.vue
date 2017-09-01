<template>
  <li
    v-on:click="setCurrentValue(value)"
    :class="{ 'current': selected }"
  >{{label}}</li>
</template>

<script>
import { isArray } from 'ct-util'
import Emitter from '../../mixins/emitter'

export default {
  name: 'ctOption',
  mixins: [Emitter],
  props: {
    value: {
      type: [String, Number, Object],
      required: true,
    },
    label: {
      type: [String, Number],
    },
  },
  data() {
    return {
      selected: false,
    }
  },
  created() {
    this.$on('update-selected', this.updateSelect)
    this.addOption()
  },
  computed: {
    parent() {
      return this.findComponentUpward(this, 'ctSelect')
    },
  },
  methods: {
    addOption() {
      this.parent.optionList.push({
        label: this.label,
        value: this.value,
        selected: false,
      })
    },
    setCurrentValue() {
      // 通知select组件，该选项被点击了
      this.dispatch('ctSelect', 'selected', this.value)
      if (this.parent.multiple) return
      this.parent.hideList()
    },
    updateSelect(payload) {
      // console.log('updateSelect', payload)
      if (isArray(payload)) {
        // console.log('payload.indexOf(this.value)', payload.indexOf(this.value))
        if (payload.indexOf(this.value) > -1) {
          this.selected = true
        } else {
          this.selected = false
        }
      } else {
        if (payload === this.value) {
          this.selected = true
          const parent = this.parent

          // 值为空的时候渲染成emptyName, 用于某些要清空选择的清空下
          if (this.value === '') {
            parent.name = parent.emptyName ? parent.emptyName : this.label
          } else {
            parent.name = this.label
          }
        } else {
          this.selected = false
        }
      }
    },
    removeOption() {
      this.parent.optionList = this.parent.optionList.filter(
        (element) => element.value !== this.value)
      // 通知select组件，该选项被移除了
      this.dispatch('ctSelect', 'remove-option', this.value)
    },
  },
  beforeDestroy() {
    this.removeOption()
  },
}
</script>
