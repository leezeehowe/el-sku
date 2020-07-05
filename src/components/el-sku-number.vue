<template>
  <div>
    <div v-if="preview">{{ value }}</div>
    <el-input-number
      v-else
      v-model="val"
      style="transform:scale(0.8);"
      :min="0"
      label="描述文字"
      size="mini"
      :precision="2"
      controls-position="right"
    ></el-input-number>
  </div>
</template>

<script>
import {InputNumber} from 'element-ui'
export default {
  name: 'ElSkuNumber',
  components: {
    ElInputNumber: InputNumber
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    preview: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      val: this.value
    }
  },
  watch: {
    val: function(n) {
      this.$emit('change', n)
    }
  }
}
</script>
