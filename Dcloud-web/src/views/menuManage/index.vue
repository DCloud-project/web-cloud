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
        <el-table-column label="菜单名称" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column label="图标" min-width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.icon}}</span>
          </template>
        </el-table-column>

        <el-table-column label="层级" min-width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.menuOrder}}级</span>
          </template>
        </el-table-column>
        <el-table-column label="父菜单" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.parentId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" min-width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.menuOrder}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否可见" min-width="70" align="center">
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.isVisible=='1'" style="color:green"></i>
            <i class="el-icon-close" v-if="scope.row.isVisible=='0'" style="color:red"></i>
          </template>
        </el-table-column>
        <el-table-column label="是否是菜单" min-width="80" align="center">
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.isMenu=='1'" style="color:green"></i>
            <i class="el-icon-close" v-if="scope.row.isMenu=='0'" style="color:red"></i>
          </template>
        </el-table-column>
        <el-table-column label="是否是页面" min-width="80" align="center">
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.isPage=='1'" style="color:green"></i>
            <i class="el-icon-close" v-if="scope.row.isPage=='0'" style="color:red"></i>
          </template>
        </el-table-column>
        <el-table-column label="请求地址" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.url}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="100">
          <template slot-scope="scope">
            <div>
              <el-link type="primary" @click="editData(scope.row)">编辑</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger" @click="deleteUser(scope.row)">删除</el-link>
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
        :model="menuForm"
        :rules="menus"
        ref="menuForm"
        label-width="150px"
        class="demo-menuForm"
      >
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="menuForm.parentId" placeholder="请选择上级菜单">
            <el-option v-for="item in parentList" :key="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="menuForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否是页面" prop="isPage">
          <el-radio v-model="menuForm.isPage" label="1">是</el-radio>
          <el-radio v-model="menuForm.isPage" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="请求地址">
          <el-input v-model="menuForm.url"></el-input>
        </el-form-item>
        <el-form-item label="是否是菜单" prop="isMenu">
          <el-radio v-model="menuForm.isMenu" label="1">是</el-radio>
          <el-radio v-model="menuForm.isMenu" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="菜单状态(默认可见)">
          <el-radio v-model="menuForm.isVisible" label="1">可见</el-radio>
          <el-radio v-model="menuForm.isVisible" label="0">不可见</el-radio>
        </el-form-item>
        <el-form-item label="显示排序" prop="menuOrder">
          <el-input v-model="menuForm.menuOrder"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('menuForm')">提交</el-button>
        <el-button @click="resetForm('menuForm')">取消</el-button>
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
      multipleSelection: [],
      dialogFormVisible: false,
      parentList: [],
      menuForm: {
        parentId: "",
        name: "",
        icon: "",
        isPage: "",
        url: "",
        isVisible: "1",
        menuOrder: ""
      },
      menus: {
        parentId: [
          { required: true, message: "请选择上级菜单", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        isPage: [{ required: true, message: "请选择", trigger: "blur" }],
        isMenu: [{ required: true, message: "请选择", trigger: "blur" }],
        menuOrder: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      totalNum: 0,
      title: "新增用户",
      pageSize: 10,
      page: 1,
      searchUserInput: "",
      formInline: {
        menus: "",
        state: ""
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
    this.showUserInfo(this.page);
  },
  methods: {
    reset() {
      this.menuForm.parentId = "";
      this.menuForm.name = "";
      this.menuForm.icon = "";
      this.menuForm.isPage = "";
      this.menuForm.url = "";
      this.menuForm.isVisible = "1";
      this.menuForm.menuOrder = "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    addData() {
      this.reset();
      this.dialogFormVisible = true;
      this.title = "新增菜单";
    },
    searchData() {
      this.list = [];
      this.listLoading = true;
      this.page = 1;
      var data = {
        page: this.page,
        name: this.formInline.menus,
        state: this.formInline.state
      };
      this.$http
        .get(
          "/api/menus?page=" +
            this.page +
            "&name=" +
            this.formInline.menus +
            "&is_visible=" +
            this.formInline.state
        )
        .then(res => {
          this.listLoading = false;
          this.totalNum = res.data.total;
          if (this.totalNum != 0) {
            this.list = res.data.records;
            for (var i = 0; i < this.list.length; i++) {
              this.list[i].parentId = this.parentFind(this.list[i].parentId);
            }
          }
        });
    },

    deleteUser(row) {
      //单个删除
      var del_list = [];
      del_list.push(row.id);
      this.$confirm("确定要删除该用户？", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          this.$http.delete("/api/menus?ids=" + del_list).then(res => {
            if (res.data.respCode == "1") {
              this.$alert("删除成功", "成功", {
                confirmButtonText: "确定"
              });
            }
            this.showUserInfo(this.page);
          });
        })
        .catch(() => {});
    },
    deleteData() {
      //批量删除
      if (this.multipleSelection.length == 0) {
        this.$alert("请至少选中一条数据", "批量删除", {
          confirmButtonText: "确定"
        });
      } else {
        var del_list = [];
        for (var i in this.multipleSelection) {
          del_list.push(this.multipleSelection[i].id);
        }
        this.$confirm("确定要删除所选择的菜单？", "删除菜单", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        })
          .then(() => {
            this.$http.delete("/api/menus?ids=" + del_list).then(res => {
              if (res.data.respCode == "1") {
                this.$alert("删除成功", "成功", {
                  confirmButtonText: "确定"
                });
              }
              this.showUserInfo(this.page);
            });
          })
          .catch(() => {});
      }
    },
    parentFind(id) {
      //寻找父菜单
      var parentName = "";
      for (var i = 0; i < this.list.length; i++) {
        if (id == this.list[i].id) {
          parentName = this.list[i].name;
        }
      }
      return parentName;
    },
    editData(row) {
      this.menuForm = row;
      this.menuForm.parentId = this.menuForm.parentId.toString();
      this.menuForm.isPage = this.menuForm.isPage.toString();
      this.menuForm.isMenu = this.menuForm.isMenu.toString();
      this.menuForm.isVisible = this.menuForm.isVisible.toString();
      this.title = "编辑菜单";
      this.dialogFormVisible = true;
    },
    showUserInfo(page) {
      this.list = [];
      this.listLoading = true;
      this.page = page;
      //获取用户信息
      var data = {
        page: this.page
      };
      this.$http.get("/api/menus?page=" + page).then(res => {
        this.listLoading = false;
        this.totalNum = res.data.total;
        if (this.totalNum != 0) {
          delete res.data[0];
          this.list = res.data.records;
          for (var i = 0; i < this.list.length; i++) {
            this.list[i].parentId = this.parentFind(this.list[i].parentId);
          }
        }
      });
      this.getParentList();
    },

    getParentList() {
      this.$http.get("/api/menus").then(res => {
        this.listLoading = false;
        this.parentList = res.data;
      });
    },

    addUser() {
      this.reset();
      this.dialogFormVisible = true;
      this.title = "新增菜单";
    },
    submitForm(formName) {
      var data = {
        id: this.menuForm.id,
        parent_name: this.menuForm.parentId,
        name: this.menuForm.name,
        icon: this.menuForm.icon,
        is_page: this.menuForm.isPage,
        url: this.menuForm.url,
        is_visible: this.menuForm.isVisible,
        is_menu: this.menuForm.isMenu,
        menu_order: this.menuForm.menuOrder
      };
      var addData = {
        parent_name: this.menuForm.parentId,
        name: this.menuForm.name,
        icon: this.menuForm.icon,
        is_page: this.menuForm.isPage,
        url: this.menuForm.url,
        is_visible: this.menuForm.isVisible,
        is_menu: this.menuForm.isMenu,
        menu_order: this.menuForm.menuOrder
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          if (this.title == "新增菜单") {
            this.$http.post("/api/menus", addData).then(res => {
              if (res.data.respCode == "1") {
                this.$alert("菜单新增成功", "成功", {
                  confirmButtonText: "确定"
                });
                this.showUserInfo(this.page);
              } else {
                this.$alert("菜单新增失败", "失败", {
                  confirmButtonText: "确定"
                });
                this.showUserInfo(this.page);
              }
              this.$refs[formName].resetFields();
            });
          } else {
            console.log(data);
            this.$http.patch("/api/menus", data).then(res => {
              if (res.data.respCode == "1") {
                this.$alert("菜单修改成功", "成功", {
                  confirmButtonText: "确定"
                });
                this.showUserInfo(this.page);
              } else {
                this.$alert("菜单修改失败", "失败", {
                  confirmButtonText: "确定"
                });
                this.showUserInfo(this.page);
              }
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
    handleCurrentChange(val) {
      this.page = val;
      this.showUserInfo(this.page);
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
