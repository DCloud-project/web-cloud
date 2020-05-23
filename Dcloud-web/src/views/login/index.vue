<template>
  <div class="login-container">
    <div class="login-form">
      <el-form>
        <div class="title-container">
          <img src="../../assets/cloud.png" style="width:250px;" />
          <!-- <h3 class="title">{{login.title}}</h3> -->
        </div>
        <div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="密码登录" name="1"></el-tab-pane>
            <el-tab-pane label="验证码登录" name="2"></el-tab-pane>
          </el-tabs>
        </div>
      </el-form>
      <el-form
        v-show="activeName=='1'"
        autocomplete="on"
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-position="left"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            name="username"
            type="text"
            v-model="loginForm.username"
            autocomplete="on"
            placeholder="请输入邮箱或账号"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
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
        <el-button
          type="primary"
          style="width:100%;margin-bottom:10px;"
          :loading="loading"
          @click="handleLogin"
        >登录</el-button>
        <el-link type="primary" style="float:left" @click="signup()">注册</el-link>
        <el-link type="primary" style="float:right" @click="forgetPass()">忘记密码</el-link>
      </el-form>
      <el-form
        v-show="activeName=='2'"
        autocomplete="on"
        :model="loginForm1"
        :rules="loginRules1"
        ref="loginForm1"
        label-position="left"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            name="username"
            type="text"
            v-model="loginForm1.username"
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
                v-model="loginForm1.message"
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

        <el-button
          type="primary"
          style="width:100%;margin-bottom:10px;"
          :loading="loading"
          @click="handleLogin"
        >登录</el-button>
        <el-link type="primary" style="float:right" @click="signup">注册</el-link>
      </el-form>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginForm1: {
        username: "",
        message: ""
      },
      loginRules: {
        username: [{ required: true, trigger: "blur", message: "请输入邮箱" }],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }]
      },
      loginRules1: {
        username: [{ required: true, trigger: "blur", message: "请输入邮箱" }],
        message: [{ required: true, trigger: "blur", message: "请输入验证码" }]
      },
      passwordType: "password",
      loading: false,
      activeName: "1",
      butName: "获取验证码",
      isDisabled: false
    };
  },
  methods: {
    handleClick(tab, event) {},
    getMessage() {
      var time = 60;
      this.$refs.loginForm1.validateField("username", errMsg => {
        if (errMsg) {
        } else {
          var data = {
            email: this.loginForm1.username
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
          // this.$axios.post("/api/sendCode", data, this.config).then(res => {
          //   // this.validateCode = res.data;
          //   localStorage.setItem("validateCode", res.data);
          // });

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
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      console.log(this.config);
      this.$http.get("/api/menus").then(
                    res => {
                localStorage.setItem("menuList", JSON.stringify(res.data));
              })
      if (this.activeName == "1") {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            //密码登录
            var data = {
              email: this.loginForm.username,
              password: this.loginForm.password
            };
            this.$http.post("/api/loginByPassword", data).then(
              res => {
                if (res.data.respCode == "1") {
                  //登录成功
                   
                  localStorage.setItem("roleId", res.data.role);
                  if (res.data.role == "0") {
                    //登录角色
                    localStorage.setItem("roles", "teacher");
                  } else if (res.data.role == "1") {
                    localStorage.setItem("roles", "admin");
                  } else if (res.data.role == "2") {
                    localStorage.setItem("roles", "superAdmin");
                  }

                  var date = new Date();
                  localStorage.setItem("loginTime", date.getTime()); //登录时间
                  this.loading = false;
                  localStorage.setItem("Authorization", res.data.token);
                  localStorage.setItem("account", this.loginForm.username);
                  localStorage.setItem("isLogin", true);
                  this.$router.push("/home");
                } else {   
                  this.loading = false;
                  this.$alert(res.data.respCode, "登录失败", {
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
        });
      } else {
        //验证码登录
        this.$refs.loginForm1.validate(valid => {
          if (valid) {
            if (
              localStorage.getItem("validateCode") != this.loginForm1.message
            ) {
              this.$alert("验证码错误，请重新输入", "注册失败", {
                confirmButtonText: "确定"
              });
            } else {
              this.loading = true;
              var data = {
                email: this.loginForm1.username
              };
              this.$http.post("/api/loginByCode", data).then(
                res => {
                  this.loading = false;
                  if (res.data.respCode == "1") {
                    //登录成功
                    localStorage.setItem("roleId", res.data.role);
                    if (res.data.role == "0") {
                      //登录角色
                      localStorage.setItem("roles", "teacher");
                    } else if (res.data.role == "1") {
                      localStorage.setItem("roles", "admin");
                    } else if (res.data.role == "2") {
                      localStorage.setItem("roles", "superAdmin");
                    }
                    var date = new Date();
                    localStorage.setItem("loginTime", date.getTime()); //登录时间
                    this.loading = false;
                    localStorage.setItem("Authorization", res.data.token);
                    localStorage.setItem("account", this.loginForm.username);
                    localStorage.setItem("isLogin", true);
                    this.$router.push("/home");
                  } else {
                    this.loading = false;
                    this.$alert(res.data.respCode, "登录失败", {
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
          }
        });
      }
    },
    signup() {
      this.$router.push("/signup");
    },
    forgetPass() {
      this.$router.push("/forgetPassword");
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
