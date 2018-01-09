let seed = 0

// 不同类型下的默认数据
const defaults = {
  default: {},
  selection: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    className: 'ct-table-column--selection',
  },
  expand: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
  },
  index: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
  },
}

function getValueByPath(object, prop) {
  prop = prop || ''
  const paths = prop.split('.')
  let current = object
  let result = null
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i]
    if (!current) break

    if (i === j - 1) {
      result = current[path]
      break
    }
    current = current[path]
  }
  return result
}

function getDefaultColumn(type, options) {
  const column = {}

  // 合并默认数据
  Object.assign(column, defaults[type || 'default'])

  for (const name in options) {
    if (Object.hasOwnProperty.call(options, name)) {
      const value = options[name]
      if (typeof value !== 'undefined') {
        column[name] = value
      }
    }
  }

  if (!column.minWidth) {
    column.minWidth = 120
  }

  return column
}

const forced = {
  selection: {
    renderHeader: function renderHeader(h, { store }) {
      return <ctCheckbox
        value={ store.states.isAllSelected }
        on-input={ () => store.commit('toggleAllSelection') }
      ></ctCheckbox>
    },
    renderCell: function renderCell(h, { row, column, store, $index }) {
      return <ctCheckbox
          value={ store.isSelected(row) }
          disabled={ column.selectable ? !column.selectable.call(null, row, $index) : false }
          on-input={ () => store.commit('rowSelectedChanged', row) }
        ></ctCheckbox>
    },
    resizable: false,
  },
  index: {
    renderHeader: function renderHeader(h, { column }) {
      return column.label || '#'
    },
    renderCell: function renderCell(h, { $index }) {
      return <div>{ $index + 1 }</div>
    },
    resizable: false,
  },
}

/**
 * 默认的渲染单元格的方式
 * @param h createElement
 * @param options.row 行信息
 * @param options.column 列信息
 */
function DEFAULT_RENDER_CELL(h, { row, column }) {
  const property = column.property
  const value = property && property.indexOf('.') === -1
    ? row[property]
    : getValueByPath(row, property) // 寻找嵌套的属性
  if (column && column.formatter) {
    // 格式化后输出
    return column.formatter(row, column, value)
  }
  return value
}

export default {
  name: 'ctTableColumn',
  props: {
    type: {
      type: String,
      default: 'default',
    },
    // theadName
    label: String,
    property: String,
    prop: String,
    width: null,
    minWidth: {
      type: Number,
      default: 120,
    },
    renderHeader: Function,
    resizable: {
      type: Boolean,
      default: true,
    },
    renderCell: null,
    context: {},
    // 固定
    fixed: [Boolean, String],
    formatter: {
      type: Function,
      default: (row, column, cellValue) => {
        if (!cellValue && cellValue !== 0) return '--'
        return cellValue
      },
    },
    // 是否可选
    selectable: Function,
    // 还原选择
    reserveSelection: Boolean,
    className: String,
    labelClassName: String,
    align: {
      type: String,
      default: 'left',
    },
    headerAlign: String,
  },
  data() {
    return {
      column: '',
    }
  },
  computed: {
    // 获取父级组件
    owner() {
      let parent = this.$parent
      while (parent && !parent.tableId) {
        parent = parent.$parent
      }
      return parent
    },
  },
  beforeCreate() {
    this.row = {}
    this.column = {}
    this.$index = 0
  },
  created() {
    this.customRender = this.$options.render
    this.$options.render = h => h('div', this.$slots.default)
    const _id = this.$parent.tableId || `${this.$parent.columnId}-`
    this.columnId = `${_id}column-${seed++}`

    // 初始化列数据
    const column = getDefaultColumn(this.type, {
      id: this.columnId,
      label: this.label,
      property: this.prop || this.property,
      renderCell: null,
      renderHeader: this.renderHeader,
      minWidth: this.minWidth,
      width: this.width,
      isColumnGroup: false,
      context: this.context,
      resizable: this.resizable,
      showOverflowTooltip: this.showOverflowTooltip,
      formatter: this.formatter,
      selectable: this.selectable,
      reserveSelection: this.reserveSelection,
      fixed: this.fixed === '' ? true : this.fixed,
      className: this.className,
      labelClassName: this.labelClassName,
      align: this.align,
      headerAlign: this.headerAlign,
    })

    this.column = column
    Object.assign(column, forced[this.type] || {})

    if (column.width) {
      column.width = Number(column.width)
    }
    column.realWidth = column.width || column.minWidth

    // 判断是否是嵌套的column
    this.isSubColumn = this.owner !== this.$parent
    const _self = this
    let renderCell = column.renderCell

    column.renderCell = function redc(h, data) {
      if (_self.$scopedSlots.default) {
        renderCell = () => _self.$scopedSlots.default(data)
      }

      if (!renderCell) {
        renderCell = DEFAULT_RENDER_CELL
      }

      return <div class="cell">{ renderCell(h, data) }</div>
    }
  },
  mounted() {
    const parent = this.$parent

    let columnIndex

    if (!this.isSubColumn) {
      columnIndex = [].indexOf.call(parent.$refs.hiddenColumns.children, this.$el)
    } else {
      columnIndex = [].indexOf.call(parent.$el.children, this.$el)
    }
    this.owner.store.commit('insertColumn', this.column, columnIndex, this.isSubColumn ? parent.column : null)
    this.owner.doLayout()
  },
  destroyed() {
    if (!this.$parent) return false
    this.owner.store.commit('removeColumn', this.column)
    this.owner.doLayout()
  },
}