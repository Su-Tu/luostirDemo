<template>
  <div class="whole">
    <div class="left">
      <div id="avatar">
        <label for="img">
          <img :src='circleUrl' alt="">
        </label>
        <input type="file" id="img" value="null" style="opacity: 0;" name="img" ref="avatar"  @change="updateAvatar">
      </div>
      <div id="msg1">
        <span style="display: block; font-size: 20px;color: rgb(97, 169, 252);">姓名：<span style="color: #fff;">{{ name }}</span></span>
        <span style="display: block; font-size: 20px;color: rgb(97, 169, 252);">年龄：<span style="color: #fff;">{{ age }}</span></span>
        <div class="myself">
          <router-link :to="{name: 'UserCenter'}">个人信息</router-link>
        </div>
        <div class="mylog">
          <router-link :to="{name: 'Log'}">停车记录</router-link>
        </div>
        <!-- <router-link :to="{name: 'Pay'}" style="color: #fff;">支付记录</router-link> -->
      </div>
    </div>
    <div>
      
      <keep-alive :include="['UserCenter','Log','Pay']" v-if="$route.meta.keepAlive">
        <transition 
        name="animate__animated animate__bounce"
        enter-active-class="animate__zoomOut"
        leave-active-class="animate__fadeOut"
        >
          <router-view></router-view>
        </transition>

      </keep-alive>
    </div>
    <popup :visible="popupVisible" @close="closePopup" @submit="change"></popup>
  </div>
</template>

<script>
import axios from 'axios';
import "animate.css"
import popup from '../components/popup.vue';
import UserCenter from './UserCenter.vue';
import Log from './Log.vue';
import Pay from "./Pay.vue"
import { Message } from 'element-ui';
export default {
name:'PersonMsg',
components:{
  popup,
  UserCenter,
  Log,
  Pay
},
data(){
  return {
    popupVisible: false,
  }
},
created(){
      if (this.$route.name !== 'UserCenter') {
      this.$router.replace({ name: 'UserCenter' });
    }
    },
computed:{
  circleUrl(){
    return this.$store.state.user.circleUrl
  },
  makeIdCard(){
    return this.id.slice(0,6)+"********"+this.id.slice(14)
  },
  name(){
    return this.$store.state.user.real_name
  },
  age(){
    return this.$store.state.user.age
  }
},
methods:{
  amend(){
    this.popupVisible = true;
  },
  closePopup() {
    this.popupVisible = false;
  },
  change(item){
    if(item.name != ''){
      this.userName = item.name
    }
    if(item.tel != ''){
      this.telNum = item.tel
    }
    if(item.age != ''){
      this.age = item.age
    }
    if(item.car != ''){
      this.carNum = item.car
    }
  },
  enter(el, done) {
      el.classList.add('animate__zoomIn');
      done();
    },
    leave(el, done) {
      el.classList.add('animate__zoomOut');
      done();
    },
  updateAvatar(e){
    console.log(e.target.files[0]);
    console.log(this.$store.state.user.id);
    const fd  = new FormData()
    fd.append('file',e.target.files[0])
    fd.append('user_id', this.$store.state.user.id)
    console.log(fd);
    axios({
      url:'http://192.168.123.130:8080/image/upload',
      method:'POST',
      data:fd
    }).then(res=>{
      console.log(res);
      axios({
      url:`http://192.168.123.130:8080/image/get_img/${this.$store.state.user.id}`,
      method:'GET',
      }).then(res=>{
        console.log(res);
        const newurl = res.data.url + '?v=' + new Date().getTime();
        this.$store.commit('user/change',newurl)
      }).catch(err=>{
        console.dir(err)
      })
      Message({
        type:'success',
        message:'上传成功'
      })
    }).catch(err=>{
      console.dir(err);
      Message({
        type:'error',
        message:'上传失败'
      })
    })
   
  }
  
}
}
</script>

<style scoped>

.whole{
  width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: space-evenly;
  padding-top: 20px;
}
.left{
  width: 250px;
  height: 500px;
}
#avatar{
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-image: url('../assets/img/图像67.png');
  background-clip:content-box;
  background-size:contain;
  margin: 0 auto;
}
#avatar img{
  width: 200px;
  height: 200px;
  padding: 40px;
  border-radius: 50%;
}
#msg1{
  position: relative;
  width: 250px;
  height: 350px;
  background-color: rgba(98, 134, 175,0.2);
  margin: 0 auto;
  margin-top: 40px;
  padding-top: 30px;
  padding-left: 40px;
  border: 6px solid rgb(42, 91, 146);
  border-radius: 5%;
  text-align: left
}

#avatar:hover img{
  cursor: pointer;
}

.myself{
  position: absolute;
  
  width: 100px;
  height: 35px;
  bottom: 10%;
  left: 4%;
  /* border: 1px solid white; */
  background-image: url(../assets/img/msg.png);
  background-size: cover;
  background-repeat: no-repeat;
}
.mylog{
  position: absolute;
  
  width: 100px;
  height: 35px;
  bottom: 10%;
  right: 4%;
  /* border: 1px solid white; */
  background-image: url(../assets/img/log.png);
  background-size: cover;
  background-repeat: no-repeat;
}
.myself a ,
.mylog a{
  display: block; 
  height: 100%; 
  font-size: 15px;
  line-height: 35px; 
  border-radius: 10px;
  text-align: center; 
  white-space: nowrap; /* 不换行 */
  overflow: hidden; 
  text-overflow: ellipsis; /* 溢出显示省略号 */
  color: #fff; 
  text-decoration: none;
}
.myself:hover a{
  background-color: rgb(10, 100, 36,0.3);
  /* color: rgb(97, 169, 252); */
}
.mylog:hover a{
  background-color: rgba(122, 17, 138, 0.2);
  /* color: rgb(97, 169, 252); */
}
</style>