/**
 * 如果有则必须是：假如obj有该属性，则必须是options指定的可选值或之一。
 * 如果options是对象，则判断对象的内容是否相等。
 * @param {*} obj 被检测的对象
 * @param {*} prop 字段名
 * @param {*} options 可选值
 */
const shouldBe = function(obj, prop, options) {
  if (typeof obj !== 'object') {
    throw new TypeError('the target must be type of object!')
  }
  // 若没有这个属性，则返回true
  if (!Object.prototype.hasOwnProperty.call(obj, prop)) return true
  // 若是数组，则必选是可选值之一
  else if (Array.isArray(options)) {
    return options.includes(obj[prop])
  }
  // 若是对象，内容必须相等
  else if (typeof options === 'object') {
    return JSON.stringify(obj[prop]) == JSON.stringify(options)
  }
  // 其他
  else {
    return obj[prop] === options
  }
}

/**
 * PROP<specification>校验函数
 * 2. text属性必须为有效字符串
 * 3. values属性必须是长度大于1的数组
 */
export const specificationValidator = val => {
  const _validate = (item = {}) => {
    return (
      typeof item['prop'] == 'string' &&
      typeof item['label'] == 'string' &&
      Array.isArray(item['values']) &&
      item['values'].length > 0 &&
      item['values'].every(i => typeof i['text'] == 'string')
    )
  }
  return Array.isArray(val) && val.every(_validate)
}

/**
 * PROP<customColumn>校验函数
 */
export const customColumnValidator = val => {
  const _validate = (item = {}) => {
    return (
      typeof item['prop'] == 'string' &&
      typeof item['label'] == 'string' &&
      shouldBe(item, 'type', ['number', 'text', 'switch'])
    )
  }
  return Array.isArray(val) && val.every(_validate)
}
