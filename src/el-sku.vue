<template>
  <div class="el-sku" v-bind="$attrs" v-on="$listeners">
    <el-table
      :data="tableData"
      :border="false"
      :size="size"
      :height="height"
      :stripe="stripe"
    >
      <el-table-column v-if="showIndex" type="index"></el-table-column>
      <!-- sku的属性列，不可编辑 -->
      <template v-for="item in skusColumns">
        <el-table-column
          :key="item.prop"
          align="center"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || 100"
        ></el-table-column>
      </template>
      <!-- sku的属性列，不可编辑 end-->

      <!-- 可编辑的列 -->
      <template v-for="item in editableColumns">
        <el-table-column
          :key="item.prop"
          align="center"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || 100"
        >
          <template slot-scope="scope">
            <!-- @slot 插槽区域，可自定义表单列模板，通过prop对应。 -->
            <slot
              :name="item.prop"
              :table="{
                row: scope.row,
                editable: editableRow === scope.$index
              }"
            >
              <component
                :is="item.component"
                v-model="scope.row[item.prop]"
                :preview="editableRow !== scope.$index"
                :prop="item.prop"
                @change="handleChange"
              ></component>
            </slot>
            <!-- @slot 插槽区域，可自定义表单列 end-->
          </template>
        </el-table-column>
      </template>
      <!-- 可编辑的列 end-->

      <!-- 操作列 -->
      <el-table-column align="center" width="140" :fixed="fixed">
        <template slot="header" slot-scope>
          <el-dropdown :show-timeout="100">
            <el-button size="mini" type="primary" plain>
              辅助操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="handleAutoFillPrice">自动填充价格</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="handleAutoFillCode">自动填充编码</div>
              </el-dropdown-item>
              <el-dropdown-item
                v-for="({label, name}, index) in assists"
                :key="`assist-${index}`"
              >
                <div :data-name="name" @click="dispatchAssist">{{ label }}</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <el-button
            v-if="editableRow === scope.$index"
            icon="el-icon-check"
            type="success"
            size="small"
            circle
            @click="handleConfirm(scope.$index, scope.row)"
          ></el-button>
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            circle
            :disabled="editableRow === scope.$index"
            @click="handleEdit(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
      <!-- 操作列 end-->
    </el-table>
  </div>
</template>

