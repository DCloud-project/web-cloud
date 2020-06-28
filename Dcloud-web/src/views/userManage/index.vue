<template>
  <div class="app-container">
    <div class="form-style">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" size="small" @click="addData()" icon="el-icon-plus">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" size="small" @click="deleteData()" icon="el-icon-delete">删除</el-button>
        </el-form-item>

        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="resetData()">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="searchData()">查询</el-button>
        </el-form-item>
        <el-form-item label="状态：" style="float:right">
          <el-select v-model="formInline.state" placeholder="请选择状态" size="small">
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名：" style="float:right">
          <el-input placeholder="请输入用户名" size="small" v-model="formInline.username"></el-input>
        </el-form-item>
      </el-form>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="Loading"
        fit
        highlight-current-row
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="序号" type="index" width="50" align="center">
          <template slot-scope="scope">
            <span>{{(page - 1) * pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" min-width="50" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sex=='1'">男</span>
            <span v-if="scope.row.sex=='0'">女</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="电话号码" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.tel}}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="邮箱" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.email}}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" min-width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.roleId=='0'">教师</span>
            <span v-if="scope.row.roleId=='1'">管理员</span>
            <span v-if="scope.row.roleId=='2'">超级管理员</span>
            <!-- <span>{{scope.row.role}}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="50" align="center">
          <template slot-scope="scope">
            <el-button
              :type="btnState(scope.row.state)"
              plain
              @click="changeState(scope.row)"
              size="small"
            >{{filterState(scope.row.state)}}</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="所属机构" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.schoolName}}</span>
          </template>
        </el-table-column>-->
        <el-table-column align="center" label="操作" min-width="150">
          <template slot-scope="scope">
            <div>
              <!--  <el-link type="primary" @click="permissionAssign(scope.row)">分配权限</el-link>
              <el-divider direction="vertical"></el-divider>-->
              <el-link type="primary" @click="editData(scope.row)">编辑</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger" @click="resetPass(scope.row)">重置密码</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :total="totalNum"
        v-if="totalNum!=0"
        :page-size="pageSize"
      ></el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" :disabled="title=='修改用户信息'" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="ruleForm.sex" label="1">男</el-radio>
          <el-radio v-model="ruleForm.sex" label="0">女</el-radio>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <!-- <el-select v-model="ruleForm.role" placeholder="请选择角色" style="width:100%">
            <el-option
              v-for="item in ruleForm.roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>-->
          <el-radio v-model="ruleForm.roleId" label="0" :disabled="roleAu==false">老师</el-radio>
          <el-radio v-model="ruleForm.roleId" label="1" :disabled="roleAu==false">管理员</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;margin-bottom:10px">
        <el-button type="primary" @click="submitForm('ruleForm')" style="width:180px">提交</el-button>
        <el-button @click="resetForm('ruleForm')" style="width:180px">取消</el-button>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        style="text-align: center;color: #5d5b5b;font-size:14px"
        v-if="title=='新增用户'"
      >
        <span>新增用户状态默认为正常</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // var checkPhone = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error("手机号不能为空"));
    //   } else {
    //     const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    //     console.log(reg.test(value));
    //     if (reg.test(value)) {
    //       callback();
    //     } else {
    //       return callback(new Error("请输入正确的手机号"));
    //     }
    //   }
    // };
    return {
      list: [],
      AllData: [],
      listLoading: false,
      multipleSelection: [],
      dialogFormVisible: false,
      ruleForm: {
        name: "",
        sex: "0",
        roleId: "0",
        email: ""
      },
      roleAu: false,
      rules: {
        name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        // tel: [{ required: true, validator: checkPhone, trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      },
      totalNum: 0,
      title: "新增用户",
      pageSize: 10,
      formInline: {
        username: "",
        state: ""
      },
      page: 1
    };
  },
  mounted() {
    this.getStateAu();
  },
  created() {
    this.showUserInfo(this.page);
    this.getStateAu();
  },
  methods: {
    filterState(state) {
      if (state == "0") {
        return "正常";
      } else {
        return "禁用";
      }
    },
    btnState(state) {
      if (state == "0") {
        return "primary";
      } else {
        return "danger";
      }
    },
    getStateAu() {
      var authority = JSON.parse(localStorage.getItem("authority"));
      if (authority) {
        for (var i = 0; i < authority.length; i++) {
          if (authority[i] == "4") {
            this.roleAu = true;
          }
        }
      }
    },
    changeState(row) {
      var data = {
        email: row.email
      };
      var auth = 0;
      //恢复权限
      var authority = JSON.parse(localStorage.getItem("authority"));
      if (authority) {
        for (var i = 0; i < authority.length; i++) {
          if (authority[i] == "5") {
            auth = 1;
          }
        }
      }
      var auth1 = 0;
      //禁用权限
      if (authority) {
        for (var i = 0; i < authority.length; i++) {
          if (authority[i] == "8") {
            auth1 = 1;
          }
        }
      }
      if ((auth && row.state == 1) || (auth1 && row.state == 0)) {
        this.$http.patch("/api/user", data).then(
          res => {
            // success callback
            if (res.data.respCode == "1") {
              this.$alert("状态修改成功", "成功", {
                confirmButtonText: "确定"
              });
              this.showUserInfo(this.page);
            } else {
              this.$alert(res.data.respCode, "失败", {
                confirmButtonText: "确定"
              });
              this.showUserInfo(this.page);
            }
            this.listLoading = false;
          },
          res => {
            this.$router.push({
              path: "/" + res
            });
          }
        );
      } else {
        if (row.state == 0) {
          this.$alert("你没有禁用用户状态权限", {
            confirmButtonText: "确定"
          });
        } else {
          this.$alert("你没有恢复用户状态权限", {
            confirmButtonText: "确定"
          });
        }
      }
    },
    resetPass(row) {
      //重置密码
      var auth = 0;
      var authority = JSON.parse(localStorage.getItem("authority"));
      if (authority) {
        for (var i = 0; i < authority.length; i++) {
          if (authority[i] == "6") {
            auth = 1;
          }
        }
      }
      if (auth) {
        this.$http
          .put("/api/user/resetPassword?email=" + row.email)
          .then(res => {
            if (res.data.respCode == "1") {
              this.$alert("密码重置成功", "成功", {
                confirmButtonText: "确定"
              });
            } else {
              this.$alert(res.data.respCode, "失败", {
                confirmButtonText: "确定"
              });
            }
          });
      } else {
        this.$alert("你没有重置密码权限", {
          confirmButtonText: "确定"
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteData() {
      //批量删除
      var auth = 0;
      var authority = JSON.parse(localStorage.getItem("authority"));
      if (authority) {
        for (var i = 0; i < authority.length; i++) {
          if (authority[i] == "2") {
            auth = 1;
          }
        }
      }
      if (auth) {
        if (this.multipleSelection.length == 0) {
          this.$alert("请至少选中一条数据", "批量删除", {
            confirmButtonText: "确定"
          });
        } else {
          var emails = [];
          for (var i in this.multipleSelection) {
            emails.push(this.multipleSelection[i].email);
          }
          this.$confirm("确定要删除选择的用户？", "删除用户", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info"
          })
            .then(() => {
              var data = emails;
              this.$http.delete("/api/user?del_list=" + data).then(
                res => {
                  if (res.data.respCode == "1") {
                    this.$alert("用户删除成功", "成功", {
                      confirmButtonText: "确定"
                    });
                    this.page = 1;
                    this.showUserInfo(this.page);
                  } else {
                    this.$alert(res.data.respCode, "失败", {
                      confirmButtonText: "确定"
                    });
                    this.showUserInfo(this.page);
                  }
                  this.listLoading = false;
                },
                res => {
                  this.$router.push({
                    path: "/" + res
                  });
                }
              );
            })
            .catch(() => {});
        }
      } else {
        this.$alert("你没有删除用户权限", {
          confirmButtonText: "确定"
        });
      }
    },
    searchData() {
      var auth = 0;
      var authority = JSON.parse(localStorage.getItem("authority"));
      if (authority) {
        for (var i = 0; i < authority.length; i++) {
          if (authority[i] == "7") {
            auth = 1;
          }
        }
      }
      if (auth) {
        this.list = [];
        this.listLoading = true;
        var roleId = localStorage.getItem("roleId");
        if (this.formInline.username == "" && this.formInline.state == "") {
          this.showUserInfo(this.page);
        } else {
          this.page = 1;
          this.$http
            .get(
              "/api/user?page=" +
                this.page +
                "&state=" +
                this.formInline.state +
                "&name=" +
                this.formInline.username +
                "&roleId=" +
                roleId
            )
            .then(
              res => {
                this.listLoading = false;
                this.totalNum = res.data[0].totalCount;
                if (this.totalNum != 0) {
                  delete res.data[0];
                  this.list = res.data;
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
        this.$alert("你没有查询用户权限", {
          confirmButtonText: "确定"
        });
      }
    },
    showUserInfo(page) {
      this.list = [];
      this.listLoading = true;
      this.page = page;
      //获取用户信息
      var data = {
        page: this.page
      };
      var roleId = localStorage.getItem("roleId");
      this.$http
        .get("/api/user?page=" + this.page + "&state=&name=&roleId=" + roleId)
        .then(
          res => {
            this.listLoading = false;
            this.totalNum = res.data[0].totalCount;
            if (this.totalNum != 0) {
              delete res.data[0];
              this.list = res.data;
            }
          },
          res => {
            this.$router.push({
              path: "/" + res
            });
          }
        );
    },
    reset() {
      this.ruleForm.name = "";
      this.ruleForm.sex = "1";
      this.ruleForm.roleId = "0";
      this.ruleForm.email = "";
    },
    addData() {
      var auth = 0;
      var authority = JSON.parse(localStorage.getItem("authority"));
      if (authority) {
        for (var i = 0; i < authority.length; i++) {
          if (authority[i] == "1") {
            auth = 1;
          }
        }
      }
      if (auth) {
        this.reset();
        this.dialogFormVisible = true;
        this.title = "新增用户";
      } else {
        this.$alert("你没有新增用户权限", {
          confirmButtonText: "确定"
        });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          if (this.title == "新增用户") {
            var data = {
              name: this.ruleForm.name,
              sex: this.ruleForm.sex,
              roleId: this.ruleForm.roleId,
              email: this.ruleForm.email
            };
            this.$http.post("/api/user", data).then(
              res => {
                if (res.data.respCode == "1") {
                  this.$alert("用户添加成功", "成功", {
                    confirmButtonText: "确定"
                  });
                  this.showUserInfo(this.page);
                } else {
                  this.$alert(res.data.respCode, "失败", {
                    confirmButtonText: "确定"
                  });
                  this.showUserInfo(this.page);
                }
                this.listLoading = false;
              },
              res => {
                this.$router.push({
                  path: "/" + res
                });
              }
            );
          } else {
            //修改信息
            var data = {
              name: this.ruleForm.name,
              sex: this.ruleForm.sex,
              roleId: this.ruleForm.roleId,
              email: this.ruleForm.email
            };
            console.log(data);
            this.$http.put("/api/user", data).then(
              res => {
                if (res.data.respCode == "1") {
                  this.$alert("用户修改成功", "成功", {
                    confirmButtonText: "确定"
                  });
                  this.showUserInfo(this.page);
                } else {
                  this.$alert(res.data.respCode, "失败", {
                    confirmButtonText: "确定"
                  });
                  this.showUserInfo(this.page);
                }
                this.listLoading = false;
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
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      this.reset();
      this.showUserInfo(this.page);
    },
    handleCurrentChange(val) {
      console.log(val);
      this.page = val;
      this.showUserInfo(this.page);
    },
    resetData() {
      this.formInline.username = "";
      this.formInline.state = "";
      this.page = 1;
      this.showUserInfo(this.page);
    },
    editData(row) {
      this.getStateAu();
      var auth = 0;
      var authority = JSON.parse(localStorage.getItem("authority"));
      console.log(authority);
      if (authority) {
        for (var i = 0; i < authority.length; i++) {
          if (authority[i] == "3") {
            auth = 1;
          }
        }
      }
      if (auth) {
        this.ruleForm = row;
        this.ruleForm.sex = this.ruleForm.sex.toString();
        this.ruleForm.roleId = this.ruleForm.roleId.toString();
        this.title = "修改用户信息";
        this.dialogFormVisible = true;
      } else {
        this.$alert("你没有编辑用户权限", {
          confirmButtonText: "确定"
        });
      }
    },
    permissionAssign(row) {
      this.$router.push({
        path: "/userManage/permissionAssignment",
        query: { username: row.name }
      });
    }
  }
};
</script>
<style scoped>
.el-pagination {
  text-align: center !important;
  margin: 20px 0 !important;
}
</style>
<style>
.el-table__header {
  width: auto !important;
}
.el-table__body {
  width: auto !important;
}
.app-container {
  background-color: #f0f2f5;
  min-height: 100vh;
  height: 100%;
}
.form-style {
  background: #fff;
  padding: 20px;
  min-height: 85vh;
}
</style>