function getCell(event) {
  let cell = event.target

  while (cell && cell.tagName.toUpperCase() !== 'HTML') {
    if (cell.tagName.toUpperCase() === 'TD') {
      return cell
    }
    cell = cell.parentNode
  }

  return null
}

function getColumnById(table, columnId) {
  let column = null
  table.columns.forEach((item) => {
    if (item.id === columnId) {
      column = item
    }
  })
  return column
}

function getColumnByCell(table, cell) {
  const matches = (cell.className || '').match(/ct-table-[^\s]+/gm)
  if (matches) {
    return getColumnById(table, matches[0])
  }
  return null
}

const getRowIdentity = (row, rowKey) => {
  if (!row) throw new Error('row is required when get row identity')
  if (typeof rowKey === 'string') {
    if (rowKey.indexOf('.') < 0) {
      return row[rowKey]
    }
    const key = rowKey.split('.')
    let current = row
    for (let i = 0; i < key.length; i++) {
      current = current[key[i]]
    }
    return current
  } else if (typeof rowKey === 'function') {
    return rowKey.call(null, row)
  }
}

export default {
  name: 'ctTableBody',
  props: {
    store: {
      required: true,
    },
    layout: {
      required: true,
    },
    context: {},
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    fixed: String,
    highlight: Boolean,
    stripe: Boolean,
  },
  computed: {
    table() {
      return this.$parent
    },
    data() {
      return this.store.states.data
    },
    columnsCount() {
      return this.store.states.columns.length
    },
    columns(val) {
      return this.store.states.columns
    },
    leftFixedCount() {
      return this.store.states.fixedColumns.length
    },
    rightFixedCount() {
      return this.store.states.rightFixedColumns.length
    },
  },
  watch: {
    'store.states.hoverRow'(newVal, oldVal) {
      // 没有fix的列时不做操作，靠css实现hover效果
      if (!this.store.states.isComplex) return
      const el = this.$el
      if (!el) return
      const rows = el.querySelectorAll('tbody > tr.ct-table-row')
      const oldRow = rows[oldVal]
      const newRow = rows[newVal]
      if (oldRow) {
        this.$util.removeClass(oldRow, 'hover-row')
      }
      if (newRow) {
        this.$util.addClass(newRow, 'hover-row')
      }
    },
    'store.states.currentRow'(newVal, oldVal) {
      if (!this.highlight) return
      const el = this.$el
      if (!el) return
      const data = this.store.states.data
      const rows = el.querySelectorAll('tbody > tr.ct-table-row')
      const oldRow = rows[data.indexOf(oldVal)]
      const newRow = rows[data.indexOf(newVal)]
      if (oldRow) {
        this.$util.removeClass(oldRow, 'current-row')
      } else if (rows) {
        [].forEach.call(rows, row => this.$util.removeClass(row, 'current-row'))
      }
      if (newRow) {
        this.$util.addClass(newRow, 'current-row')
      }
    },
  },
  render(h) {
    const columnsHidden = this.columns.map((column, index) => this.isColumnHidden(index))

    return (
      <table
        class="ct-table-body"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <colgroup>
          {
            this._l(this.columns, column =>
              <col
                name={ column.id }
                width={ column.realWidth || column.width }
              />)
          }
        </colgroup>
        <tbody>
          {
            this._l(this.data, (row, $index) =>
              [
                <tr
                  style={ this.rowStyle ? this.getRowStyle(row, $index) : null }
                  key={ this.table.rowKey ? this.getKeyOfRow(row, $index) : $index }
                  on-dblclick={ ($event) => this.handleDoubleClick($event, row) }
                  on-click={ ($event) => this.handleClick($event, row) }
                  on-contextmenu={ ($event) => this.handleContextMenu($event, row) }
                  on-mouseenter={ _ => this.handleMouseEnter($index) }
                  on-mouseleave={ _ => this.handleMouseLeave() }
                  class={ [this.getRowClass(row, $index)] }
                >
                  {
                    this._l(this.columns, (column, cellIndex) =>
                      [
                        <td
                          class={ [column.id, column.align, column.className || '',
                            columnsHidden[cellIndex] ? 'is-hidden' : ''] }
                          on-mouseenter={ ($event) => this.handleCellMouseEnter($event, row) }
                          on-mouseleave={ this.handleCellMouseLeave }
                        >
                          {
                            column.renderCell.call(
                              this._renderProxy,
                              h,
                              {
                                row,
                                column,
                                $index,
                                store: this.store,
                                _self: this.context || this.table.$vnode.context,
                              },
                            )
                          }
                        </td>,
                      ],
                    )
                  }
                  {
                    !this.fixed && this.layout.scrollY && this.layout.gutterWidth ? <td class="gutter" /> : ''
                  }
                </tr>,
              ],
            )
          }
        </tbody>
      </table>
    )
  },
  methods: {
    getKeyOfRow(row, index) {
      const rowKey = this.table.rowKey
      if (rowKey) {
        return getRowIdentity(row, rowKey)
      }
      return index
    },
    getRowStyle(row, index) {
      const rowStyle = this.rowStyle
      if (typeof rowStyle === 'function') {
        return rowStyle.call(null, row, index)
      }
      return rowStyle
    },

    getRowClass(row, index) {
      const classes = ['ct-table-row']

      if (this.stripe && index % 2 === 1) {
        classes.push('ct-table-row-stripe')
      }
      const rowClassName = this.rowClassName
      if (typeof rowClassName === 'string') {
        classes.push(rowClassName)
      } else if (typeof rowClassName === 'function') {
        classes.push(rowClassName.call(null, row, index) || '')
      }

      return classes.join(' ')
    },
    handleCellMouseEnter(event, row) {
      // console.log(row)
      const table = this.table
      const cell = getCell(event)

      if (cell) {
        const column = getColumnByCell(table, cell)
        table.hoverState = { cell, column, row }
        const hoverState = table.hoverState
        table.$emit('cell-mouse-enter', hoverState.row, hoverState.column, hoverState.cell, event)
      }
    },
    handleCellMouseLeave(event) {
      const cell = getCell(event)
      if (!cell) return
      const oldHoverState = this.table.hoverState
      this.table.$emit('cell-mouse-leave', oldHoverState.row, oldHoverState.column, oldHoverState.cell, event)
    },
    handleMouseEnter(index) {
      this.store.commit('setHoverRow', index)
    },
    handleMouseLeave() {
      this.store.commit('setHoverRow', null)
    },
    // 鼠标右键
    handleContextMenu(event, row) {
      this.handleEvent(event, row, 'contextmenu')
    },

    handleDoubleClick(event, row) {
      this.handleEvent(event, row, 'dblclick')
    },

    handleClick(event, row) {
      this.store.commit('setCurrentRow', row)
      this.handleEvent(event, row, 'click')
    },

    handleEvent(event, row, name) {
      const table = this.table
      const cell = getCell(event)
      let column
      if (cell) {
        column = getColumnByCell(table, cell)
        if (column) {
          table.$emit(`cell-${name}`, row, column, cell, event)
        }
      }
      table.$emit(`row-${name}`, row, event, column)
    },
    isColumnHidden(index) {
      if (this.fixed === true || this.fixed === 'left') {
        return index >= this.leftFixedCount
      } else if (this.fixed === 'right') {
        return index < this.columnsCount - this.rightFixedCount
      }
      return (index < this.leftFixedCount) || (index >= this.columnsCount - this.rightFixedCount)
    },
  },
}