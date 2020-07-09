import ElSkuText from './components/el-sku-text.vue'
import ElSkuNumber from './components/el-sku-number.vue'
import {Switch} from 'element-ui'

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
