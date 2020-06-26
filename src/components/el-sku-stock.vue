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
      controls-position="right"
      @change="handleChange"
    ></el-input-number>
  </div>
</template>

<script>
import {InputNumber} from 'element-ui'
export default {
  name: 'ElSkuStock',
  components: {
    ElInputNumber: InputNumber
  },
  props: {
    prop: {
      type: String,
      required: true
    },
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
    value: function(n) {
      this.val = n
    }
  },
  methods: {
    handleChange() {
      this.$emit('change', this.prop, this.val)
    }
  }
}
</script>
