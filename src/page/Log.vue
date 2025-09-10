<template>
  <div>
    <h1>停车记录</h1>
    <div id="right">
        <ul class="msg2" style="max-height: 400px; overflow: auto; ">
          <li v-for="i in limitedCount" class="limited-list-item" :key="i" style="color: white;width: 100%;height: 120px;">
            <h5 style="text-align: left;margin: 0;padding-left: 10px;height: 60px;font-size: 16px;">日期：{{ parkdata[i].date }}</h5>
            <div style="padding-left: 10px;display: flex;">
              <div style="flex: 1;">车位号：{{ parkdata[i].number }}</div> 
              <div style="flex: 1;">停车时长：{{ parkdata[i].duration }}</div> 
              <div style="flex: 1;">停车费用：{{ parkdata[i].duration*5 }}</div> 
            </div>
          </li>
          <li v-if="isEmpty" style="text-align: center;color: white;font-size: 30px;">暂无记录</li>
        </ul>
    </div>
    <div class="btn" v-if="showLoadMore">
      <button @click="loadMore">加载更多</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemsPerPage: 6, // 每次显示的项数
      currentPage: 1, // 当前页数
    };
  },
  computed: {
    limitedCount() {
      return Math.min(this.currentPage * this.itemsPerPage, this.count);
    },
    showLoadMore() {
      return this.currentPage * this.itemsPerPage < this.count;
    },
    parkdata(){
      if(this.$store.state.user.parking_records.length != 0)
        return this.$store.state.user.parking_records;
      return 
    },
    count(){
      return this.$store.state.user.parking_records.length
    },
    isEmpty(){
      return this.$store.state.user.parking_records.length==0?true:false
    }
  },
  methods: {
    loadMore() {
      if (this.showLoadMore) {
        this.currentPage++;
      }
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

h1{
  margin-top: 0;
  color: white;
  font-size: 32px;
  letter-spacing: 5px;
}

.limited-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.msg2::-webkit-scrollbar{
  display: none
}

.limited-list-item {
  padding: 5px;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.msg2{
  
  padding-left: 50px;
  padding-right: 50px;
  position:absolute;
  top: 3%;
  width: 100%;
  height: 80%;
  background-color: rgba(65, 142, 231, 0.05);
  /* box-sizing: border-box; */
  background-clip:content-box;
  list-style-type: none;
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

.limited-list-item:hover{
  background-color: rgba(50, 108, 195,0.5);
}
</style>