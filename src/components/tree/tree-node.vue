<template>
  <li>
    <div
      :class="{ 'ct-tree-folder': isFolder}"
    >
      <span
        v-if="isFolder"
        @click="toggle"
        class="ct-tree-arrow" :class="arrowCls"></span>
      <ctCheckbox
        v-if="showCheckbox && !catalog"
        :value="model.checked"
        :indeterminate="indeterminate"
        @click.native.prevent="handleCheck"
        :aria-readonly="readonly"
        :readonly="readonly"
      >{{model.name}}</ctCheckbox>
      <span v-if="!showCheckbox && !catalog" @click="toggle" class="pointer">{{model.name}}</span>
      <span v-if="catalog" @click="handleClick" class="pointer">{{model.name}}</span>
    </div>
    <transition
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:after-enter="afterEnter"
      v-on:before-leave="beforeLeave"
      v-on:leave="leave"
      v-on:after-leave="afterLeave"
    >
      <ul v-show="open" v-if="isFolder">
        <tree-node
          class="item"
          v-for="model in model.children"
          :key="model.id"
          :model="model"
          :singleSelection="singleSelection"
          :catalog="catalog"
        />
      </ul>
    </transition>
  </li>
</template>

<script>
import { clone } from 'ct-util'
import ct from '../../mixins/collapse-transition'
import Emitter from '../../mixins/emitter'

export default {
  name: 'treeNode',
  mixins: [Emitter, ct],
  props: {
    model: {
      type: Object,
      default: () => {},
    },
    singleSelection: Boolean,
    catalog: Boolean,
  },
  data() {
    return {
      readonly: false,
      // 禁止状态不显示Checkbox
      disabled: false,
      open: false,
      // children 中是否有选中的
      indeterminate: false,
    }
  },
  computed: {
    isFolder() {
      return this.model.children && this.model.children.length
    },
    arrowCls() {
      return [{ 'ct-tree-arrow-expand': this.open }]
    },
    showCheckbox() {
      let flag = true
      if (this.disabled) flag = false
      if (this.singleSelection && this.isFolder) flag = false
      return flag
    },
  },
  created() {
    // created tree-node.vue first, mounted tree.vue second
    if (!this.model.checked) this.$set(this.model, 'checked', false)
    if (this.model.open) this.open = this.model.open
    if (this.model.readonly) this.readonly = this.model.readonly
    if (this.model.disabled) this.disabled = this.model.disabled
  },
  mounted() {
    this.$on('indeterminate', () => {
      this.broadcast('treeNode', 'indeterminate')
      this.setIndeterminate()
    })
  },
  methods: {
    handleClick() {
      this.dispatch('Tree', 'clicked', clone(this.model))
    },
    toggle() {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    handleCheck() {
      if (this.disabled) return
      const checked = !this.model.checked

      // 取消选择 或者 未选中状态下取消children中所有选中的，
      if (!checked || this.indeterminate) {
        this.findComponentsDownward(this, 'treeNode').forEach(node => {
          node.model.checked = false
        })
      } else {
        // 选中的同时，选中所有children
        this.findComponentsDownward(this, 'treeNode').forEach(node => {
          node.model.checked = true
        })
      }
      // console.log(checked)
      this.$set(this.model, 'checked', checked)
      this.dispatch('Tree', 'checked', clone(this.model))
      this.dispatch('Tree', 'on-checked', clone(this.model))
    },
    // 更新半选中状态
    setIndeterminate() {
      this.indeterminate = this.model.checked ? false : this.findComponentsDownward(this, 'treeNode').some(node => node.model.checked)
    },
  },
}
</script>
