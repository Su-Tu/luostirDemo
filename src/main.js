import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueRouter from 'vue-router'
import router from './router'


// 按需引入的写法,要引入哪一个组件就在花括号里面写入这个组件
import {
  Button,
  Row,
  Form,
  FormItem,
  Input,
  Tabs,
  TabPane,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Footer,
  Container,
  Main,
  Header,
  Col,
  Avatar,
  Descriptions,
  DescriptionsItem,
  Tag,
  Radio,
  Option,
  RadioGroup,
  Rate,
  Drawer,
  Collapse,
  CollapseItem,
  Switch
} from 'element-ui'
// 然后在全局注册该组件
Vue.component(Button.name, Button)
Vue.component(Row.name, Row)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Tabs.name, Tabs)
Vue.component(TabPane.name, TabPane)
Vue.component(Menu.name, Menu)
Vue.component(Submenu.name, Submenu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(MenuItemGroup.name, MenuItemGroup)
Vue.component(Footer.name, Footer)
Vue.component(Container.name, Container)
Vue.component(Main.name, Main)
Vue.component(Header.name, Header)
Vue.component(Col.name, Col)
Vue.component(Avatar.name, Avatar)
Vue.component(Descriptions.name, Descriptions)
Vue.component(DescriptionsItem.name, DescriptionsItem)
Vue.component(Tag.name, Tag)
Vue.component(Radio.name, Radio)
Vue.component(Option.name, Option)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Rate.name, Rate)
Vue.component(Drawer.name, Drawer)
Vue.component(Collapse.name, Collapse)
Vue.component(CollapseItem.name, CollapseItem)
Vue.component(Switch.name, Switch)
Vue.config.productionTip = false
Vue.use(VueRouter)

const vm = new Vue({
  // render 是一个函数（必须写返回值），h是他的一个参数，该参数是一个函数，用来创建页面元素
  // render(h){return h('h1',''hello)} 正常写法，下面这种下发是精简的写法
  render: h => h(App),
  beforeCreate() {
    // 全局事件总线
    Vue.prototype.$bus = this
  },
  store,
  router: router
}).$mount('#app')
