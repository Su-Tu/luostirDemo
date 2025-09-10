<template>
  <div>
    <!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick" >
      <el-tab-pane label="登录" name="first" >
      </el-tab-pane>
      <el-tab-pane label="注册" name="second">
      </el-tab-pane>
    </el-tabs> -->
    <div class="content">
      <div 
      class="skip"
      @click="skipTouse"
      >
      直接使用
    </div>
    <keep-alive :include="['register','Login']" v-if="!$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    </div>
  </div>
</template>

<script>
import Login from './Login.vue'
import Register from './Register.vue'
export default {
  name:'Enter',
  components:{
    Login,
    Register
  },
  data() {
      return {
        activeName: 'first',
      };
    },
    created(){
      if (this.$route.name !== 'Login') {
      this.$router.replace({ name: 'Login' });
    }
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab.index, event);
        if(tab.index === '0' && this.$route.name != 'Login'){
          this.$router.replace({
            name:'Login'
          })
        }
        if(tab.index == '1' && this.$route.name != 'Register'){
          this.$router.replace({
            name:'Register'
          })          
        }
      },
      skipTouse(){
        this.$router.replace({
            name:'Steer'
          })
        this.$store.commit('bg/change','box2')
        this.$store.commit("bg/to","1")
      }
      
    }
}
</script>

<style>
.skip{
position: absolute;
      top: 10px;
      right: 10px;
      width: 100px;
      height: 40px;
      color: white;
      line-height: 40px;
      border: 1px solid rgb(57, 118, 181);
      border-radius: 5px;
      text-align: center;
}
.skip:hover{
  background-color: rgb(57, 118, 181);
  cursor: pointer;
}

</style>