<template>
  <div class="content">
    <el-form 
    :model="ruleForm" 
    :rules="rules"
     ref="ruleForm" 
     label-width="100px" 
     class="demo-ruleForm">
      <el-form-item style="margin-bottom: 0;">
        <h1>注册</h1>
      </el-form-item>
      <el-form-item  
      prop="user" 
      class="user"
      style="position: relative;">
        <el-input v-model="ruleForm.user" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item  
      prop="pass" 
      class="password"
      style="position: relative;">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="请设置密码" :show-password="true"></el-input>
      </el-form-item>

      <el-form-item 
      prop="checkPass" 
      class="password"
      style="position: relative;">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="请确认密码" :show-password="true"></el-input>
      </el-form-item>

      <el-form-item 
      prop="code" 
      class="sidentify" 
      style="position: relative;max-width: 70%;">
        <el-input type="text" v-model="ruleForm.code" autocomplete="off" placeholder="请输入验证码" ></el-input>
        <div class="checkcode" @click="refreshCode" >
          <Sidentify :identifyCode="identifyCode"></Sidentify>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" style="width: 100%;margin-top: 20px; font-size: 18px;letter-spacing: 10px;">注册</el-button>
        <span style="position: absolute;left: 40%;top: 100%;color: #fff;">已有账号?<router-link :to="{name:'Login'}" style="color: rgb(44, 226, 233);">去登录</router-link></span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
import Sidentify from '../components/Sidentify.vue';
import { MessageBox } from 'element-ui';
import { Message } from 'element-ui';
export default {
    name:'Register',
    components:{
      Sidentify
    },
    data() {
      let validateuser = (rule, value, callback) => {
         const reg = /[^\u4e00-\u9fa5]+/g
        if (value === "") {
          callback(new Error('账号不能为空!'));
        }else if(!reg.test(value)){
          callback(new Error('账号不应包含有汉字！'))
        }else{
          callback();
          this.$store.commit('user/checkuser',true)
        }
      };
      let validatePass = (rule, value, callback) => {
        const reg = /^(?:[^0-9]*[0-9]){5,}.*$/
        const reg1 =/[a-z]/
        const reg2 =/[A-Z]/
        if (value === '') {
          callback(new Error('请输入密码!'));
        } else if(value.length<8){
          callback(new Error('密码长度不应该小于8位！'))
        }else if(value.length>12){
          callback(new Error('密码长度不应大于12位！'))
        }
        else if(!reg.test(value)){
          callback(new Error('密码至少含有5位数字！'))
        }else if(!reg1.test(value)){
          callback(new Error('密码中至少含有1位小写字母！'))
        }else if(!reg2.test(value)){
          callback(new Error('密码中至少含有1位大写字母！'))
        }else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
          this.$store.commit('user/checkpass',true)
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码!'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      let validatecheck = (rule,value,callback)=>{
        if(value === ''){
          callback(new Error('请输入验证码!'))
        }
        else if(value != this.identifyCode){
          callback(new Error('验证码错误!'))
        }else{
          callback()
          
        }
      };
      return {
        ruleForm: {
          user: '',
          pass: '',
          checkPass:'',
          code: '',
        },
        identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz',
        identifyCode: '',
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          user: [
            { validator: validateuser, trigger: 'blur' }
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
        }
        else if(this.ruleForm.pass != this.ruleForm.checkPass){
          return this.openCheck()
        }else if(this.ruleForm.pass === ''){
          return this.openPass()
        }else if(this.ruleForm.code != this.identifyCode){
          return this.openCode()
        }else if(!this.$store.state.user.check.userCheck){
          Message({
            type:'error',
            message:'账号格式有误！'
          })
          return
        }else if(!this.$store.state.user.check.passCheck){
          Message({
            type:'error',
            message:'密码格式有误！'
          })
          return
        }
       axios({
        url:'http://192.168.123.130:8080/user/register',
        method:'POST',
        data:{
          name:this.ruleForm.user,
          password:this.ruleForm.checkPass,
          account:this.ruleForm.user
        }
       }).then(res=>{
        if(res.status>=200&&res.status<300){
          this.success()
          console.log(res.data);
          this.ruleForm.user = ""
          this.ruleForm.pass = ''
          this.ruleForm.checkPass = ''
          this.ruleForm.code = ''
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
      openCheck() {
        MessageBox.alert('两次密码不一样！', '', {
          confirmButtonText: '确定',
          iconClass:'el-icon-error',
          callback: action => {
            Message({
              type: 'error',
              message: `两次密码不一样！`
            });
          }
        });
      },
      success() {
        Message({
          message: '注册成功！',
          type: 'success'
        });
      },
      fail(msg){
        Message({
          message:'注册失败,'+ msg,
          type:'error'
        })
      }
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
.checkcode{
  width: 120px;
  height: 100%;
  position: absolute;
  right: -50%;
  top:0;
}
a:hover{
 color: red !important;
}
</style>