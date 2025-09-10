<template>
  <div class="Top-msg">
    <div class="demo-avatar">
      <el-avatar :size="50" :src="circleUrl"></el-avatar>
    </div>
    <span style="color: white;display: inline-block;font-size: 20px;letter-spacing: 2px;">Hi,{{ name }}</span>
  </div> 
</template>

<script>
// 使用引用解决图片的路径问题
export default {
  name:'StatusBar',
  computed:{
  circleUrl(){
    return this.$store.state.user.circleUrl
  },
  name(){
    return this.$store.state.user.userName
  }
},
}
</script>

<style scoped>
.Top-msg{
  display: flex;
  align-items: center;
}
.demo-avatar{
  margin-top: 10px;
  margin-right: 15px;
}
</style>