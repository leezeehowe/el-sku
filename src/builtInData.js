export const builtInColumns = [
  {
    prop: 'skuCode',
    label: 'SKU编码',
    default: '',
    width: 150,
    type: 'text'
  },
  {
    prop: 'price',
    label: '价格',
    default: 0,
    width: 150,
    type: 'number'
  },
  {
    prop: 'stock',
    label: '库存',
    default: 0,
    width: 150,
    type: 'number'
  }
]

export const builtInAssists = [
  {
    name: 'autofillPrice',
    label: '自动填充价格',
    async: true,
    // desc: '填充SPU的价格到每个SKU，若无指定SPU则手动输入',
    prop: 'price'
  },
  {
    name: 'autofillCode',
    label: '自动填充编码',
    // desc: '自动生成每个SKU的编码，默认根据SPU的id以及SKU的序列生成，若无指定SPU则id使用时间戳替换',
    prop: 'skuCode'
  }
]
