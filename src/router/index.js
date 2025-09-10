// 引入VueRouter
import VueRouter from "vue-router";
// 引入路由需要的组件
import Login from "../page/Login.vue"
import Register from "../page/Register.vue";
import Enter from "../page/Enter.vue"
import Steer from '../page/Steer.vue'
import PersonMsg from "../page/PersonMsg.vue";
import UserCenter from "../page/UserCenter.vue";
import Log from "../page/Log.vue";
import Pay from "../page/Pay.vue";
// 创建router实例对象，去管理一组一组的路由规则

const router = new VueRouter({
  routes: [
    {
      name: 'Enter',
      path: '/enter',
      component: Enter,
      meta: { keepAlive: false },
      children: [
        {
          name: 'Login',
          path: 'login',
          component: Login,
          meta: { keepAlive: false }
        },
        {
          name: 'Register',
          path: 'register',
          component: Register,
          meta: { keepAlive: false }
        },
      ]
    },
    {
      name: 'Steer',
      path: '/steer',
      component: Steer,
      meta: { keepAlive: true }
    },
    {
      name: 'PersonMsg',
      path: '/pmsg',
      component: PersonMsg,
      meta: { keepAlive: true },
      children: [
        {
          name: 'UserCenter',
          path: 'usercenter',
          component: UserCenter,
          meta: { keepAlive: true }
        },
        {
          name: 'Log',
          path: 'log',
          component: Log,
          meta: { keepAlive: true }
        },
        {
          name: 'Pay',
          path: 'pay',
          component: Pay,
          meta: { keepAlive: true }
        }
      ]
    }
  ]
})
// 全局前置路由守卫——初始化的时候被调用，每次路由切换的时候调用
// router.beforeEach((to, from, next) => {
//   // to表示是要到那里去，from表示从哪里来
//   console.log(to, from);
//   // 这里的书写表明需要进行检验，如果值为true,就说明需要进行检验，如果值为false，就说明不需要检验
//   if (to.meta.isAuth) {
//     if (localStorage.getItem('school') === 'Scnuc') {
//       next()
//     } else {
//       alert('学校名字不对')
//     }
//   } else {
//     next()
//   }
// })


// 全局后置路由守卫——初始化的时候调用,每次路由切换之后调用
router.afterEach((to, from) => {
  // // 后置路由守卫没有next这个参数
  // console.log('后置路由守卫', to, from);
  // document.title = to.meta.title || "index"
})
export default router