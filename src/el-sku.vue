<template>
  <div class="el-sku" v-bind="$attrs" v-on="$listeners">
    <el-table
      :data="tableData"
      :border="false"
      :size="size"
      :height="height"
      :stripe="stripe"
      :fit="true"
    >
      <!-- 序号列 -->
      <el-table-column v-if="showIndex" type="index"></el-table-column>
      <!-- 序号列 end-->

      <!-- sku的属性列，不可编辑 -->
      <template v-for="item in skusColumns">
        <el-table-column
          :key="item.prop"
          :show-overflow-tooltip="item.tooltip || true"
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
                :is="item.builtinComponent"
                v-model="scope.row[item.prop]"
                :disabled="editableRow !== scope.$index"
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
              <div
                v-for="({label, name, desc}, index) in assists"
                :key="`assist-${name}-${index}`"
              >
                <el-tooltip
                  :disabled="!desc"
                  :content="desc"
                  placement="right-end"
                  effect="dark"
                >
                  <el-dropdown-item>
                    <div :data-name="name" @click="dispatchAssist">
                      {{ label }}
                    </div>
                  </el-dropdown-item>
                </el-tooltip>
              </div>
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
  MessageBox,
  Tooltip
} from 'element-ui'
import {injectBuiltinComponent, mapBuiltinComponent} from './columnType.js'
import {
  extraSpecHead,
  extraSpecVal,
  generateSku,
  mixSkuAndColumn
} from './methods'
import {
  specificationValidator,
  customColumnValidator,
  customAssistValidator
} from './validator.js'
import {slotChangedEvent} from './event.js'
import {builtInColumns, builtInAssists} from './builtInData'
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
    ElTooltip: Tooltip,
    ...injectBuiltinComponent()
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    /**
     * 表格大小，参数值和element-ui一致
     */
    size: {
      type: String,
      default: 'medium'
    },
    inline: {
      type: Boolean,
      default: false
    },
    /**
     * 表格宽度，参数值和element-ui一致
     */
    height: {
      type: Number,
      default: undefined
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
      default: () => [],
      validator: customColumnValidator
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
    customAssists: {
      type: Array,
      validator: customAssistValidator,
      default: () => []
    }
  },
  data() {
    return {
      tableData: [],
      editableRow: -1
    }
  },
  computed: {
    skusColumns: function() {
      return extraSpecHead(this.specification)
    },
    editableColumns: function() {
      const {customColumn, skuCodeDisabled, priceDisabled, stockDisabled} = this
      return (
        [skuCodeDisabled, priceDisabled, stockDisabled]
          // 给用户要移除的默认列设置flag
          .map((whetherDisable, index) => {
            const clone = JSON.parse(JSON.stringify(builtInColumns[index]))
            clone.disabled = whetherDisable
            return clone
          })
          // 过滤用户要移除的默认列
          .filter(_ => !_.disabled)
          // 合并自定义列
          .concat(customColumn)
          // 映射type -> 内置组件
          .map(column => {
            // vue组件创建时会进行prop的校验，所以这里不校验用户填写的type
            column.builtinComponent = mapBuiltinComponent(column.type)
            return column
          })
      )
    },
    assists: function() {
      builtInAssists[0].cb = this.handleAutoFillPrice
      builtInAssists[1].cb = this.handleAutoFillCode
      return this.customAssists.concat(builtInAssists)
    }
  },
  watch: {
    tableData: {
      handler: function(val) {
        this.$emit('input', val)
      },
      deep: true
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
    /**
     * 点击侧边栏的编辑按钮的处理函数
     */
    handleEdit(index, row) {
      this.editableRow = index
      /**
       * 行侧边编辑按钮被点击，进入编辑模式
       * @property {Number} index - 行序列号
       * @property {Object} row - 该行数据
       */
      this.$emit('row-edit', index, row)
    },
    /**
     * 点击侧边栏的确认按钮的处理函数
     */
    handleConfirm(index, row) {
      this.editableRow = -1
      /**
       * 行侧边完成按钮被点击，退出编辑模式
       * @property {Number} index - 行序列号
       * @property {Object} row - 该行数据
       */
      this.$emit('row-confirm', index, row)
    },
    /**
     * 内置辅助功能：填充价格
     */
    async handleAutoFillPrice() {
      let price = this.commodity.price
      if (typeof price !== 'number') {
        try {
          price = (await MessageBox.prompt(
            '未获取到商品价格，请手动输入',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }
          )).value
        } catch (error) {
          return
        }
      }
      try {
        price = Number(price)
        if (Number.isNaN(price)) return
      } catch (error) {
        return
      }
      return this.tableData.map(() => price)
    },
    /**
     * 内置辅助功能；填充SKU编码
     */
    handleAutoFillCode() {
      return this.autoFillCodeStrategy()(
        JSON.parse(JSON.stringify(this.tableData)),
        this.commodity
      )
    },
    /**
     * 分发自定义辅助功能
     */
    dispatchAssist(event) {
      const {tableData, editableRow} = this
      const name = event.target.dataset.name
      const {prop, cb, async} = this.assists.find(_ => _.name === name)
      const cbResult = cb(
        // 引用传递，避免被修改
        JSON.parse(JSON.stringify(tableData)),
        editableRow,
        event
      )
      // 统一包装异步和同步
      new Promise(resolve => {
        if (async) {
          cbResult.then(res => {
            resolve(res)
          })
        } else {
          resolve(cbResult)
        }
      }).then(res => {
        if (Array.isArray(res)) {
          res.forEach((i, index) => {
            if (
              index < tableData.length &&
              Object.prototype.hasOwnProperty.call(tableData[index], prop)
            ) {
              tableData[index][prop] = i
            }
          })
          this.tableData = tableData
        }
      })
    }
  }
}
</script>
