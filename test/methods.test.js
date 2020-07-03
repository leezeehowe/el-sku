import {extraSpecVal, generateSku} from '../src/methods'

// 测试样例
const specifications = [
  {
    id: 1,
    prop: 'color',
    label: '颜色',
    values: [
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
    values: [
      {
        id: 21,
        text: '6.4'
      },
      {
        id: 22,
        text: '5.8'
      }
    ]
  },
  {
    id: 3,
    prop: 'cpu',
    label: 'CPU',
    values: [
      {
        id: 31,
        text: 'I5'
      },
      {
        id: 32,
        text: 'I7'
      }
    ]
  }
]

describe('从PROP<specification>中提取出属性名和属性值', () => {
  const result = extraSpecVal(specifications)
  // 每一个规格属性是提取结果的一个元素，所以长度应该相等
  test('每一个规格属性是提取结果的一个元素，所以长度应该相等', () => {
    expect(result.length).toBe(specifications.length)
  })
  // 提取结果的每一个元素都是一个数组，该数组的长度应该等于每一个规格属性的属性值数量
  test('提取结果的每一个元素都是一个数组，该数组的长度应该等于每一个规格属性的属性值数量', () => {
    expect(result.map(i => i.length).join('')).toEqual(
      specifications.map(i => i.values.length).join('')
    )
  })
})

describe('根据<extraSpecVal>提取出来的属性和属性值数组结果计算笛卡尔积生成SKU', () => {
  const attrKeyWithValArr = extraSpecVal(specifications)
  const SKUS = generateSku(attrKeyWithValArr)
  test('生成的SKU数量应该等于每个规格属性的属性值数量之间的乘积', () => {
    expect(SKUS.length).toBe(
      attrKeyWithValArr.reduce((accumulator, cv) => accumulator * cv.length, 1)
    )
  })
  test('生成的每一个SKU对象不重复', () => {
    const skuObjJsonStrArr = SKUS.map(_ => JSON.stringify(_))
    expect(skuObjJsonStrArr.length).toBe(new Set(skuObjJsonStrArr).size)
  })
})
