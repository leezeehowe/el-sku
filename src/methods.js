/**从prop-规格数据中提取出规格属性名生成表格列
 * @param {Array} specifications 规格数据
 * @returns {Array} 返回一个item数组，
 * item = {
 *  prop：属性英文标识，
 *  label：属性中文名
 * }
 */
export const extraSpecHead = (specifications = []) => {
  return specifications.map(({prop, label}) => {
    return {
      prop,
      label
    }
  })
}

/**从prop-规格数据中提取出属性和属性值，属性名做key，属性值做value
 * 
 * @param {*} specifications 规格数据
 * @returns {Array} 返回一个二维数组，二维数组的长度等于属性名的数量。
 * 二维数组中的每一个元素（数组）的长度等于其所属属性具有的属性值的数量，
 * 该数组的元素是一个对象，key=属性名，val=属性值
 * 例:
 * [
    {
        id: 1,
        prop: 'color',
        label: '颜色',
        values:[
            {
                id: 11,
                text: '黑色'
            },
            {
                id: 12,
                text: '白色'
            }
        ]
    },
    {
        id: 2,
        prop: 'size',
        label: '尺寸',
        values:[
            {
                id: 21,
                text: '6.4'
            },
            {
                id: 22,
                text: '5.8'
            }
        ]
    }
  ]
 * 返回值：[[{"color": "黑色"}, {"color": "白色"}], [{"size": "6.4"}, {"size": "5.8"}]]
 */
export const extraSpecVal = (specifications = []) => {
  const _f = ({prop, values}) => {
    function _g({text}) {
      return Object.defineProperty({}, prop, {
        value: text,
        writable: false,
        enumerable: true,
        configurable: false
      })
    }
    return values.map(_g)
  }
  return specifications.map(_f)
}

/**笛卡尔积计算生成SKU
 *
 * @param {*} specVal
 */
export const generateSku = specVal => {
  function reducer(accumulator, cV, index, arr) {
    const temp = []
    if (index === 0) {
      return arr[index]
    }
    cV.forEach(item => {
      temp.push(
        ...accumulator.map(_ => {
          const obj = {}
          Object.assign(obj, item)
          Object.assign(obj, _)
          return obj
        })
      )
    })
    return temp
  }
  return specVal.reduce(reducer, [])
}

/**根据sku列和自定义列以及默认列生成tableData
 */
export const mixSkuAndColumn = (skus, column) => {
  const props = column.map(i => [i.prop, i.default])
  const clone = JSON.parse(JSON.stringify(skus))
  clone.forEach(i => {
    props.forEach(j => (i[j[0]] = j[1]))
  })
  return clone
}

/**响应slot列自定义模板要修改tableData
 * @param {String} prop 列属性名
 * @param {Object} val 行值
 */
export function handleSlotChanged(prop, val) {
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
