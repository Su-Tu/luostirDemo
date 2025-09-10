<template>
  <div v-if="visible" class="popup">
    <div class="popup-content">
      <el-button @click="closePopup" icon="el-icon-close" style="position: absolute; border: none;right: 0%;top: 1%;font-size: 20px;"></el-button>
      <el-input
        type="textarea"
        :rows="10"
        placeholder="请写下你的反馈"
        v-model="textarea">
      </el-input>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name:'popup1',
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