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
        </el-table-column> -->
        <el-table-column align="center" label="操作" min-width="150">
          <template slot-scope="scope">
            <div>
              <el-link type="primary" @click="permissionAssign(scope.row)">分配权限</el-link>
              <el-divider direction="vertical"></el-divider>
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
          <el-radio v-model="ruleForm.roleId" label="0">老师</el-radio>
          <el-radio v-model="ruleForm.roleId" label="1">管理员</el-radio>
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
  created() {
    this.showUserInfo(this.page);
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
    changeState(row) {
      var data = {
        email: row.email
      };
      this.$axios.post("/api/changeUserState", data, this.config).then(res => {
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
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection);
    },
    deleteData() {
      //批量删除
      if (this.multipleSelection.length == 0) {
        this.$alert("请至少选中一条数据", "批量删除", {
          confirmButtonText: "确定"
        });
      } else {
        var emails = [];
        for (var i in this.multipleSelection) {
          emails.push({ email: this.multipleSelection[i].email });
        }
        console.log(emails);
        this.$confirm("确定要删除选择的用户？", "删除用户", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        })
          .then(() => {
            var data = emails;
            this.$axios.post("/api/deleteUser", data, this.config).then(res => {
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
            });
          })
          .catch(() => {});
      }
    },
    searchData() {
      this.list = [];
      this.listLoading = true;
      if (this.formInline.username == "" && this.formInline.state == "") {
        this.showUserInfo(this.page);
      } else {
        this.page = 1;
        var data = {
          page: this.page,
          name: this.formInline.username,
          state: this.formInline.state
        };
        this.$axios.post("/api/searchUser", data, this.config).then(res => {
          this.listLoading = false;
          this.totalNum = res.data[0].totalCount;
          if (this.totalNum != 0) {
            delete res.data[0];
            this.list = res.data;
          }
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
      this.$axios.post("/api/userList", data, this.config).then(res => {
        this.listLoading = false;
        this.totalNum = res.data[0].totalCount;
        if (this.totalNum != 0) {
          delete res.data[0];
          this.list = res.data;
        }
      });
    },
    reset() {
      this.ruleForm.name = "";
      this.ruleForm.sex = "1";
      this.ruleForm.roleId = "0";
      this.ruleForm.email = "";
    },
    addData() {
      this.reset();
      this.dialogFormVisible = true;
      this.title = "新增用户";
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
            this.$axios.post("/api/addUser", data, this.config).then(res => {
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
            });
          } else {
            //修改信息
            var data = {
              name: this.ruleForm.name,
              sex: this.ruleForm.sex,
              roleId: this.ruleForm.roleId,
              email: this.ruleForm.email
            };
            this.$axios
              .post("/api/updateUserByAdmin", data, this.config)
              .then(res => {
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
              });
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
      this.ruleForm = row;
      this.ruleForm.sex = this.ruleForm.sex.toString();
      this.ruleForm.roleId = this.ruleForm.roleId.toString();
      console.log(this.ruleForm);
      this.title = "修改用户信息";
      this.dialogFormVisible = true;
    },
    permissionAssign(row) {
      this.$router.push({
        path: "/userManage/permissionAssignment",
        query: { username: row.username }
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