/**
 * 组件的prop的校验函数
 */

/**
 * PROP<specification>校验函数
 * 2. text属性必须为有效字符串
 * 3. values属性必须是长度大于1的数组
 */
export const specificationValidator = val => {
  const _validate = (item = {}) => {
    return (
      !item['label'] ||
      !item['prop'] ||
      !Array.isArray(item['values']) ||
      item['values'].find(i => !i['text'])
    )
  }
  return Array.isArray(val) && !val.find(_validate)
}
