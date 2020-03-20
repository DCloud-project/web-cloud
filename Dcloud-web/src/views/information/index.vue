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
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- </el-form-item> -->
          <el-form-item label="账号">
            <el-input v-model="ruleForm.email" disabled></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入昵称"></el-input>
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
          <el-form-item label="用户角色">
            <el-tag type="success">老师</el-tag>
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
    return {
      ruleForm: {
        email: "",
        name: "",
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
        school: [
          { required: true, validator: validateSchool, trigger: "change" }
        ]
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      options: [
        {
          value: "1",
          label: "福州大学",
          children: [
            {
              value: "1.1",
              label: "经济学",
              children: [
                {
                  value: "1.1.1",
                  label: "经济学"
                },
                {
                  value: "1.1.2",
                  label: "财政学"
                },
                {
                  value: "1.1.3",
                  label: "金融学"
                },
                {
                  value: "1.1.4",
                  label: "国际经济与贸易"
                }
              ]
            },
            {
              value: "1.2",
              label: "法学",
              children: [
                {
                  value: "1.2.1",
                  label: "法学"
                },
                {
                  value: "1.2.2",
                  label: "社会学"
                }
              ]
            },
            {
              value: "1.3",
              label: "文学",
              children: [
                {
                  value: "1.3.1",
                  label: "汉语言文学"
                },
                {
                  value: "1.3.2",
                  label: "英语"
                },
                {
                  value: "1.3.3",
                  label: "德语"
                },
                {
                  value: "1.3.4",
                  label: "日语"
                }
              ]
            },
            {
              value: "1.4",
              label: "理学",
              children: [
                {
                  value: "1.4.1",
                  label: "数学类"
                },
                {
                  value: "1.4.2",
                  label: "应用物理学"
                },
                {
                  value: "1.4.3",
                  label: "化学类"
                },
                {
                  value: "1.4.4",
                  label: "化学"
                },
                {
                  value: "1.4.5",
                  label: "生物技术"
                },
                {
                  value: "1.4.6",
                  label: "应用心理学"
                }
              ]
            },
            {
              value: "1.5",
              label: "工学",
              children: [
                {
                  value: "1.5.1",
                  label: "机械设计制造及其自动化"
                },
                {
                  value: "1.5.2",
                  label: "材料成型及控制工程"
                },
                {
                  value: "1.5.3",
                  label: "过程装备与控制工程"
                },
                {
                  value: "1.5.4",
                  label: "车辆工程"
                },
                {
                  value: "1.5.5",
                  label: "材料科学与工程"
                },
                {
                  value: "1.5.6",
                  label: "电气工程及其自动化"
                },
                {
                  value: "1.5.7",
                  label: "电子信息工程"
                },
                {
                  value: "1.5.8",
                  label: "电子科学与技术"
                },
                {
                  value: "1.5.9",
                  label: "微电子科学与工程"
                },
                {
                  value: "1.5.10",
                  label: "光电信息科学与工程"
                },
                {
                  value: "1.5.11",
                  label: "自动化"
                },
                {
                  value: "1.5.12",
                  label: "计算机类"
                },
                {
                  value: "1.5.13",
                  label: "软件工程"
                },
                {
                  value: "1.5.14",
                  label: "信息安全"
                },
                {
                  value: "1.5.15",
                  label: "物联网工程"
                },
                {
                  value: "1.5.16",
                  label: "数字媒体技术"
                },
                {
                  value: "1.5.17",
                  label: "土木工程"
                },
                {
                  value: "1.5.18",
                  label: "给排水科学与工程"
                },
                {
                  value: "1.5.19",
                  label: "水利水电工程"
                },
                {
                  value: "1.5.20",
                  label: "化学工程与工艺"
                },
                {
                  value: "1.5.21",
                  label: "制药工程"
                },
                {
                  value: "1.5.22",
                  label: "资源循环科学与工程"
                },
                {
                  value: "1.5.23",
                  label: "地质类"
                },
                {
                  value: "1.5.24",
                  label: "资源勘查工程"
                },
                {
                  value: "1.5.25",
                  label: "采矿工程"
                },
                {
                  value: "1.5.26",
                  label: "交通运输类"
                },
                {
                  value: "1.5.27",
                  label: "环境工程"
                },
                {
                  value: "1.5.28",
                  label: "食品科学与工程"
                },
                {
                  value: "1.5.29",
                  label: "建筑学 "
                },
                {
                  value: "1.5.30",
                  label: "风景园林"
                },
                {
                  value: "1.5.31",
                  label: "安全工程"
                },
                {
                  value: "1.5.32",
                  label: "生物工程"
                }
              ]
            }
          ]
        }
      ],
      imageUrl: ""
    };
  },
  created() {
    this.showUserInfo();
  },
  methods: {
    showUserInfo() {
      //获取用户信息
      this.$axios
        .post("/baseUrl/api/mymanage/own?id=" + localStorage.getItem("user_id"))
        .then(res => {
          this.ruleForm.username = res.data.username;
          this.ruleForm.name = res.data.name;
          this.ruleForm.sex = res.data.sex.toString();
          this.ruleForm.phone = res.data.email;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/baseUrl/api/mymanage/altering?id=" +
                localStorage.getItem("user_id") +
                "&name=" +
                this.ruleForm.name +
                "&sex=" +
                this.ruleForm.sex +
                "&email=" +
                this.ruleForm.phone
            )
            .then(res => {
              this.$alert("用户信息修改成功", "成功", {
                confirmButtonText: "确定"
              });
            });
        } else {
          this.$alert("有必填项未填写或者填写错误", "警告", {
            confirmButtonText: "确定"
          });
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
          this.$axios
            .post(
              "/baseUrl/api/mymanage/alter?id=" +
                localStorage.getItem("user_id") +
                "&oldpwd=" +
                this.ruleForm2.oldPass +
                "&newpwd=" +
                this.ruleForm2.pass
            )
            .then(res => {
              if (res.data.respcode == "1000") {
                this.$alert("密码修改成功", "成功", {
                  confirmButtonText: "确定"
                });
              } else if (res.data.respcode == "1001") {
                this.$alert("旧密码错误，修改失败", "失败", {
                  confirmButtonText: "确定"
                });
              }
            });
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
        console.log(value);
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
