<template>
  <div class="ct-table"
    :class="{
      'ct-table-stripe': stripe,
      'ct-table-border': border || isGroup,
      'ct-table-group': isGroup,
    }"
  >
    <!-- 容纳 table 内容 -->
    <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>

    <!-- 表格头部, 非固定列 -->
    <div class="ct-table-header-warp" v-if="showHeader" ref="headerWrapper">
      <ctTableHeader
        :store="store"
        :layout="layout"
        :style="{ width: layout.bodyWidth ? layout.bodyWidth + 'px' : '' }"
        :default-sort="defaultSort"
      ></ctTableHeader>
    </div>

    <!-- 表格主体, 非固定列 -->
    <div class="ct-table-body-warp" :style="[bodyHeight]" ref="bodyWrapper">
      <ctTableBody
        :store="store"
        :layout="layout"
        :style="{ width: bodyWidth }"
        :highlight="highlightCurrentRow"
        :stripe="stripe"
        :rowClassName="rowClassName"
        :rowStyle="rowStyle"
      ></ctTableBody>
      <section :style="{ width: bodyWidth }" class="ct-table-empty" v-if="(!data || data.length === 0) && !loading">
        <div class="ct-table-empty-text relative text-center">
          <slot name="empty">
            <div class="empty__img" />
            <div>{{ emptyText }}</div>
          </slot>
        </div>
      </section>
      <section :style="{ width: bodyWidth }"
        class="ct-table-loading"
        v-if="(!data || data.length === 0) && loading">
        <ct-loading style="display: block"></ct-loading>
      </section>
    </div>
    <!-- 表格底部 -->
    <div class="ct-table-footer-warp" ref="footerWrapper" v-if="showSummary" v-show="data && data.length > 0">
      <ctTableFooter
        :store="store"
        :layout="layout"
        :border="border"
        :sum-text="sumText"
        :summary-method="summaryMethod"
        :default-sort="defaultSort"
        :style="{ width: layout.bodyWidth ? layout.bodyWidth + 'px' : '' }">
      </ctTableFooter>
    </div>

    <!-- 左侧固定 -->
    <div class="ct-table-fixed"
      v-if="fixedColumns.length > 0"
      :style="[
        { width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' },
        fixedHeight
      ]"
    >
      <!-- 表格头部, 左侧固定 -->
      <div class="ct-table-fixed-header-warp" ref="fixedHeaderWrapper" v-if="showHeader">
        <ctTableHeader
          fixed="left"
          :store="store"
          :layout="layout"
          :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }"
          :default-sort="defaultSort"
        >
        </ctTableHeader>
      </div>
      <!-- 表格主体, 左侧固定 -->
      <div class="ct-table-fixed-body-warp" ref="fixedBodyWrapper"
        :style="[
          { top: layout.headerHeight + 'px' },
          fixedBodyHeight
        ]"
      >
        <ctTableBody
          :store="store"
          :layout="layout"
          fixed="left"
          :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }"
          :highlight="highlightCurrentRow"
          :stripe="stripe"
          :rowClassName="rowClassName"
          :rowStyle="rowStyle"
        ></ctTableBody>
      </div>
      <div class="ct-table-fixed-footer-warp" ref="fixedFooterWrapper" v-if="showSummary" v-show="data && data.length > 0">
        <ctTableFooter
          fixed="left"
          :border="border"
          :sum-text="sumText"
          :summary-method="summaryMethod"
          :store="store"
          :layout="layout"
          :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }"
        ></ctTableFooter>
      </div>
    </div>
    <!-- 左侧固定 end -->

    <!-- 右侧固定 -->
    <div class="ct-table-fixed-right" ref="rightFixedWrapper" v-if="rightFixedColumns.length > 0"
      :style="[
        { width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' },
        { right: layout.scrollY ? (border ? layout.gutterWidth : (layout.gutterWidth || 1)) + 'px' : '' },
        fixedHeight
      ]"
    >
      <!-- 表格头部, 右侧侧固定 -->
      <div class="ct-table-fixed-header-warp" ref="rightFixedHeaderWrapper" v-if="showHeader">
        <ctTableHeader
          fixed="right"
          :store="store"
          :layout="layout"
          :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' }"
          :default-sort="defaultSort"
        >
        </ctTableHeader>
      </div>
      <!-- 表格主体, 右侧侧固定 -->
      <div class="ct-table-fixed-body-warp"  ref="rightFixedBodyWrapper"
        :style="[
          { top: layout.headerHeight + 'px' },
          fixedBodyHeight
        ]"
      >
        <ctTableBody
          :store="store"
          :layout="layout"
          fixed="right"
          :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' }"
          :highlight="highlightCurrentRow"
          :stripe="stripe"
          :rowClassName="rowClassName"
          :rowStyle="rowStyle"
        ></ctTableBody>
      </div>
      <div class="ct-table-fixed-footer-warp" ref="rightFixedFooterWrapper" v-if="showSummary" v-show="data && data.length > 0">
        <ctTableFooter
          fixed="left"
          :border="border"
          :sum-text="sumText"
          :summary-method="summaryMethod"
          :store="store"
          :layout="layout"
          :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }"
        ></ctTableFooter>
      </div>
    </div>
    <!-- 右侧固定 end -->
    <!-- 修正右侧滚动条的宽度 -->
    <div class="ct-table-fixed-right-patch"
      v-if="rightFixedColumns.length > 0"
      :style="{ width: layout.scrollY ? layout.gutterWidth + 'px' : '0', height: layout.headerHeight + 'px' }">
    </div>
  </div>
