<template>
  <div class="content">
    <el-form 
    :model="ruleForm" 
    status-icon :rules="rules" 
    ref="ruleForm" 
    label-width="100px" 
    class="demo-ruleForm">
      <el-form-item>
        <h1>登录</h1>
      </el-form-item>
      <el-form-item 
      prop="user" 
      class="user" 
      style="position: relative;">
        <el-input type="text" v-model="ruleForm.user" autocomplete="off" placeholder="请输入账号" ></el-input>
      </el-form-item>
      <el-form-item  
      prop="Pass" 
      class="password" 
      style="position: relative;" >
        <el-input type="password" v-model="ruleForm.Pass" autocomplete="off" :show-password="true" placeholder="请输入密码"></el-input>
      </el-form-item>

      <el-form-item 
      prop="code" 
      class="sidentify" 
      style="position: relative;max-width: 70%;margin-bottom: 25px;">
        <el-input type="text" v-model="ruleForm.code" autocomplete="off" placeholder="请输入验证码" ></el-input>
        <div class="checkcode" @click="refreshCode" >
          <Sidentify :identifyCode="identifyCode"></Sidentify>
        </div>
        <a href="#" style="position: absolute;display: block;font-size: 14px;right: -50%;top:120%;color:white;">忘记密码?</a>
        <span style="position: absolute;left: 0;top: 120%;color: #fff;">还没有账号?<router-link :to="{name:'Register'}" style="color: rgb(44, 226, 233);">去注册</router-link></span>
      </el-form-item>

      <el-form-item style="margin-top: 50px;margin-bottom: 0">
        <el-button type="primary" @click="submitForm" style="width: 100%; font-size: 18px;letter-spacing: 10px;">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
import Sidentify from '../components/Sidentify.vue';
import { MessageBox } from 'element-ui';
import { Message } from 'element-ui';
// import {mapState,mapGetters,mapActions,mapMutations} from 'vuex'
  export default {
    name:'Login',
    components:{
      Sidentify
    },
    data() {
      let validateuser = (rule, value, callback) => {
       
        if (value === '') {
          callback(new Error('请输入账号！'));
        } 
        else{
          callback();
        }
      };
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码！'));
        }
        else {
          callback();
        }
      };
      let validatecheck = (rule,value,callback)=>{
        if(value === ''){
          callback(new Error('请输入验证码！'))
        }
        else if(value != this.identifyCode){
          callback(new Error('验证码错误！'))
        }else{
          callback()
        }
      };
      return {
        ruleForm: {
          user: '',
          Pass: '',
          code: '',
        },
        identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz',
        identifyCode: '',
        rules: {
          user: [
            { validator: validateuser, trigger: 'blur' }
          ],
          Pass: [
            { validator: validatePass, trigger: 'blur' }
          ],  
          code:[
            { validator: validatecheck, trigger:'blur' }  
          ],
        }

      };
    },
    methods: {
      submitForm() {
        if(this.ruleForm.user === ''){
          return this.openUser()
        }else if(this.ruleForm.Pass === ''){
          return this.openPass()
        }else if(this.ruleForm.code != this.identifyCode){
          return this.openCode()
        }
       axios({
        url:'http://192.168.123.130:8080/user/login',
        method:'POST',
        data:{
          name:this.ruleForm.user,
          password:this.ruleForm.Pass,
          account:this.ruleForm.user
        }
       }).then(res=>{
        if(res.status>=200&&res.status<300){
          this.success()
          console.log(res.data);
          this.$store.commit('user/updata',res.data)
          axios({
            url:`http://192.168.123.130:8080/image/get_img/${this.$store.state.user.id}`,
            method:'GET',
          }).then(respone=>{
            console.log(respone);
            const newurl = respone.data.url + '?v=' + new Date().getTime();
            this.$store.commit('user/change',newurl)
          }).catch(err=>{
            console.dir(err)
          })
          axios({
            url:`http://192.168.123.130:8080/As/Check`,
            method:'GET',
          }).then(respone=>{
            console.log(respone.data);
            this.$store.commit('park/p_occupy', respone.data)
          }).catch(err=>{
            console.dir(err)
          })
          this.ruleForm.user = ""
          this.ruleForm.Pass = ''
          this.ruleForm.code = ''
          this.$router.replace({
            name:'Steer'
          })
          this.$store.commit('bg/change','box2')
          this.$store.commit("bg/to","1")
        }
       }).catch(error=>{
        console.dir(error)
        this.fail(error.response.data.detail)
       })
      },
      refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
      },
      makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
        }
      },
      randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
      },
      openUser() {
        MessageBox.alert('账号不能为空！', '', {
          confirmButtonText: '确定',
          iconClass:'el-icon-error',
          callback: action => {
            Message({
              type: 'error',
              message: `账号不能为空！`
            });
          }
        });
      },
      openPass() {
        MessageBox.alert('密码不能为空！', '', {
          confirmButtonText: '确定',
          iconClass:'el-icon-error',
          callback: action => {
            Message({
              type: 'error',
              message: `密码不能为空！`
            });
          }
        });
      },
      openCode() {
        MessageBox.alert('验证码错误！', '', {
          confirmButtonText: '确定',
          iconClass:'el-icon-error',
          callback: action => {
            Message({
              type: 'error',
              message: `验证码错误！`
            });
          }
        });
      },
      success() {
        Message({
          message: '登录成功！',
          type: 'success'
        });
      },
      fail(msg){
        Message({
          message:'登录失败,'+msg,
          type:'error'
        });
      },
  },
   mounted () {
    // 初始化验证码
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  }, 
}
</script>

<style scoped>
h1{
  color: white;
  text-align:center;
  font-size: 35px;
  letter-spacing: 10px;
}
form{
  width: 90%;
}
.content{
  border: 3px solid rgb(57, 118, 181);
  margin: 0;
  font-size: 18px;
}
a:hover{
 color: red !important;
}
.checkcode{
  width: 120px;
  height: 100%;
  position: absolute;
  right: -50%;
  top:0;
}

</style>