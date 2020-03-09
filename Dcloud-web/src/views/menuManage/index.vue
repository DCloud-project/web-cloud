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
            <el-option label="正常" value="1"></el-option>
            <el-option label="禁用" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称：" style="float:right">
          <el-input placeholder="请输入菜单名称" size="small" v-model="formInline.menu"></el-input>
        </el-form-item>
      </el-form>

      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="菜单名称" min-width="110" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" min-width="110" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" min-width="50" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sex=='0'">男</span>
            <span v-if="scope.row.sex=='1'">女</span>
          </template>
        </el-table-column>
        <el-table-column label="电话号码" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.tel}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="100">
          <template slot-scope="scope">
            <i
              class="el-icon-key"
              @click="resetPass(scope.row)"
              style="font-size:17px;margin-right:10px;"
            ></i>
            <i class="el-icon-delete" @click="deleteUser(scope.row)" style="font-size:17px"></i>
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
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="ruleForm.username" :disabled="title=='修改用户信息'"></el-input>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="ruleForm.sex" label="0">男</el-radio>
          <el-radio v-model="ruleForm.sex" label="1">女</el-radio>
        </el-form-item>
        <el-form-item label="联系方式" prop="tel">
          <el-input v-model="ruleForm.tel"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback();
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
      list: [],
      AllData: [],
      listLoading: false,
      multipleSelection: [],
      dialogFormVisible: false,
      ruleForm: {
        name: "",
        username: "",
        tel: "",
        sex: "0"
      },
      rules: {
        // name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户账号", trigger: "blur" }
        ],
        tel: [{ required: false, validator: checkPhone, trigger: "blur" }]
      },
      totalNum: 0,
      title: "新增用户",
      pageSize: 10,
      searchUserInput: "",
      formInline: {
        user: "",
        region: ""
      }
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  created() {
    // this.showUserInfo();
  },
  methods: {
    reset() {
      this.ruleForm.sex = "0";
      this.ruleForm.tel = "";
      this.ruleForm.username = "";
      this.ruleForm.name = "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    searchUser() {
      this.list = [];
      this.listLoading = true;
      this.$axios
        .post("/baseUrl/api/mymanage/select?username=" + this.searchUserInput)
        .then(res => {
          this.listLoading = false;
          var mapsize = Object.keys(res.data).length;
          this.AllData = res.data; //用户信息
          this.totalNum = mapsize;
          if (mapsize <= this.pageSize) {
            for (var i in res.data) {
              this.list.push(this.AllData[i]);
            }
          } else {
            var j = 0;
            for (var i in res.data) {
              this.list.push(this.AllData[i]);
              j++;
              if (j >= this.pageSize) {
                break;
              }
            }
          }
        });
    },
    resetPass(row) {
      this.$confirm("确定要为该用户重置密码吗？", "重置密码", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          this.$axios
            .post("/baseUrl/api/mymanage/reset?ids=" + row.id)
            .then(res => {
              if (res.data.response == "1000") {
                this.$alert("重置密码成功", "成功", {
                  confirmButtonText: "确定"
                });
              }
            });
        })
        .catch(() => {});
    },
    resetpassAll() {
      //批量重置
      if (this.multipleSelection.length == 0) {
        this.$alert("请至少选中一条数据", "批量重置", {
          confirmButtonText: "确定"
        });
      } else {
        var ids = new Array();
        for (var i in this.multipleSelection) {
          ids.push(this.multipleSelection[i].id);
        }
        this.$confirm("确定要为这些用户重置密码吗？", "重置密码", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        })
          .then(() => {
            this.$axios
              .post("/baseUrl/api/mymanage/reset?ids=" + ids)
              .then(res => {
                this.$alert("重置密码成功", "成功", {
                  confirmButtonText: "确定"
                });
              });
          })
          .catch(() => {});
      }
    },
    // editUser(row) {
    //   //编辑用户信息
    //   this.dialogFormVisible = true;
    //   // this.ruleForm = row;
    //   this.ruleForm.username = row.username;
    //   this.ruleForm.name = row.name;
    //   this.ruleForm.sex = row.sex;
    //   this.ruleForm.tel = row.tel;
    //   this.title = "修改用户信息";
    // },
    deleteUser(row) {
      //单个删除
      this.$confirm("确定要删除该用户？", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          this.$axios
            .post("/baseUrl/api/mymanage/delete?ids=" + row.id)
            .then(res => {
              if (res.data.response == "1000") {
                this.$alert("删除成功", "成功", {
                  confirmButtonText: "确定"
                });
              }
              this.showUserInfo();
            });
        })
        .catch(() => {});
    },
    deleteAll() {
      //批量删除
      if (this.multipleSelection.length == 0) {
        this.$alert("请至少选中一条数据", "批量删除", {
          confirmButtonText: "确定"
        });
      } else {
        var ids = new Array();
        for (var i in this.multipleSelection) {
          ids.push(this.multipleSelection[i].id);
        }
        this.$confirm("确定要删除选择的用户？", "删除用户", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        })
          .then(() => {
            this.$axios
              .post("/baseUrl/api/mymanage/delete?ids=" + ids)
              .then(res => {
                if (res.data.response == "1000") {
                  this.$alert("删除成功", "成功", {
                    confirmButtonText: "确定"
                  });
                }
                this.showUserInfo();
              });
          })
          .catch(() => {});
      }
    },
    showUserInfo() {
      this.list = [];
      this.listLoading = true;
      //获取用户信息
      this.$axios.post("/baseUrl/api/mymanage/show").then(res => {
        this.listLoading = false;
        var mapsize = Object.keys(res.data).length;
        this.AllData = res.data; //用户信息
        this.totalNum = mapsize;
        if (mapsize <= this.pageSize) {
          for (var i in res.data) {
            this.list.push(this.AllData[i]);
          }
        } else {
          var j = 0;
          for (var i in res.data) {
            this.list.push(this.AllData[i]);
            j++;
            if (j >= this.pageSize) {
              break;
            }
          }
        }
        // } else {
        //   self.$alert("用户类别获取失败，请稍后重试", "失败", {
        //     confirmButtonText: "确定"
        //   });
        // }
      });
    },
    addUser() {
      this.reset();
      this.dialogFormVisible = true;
      this.title = "新增用户";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          if (this.title == "新增用户") {
            this.$axios
              .post(
                "/baseUrl/api/mymanage/add?username=" +
                  this.ruleForm.username +
                  "&password=123456" +
                  "&name=" +
                  this.ruleForm.name +
                  "&sex=" +
                  this.ruleForm.sex +
                  "&tel=" +
                  this.ruleForm.tel
              )
              .then(res => {
                if (res.data.respcode == "1000") {
                  //添加用户成功
                  this.$alert("操作成功", "成功", {
                    confirmButtonText: "确定"
                  });
                } else if (res.data.respcode == "1001") {
                  this.$alert("该用户已存在", "失败", {
                    confirmButtonText: "确定"
                  });
                } else {
                  this.$alert("操作失败，请稍后重试", "失败", {
                    confirmButtonText: "确定"
                  });
                }
                this.$refs[formName].resetFields();
                this.ruleForm.sex = "0";
                this.showUserInfo();
              });
          } else {
            //修改信息
          }
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      this.reset();
    },
    handleCurrentChange(val) {
      // console.log(val);
      //根据页数显示页面上的数据。
      this.list = [];
      var mapsize = Object.keys(this.AllData).length;

      if (mapsize - (val - 1) * this.pageSize < this.pageSize) {
        for (var i = (val - 1) * this.pageSize + 1; i <= mapsize; i++) {
          this.list.push(this.AllData[i]);
        }
      } else {
        for (
          var i = (val - 1) * this.pageSize + 1;
          i <= val * this.pageSize;
          i++
        ) {
          this.list.push(this.AllData[i]);
        }
      }
    },
    resetData() {
      this.searchUserInput = "";
      this.showUserInfo();
    }
  }
};
</script>
<style scoped>
.el-pagination {
  text-align: center !important;
  margin: 20px 0 !important;
}
.app-container {
  background-color: #f0f2f5;
  min-height: 100vh;
  height: 100%;
}
.form-style {
  background: #fff;
  padding: 20px;
}
</style>
<style>
.el-table__header {
  width: auto !important;
}
.el-table__body {
  width: auto !important;
}
</style>
