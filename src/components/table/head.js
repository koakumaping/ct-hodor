import { hasClass, removeClass } from 'ct-util'

/**
 * 获取所有的列，因为会有嵌套所以使用了递归
 * @param columns 原始的所有列
 * @return 所有列
 */
const getAllColumns = (columns) => {
  const result = []
  columns.forEach((column) => {
    if (column.children) {
      result.push(column)
      result.push.apply(result, getAllColumns(column.children))
    } else {
      result.push(column)
    }
  })
  return result
}

/**
 * 将所有的列信息转换成表头的行信息
 * @param originColumns 列信息
 * @return 表头信息
 */
const convertToRows = (originColumns) => {
  let maxLevel = 1
  const traverse = (column, parent) => {
    if (parent) {
      column.level = parent.level + 1
      if (maxLevel < column.level) {
        maxLevel = column.level
      }
    }
    if (column.children) {
      let colSpan = 0
      column.children.forEach((subColumn) => {
        traverse(subColumn, column)
        colSpan += subColumn.colSpan
      })
      column.colSpan = colSpan
    } else {
      column.colSpan = 1
    }
  }

  if (!originColumns) return []

  originColumns.forEach((column) => {
    column.level = 1
    traverse(column)
  })

  const rows = []
  for (let i = 0; i < maxLevel; i++) {
    rows.push([])
  }

  const allColumns = getAllColumns(originColumns)

  allColumns.forEach((column) => {
    if (!column.children) {
      column.rowSpan = (maxLevel - column.level) + 1
    } else {
      column.rowSpan = 1
    }
    rows[column.level - 1].push(column)
  })
  return rows
}

export default {
  name: 'ctTableHeader',
  props: {
    fixed: String,
    store: {
      required: true,
    },
    layout: {
      required: true,
    },
    border: Boolean,
    // 默认排序
    defaultSort: {
      type: Object,
      default() {
        return {
          prop: '',
          order: '',
        }
      },
    },
  },
  computed: {
    // 所有的列
    columns() {
      return this.store.states.columns
    },
  },
  mounted() {
    console.log('head mounted')
    const init = true
    const { prop, order } = this.defaultSort
    this.store.commit('sort', { prop, order, init })
  },
  methods: {
    isCellHidden(index, columns) {
      if (this.fixed === true || this.fixed === 'left') {
        return index >= this.leftFixedCount
      } else if (this.fixed === 'right') {
        let before = 0
        for (let i = 0; i < index; i++) {
          before += columns[i].colSpan
        }
        return before < this.columnsCount - this.rightFixedCount
      }
      return (index < this.leftFixedCount) || (index >= this.columnsCount - this.rightFixedCount)
    },
    handleSortClick(event, column, givenOrder) {
      event.stopPropagation()

      let target = event.target
      while (target && target.tagName !== 'TH') {
        target = target.parentNode
      }

      if (target && target.tagName === 'TH') {
        if (hasClass(target, 'noclick')) {
          removeClass(target, 'noclick')
          return false
        }
      }

      if (!column.sortable) return

      const states = this.store.states

      let sortOrder
      const sortingColumn = states.sortingColumn

      if (sortingColumn !== column || (sortingColumn === column && sortingColumn.order === null)) {
        if (sortingColumn) {
          sortingColumn.order = null
        }
        states.sortingColumn = column
      }

      if (!givenOrder) {
        column.order = null
        sortOrder = column.order
      } else {
        column.order = givenOrder
        sortOrder = column.order
      }

      states.sortProp = column.property
      states.sortOrder = sortOrder
      states.sortingColumn = column

      this.store.commit('changeSortCondition')
    },
  },
  render(h) {
    const originColumns = this.store.states.originColumns
    const columnRows = convertToRows(originColumns, this.columns)
    // 是否拥有多级表头
    const isGroup = columnRows.length > 1
    if (isGroup) this.$parent.isGroup = true
    return (
      <table
        class="ct-table-header"
        cellspacing="0"
        cellpadding="0"
        border="0">
        <colgroup>
          {
            this._l(this.columns, column =>
              <col
                name={ column.id }
                width={ column.realWidth || column.width }
              />)
          }
        </colgroup>
        <thead class={ [{ 'is-group': isGroup }] }>
          {
            this._l(columnRows, (columns, rowIndex) =>
              <tr>
                {
                  this._l(columns, (column, cellIndex) =>
                    <th
                      colspan={column.colSpan}
                      rowspan={column.rowSpan}
                      prop={column.prop}
                      class={
                      [
                        column.id, column.order, `text-${column.headerAlign}`, column.className || '',
                        rowIndex === 0 && this.isCellHidden(cellIndex, columns) ? 'is-hidden' : '',
                        !column.children ? 'is-leaf' : '',
                        column.sortable ? 'is-sortable' : '',
                        column.labelClassName,
                      ]
                      }
                    >
                      <div class={['cell', column.labelClassName]}>
                        {
                          column.renderHeader
                            ? column.renderHeader.call(
                              this._renderProxy,
                              h,
                              {
                                column,
                                $index: cellIndex,
                                store: this.store,
                                _self: this.$parent.$vnode.context,
                              },
                              )
                            : column.label
                        }
                        {
                          column.sortable ? (<span
                            class="caret-wrapper"
                            on-click={ ($event) => this.handleSortClick($event, column) }>
                            <i class="sort-caret ascending"
                              on-click={ ($event) => this.handleSortClick($event, column, 'ascending') }>
                            </i>
                            <i class="sort-caret descending"
                              on-click={ ($event) => this.handleSortClick($event, column, 'descending') }>
                            </i>
                          </span>) : ''
                        }
                      </div>
                    </th>,
                  )
                }
                {
                  !this.fixed && this.layout.gutterWidth
                    ? <th class="gutter" style={{ width: this.layout.scrollY ? this.layout.gutterWidth + 'px' : '0' }}></th>
                    : ''
                }
              </tr>,
            )
          }
        </thead>
      </table>
    )
  },
}