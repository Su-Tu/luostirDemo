<template>
  <div v-if="visible" class="popup">
    <div class="popup-content">
      <el-button @click="closePopup" icon="el-icon-close" style="position: absolute; border: none;right: 0%;top: 1%;font-size: 20px;"></el-button>
      <h2>团队成员</h2>
      <div style="text-align: left;font-size: 22px;padding-left: 160px;letter-spacing: 2px;">前端页面制作：Su</div>
      <div style="text-align: left;font-size: 22px;padding-left: 160px;letter-spacing: 2px;">后端服务器搭建：Lin</div>
      <div style="text-align: left;font-size: 22px;padding-left: 160px;letter-spacing: 2px;">算法建构：Liu</div>
      <div style="text-align: left;font-size: 22px;padding-left: 160px;letter-spacing: 2px;">YOLO图片识别：Hong</div>
      <div style="text-align: left;font-size: 22px;padding-left: 160px;letter-spacing: 2px;">UI样式设计：Chen</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name:'popup2',
  data() {
    return {
      textarea: ''
    }
  },
  methods:{
    closePopup(){
      this.$emit('close')
    },
    onsubmit(){
      axios({
        url:'',
        data:{
          textarea:this.textarea
        },

      }).then(res=>{

      }).catch(err=>{
        console.dir(err)
      })
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
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