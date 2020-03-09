<template>
  <div class="login-container">
    <el-form
      class="login-form"
      autocomplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
    >
      <div class="title-container">
        <img src="../../assets/cloud.png" style="width:250px" />
        <!-- <h3 class="title">注册</h3> -->
      </div>
      <el-form-item prop="username">
        <el-input
          prefix-icon="el-icon-user-solid"
          name="username"
          type="text"
          v-model="loginForm.username"
          autocomplete="on"
          placeholder="请输入手机号码"
        ></el-input>
      </el-form-item>

      <el-form-item prop="message">
        <el-row>
          <el-col :span="15">
            <el-input
              prefix-icon="el-icon-message"
              name="password"
              v-model="loginForm.message"
              autocomplete="on"
              placeholder="请输入验证码"
            />
          </el-col>
          <el-col :span="8" :offset="1">
            <el-button type="primary" plain>获取验证码</el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-button
        type="primary"
        style="width:100%;margin-bottom:10px;"
        :loading="loading"
        @click="signup"
      >注册</el-button>
      <el-link type="primary" style="float:right" @click="login">已有账号，去登录</el-link>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("手机号码格式不正确"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        message: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        message: [{ required: true, trigger: "blur", message: "请输入验证码" }]
      },
      loading: false,
      activeName: "1"
    };
  },
  methods: {
    signup() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
        } else {
          return false;
        }
      });
    },
    login() {
      this.$router.push("/login");
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #4a4949;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
//   background-color: $bg;
  background-image: url("../../assets/bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    background-color: #f8f8f9;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>
