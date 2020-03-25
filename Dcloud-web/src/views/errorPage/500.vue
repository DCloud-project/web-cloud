<template>
  <div class="error500">
    <ul class="content">
      <li :style="{ color: '#000000', fontSize:'20px',top:'10px'}">大 家 好 , 我 是</li>
      <li :style="{ color: '#ff002f',fontSize: '60px'}">500！！！</li>
    </ul>
    <ul class="content">
      <li :style="{ color: '#c3bdbd', fontSize:'15px'}">呃，服务器君打瞌睡啦~</li>
      <li :style="{ color: '#ece3e3',fontSize: '12px'}">(所以暂时将你眼睛闭了起来)</li>
      <el-button type="primary" plain size="medium" @click="back" style="margin-left: 30px;
}">返回首页</el-button>
    </ul>
    <div class="img500">
      <img :src="img_500" alt="500" />
    </div>
  </div>
</template>

<script>
import img_500 from "@/assets/500_images/500.png";

export default {
  name: "page500",
  data() {
    return {
      img_500
    };
  },
  methods: {
    back() {
      this.$router.push({ path: "/home" });
    },
  }
};
</script>
<style lang="scss" scoped>
.img500 {
  display: inline-block;
  vertical-align: middle;
  margin-left: 33%;
}
.content {
  text-align: center;
}
li {
  display: inline;
  font-weight: bold;
}
</style>