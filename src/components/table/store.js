import Vue from 'vue'
import { hasOwn } from 'ct-util'

function toggleRowSelection(states, row, selected) {
  let changed = false
  const selection = states.selection
  const index = selection.indexOf(row)

  if (typeof selected === 'undefined') {
    if (index === -1) {
      selection.push(row)
      changed = true
    } else {
      selection.splice(index, 1)
      changed = true
    }
  } else {
    if (selected && index === -1) {
      selection.push(row)
      changed = true
    } else if (!selected && index > -1) {
      selection.splice(index, 1)
      changed = true
    }
  }
  console.log('toggleRowSelection changed', changed)
  return changed
}

function getRowIdentity(row, rowKey) {
  if (!row) throw new Error('row is required when get row identity')
  if (typeof rowKey === 'string') {
    if (rowKey.indexOf('.') < 0) {
      return row[rowKey]
    }
    const key = rowKey.split('.')
    let current = row
    for (let i = 0; i < key.length; ++i) {
      current = current[key[i]]
    }
    return current
  } else if (typeof rowKey === 'function') {
    return rowKey.call(null, row)
  }
}

function getKeysMap(array = [], rowKey) {
  const arrayMap = {}
  array.forEach((row, index) => {
    arrayMap[getRowIdentity(row, rowKey)] = { row, index }
  })
  return arrayMap
}

function TableStore(table, initialState) {
  if (!table) {
    throw new Error('Table is required')
  }
  this.table = table
  this.states = {
    rowKey: null,
    _columns: [],
    originColumns: [],
    columns: [],
    fixedColumns: [],
    rightFixedColumns: [],
    // 是否有fixed的列
    isComplex: false,
    _data: null,
    data: null,
    isAllSelected: true,
    selection: [],
    reserveSelection: false,
    selectable: null,
    currentRow: null,
    hoverRow: null,
  }
}

TableStore.prototype.mutations = {
  handleRowClick(row) {
    this.table.$emit('row-click', row)
  },
  handleHoverEvent(row) {
    this.table.$emit('row-hover', row)
  },
  setData(states, data) {
    const dataInstanceChanged = states._data !== data
    states._data = data
    states.data = data
    this.updateCurrentRow()

    if (!states.reserveSelection) {
      if (dataInstanceChanged) {
        this.clearSelection()
      } else {
        this.cleanSelection()
      }
      this.updateSelection()
    } else {
      const rowKey = states.rowKey
      if (rowKey) {
        const selection = states.selection
        const selectedMap = getKeysMap(selection, rowKey)

        states.data.forEach((row) => {
          const rowId = getRowIdentity(row, rowKey)
          const rowInfo = selectedMap[rowId]
          if (rowInfo) {
            selection[rowInfo.index] = row
          }
        })

        this.updateSelection()
      } else {
        console.warn('WARN: rowKey is required when reserve-selection is enabled.')
      }
    }

    const defaultExpandAll = states.defaultExpandAll
    if (defaultExpandAll) {
      this.states.expandRows = (states.data || []).slice(0)
    }

    Vue.nextTick(() => this.table.layout.updateScrollY())
  },
  insertColumn(states, column, index, parent) {
    // console.log(states, column, index, parent)
    let array = states._columns
    if (parent) {
      array = parent.children
      if (!array) {
        // 坑爹,坑孩子
        parent.children = []
        array = parent.children
      }
    }
    if (typeof index !== 'undefined') {
      array.splice(index, 0, column)
    } else {
      array.push(column)
    }

    if (column.type === 'selection') {
      states.selectable = column.selectable
      states.reserveSelection = column.reserveSelection
    }
    this.updateColumns()
  },

  removeColumn(states, column) {
    const _columns = states._columns
    if (_columns) {
      _columns.splice(_columns.indexOf(column), 1)
    }

    this.updateColumns()
  },
  rowSelectedChanged(states, row) {
    const changed = toggleRowSelection(states, row)
    const selection = states.selection

    if (changed) {
      const table = this.table
      table.$emit('selection-change', selection)
      table.$emit('select', selection, row)
    }
    console.log('rowSelectedChanged')
    this.updateSelection()
  },
  toggleAllSelection(states) {
    console.log('toggleAllSelection')
    const { selection, data } = states

    if (!this.states.isAllSelected) {
      data.forEach((item, index) => {
        if (this.isSelected(item)) return false
        selection.push(item)
      })

      this.states.isAllSelected = true
      this.table.$emit('selection-change', selection)
    } else {
      this.clearSelection()
    }

    this.table.$emit('selection-all', selection)
  },
  setHoverRow(states, row) {
    states.hoverRow = row
  },
  setCurrentRow(states, row) {
    const oldCurrentRow = states.currentRow
    states.currentRow = row
    if (oldCurrentRow !== row) {
      this.table.$emit('current-change', row, oldCurrentRow)
    }
  },
}

