<template>
  <div style="width: 100%;">
    <el-menu
      :default-active="$store.state.bg.active_route"
      class="el-menu-vertical-demo"
      style="display: flex;
      border-right: none;
      width: 100%;
      justify-content: space-around;
      background-color: rgba(0,0,0,0);">
      <el-menu-item index="1" @click="first">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>主页</span>
        </template>
      </el-menu-item>
      <el-menu-item index="2" @click="second">
        <i class="el-icon-document"></i>
        <span slot="title">用户中心</span>
      </el-menu-item>

      <el-menu-item index="3" @click="drawer=true">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>设置</span>
        </template>
      </el-menu-item>

      <el-menu-item index="4" @click="third">
        <i class="el-icon-switch-button"></i>
        <span slot="title">退出</span>
      </el-menu-item>
    </el-menu>
    <el-drawer
      title="设置"
      :visible.sync="drawer"
      >
      <el-collapse v-model="activeName" accordion style="padding-left: 50px;">
        <el-collapse-item name="1">
          <template slot="title">
            <h3>权限管理</h3>
          </template>
          <div class="setting">
            停车记录上传
            <el-switch
              v-model="value1"
              active-text="开"
              inactive-text="">
            </el-switch>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
           <h3>反馈</h3>
          </template>
          <div class="setting" @click="submit" style="cursor: pointer;">提交反馈</div>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <h3>关于我们</h3>
          </template>
          <div class="setting" @click="read" style="cursor: pointer;">制作团队</div>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>
    <popup1 :visible="popupVisible" @close="closePopup"></popup1>
    <popup2 :visible="popupVisible1" @close="closePopup1"></popup2>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import popup1 from './popup1.vue';
import popup2 from './popup2.vue';
 export default {
  name:'NavMenu',
  components:{
    popup1,
    popup2
  },
  data(){
    return {
      drawer:false,
      activeName:'1',
      value1:true,
      popupVisible: false,
      popupVisible1: false
    }
  },
  methods: {
    first(){
      if(this.$route.name != 'Steer'){
        this.$store.commit('bg/change','box2')
        this.$router.replace({name:'Steer'})
        this.$store.commit("bg/to", "1")
      }
    },
    second(){
      if(this.$route.name != 'PersonMsg'){
        this.$store.commit('bg/change','box3')
        this.$router.replace({name:'UserCenter'})
        this.$store.commit("bg/to", '2')
      }
    },
    third(){
        MessageBox.confirm('', '退出登录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          iconClass:'el-icon-error',
        }).then(()=>{
          if(this.$route.name != 'Login'){
            this.$store.commit('bg/change','box1')
            this.$router.replace({name:'Login'})
            this.$store.commit("bg/to", "4")
          }
        }).catch(()=>{
          Message({
            type:'info',
            message:'已取消退出'
          })
        })
      
    },
    closePopup() {
      this.popupVisible = false;
    },
    closePopup1(){
      this.popupVisible1 = false
    },
    read(){
      this.popupVisible1 = true
    },
    submit(){
      this.popupVisible = true;
    }
  },
  mounted(){
    console.log(this.$route.path);
  }
  }
</script>

<style>
.el-menu-item{
  font-size: 18px;
  color: white;
}
.el-menu-item:focus, .el-menu-item:hover{
  background-color: rgba(0,0,0,0);
}
.setting{
 text-align: left;
 font-size: 15px;
 border-bottom: 0.5px solid rgb(235, 238, 245);
 letter-spacing: 2px;
}
</style>