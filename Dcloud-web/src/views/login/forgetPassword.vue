<template>
  <div class="contain">
    <el-row class="grid-content">
      <el-col :span="6">
        <img src="../../assets/cloud.png" style="width:250px;" />
      </el-col>
      <el-col :span="6" class="resetPass">
        <span>重置密码</span>
      </el-col>
      <el-col :span="12">
        <el-button class="loginButton" type="text" @click="login">登录</el-button>
      </el-col>
    </el-row>
    <div class="formcontent">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="resetRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="email">
          <el-input v-model="ruleForm.email" autocomplete="on"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="16">
            <el-form-item label="验证码" prop="message">
              <el-input v-model="ruleForm.message"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-button type="primary" plain :disabled="isDisabled" @click="getMessage()">{{butName}}</el-button>
          </el-col>
        </el-row>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        email: "",
        message: "",
        pass: "",
        checkPass: "",
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
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
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
          if (localStorage.getItem("validateCode") != this.loginForm.message) {
            this.$alert("验证码错误，请重新输入", "注册失败", {
              confirmButtonText: "确定"
            });
          } else {
            this.loading = true;
            var data = {
              email: this.ruleForm.email,
              password: this.ruleForm.pass
            };
            this.$axios.post("/api/resetPass", data, this.config).then(res => {
              this.loading = false;
              this.$router.push("/login");
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getMessage() {
      var time = 60;
      this.$refs.ruleForm.validateField("email", errMsg => {
        if (errMsg) {
        } else {
          var data = {
            email: this.ruleForm.email
          };
          this.$axios.post("/api/sendCode", data, this.config).then(res => {
            localStorage.setItem("validateCode", res.data);
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
.contain {
  position: fixed;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
}
.grid-content {
  height: 60px;
  background-color: #c1d0d0;
}
.resetPass {
  margin-top: 20px;
  font-weight: bold;
  font-size: 18px;
}
.loginButton {
  top: 10px;
  font-size: 18px;
  right: 30px;
  position: absolute;
  color: #ffffff;
  font-weight: bold;
}
.formcontent {
  position: fixed;
  left: 35%;
  top: 150px;
}
</style>