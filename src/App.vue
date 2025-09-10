<template>
  <div class="index" :class="classStyle">
    <el-container>
      <el-header v-if="$route.meta.keepAlive">
        <StatusBar></StatusBar>
      </el-header>
      <el-main>
        <keep-alive :include="['Enter']">
          <router-view></router-view>
        </keep-alive>
      </el-main>
      <el-footer v-if="$route.meta.keepAlive">
        <NavMenu></NavMenu>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Enter from './page/Enter.vue'
import NavMenu  from './components/NavMenu.vue';
import StatusBar from './components/StatusBar.vue';
import Steer from './page/Steer.vue';
export default {
  name:'App',
  components:{
    Enter,NavMenu,StatusBar,Steer
  },
  computed:{
    classStyle(){
      return this.$store.state.bg.classStyle
    }
  },
  created(){
    //   if (this.$route.name !== 'Steer') {
    //   this.$router.replace({ name: 'Steer' });
    // }
    if (this.$route.name !== 'Enter') {
      this.$router.replace({ name: 'Enter' });
    }
  },
}
</script>

<style>
* {
  font-family: 思源黑体;
  box-sizing: border-box;
}

.index {
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: -1;
  background-size: cover;
  background-repeat: no-repeat;
  top: 0;
  left: 0;
}
.el-header{
  background-color: rgba(0,0,0,0.5);
}
.el-container {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content:space-between;
}
.v-modal{
  width: 0;
  height: 0;
}
.el-footer {
  display: flex;
  height: 4vh;
  width: 100%;
  align-items: center;
  color: #333;
  text-align: center;
  line-height: 60px;
}
body > .el-container {
  margin-bottom: 40px;
}
.el-main {
  color: #333;
  height: 100%;
  overflow: hidden;
  text-align: center;
  line-height: 70px;
}
.content{
  width: 550px;
  height: 460px;
  margin: 10% 10% 0 53%;
  text-align: center;
  align-items: center;
  padding-right: 20px;
  border-radius: 0 25% 0 25%;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: rgba(66, 113, 176, 0.2);
  box-shadow: 5px 5px 20px 6px rgba(0,0,0,0.2);
}
.el-tabs__item{
  font-size: 18px;
  color: white;
}

.el-tabs--card>.el-tabs__header .el-tabs__item{
  border-bottom: none;
}
.user .el-form-item__content::before {
  content: "";
  position: absolute;
  z-index: 99;
  top: 18%;
  left: 2%;
  width: 25px;
  height: 25px;
  border-right: 2px solid rgb(248, 248, 243);
  padding-left: 11px;
  background-image: url('./assets/img/用户.png');
  background-size: contain;
  background-repeat: no-repeat;
}
.password .el-form-item__content::before{
  content: "";
  position: absolute;
  z-index: 99;
  top: 18%;
  left: 2%;
  width: 25px;
  height: 25px;
  border-right: 2px solid rgb(248, 248, 243);
  padding-left: 11px;
  background-image: url('./assets/img/密码.png');
  background-size: contain;
  background-repeat: no-repeat;
}
.sidentify .el-form-item__content::before{
  content: "";
  position: absolute;
  z-index: 99;
  top: 18%;
  left: 4%;
  width: 25px;
  height: 25px;
  border-right: 2px solid rgb(248, 248, 243);
  padding-left: 11px;
  background-image: url('./assets/img/验证码.png');
  background-size: contain;
  background-repeat: no-repeat;
}
.el-input__inner{
  padding: 0 0 0 50px;
  font-size: 16px;
  width: 100%;
}
#popinput{
  padding-left: 10px;
}
.el-form-item__error{
  color: rgb(240, 108, 108);
  font-size: 13px;
}
.el-form-item__content{
  margin-left: 60px !important;
}
.el-rate{
  margin: 0;
  padding: 0;
}
.box1{
  background-image: url('./assets/img/enter.png');
}
.box2{
  background-image: url('./assets/img/other.png');
}
.box3{
  background-image: url('./assets/img/other.png');
}
.el-drawer__header{
  margin-bottom: 0;
}

.el-collapse{
  padding-left: 50px;
}
</style>