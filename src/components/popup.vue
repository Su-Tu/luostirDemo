<template>
  <div v-if="visible" class="popup">
    <div class="popup-content">
      <el-button @click="closePopup" icon="el-icon-close" style="position: absolute; border: none;right: 0%;top: 1%;font-size: 20px;"></el-button>
      <el-form ref="form" :model="form" label-width="60px">
        <el-form-item label="用户名">
          <el-input v-model="form.name" id="popinput"></el-input>
        </el-form-item>
        <el-form-item label="密码重设">
          <el-input v-model="form.password" id="popinput"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="form.credit" id="popinput"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" id="popinput"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="form.real_name" id="popinput"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.tel" id="popinput"></el-input>
        </el-form-item>
        
        <el-form-item label="年龄">
          <el-input v-model.number="form.age" id="popinput"></el-input>
        </el-form-item>

        <el-form-item label="性别" style="text-align: left;">
          <el-radio-group v-model="form.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit" style="margin-right: 50px">修改</el-button>
        </el-form-item>
        
      </el-form>
    </div>
  </div>
</template>
 
<script>
import axios from 'axios';
import { Message } from 'element-ui';
export default {
  name:'popup',
  data(){
    return {
      form:{
        credit:'',
      name:'',
      sex:'',
      email:'',
      tel:'',
      age:null,
      password:'' ,
      real_name:'',
      datetime:'',
      parking_records:[]
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    closePopup() {
      this.$emit('close');
    },
    onSubmit(){
      if(this.form.name==''){
        this.form.name =this.$store.state.user.userName
      }
      if(this.form.email == ''){
        this.form.email = this.$store.state.user.email
      }
      if(this.form.tel == ''){
        this.form.tel = this.$store.state.user.telNum
      }
      if(this.form.credit == ''){
        this.form.credit = this.$store.state.user.credit
      }
      if(this.form.age == ''){
        this.form.age = this.$store.state.user.age
      }
      if(this.form.sex == ''){
        this.form.sex = this.$store.state.user.sex
      }
      if(this.form.password == ''){
        this.form.password = this.$store.state.user.password
      }
      if(this.form.real_name == ''){
        this.form.real_name = this.$store.state.user.password.name
      }
      axios({
      url:"http://192.168.123.130:8080/user/edit",
      method:"PUT",
      data:{
        id:this.$store.state.user.id,
        account:this.form.name,
        name:this.form.name,
        email:this.form.email,
        phone:this.form.tel,
        credit:this.form.credit,
        age:this.form.age,
        sex:this.form.sex,
        password:this.form.password,
        real_name:this.form.real_name,
        datetime:this.form.datetime,
        parking_records:this.form.parking_records
      },
    }).then(res=>{
      console.log(res.data);
      this.$store.commit("user/renewdata",res.data)
      Message({
        type:'success',
        message:'修改成功'
      })
    }).catch(error=>{
      console.dir(error)
      Message({
        type:'error',
        message:'修改失败'
      })
    })
    }
  }
}
</script>
 
<style scoped>
.popup {
  position: fixed;
  top: 0%;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-content: flex-start;
  justify-content: center;
  align-items: center;
}
 
.popup-content {
  width: 600px;
  position: relative;
  background: #fff;
  padding: 30px;
  padding-top: 50px;
  border-radius: 5px;
}
 
.close-button {
  margin-top: 10px;
}

</style>