const doFlattenColumns = (columns) => {
  const result = []
  columns.forEach((column) => {
    if (column.children) {
      result.push.apply(result, doFlattenColumns(column.children))
    } else {
      result.push(column)
    }
  })
  return result
}

TableStore.prototype.updateColumns = function updateColumns() {
  const states = this.states
  const _columns = states._columns || []

  states.fixedColumns = _columns.filter((column) => column.fixed === true || column.fixed === 'left')
  states.rightFixedColumns = _columns.filter((column) => column.fixed === 'right')

  if (states.fixedColumns.length > 0 && _columns[0] && _columns[0].type === 'selection' && !_columns[0].fixed) {
    _columns[0].fixed = true
    states.fixedColumns.unshift(_columns[0])
  }

  // 进行排序，left fixed放最左边，right fixed放最右边
  states.originColumns = [].concat(states.fixedColumns)
    .concat(_columns.filter((column) => !column.fixed))
    .concat(states.rightFixedColumns)

  states.columns = doFlattenColumns(states.originColumns)
  states.isComplex = states.fixedColumns.length > 0 || states.rightFixedColumns.length > 0
}

TableStore.prototype.commit = function commit(name, ...args) {
  const mutations = this.mutations
  if (mutations[name]) {
    mutations[name].apply(this, [this.states].concat(args))
  } else {
    throw new Error(`Action not found ${name}`)
  }
}

// 是否被选中
TableStore.prototype.isSelected = function isSelected(row) {
  return (this.states.selection || []).indexOf(row) > -1
}

// 选中，取消选中操作
TableStore.prototype.toggleRowSelection = function tRS(row, selected) {
  const changed = toggleRowSelection(this.states, row, selected)
  if (changed) {
    this.table.$emit('toggle-selection-change', this.states.selection)
  }
}

// 删除特定的
TableStore.prototype.cleanSelection = function cleanSelection() {
  const selection = this.states.selection || []
  const data = this.states.data
  const rowKey = this.states.rowKey
  let deleted
  if (rowKey) {
    deleted = []
    const selectedMap = getKeysMap(selection, rowKey)
    const dataMap = getKeysMap(data, rowKey)
    for (const key in selectedMap) {
      if (hasOwn(selectedMap, key) && !dataMap[key]) {
        deleted.push(selectedMap[key].row)
      }
    }
  } else {
    deleted = selection.filter((item) => data.indexOf(item) === -1)
  }

  deleted.forEach((deletedItem) => {
    selection.splice(selection.indexOf(deletedItem), 1)
  })

  if (deleted.length) {
    this.table.$emit('selection-change', selection)
  }
}

// 清除所有选中项
TableStore.prototype.clearSelection = function clearSelection() {
  const states = this.states
  states.isAllSelected = false

  const oldSelection = states.selection
  states.selection = []

  if (oldSelection.length > 0) {
    this.table.$emit('selection-change', states.selection)
  }
  console.log('clearSelection')
}

// 更新所有选中项
TableStore.prototype.updateSelection = function updateSelection() {
  const states = this.states
  const { selection, data } = states

  states.isAllSelected = false

  if (data.length === 0) {
    states.isAllSelected = false
    return false
  }

  const isSelected = (row) => selection.indexOf(row) !== -1

  let selectCount = 0
  for (let i = 0, l = data.length; i < l; ++i) {
    if (isSelected(data[i])) {
      selectCount++
    }
  }

  if (selectCount === data.length) {
    states.isAllSelected = true
  }
}

// 更新当前选中的行
TableStore.prototype.updateCurrentRow = function _updateCurrentRow() {
  const table = this.table
  const _data = this.states.data || []
  const oldCurrentRow = this.states.currentRow

  if (_data.indexOf(oldCurrentRow) === -1) {
    this.states.currentRow = null

    if (this.states.currentRow !== oldCurrentRow) {
      table.$emit('current-change', null, oldCurrentRow)
    }
  }
}

TableStore.prototype.updateAllSelected = function uAS() {
  const states = this.states
  const { selection, rowKey, selectable, data } = states
  if (!data || data.length === 0) {
    states.isAllSelected = false
    return
  }

  let selectedMap
  if (rowKey) {
    selectedMap = getKeysMap(states.selection, rowKey)
    console.log(rowKey, selectedMap)
  }

  const isSelected = function isSelected(row) {
    if (selectedMap) {
      return !!selectedMap[getRowIdentity(row, rowKey)]
    }
    return selection.indexOf(row) !== -1
  }

  let isAllSelected = true
  let selectedCount = 0
  for (let i = 0, j = data.length; i < j; i++) {
    const item = data[i]
    if (selectable) {
      const isRowSelectable = selectable.call(null, item, i)
      if (isRowSelectable) {
        if (!isSelected(item)) {
          isAllSelected = false
          break
        } else {
          selectedCount++
        }
      }
    } else {
      if (!isSelected(item)) {
        isAllSelected = false
        break
      } else {
        selectedCount++
      }
    }
  }

  if (selectedCount === 0) isAllSelected = false

  states.isAllSelected = isAllSelected
}

export default TableStore