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
        <img src="../../assets/cloud.png" style="width:250px;" />
        <!-- <h3 class="title">{{login.title}}</h3> -->
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="密码登录" name="1"></el-tab-pane>
          <el-tab-pane label="短信验证码登录" name="2"></el-tab-pane>
        </el-tabs>
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

      <el-form-item v-show="activeName=='1'" prop="password">
        <el-input
          prefix-icon="el-icon-lock"
          name="password"
          :type="passwordType"
          v-model="loginForm.password"
          autocomplete="on"
          placeholder="请输入密码"
        >
          <i slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" />
          </i>
        </el-input>
      </el-form-item>
      <el-form-item v-show="activeName=='2'" prop="message">
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
        @click="handleLogin"
      >登录</el-button>
      <el-link type="primary" style="float:right" @click="signup">注册</el-link>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        message: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入手机号" }
        ],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
        message: [{ required: true, trigger: "blur", message: "请输入验证码" }]
      },
      passwordType: "password",
      loading: false,
      activeName: "1"
    };
  },
  methods: {
    handleClick(tab, event) {
      if (this.activeName == "2") {
        //验证码登录
      } else {
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      localStorage.setItem("roles", 'superAdmin');
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.activeName == "1") {//密码登录
            this.$axios
              .post(
                "/baseUrl/api/mymanage/admin?username=" +
                  this.loginForm.username +
                  "&password=" +
                  this.loginForm.password
              )
              .then(res => {
                if (res.data.respcode == "1000") {
                  //登录成功
                  this.loading = false;
                  localStorage.setItem("roles", 'superAdmin');
                  localStorage.setItem("isLogin", true);
                  this.$router.push("/home");
                } else {
                  this.$alert(
                    "账号或密码错误，请重新选择或者输入",
                    "登录失败",
                    {
                      confirmButtonText: "确定"
                    }
                  );
                }
              });
          } else {
            //验证码登录
          }
        } else {
          return false;
        }
      });
    },
    signup(){
      console.log("ooo")
       this.$router.push("/signup");
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
  // background-color: $bg;
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
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
