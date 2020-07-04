通过specifications向el-sku传递商品规格属性及其属性值，随后el-sku将结合自定义列以及默认列生成sku、表格数据、表格头。  
默认列有SKU编码、价格、库存。支持v-model获取表格数据。

``` javascript
defaultColumn: [{
        prop: 'skuCode',
        label: 'SKU编码',
        default: '',
        width: 150,
        component: 'ElSkuCode'
    },
    {
        prop: 'price',
        label: '价格',
        default: 0,
        width: 150,
        component: 'ElSkuPrice'
    },
    {
        prop: 'stock',
        label: '库存',
        default: 0,
        width: 150,
        component: 'ElSkuStock'
    }
]
```

``` vue
<template>
  <el-sku :specification="specification" size="small" v-model="data"></el-sku>
</template>

<script>
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
export default {
  data() {
    return {
      specification: specifications,
      data: []
    }
  }
}
</script>
```