</template>

<script>
import {
  debounce,
  throttle,
  addResizeListener,
  removeResizeListener,
} from 'ct-util'

import ctLoading from '../normal/ctLoading'

import TableStore from './store'
import ctTableHeader from './head'
import ctTableBody from './body'
import ctTableFooter from './footer'
import TableLayout from './layout'

const seed = 0

export default {
  name: 'ctTable',
  components: {
    ctTableHeader,
    ctTableBody,
    ctTableFooter,
    ctLoading,
  },
  props: {
    // 传入的列表数据
    data: {
      type: Array,
      default: () => [],
    },
    // 列的宽度是否自撑开
    fit: {
      type: Boolean,
      default: true,
    },
    // 是否显示表头
    showHeader: {
      type: Boolean,
      default: true,
    },
    // 是否显示统计
    showSummary: Boolean,
    sumText: String,
    summaryMethod: Function,
    defaultSort: {
      type: Object,
      default: function d() {
        return {
          prop: '',
          order: '',
        }
      },
    },
    emptyText: {
      default: '暂无数据',
    },
    rowKey: [String, Function],
    width: [String, Number],
    height: [String, Number],
    maxHeight: [String, Number],
    loading: Boolean,
    // 高亮显示当前行
    highlightCurrentRow: {
      type: Boolean,
      default: false,
    },
    // 斑马格，隔一行换一个背景色
    stripe: Boolean,
    // 边框,默认没有
    border: Boolean,
    // 禁止显示没有数据时的图片
    noEmptyPic: Boolean,
    // 行的class设置
    rowClassName: [String, Function],
    // 行的style设置
    rowStyle: [String, Function],
  },
  data() {
    // 用于表格的数据共享
    const store = new TableStore(this, {
      rowKey: this.rowKey,
    })
    // 表格的布局计算，共享
    const layout = new TableLayout({
      store,
      table: this,
      fit: this.fit,
      showHeader: this.showHeader,
    })

    return {
      store,
      layout,
      tableId: '',
      windowResizeListener: '',
      resizehandleEvent: null,
      $ready: false,
      // 是否拥有多级表头
      isGroup: false,
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.store.commit('setData', val)
        if (this.$ready) this.doLayout()
      },
    },
  },
  created() {
    this.tableId = `ct-table-${seed}-`
    this.debounceLayout()
  },
  mounted() {
    this.$ready = true
    this.bindEvents()
  },
  computed: {
    bodyWrapper() {
      return this.$refs.bodyWrapper
    },
    fixedColumns() {
      return this.store.states.fixedColumns
    },
    rightFixedColumns() {
      return this.store.states.rightFixedColumns
    },
    shouldUpdateHeight() {
      return typeof this.height === 'number' ||
        this.fixedColumns.length > 0 ||
        this.rightFixedColumns.length > 0
    },
    fixedHeight() {
      let style = {}
      if (this.maxHeight) {
        style = {
          bottom: (this.layout.scrollX && this.data.length) ? `${this.layout.gutterWidth}px` : '',
        }
      } else {
        style = {
          height: this.layout.viewportHeight ? `${this.layout.viewportHeight}px` : '',
        }
      }
      return style
    },
    bodyHeight() {
      let style = {}
      if (this.height) {
        style = {
          height: this.layout.bodyHeight ? this.layout.bodyHeight + 'px' : '',
        }
      } else if (this.maxHeight) {
        style = {
          'max-height': (this.showHeader
            ? this.maxHeight - this.layout.headerHeight - this.layout.footerHeight
            : this.maxHeight - this.layout.footerHeight) + 'px',
        }
      }
      return style
    },
    fixedBodyHeight() {
      let style = {}
      if (this.height) {
        style = {
          height: this.layout.fixedBodyHeight ? this.layout.fixedBodyHeight + 'px' : '',
        }
      } else if (this.maxHeight) {
        let maxHeight = this.layout.scrollX ?
          this.maxHeight - this.layout.gutterWidth : this.maxHeight
        if (this.showHeader) {
          maxHeight -= this.layout.headerHeight
        }
        style = {
          'max-height': maxHeight + 'px',
        }
      }
      return style
    },

    bodyWidth() {
      const { bodyWidth, scrollY, gutterWidth } = this.layout
      return bodyWidth ? `${bodyWidth - (scrollY ? gutterWidth : 0)}px` : ''
    },
    columns() {
      return this.store.states.columns
    },
  },
  methods: {
    toggleRowSelection(row, selected) {
      this.store.toggleRowSelection(row, selected)
      this.store.updateAllSelected()
      this.doLayout()
    },
    bindEvents() {
      const { headerWrapper, bodyWrapper, footerWrapper } = this.$refs
      const refs = this.$refs

      // 监听bodyWrapper的滚动，对其他wrapper进行操作
      bodyWrapper.addEventListener('scroll', function sc(event) {
        if (headerWrapper) headerWrapper.scrollLeft = this.scrollLeft
        if (footerWrapper) footerWrapper.scrollLeft = this.scrollLeft
        if (refs.fixedBodyWrapper) refs.fixedBodyWrapper.scrollTop = this.scrollTop
        if (refs.rightFixedBodyWrapper) refs.rightFixedBodyWrapper.scrollTop = this.scrollTop
      })

      this.resizeHandleEvent = throttle(() => {
        this.doLayout()
      }, 10)

      addResizeListener(this.$el, this.resizeHandleEvent)
    },
    doLayout() {
      this.store.updateColumns()
      this.store.updateSelection()
      this.layout.update()
      this.layout.updateScrollY()
      this.$nextTick(() => {
        if (this.height) {
          this.layout.setHeight(this.height)
        } else if (this.maxHeight) {
          this.layout.setMaxHeight(this.maxHeight)
        } else if (this.shouldUpdateHeight) {
          this.layout.updateHeight()
        }
        if (this.$el) {
          this.isHidden = this.$el.clientWidth === 0
        }
      })
    },
    debounceLayout() {
      debounce(() => {
        this.doLayout()
      }, 50)()
    },
  },
  beforeDestroy() {
    if (this.resizeHandleEvent) {
      removeResizeListener(this.$el, this.resizeHandleEvent)
    }
  },
}
</script>

<style lang="stylus">
@import './table'
</style>