import ElSkuText from './components/el-sku-text.vue'
import ElSkuNumber from './components/el-sku-number.vue'
import {Switch} from 'element-ui'

/**
 * 数据类型到所使用的组件的映射
 */
const map = {
  text: ElSkuText,
  number: ElSkuNumber,
  switch: Switch
}

export const injectBuiltinComponent = function() {
  return {
    ElSkuText,
    ElSkuNumber,
    ElSwitch: Switch
  }
}

export const mapBuiltinComponent = function(type) {
  return map[type]
}

export const getTypes = (function() {
  const types = Object.keys(map)
  return function() {
    return types
  }
})()