<script>
import {
  Button,
  Table,
  TableColumn,
  Input,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Tag,
  MessageBox
} from 'element-ui'
import ElSkuCode from './components/el-sku-code.vue'
import ElSkuPrice from './components/el-sku-price.vue'
import ElSkuStock from './components/el-sku-stock.vue'
import {
  extraSpecHead,
  extraSpecVal,
  generateSku,
  mixSkuAndColumn
} from './methods'
import {specificationValidator} from './validator.js'
import {slotChangedEvent} from './event.js'
export default {
  name: 'ElSku',
  components: {
    ElButton: Button,
    ElTable: Table,
    ElTableColumn: TableColumn,
    ElInput: Input,
    ElDropdown: Dropdown,
    ElDropdownMenu: DropdownMenu,
    ElDropdownItem: DropdownItem,
    ElTag: Tag,
    ElSkuCode,
    ElSkuPrice,
    ElSkuStock
  },
  props: {
    /**
     * 表格大小，参数值和element-ui一致
     */
    size: {
      type: String,
      default: 'medium'
    },
    /**
     * 表格宽度，参数值和element-ui一致
     */
    height: {
      type: Number,
      default: 300
    },
    /**
     * 是否斑马行
     */
    stripe: {
      type: Boolean,
      default: true
    },
    /**
     * 操作列是否固定，或靠左/右固定,接收布尔值或者字符串，该参数跟element-ui一致。
     */
    fixed: {
      type: null,
      default: 'right'
    },
    /**
     * 是否展示每行的序列号
     */
    showIndex: {
      type: Boolean,
      default: true
    },
    /**
     * 移除SKU编码默认列
     */
    skuCodeDisabled: {
      type: Boolean,
      default: false
    },
    /**
     * 移除价格默认列
     */
    priceDisabled: {
      type: Boolean,
      default: false
    },
    /**
     * 移除库存默认列
     */
    stockDisabled: {
      type: Boolean,
      default: false
    },
    /**
     * 商品数据，应该包括price字段和id字段用于自动填充价格和生成SKU编码。
     */
    commodity: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /**
     * 规格属性及其属性值
     */
    specification: {
      type: Array,
      default: () => [],
      validator: specificationValidator
    },
    /**
     * 自定义列
     */
    customColumn: {
      type: Array,
      default: () => []
    },
    /**
     * SKU编码生成策略，默认策略：`${商品id}-${index}`，要求返回一个数组，顺序对应tableData。
     */
    autoFillCodeStrategy: {
      type: Function,
      default: () => {
        return function(tableData, {id}) {
          if (typeof id === 'undefined') {
            id = Date.now()
          }
          const codeArr = []
          for (let index = 0; index < tableData.length; index++) {
            codeArr.push(`${id}-${index}`)
          }
          return codeArr
        }
      }
    },
    /**
     * 辅助操作栏目配置项
     */
    assists: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      defaultColumn: [
        {
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
      ],
      tableData: [],
      editableRow: -1
    }
  },
  computed: {
    skusColumns: function() {
      return extraSpecHead(this.specification)
    },
    editableColumns: function() {
      const {
        defaultColumn,
        customColumn,
        skuCodeDisabled,
        priceDisabled,
        stockDisabled
      } = this
      return [skuCodeDisabled, priceDisabled, stockDisabled]
        .map((_, index) => {
          const clone = JSON.parse(JSON.stringify(defaultColumn[index]))
          clone.disabled = _
          return clone
        })
        .filter(_ => !_.disabled)
        .concat(customColumn)
    }
  },
  mounted: function() {
    // 注入一个event-bus
    this.$root.__proto__[
      Symbol.for('el-sku-event-bus')
    ] = new this.__proto__.constructor()
    /**
     * 监听slot的自定义列模板对行数据的改变
     */
    this[Symbol.for('el-sku-event-bus')].$on(
      slotChangedEvent.event,
      slotChangedEvent.handler.bind(this)
    )
  },
  created: function() {
    // 提取出规格属性及其属性值，分别存储于每一个数组中
    const specVal = extraSpecVal(this.specification)
    // 根据笛卡儿积映射提取出的所有数组生成SKU
    const skus = generateSku(specVal)
    // 混合SKU和自定义列
    const data = mixSkuAndColumn(skus, this.editableColumns)
    this.tableData = data
  },
  methods: {
    /**
     * 获取表格数据。
     * @public
     */
    GetTableData() {
      return JSON.parse(JSON.stringify(this.tableData))
    },
    handleEdit(index, row) {
      this.editableRow = index
      /**
       * 行侧边编辑按钮被点击，进入编辑模式
       * @property {Number} index - 行序列号
       * @property {Object} row - 该行数据
       */
      this.$emit('row-edit', index, row)
    },
    handleConfirm(index, row) {
      this.editableRow = -1
      /**
       * 行侧边完成按钮被点击，退出编辑模式
       * @property {Number} index - 行序列号
       * @property {Object} row - 该行数据
       */
      this.$emit('row-confirm', index, row)
    },
    handleChange(prop, val) {
      const clone = JSON.parse(JSON.stringify(this.tableData))
      clone[this.editableRow][prop] = val
      this.tableData = clone
    },
    async handleAutoFillPrice() {
      const clone = JSON.parse(JSON.stringify(this.tableData))
      let price = this.commodity.price
      if (typeof price !== 'number') {
        price = (await MessageBox.prompt(
          '未获取到商品价格，请手动输入',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }
        )).value
      }
      clone.forEach(i => {
        i.price = price
      })
      this.tableData = clone
    },
    handleAutoFillCode() {
      const codes = this.autoFillCodeStrategy()(
        JSON.parse(JSON.stringify(this.tableData)),
        this.commodity
      )
      const clone = JSON.parse(JSON.stringify(this.tableData))
      clone.forEach((i, index) => (i.skuCode = codes[index]))
      this.tableData = clone
    },
    dispatchAssist(event) {
      const {tableData, editableRow} = this
      const name = event.target.dataset.name
      const {prop, cb} = this.assists.find(_ => _.name === name)
      cb(JSON.parse(JSON.stringify(tableData)), editableRow, event).forEach(
        (i, index) => {
          if (index >= tableData.length) {
            throw new Error('自定义辅助功能的回调函数返回数组长度有误！')
          } else if (
            !Object.prototype.hasOwnProperty.call(tableData[index], prop)
          ) {
            throw new Error('自定义辅助功能的prop属性指定有误！')
          } else tableData[index][prop] = i
        }
      )
      this.tableData = tableData
    }
  }
}
</script>
