<!--指示板-->
<template>
  <div class="dashboard-editor-container">
    <el-row class="form-style">
      <el-col :span="11" class="form1">
        <el-button type="primary" style="width:100%;margin-bottom:20px;">个人信息</el-button>
        <el-form
          label-width="80px"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          style="width:90%"
        >
          <!-- <el-form-item> -->
          <!-- <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>-->
          <!-- </el-form-item> -->
          <el-form-item label="账号">
            <el-input v-model="ruleForm.email" disabled></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="工号" prop="sno">
            <el-input v-model="ruleForm.sno" placeholder="请输入工号"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="ruleForm.nickname" placeholder="请输入昵称"></el-input>
          </el-form-item>

          <el-form-item label="性别">
            <el-radio-group v-model="ruleForm.sex">
              <el-radio label="0">男</el-radio>
              <el-radio label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="学院" prop="school">
            <el-cascader v-model="ruleForm.school" :options="options" @change="handleChange"></el-cascader>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="ruleForm.birth"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="用户角色">
            <el-tag type="success" v-if="ruleForm.role=='0'">老师</el-tag>
            <el-tag type="success" v-if="ruleForm.role=='1'">管理员</el-tag>
            <el-tag type="success" v-if="ruleForm.role=='2'">超级管理员</el-tag>
          </el-form-item>
          <el-form-item label="经验值">
            <el-input v-model="ruleForm.exp" disabled></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" style="width:40%">提交</el-button>
            <el-button @click="resetForm('ruleForm')" style="width:40%">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="11" class="form2" :offset="1">
        <el-button type="primary" style="width:100%;margin-bottom:20px;">密码修改</el-button>
        <el-form
          :model="ruleForm2"
          status-icon
          :rules="rules2"
          ref="ruleForm2"
          label-width="100px"
          class="demo-ruleForm"
          style="width:90%"
        >
          <el-form-item label="原密码" required>
            <el-input v-model="ruleForm2.oldPass"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass" required>
            <el-input v-model="ruleForm2.pass"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass" required>
            <el-input v-model="ruleForm2.checkPass"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm2('ruleForm2')" style="width:40%">提交</el-button>
            <el-button @click="resetForm2('ruleForm2')" style="width:40%">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>


<script>
export default {
  data() {
    var validateSchool = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择学校及学院"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        // return callback(new Error("手机号不能为空"));
        callback();
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      ruleForm: {
        email: "",
        nickname: "",
        exp: "",
        name: "",
        birth: "",
        phone: "",
        sno: "",
        sex: "1",
        type: 1,
        school: []
      },
      ruleForm2: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        school: [
          { required: false, validator: validateSchool, trigger: "change" }
        ],
        phone: [{ validator: checkPhone, trigger: "blur" }]
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      options: [],
      imageUrl: ""
    };
  },
  created() {
    this.showUserInfo();
    this.showSchool();
  },
  methods: {
    showUserInfo() {
      this.$http
        .get("/api/user/info?" + "email=" + localStorage.getItem("account"))
        .then(
          res => {
            this.ruleForm.email = localStorage.getItem("account");
            this.ruleForm.name = res.data.name;
            this.ruleForm.sno = res.data.sno;
            this.ruleForm.nickname = res.data.nickname;
            this.ruleForm.sex = res.data.sex.toString();
            this.ruleForm.role = res.data.role;
            if (res.data.school != "" && res.data.school != "0") {
              this.ruleForm.school = res.data.school.split("/"); //字符分割
            }
            this.ruleForm.birth = res.data.birth;
            this.ruleForm.phone = res.data.telphone;
            this.ruleForm.exp = res.data.exp;
          },
          res => {
            this.$router.push({
              path: "/" + res
            });
          }
        );
    },
    showSchool() {
      this.$http.get("/api/schools?info=1").then(
        res => {
          this.options = res.data;
        },
        res => {
          this.$router.push({
            path: "/" + res
          });
        }
      );
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            email: this.ruleForm.email,
            nickname: this.ruleForm.nickname,
            sex: this.ruleForm.sex,
            school: this.ruleForm.school,
            telphone: this.ruleForm.phone,
            birth: this.ruleForm.birth,
            name: this.ruleForm.name,
            sno: this.ruleForm.sno,
            image: "0"
          };
          this.$http.put("/api/user/info", data).then(
            res => {
              if (res.data.respCode == "1") {
                this.$alert("用户信息修改成功", "成功", {
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
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm.name1 = "";
      this.ruleForm.sex = "1";
    },
    submitForm2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            email: localStorage.getItem("account"),
            newpassword1: this.ruleForm2.pass,
            newpassword2: this.ruleForm2.checkPass,
            oldpassword: this.ruleForm2.oldPass
          };
          this.$http.post("/api/user/updatePassword", data).then(
            res => {
              if (res.data.respCode == "1") {
                this.$alert("密码修改成功，跳转到登录页重新登录", "成功", {
                  confirmButtonText: "确定"
                });
                localStorage.removeItem("Authorization");
                localStorage.removeItem("isLogin");
                this.$router.push("/login");
              } else {
                this.$alert(res.data.respCode, "失败", {
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
        } else {
          this.$alert("有必填项未填写或者填写错误", "警告", {
            confirmButtonText: "确定"
          });
          return false;
        }
      });
    },
    resetForm2(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm2.oldPass = "";
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleChange(value) {
      this.ruleForm.school = "";
      for (var i = 0; i < value.length; i++) {
        this.ruleForm.school += value[i];
        if (i != value.length - 1) {
          this.ruleForm.school += "/";
        }
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  height: 100vh;
}
.form-style {
  background: #fff;
  padding: 20px;
}
.form1 {
  border: 1px solid #c5c5c5;
  padding: 20px;
}
.form2 {
  border: 1px solid #c5c5c5;
  padding: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 1px dashed;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
  margin: 0 auto;
}
</style>
<style >
.el-upload {
  display: block !important;
  position: relative !important;
  margin-bottom: 20px;
}
</style>
