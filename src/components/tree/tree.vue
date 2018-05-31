<template>
  <div class="ct-tree">
    <ul class="ct-tree-children"
      v-for="item in data" :key="item.id"
    >
      <treeNode
        class="item"
        :model="item"
        :singleSelection="singleSelection"
      >
      </treeNode>
    </ul>
  </div>
</template>

<script>
import { isNumber, clone, isArray, hasOwn } from 'ct-util'
import Emitter from '../../mixins/emitter'
import treeNode from './tree-node'

export default {
  name: 'Tree',
  components: {
    treeNode,
  },
  mixins: [Emitter],
  props: {
    data: {
      type: [Array],
      default: () => [],
    },
    dot: {
      type: String,
      default: '-',
    },
    level: {
      type: Number,
      default: 0,
    },
    singleSelection: Boolean,
  },
  mounted() {
    this.$on('checked', (payload) => {
      this.updateData(false)
      this.initMap()
    })

    this.$on('on-checked', (payload) => {
      // this.doEmit()
      const cancelOtherChecked = (list = []) => {
        for (let i = 0, l = list.length; i < l; ++i) {
          const item = list[i]

          if (item.id === payload.id) {
            // item.checked = true
            console.log(item.id, payload.id)
          } else {
            item.checked = false
          }

          if (hasOwn(item, 'children') && item.children.length > 0) {
            cancelOtherChecked(item.children)
          }
        }
      }

      if (this.singleSelection) cancelOtherChecked(this.data)
      this.$emit('on-node-check', payload)
    })
  },
  data() {
    return {
      checkedList: [],
      datas: new Map(),
    }
  },
  watch: {
    // 初始化时复原数据用，半选中框的显示（indeterminate）
    data: {
      deep: true,
      handler() {
        console.log('tree data change')
        this.$nextTick(() => {
          this.updateData()
          this.initMap()
          this.broadcast('treeNode', 'indeterminate')
          // 初始化数据完成后触发一次回调,更新下选中的列表
          this.doEmit()
        })
      },
    },
  },
  methods: {
    doEmit() {
      this.$emit('on-check-change', this.getCheckedNodes())
      this.$emit('on-list-change', this.getCheckedList(this.getCheckedNodes()))
    },
    getCheckedNodes() {
      const nodes = this.findComponentsDownward(this, 'treeNode')
      return nodes.filter(node => node.model.checked).map(node => node.model)
    },
    updateData(isInit = true) {
      // init checked status

      // 如果children的checked都是true，置parent.checked为true
      function reverseChecked(data) {
        if (isArray(data.children) && data.children.length > 0) {
          let checkedLength = 0
          data.children.forEach(node => {
            if (node.children) node = reverseChecked(node)
            if (node.checked) checkedLength++
          })
          if (isInit) {
            if (checkedLength >= data.children.length) data.checked = true
          } else {
            data.checked = checkedLength >= data.children.length
          }
          return data
        }
        return data
      }

      // 如果parent.checked为true，选中所有子元素
      function forwardChecked(data) {
        if (isArray(data.children) && data.children.length > 0) {
          data.children.forEach(node => {
            if (data.checked) node.checked = true
            if (node.children) node = forwardChecked(node)
          })
          return data
        }
        return data
      }

      this.data.map(node => reverseChecked(node)).map(node => forwardChecked(node))
      // 更新半选中状态
      this.broadcast('treeNode', 'indeterminate')
    },
    getCheckedList(list = this.getCheckedNodes()) {
      // console.log('checked list', list)
      const self = this
      this.checkedList = []
      if (list.length <= 0) {
        // console.log('checked list is', list.length)
        return this.checkedList
      }

      // TODO 修正只有一个children的选择问题

      function removeChildren(code) {
        for (let i = list.length - 1; i >= 0; i--) {
          if (list[i].id === code) {
            list.splice(i, 1)
          }
        }
      }

      function filterChildren(data) {
        if (isArray(data.children) && data.children.length > 0) {
          let checkedLength = 0
          data.children.forEach(node => {
            if (node.children) node = filterChildren(node)
            if (node.checked) checkedLength++
          })
          if (checkedLength >= data.children.length) {
            console.log('all children checked')
            for (let i = 0; i < data.children.length; ++i) {
              console.log(data.children[i].id)
              if (!self.singleSelection) removeChildren(data.children[i].id)
            }
          }
          return data
        }
        return data
      }

      for (let i = 0; i < list.length; ++i) {
        filterChildren(list[i])
      }

      const results = []
      for (let i = 0; i < list.length; ++i) {
        this.getNodeItem(list[i].id)

        let filterCheckedItem = {}
        if (this.level) {
          this.checkedList.forEach((child) => {
            if (child.level === this.level) filterCheckedItem = clone(child)
          })
        }
        results.push(this.level ? filterCheckedItem : this.checkedList.toString().replace(/,/g, this.dot))
        this.checkedList = []
      }

      return results
    },
    getNodeItem(id) {
      const checkedItem = this.getNode(id)
      // console.log(id, checkedItem)

      if (checkedItem.parentId) {
        this.getNodeItem(checkedItem.parentId)
      }
      this.checkedList.push(this.level ? checkedItem : checkedItem.name)
    },
    getNode(key) {
      return this.datas.get(key)
    },
    initMap() {
      const datas = new Map()
      const _traverseNodes = (root = [], level = 0, parentId = '') => {
        level++
        for (let i = 0; i < root.length; ++i) {
          const node = root[i]
          node.id = isNumber(node.id) ? Number(node.id) : node.id
          node.level = level
          node.parentId = parentId
          datas.set(node.id, node)
          if (node.children && node.children.length > 0) {
            _traverseNodes(node.children, level, node.id)
          }
        }
      }
      _traverseNodes(this.data)
      this.datas = datas
    },
  },
}
</script>

<style lang="stylus">
.ct-tree
  line-height 1.5
  ul
    list-style none
    margin 0
    padding 0
    font-size 12px
    li ul
      padding-left 18px
      .item
        margin-bottom 4px
  
  .ct-tree-folder
    margin-bottom 4px
    & > .ct-tree-arrow
      opacity 1
      cursor pointer
  .ct-tree-arrow
    display inline-block
    height 16px
    width 14px
    opacity 0
    vertical-align text-top
    cursor default
    background-image url(../../assets/img/select-arrow.png)
    background-position center center
    background-repeat no-repeat
    transform rotateZ(-90deg)
    transition all 0.3s
    &.ct-tree-arrow-expand
      transform rotateZ(0)
</style>
