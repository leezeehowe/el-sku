/**
 * 事件：列自定义模板要修改行数据
 */
export const slotChangedEvent = {
  event: 'slot-changed',
  handler: function handleSlotChanged(prop, val) {
    const {tableData, editableRow} = this
    if (
      editableRow < 0 ||
      editableRow >= tableData.size ||
      !Object.prototype.hasOwnProperty.call(tableData[editableRow], prop)
    ) {
      throw new Error(
        '修改table Data失败！请确保当前行可编辑以及传递的prop名正确。'
      )
    }
    tableData[editableRow][prop] = val
    this.tableData = tableData
  }
}
