自定义辅助操作，允许定制化辅助操作栏目

``` vue
<template>
  <el-sku :specification="specification" :assists="assists"></el-sku>
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

const assists = [
    {
        name: 'autofillStock',
        label: '自动填充库存',
        prop: 'stock',
        cb: function(tableData, editableRow, event) {
            return tableData.map(_ => {
                if(_.color === '黑色') return 5
            })
        }
    }
]
export default {
  data() {
    return {
      specification: specifications,
      assists: assists
    }
  }
}
</script>
```
