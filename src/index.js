// Import vue component
import Component from './el-sku.vue'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Table,
  TableColumn,
  Input,
  Tag,
  InputNumber,
  Switch,
  Tooltip
} from 'element-ui'

// `Vue.use` automatically prevents you from using
// the same plugin more than once,
// so calling it multiple times on the same plugin
// will install the plugin only once
Component.install = Vue => {
  Vue.component(Component.name, Component)
}

// To auto-install when vue is found
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(Component)
  GlobalVue.use(Button)
  GlobalVue.use(Table)
  GlobalVue.use(TableColumn)
  GlobalVue.use(Input)
  GlobalVue.use(Dropdown)
  GlobalVue.use(DropdownItem)
  GlobalVue.use(DropdownMenu)
  GlobalVue.use(Tag)
  GlobalVue.use(InputNumber)
  GlobalVue.use(Switch)
  GlobalVue.use(Tooltip)
}

// To allow use as module (npm/webpack/etc.) export component
export default Component

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
