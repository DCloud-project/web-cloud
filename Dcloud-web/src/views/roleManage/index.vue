<template>
  <div class="app-container">
    <div class="form-style">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" size="small" @click="addData()" icon="el-icon-plus">新增</el-button>
        </el-form-item>

        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="resetData()">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="searchData()">查询</el-button>
        </el-form-item>
        <el-form-item label="状态：" style="float:right">
          <el-select v-model="formInline.state" placeholder="请选择状态" size="small">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称：" style="float:right">
          <el-input placeholder="请输入角色名称" size="small" v-model="formInline.role"></el-input>
        </el-form-item>
      </el-form>

      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="Loading"
        fit
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      >
        <!-- <el-table-column type="selection" width="50"></el-table-column> -->
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="角色名称" min-width="110" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="110" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色状态" min-width="50" align="center">
          <template slot-scope="scope">
            <el-button
              :type="btnState(scope.row.state)"
              plain
              @click="changeState(scope.row)"
              size="small"
            >{{filterState(scope.row.state)}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="100">
          <template slot-scope="scope">
            <div>
              <el-link type="primary" @click="editData(scope.row)">编辑</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="primary" @click="permissionAssign(scope.row)">分配权限</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger" @click="deleteData(scope.row)">删除</el-link>
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
        :model="roleForm"
        :rules="rules"
        ref="roleForm"
        label-width="100px"
        class="demo-roleForm"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="角色状态" v-if="title=='编辑角色'">
          <el-radio v-model="roleForm.state" label="0">禁用</el-radio>
          <el-radio v-model="roleForm.state" label="1">启用</el-radio>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="roleForm.description" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;margin-bottom:10px">
        <el-button type="primary" @click="submitForm('roleForm')" style="width:180px">确定</el-button>
        <el-button @click="resetForm('roleForm')" style="width:180px">取消</el-button>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        style="text-align: center;color: #5d5b5b;font-size:14px"
        v-if="title=='新增角色'"
      >
        <span>新增角色默认为已启用</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      AllData: [],
      listLoading: false,
      dialogFormVisible: false,
      roleForm: {
        name: "",
        state: "1",
        description: ""
      },
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }]
      },
      totalNum: 1, //0
      title: "新增角色",
      pageSize: 10,
      formInline: {
        role: "",
        state: ""
      },
      page: 1
    };
  },
  created() {
    this.showRoleInfo();
  },
  methods: {
    showData() {
      this.list = [];
      this.listLoading = true;
      //获取角色信息
    },
    addData() {
      //添加新角色
      this.reset();
      this.dialogFormVisible = true;
      this.title = "新增角色";
    },

    searchData() {
      //搜索
      this.list = [];
      this.listLoading = true;
      this.page = 1;
      var data = {
        page: this.page,
        name: this.formInline.role,
        state: this.formInline.state
      };
      this.$http
        .get(
          "/api/role?page=" +
            data.page +
            "&name=" +
            data.name +
            "&state=" +
            data.state
        )
        .then(res => {
          this.listLoading = false;
          this.totalNum = res.data.total;
          if (this.totalNum != 0) {
            delete res.data[0];
            this.list = res.data.records;
          }
        });
    },
    resetData() {
      this.formInline.role = "";
      this.formInline.state = "";
      this.showRoleInfo(this.page);
    },
    reset() {
      this.roleForm.name = "";
      this.roleForm.note = "";
    },
    btnState(state) {
      if (state == "1") {
        return "primary";
      } else {
        return "danger";
      }
    },
    filterState(state) {
      if (state == "1") {
        return "启用";
      } else {
        return "禁用";
      }
    },
    changeState(row) {
      this.$http
        .patch("/api/role?id=" + row.id + "&state=" + row.state)
        .then(res => {
          if (res.data.respCode == "1") {
            this.$alert("状态修改成功", "成功", {
              confirmButtonText: "确定"
            });
            if (row.state == "1") {
              row.state = "0";
              row.stateName = "禁用";
              row.type = "0";
            } else {
              row.state = "1";
              row.stateName = "启用";
              row.type = "1";
            }
          } else {
            this.$alert(res.data.respCode, "失败", {
              confirmButtonText: "确定"
            });
          }
        });
    },
    editData(row) {
      this.roleForm = row;
      this.roleForm.state = this.roleForm.state.toString();
      this.dialogFormVisible = true;
      this.title = "编辑角色";
    },
    deleteData(row) {
      //单个删除
      this.$confirm("确定要删除该角色？", "删除角色", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          this.$http.delete("/api/role?id=" + row.id).then(res => {
            if (res.data.respCode == "1") {
              this.$alert("删除成功", "成功", {
                confirmButtonText: "确定"
              });
            }
            this.showRoleInfo(this.page);
          });
        })
        .catch(() => {});
    },

    submitForm(formName) {
      var data = {
        id: this.roleForm.id,
        description: this.roleForm.description,
        name: this.roleForm.name,
        state: this.roleForm.state
      };
      var addData = {
        description: this.roleForm.description,
        name: this.roleForm.name
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          if (this.title == "新增角色") {
            this.$http.post("/api/role", addData).then(res => {
              if (res.data.respCode == "1") {
                this.$alert("角色新增成功", "成功", {
                  confirmButtonText: "确定"
                });
                this.showRoleInfo(this.page);
              } else {
                this.$alert("角色新增失败", "失败", {
                  confirmButtonText: "确定"
                });
                this.showRoleInfo(this.page);
              }
              this.$refs[formName].resetFields();
            });
          } else {
            this.$http.put("/api/role", data).then(res => {
              if (res.data.respCode == "1") {
                this.$alert("角色修改成功", "成功", {
                  confirmButtonText: "确定"
                });
                this.showRoleInfo(this.page);
              } else {
                this.$alert("角色修改失败", "失败", {
                  confirmButtonText: "确定"
                });
                this.showRoleInfo(this.page);
              }
              this.$refs[formName].resetFields();
            });
          }
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      this.reset();
    },
    showRoleInfo(page) {
      this.list = [];
      this.listLoading = true;
      this.page = 1;
      var name = "";
      var state = "";
      //获取角色信息
      var data = {
        page: this.page,
        name: name,
        state: state
      };
      this.$http
        .get(
          "/api/role?page=" +
            data.page +
            "&name=" +
            data.name +
            "&state=" +
            data.state
        )
        .then(res => {
          this.listLoading = false;
          this.totalNum = res.data.total;
          if (this.totalNum != 0) {
            delete res.data[0];
            this.list = res.data.records;
          }
        });
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
    permissionAssign(row) {
      var description = [];
      this.$http.get("/api/rolePower?role_id=" + row.id).then(res => {
        description = res.data;
        this.$router.push({
          path: "/roleManage/permissionAssignment",
          query: { username: row.name, id: row.id, description }
        });
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
