<template>
  <div>
    <div v-if="preview">
      <el-tag v-if="!value" type="danger">未填</el-tag>
      <el-tag v-else>{{ value }}</el-tag>
    </div>
    <el-input
      v-else
      v-model="val"
      style="transform:scale(0.8);"
      size="small"
      placeholder="enter.."
      clearable
      @change="handleChange"
    ></el-input>
  </div>
</template>

<script>
import {Input, Tag} from 'element-ui'
export default {
  name: 'ElSkuCode',
  components: {
    ElInput: Input,
    ElTag: Tag
  },
  props: {
    prop: {
      type: String,
      required: true
    },
    value: {
      type: null,
      default: ''
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
