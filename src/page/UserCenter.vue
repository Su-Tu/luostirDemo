<template>
  <div>
      <h1>用户个人中心</h1>
      <div id="right">
        <div class="msg2">
          <span class="item">用户名：<span style="color: #fff;">{{ userName }}</span></span>
          <span class="item">邮箱：<span style="color: #fff;">{{ email }}</span></span>
          <span class="item">手机号：<span style="color: #fff;">{{ telNum }}</span></span>
          <span class="item">身份证号：<span style="color: #fff;">{{ makeIdCard }}</span></span>
        </div>
      </div>
      <div class="btn">
        <button @click="amend">修改信息</button>
      </div>
      <popup :visible="popupVisible" @close="closePopup"></popup>
    </div>
</template>

<script>
import popup from '../components/popup.vue';
export default {
  name:"UserCenter",
  components:{
    popup
  },
  data(){
    return {
      popupVisible: false,
    }
  },
  computed:{
    userName(){
      return this.$store.state.user.userName
    },
    email(){
      return this.$store.state.user.email
    },
    telNum(){
      return this.$store.state.user.telNum
    },
    credit(){
      return this.$store.state.user.credit
    },
    makeIdCard(){
      if(this.$store.state.user.credit != null && this.$store.state.user.credit != "")
        return this.$store.state.user.credit.slice(0,6)+"********"+this.$store.state.user.credit.slice(14)
      return " "
    },
    age(){
      return this.$store.state.age
    },
  },
  methods:{
    amend(){
      this.popupVisible = true;
    },
    closePopup() {
      this.popupVisible = false;
    },
    
  },
  
}
</script>

<style scoped>
#right{
  width: 811px;
  height: 490px;
  position: relative;
  background-image: url('../assets/img/图像71.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.msg2{
  padding: 50px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  text-align: left;
  background-color: rgba(65, 142, 231, 0.05);
  background-clip:content-box;
}

.item{
  width: 50%; 
  height: 50px;
  line-height: 50px;
  margin-top: 20px;
  display: block; 
  font-size: 20px;
  padding-left: 10px;
  letter-spacing: 1px;
  color: rgb(97, 169, 252);
}

h1{
  margin-top: 0;
  color: white;
  font-size: 32px;
  letter-spacing: 5px;
}

.btn{
  width: 160px;
  height: 55px;
  line-height: 55px;
  margin: 0px auto;
  background-image: url('../assets/img/修改按钮.png');
  background-size: cover;
  background-repeat: no-repeat;
}

.btn button{
  width: 100%;
  height: 100%; 
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 2px;
  background-color: rgba(50, 108, 195,0.1);
  border: none;
  color: #fff;
  padding: 10px;
  background-clip:content-box
}
.btn:hover button{
  cursor: pointer;
  border-radius: 20px;
  background-color: rgba(50, 108, 195,0.5);
}

</style>