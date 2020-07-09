已实现 `v-model` ，可以通过`v-model`指令实时同步表格数据。

``` vue
<template>
  <div>
    <el-sku :customColumn="customColumn" :specification="specification" v-model="data">
        <template #album="{table}">
        {{table.row.album.join("，")}}
        </template>
        <template #stock="{table: {row}}">
            <h1>{{row.stock}}，替换默认列模板</h1>
        </template>
    </el-sku>
    <pre>
        {{JSON.stringify(data, null, "\t")}}
    </pre>
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
        default: 0,
        type: 'number'
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
