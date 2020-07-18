自定义辅助操作，编辑SKU是一件挺繁琐的事情，允许向辅助操作栏目添加辅助功能解放人类的双手，支持异步操作。

**自定义辅助操作的配置项：**

``` javascript
interface assist {
    // 该辅助功能的唯一标识
    name: string,
    // 该辅助功能的对外名称
    label: string,
    // 要改变的字段
    prop: string,
    // 回调函数是否异步，默认为false
    async: boolean,
    // 回调函数，请返回一个数组，数组中的元素顺序请对应表格行数据的顺序
    cb: Function
}
```

``` vue
<template>
  <el-sku :specification="specification" :customAssists="customAssists"></el-sku>
</template>

<script>
const specification = [
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

const customAssists = [
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
      specification: specification,
      customAssists
    }
  }
}
</script>
```
