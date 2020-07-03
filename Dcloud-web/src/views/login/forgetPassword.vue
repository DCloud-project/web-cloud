<template>
  <div class="forget-container">
    <!-- <div class="login-form"> -->
    <!-- <el-row> -->
    <el-form
      class="demo-ruleForm"
      :model="ruleForm"
      :rules="resetRules"
      ref="ruleForm"
      label-position="left"
    >
      <div class="title-container">
        <img src="../../assets/cloud.png" style="width:250px" />
      </div>
        <el-form-item prop="email">
        <el-input
          prefix-icon="el-icon-user-solid"
          name="email"
          type="text"
          v-model="ruleForm.email"
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
              v-model="ruleForm.message"
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
      <el-form-item prop="passChange">
        <el-input
          prefix-icon="el-icon-lock"
          type="password"
          v-model="ruleForm.passChange" 
          autocomplete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="checkPassChange">
        <el-input
          prefix-icon="el-icon-finished"
          type="password"
          v-model="ruleForm.checkPassChange"
          autocomplete="off"
          placeholder="请确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" style="width:100%">提交</el-button>
        </el-form-item>
      <el-link type="primary" style="float:right" @click="login">登录</el-link>
    </el-form>
    <!-- </el-row> -->
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      var pattern=/^(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        // if (this.loginForm.checkPass !== "") {
        //   this.$refs.loginForm.validateField("checkPass");
        // }
        if(!pattern.exec(value)){
           callback(new Error("6-16位，由数字、英文、符号三种类型构成，至少包含两种类型字符"));
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.passChange) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        email: "",
        message: "",
        passChange: "",
        checkPassChange: "",
        age: ""
      },
      loading: false,
      butName: "获取验证码",
      isDisabled: false,
      validateCode: "",
      resetRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱",
            trigger: ["blur", "change"]
          }
        ],
        message: [{ required: true, trigger: "blur", message: "请输入验证码" }],
        passChange: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPassChange: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$router.push({ path: "/login" });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (localStorage.getItem("validateCode") != this.ruleForm.message) {
            this.$alert("验证码错误，请重新输入", "注册失败", {
              confirmButtonText: "确定"
            });
          } else {
            this.loading = true;
            var data = {
              email: this.ruleForm.email,
              newpassword: this.ruleForm.passChange,
            };
            this.$http.post("/api/user/forgetPassword", data).then(res => {
              if (res.data.respCode == "1") {
                this.$alert("密码修改成功，跳转到登录页重新登录", "成功", {
                  confirmButtonText: "确定"
                });
                 this.loading = false;
                this.$router.push("/login");
              } else {
                this.$alert(res.data.respCode, "失败", {
                  confirmButtonText: "确定"
                });
              }
             
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getMessage() {
      var time = 60;
      this.$refs.ruleForm.validateField("email", errMsg => {
        if (errMsg) {
        } else {
          var data = {
            email: this.ruleForm.email
          };
          this.$http.post("/api/sendCode", data).then(res => {
              if (res.data.respCode == "请输入真实邮箱") {
                this.$alert("请输入真实邮箱!", "失败", {
                  confirmButtonText: "确定"
                });
              } else {
              localStorage.setItem("validateCode", res.data.respCode);
              }
          });

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
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #4a4949;

.forget-container {
  position: fixed;
  height: 100%;
  width: 100%;
  //   background-color: $bg;
  background-image: url("../../assets/bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  .demo-ruleForm {
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
