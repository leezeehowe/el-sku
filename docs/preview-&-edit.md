**自定义列的配置项：**

``` javascript
interface customColumn {
    // 列的字段名,必填
    prop: string,
    // 列标题，必填
    label: string,
    // 列宽度
    width?: number,
    // 默认值
    default?: any,
    // 设置type可以使用el-sku的内置组件，目前有以下三个内置组件
    type?: 'switch' | 'number' | 'text'
}
```

``` vue
<template>
  <el-sku v-model="data" :customColumn="customColumn" :specification="specification" :skuCodeDisabled="true" :priceDisabled="true" :stockDisabled="true">
    <template #album="{table}">
      {{table.row.album.join("，")}}
    </template>
    <template #stock="{table: {row}}">
        <h1>{{row.stock}}，替换默认列模板</h1>
    </template>
    <template #marketPrice="{table: {row, editable}}">
        <b v-if="!editable">{{row.marketPrice}}</b>
        <input v-else type="text" name="marketPrice" :value="row.marketPrice" @change="handleChange">
    </template>
  </el-sku>
  </div>
</template>

<script>

/**
* 规格属性数据
*/
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
    }
]

/**
* 自定义列数据
*/
const customColumns = [
    {
        prop: 'status',
        label: '有效',
        width: 100,
        default: true,
        type: 'switch'
    },
    {
        prop: 'album',
        label: '图册',
        width: 150,
        default: ['1.jpg', '2.png']
    },
    {
        prop: 'marketPrice',
        label: '市场价',
        width: 200,
        default: 0
    }
]

export default {
  data() {
    return {
        customColumn: customColumns,
        specification: specifications,
        data: []
    }
  },
  methods: {
      handleChange(v) {
        this[Symbol.for('el-sku-event-bus')].$emit('slot-changed', 'marketPrice', v.target.value)
      }
  }
}
</script>
```
