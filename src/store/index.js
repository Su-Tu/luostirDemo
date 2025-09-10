// 该文件用于创建store中最为核心的store
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import avatar from '../assets/img/Avatar.png'

// import { nanoid } from 'nanoid'
Vue.use(Vuex)
// 注意，这里有一个报错问题，vuex的使用必须要在store创建之前，所以，要在这里使用Vuex
// 注意，调整代码的顺序是不会改变import语句的执行，脚手架的规则就是先执行所有的import语句


// 使用vuex的模块化，只要将namesapced这个配置项的值设置为true就可以
const bg = {
  namespaced: true,
  state: {
    classStyle: 'box1',
    active_route: '1',
  },
  actions: {

  },
  mutations: {
    change(state, value) {
      state.classStyle = value
    },
    to(state, value) {
      state.active_route = value
    }
  }
}

const user = {
  namespaced: true,
  state: {
    circleUrl: avatar,
    userName: "",
    email: '',
    telNum: '',
    age: null,
    id: null,
    password: '',
    name: '',
    sex: '',
    parking_records: [],
    credit: "",
    check: {
      userCheck: false,
      passCheck: false,
    }
  },
  actions: {

  },

  mutations: {
    change(state, value) {
      state.circleUrl = value
    },
    updata(state, value) {
      state.userName = value.account,
        state.email = value.email,
        state.id = value.id,
        state.age = value.age,
        state.password = value.password,
        state.name = value.real_name,
        state.telNum = value.phone,
        state.sex = value.sex
      state.parking_records = value.parking_records
      state.credit = value.credit
      // console.log(state.userName, state.email, state.id);

    },
    renewdata(state, value) {
      state.userName = value.account,
        state.email = value.email,
        state.age = value.age,
        state.password = value.password,
        state.name = value.real_name,
        state.telNum = value.phone,
        state.sex = value.sex
      state.credit = value.credit
    },
    checkuser(state, value) {
      state.check.userCheck = value
    },
    checkpass(state, value) {
      state.check.passCheck = value
    }
  }
}

const park = {
  namespaced: true,
  state: {
    occupy: [],
    num: 26
  },
  mutations: {
    p_occupy(state, value) {
      state.occupy = value
      console.log(state.occupy);
      let n = 0
      for (let i = 0; i < state.occupy.length; i++) {
        if (state.occupy[i] == 0) {
          n++
        }
      }
      state.num = n
    }
  }
}


// 创建store
const store = new Vuex.Store({
  modules: {
    bg,
    user,
    park
  }
})

export default store