<template>
  <div class="table-warp">
    <div class="table-header" v-if="title">{{title}}</div>
    <slot name="header"></slot>
    <table :style="{ width: width }">
      <colgroup>
        <col style="width: 20px;" v-show="selection"></col>
        <col v-for="thead in theadList" :key="thead.id" :style="{width: thead.width || 'auto'}"></col>
      </colgroup>
      <thead>
        <tr>
          <th v-show="selection">
            <ctCheckbox v-model="selectAll" v-on:on-change="changeSelection"></ctCheckbox>
          </th>
          <th v-for="thead in theadList" :key="thead.id" :title="thead.name" class="hidden">{{thead.name}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in list" :key="index" :class="pointerCls">
          <td v-show="selection">
            <ctCheckbox v-model="list[index].checked" v-on:on-change="changeSelection"></ctCheckbox>
          </td>
          <slot scope="props" :row="row" :index="index"></slot>
        </tr>
      </tbody>
    </table>
    <section class="table-hidden" v-if="list.length === 0">
      <div v-if="!$slots.empty">暂无数据</div>
      <div v-else>
        <slot name="empty"></slot>
      </div>
    </section>
    <slot name="footer"></slot>
    <ct-loading v-show="loading"></ct-loading>
  </div>
</template>

<script>
export default {
  name: 'ctTables',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    theadList: {
      type: Array,
      default: () => [],
    },
    width: {
      type: String,
      default: '',
    },
    title: {
      type: [String, Number],
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    selection: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    pointerCls() {
      return this.selection ? '' : ''
    },
  },
  data() {
    return {
      selectAll: false,
    }
  },
  watch: {
    selectAll(val) {
      for (let i = 0, l = this.list.length; i < l; ++i) {
        this.$set(this.list[i], 'checked', val)
      }
    },
  },
  methods: {
    changeSelection() {
      this.$emit('on-change', this.list)
    },
    clickRow(index) {
      console.log(this.list[index].checked)
      this.$set(this.list[index], 'checked', !this.list[index].checked)
    },
  },
}
</script>