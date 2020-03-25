<template>
  <div class="error">
    <ul>
      <li>ERROR</li>
    </ul>
    <el-row>
      <el-col :span="12">
        <div class="imgerror">
          <img :src="img_error" alt="error" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="content">
          <h2 class="contenth2">糟糕，网页遇到了错误</h2>
          <h5 class="contenth5">工程师在紧急修复中，请耐心等待</h5>
          <el-button type="text" icon="el-icon-arrow-left" @click="back">返回首页</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import img_error from "@/assets/error_images/error.jpg";

export default {
  name: "pageerror",
  data() {
    return {
      img_error
    };
  },
  methods: {
    back() {
      this.$router.push({ path: "/home" });
    }
  }
};
</script>
<style lang="scss" scoped>
.error {
  width: 100%;
  height: 100%;
}
.imgerror {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-left: 45%;
  margin-top: 10%;
}
.content {
  position: relative;
  top: 100px;
}
.contenth5 {
  color: #9e9e9e;
  margin-block-start: 0px;
}
ul {
  text-align: center;
}
li {
  display: inline;
  font-weight: bold;
  text-align: center;
  color: #64b4f9;
  font-size: 60px;
}
</style>