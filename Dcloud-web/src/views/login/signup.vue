<template>
  <div class="login-container">
    <!-- <div class="login-form"> -->
    <!-- <el-row> -->
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
          placeholder="请输入邮箱"
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
            <el-button
              type="primary"
              plain
              :disabled="isDisabled"
              @click="getMessage()"
              id="dyMobileButton"
            >{{butName}}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input
          prefix-icon="el-icon-lock"
          type="password"
          v-model="loginForm.pass"
          autocomplete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input
          prefix-icon="el-icon-finished"
          type="password"
          v-model="loginForm.checkPass"
          autocomplete="off"
          placeholder="请确认密码"
        ></el-input>
      </el-form-item>
      <el-button
        type="primary"
        style="width:100%;margin-bottom:10px;"
        :loading="loading"
        @click="signup"
      >注册</el-button>
      <el-link type="primary" style="float:right" @click="login">已有账号，去登录</el-link>
    </el-form>
    <!-- </el-row> -->
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.loginForm.checkPass !== "") {
          this.$refs.loginForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.loginForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        message: "",
        pass: "",
        checkPass: ""
      },
      loginRules: {
        username: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱",
            trigger: ["blur", "change"]
          }
        ],
        message: [{ required: true, trigger: "blur", message: "请输入验证码" }],
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      },
      loading: false,
      activeName: "1",
      butName: "获取验证码",
      isDisabled: false,
      validateCode: ""
    };
  },
  methods: {
    getMessage() {
      var time = 60;
      this.$refs.loginForm.validateField("username", errMsg => {
        if (errMsg) {
        } else {
          var data = {
            email: this.loginForm.username
          };
          this.$http.post("/api/sendCode", data).then(
            res => {
              localStorage.setItem("validateCode", res.data);
            },
            res => {
              this.$router.push({
                path: "/" + res
              });
            }
          );

          //倒计时
          let timer = setInterval(() => {
            if (time == 0) {
              clearInterval(timer);
              this.isDisabled = false;
              this.butName = "获取验证码";
            } else {
              this.butName = time + "秒后重试";
              this.isDisabled = true;
              time--;
            }
          }, 1000);
        }
      });
    },
    signup() {
      var flag = false;
      var flag1 = false;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (localStorage.getItem("validateCode") != this.loginForm.message) {
            this.$alert("验证码错误，请重新输入", "注册失败", {
              confirmButtonText: "确定"
            });
          } else {
            this.loading = true;
            var data = {
              email: this.loginForm1.username,
              password: this.loginForm.pass
            };
            this.$http.post("/api/sendCode", data).then(
              res => {
                this.loading = false;
                if (res.data.respCode == "1") {
                  //注册成功  角色默认为教师
                  if (res.data.role == "1") {
                    localStorage.setItem("roles", "teacher");
                  }
                  var date = new Date();
                  localStorage.setItem("loginTime", date.getTime()); //注册时间
                  localStorage.setItem("isLogin", true);
                  localStorage.setItem("Authorization", res.data.token);
                  localStorage.setItem("account", this.loginForm.username);
                  this.$router.push("/home");
                } else {
                   this.loading = false;
                  this.$alert(res.data.respCode, "注册失败", {
                    confirmButtonText: "确定"
                  });
                }
              },
              res => {
                this.$router.push({
                  path: "/" + res
                });
              }
            );
          }
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
