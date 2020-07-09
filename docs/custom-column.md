自定义列，允许向el-sku表格中添加自定义的列，并且通过插槽slot实现自定义列模板，插槽作用域中会返回该行数据以及当前行是否可编辑。  

**有三个重要的地方：**  

* 若您自定义的slot中改变了行数据，需要通过event bus发送一个事件把新值和prop传递给el-sku，使行数据得以同步。  

具体用法:

``` javascript
// el-sku在mounted钩子中挂载了event-bus，所以您可直接调用
this[Symbol.for('el-sku-event-bus')].$emit('slot-changed', prop, val)
```

> 为什么需要prop参数？因为el-sku需要prop才知道您修改了哪个列。  
> 为什么不需要index？因为el-sku内部维护了一个editableRow属性，该属性标识了表格中当前处于编辑状态的行。  
> 为什么要使用event bus？因为el-sku无法监听到slot抛出的事件。  
> 为什么使用Symbol？因为避免属性同名覆盖。  

* scope作用域中返回一个名为table的对象，table对象中有row以及editable两个属性，row是当前行数据，editable是当前行是否可编辑，从0算起。  

* 非editable的行不允许改变行数据，所以通过slot自定义列模板后，需要自己维护这个可编辑和不可编辑状态。否则会出现用户修改了表格第B行的数据，但是el-sku内部维护的editableIndex是第A行的序号而导致修改了第A行的数据等异常情况。所以必须点击行的操作列上的编辑按钮后才允许改变该行数据。

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
