<template>
  <div class="app-container">
    <div class="form-style">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" size="small" @click="addData()" icon="el-icon-plus">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" size="small" @click="deleteDataBatch()" icon="el-icon-delete">删除</el-button>
        </el-form-item>

        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="resetData()">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="searchData()">查询</el-button>
        </el-form-item>
        <el-form-item label="名称：" style="float:right">
          <el-input placeholder="请输入名称" size="small" v-model="searchForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <div class="dashboard-editor-container">
          <el-button type="primary" style="width:100%;margin-bottom:20px;" size="small">学校组织机构</el-button>
          <el-tree
            :data="data"
            :props="defaultProps"
            node-key="id"
            :default-expanded-keys="[id]"
            accordion
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
        <div style="width: 75%;float:right">
          <el-table
            :data="list"
            v-loading="listLoading"
            element-loading-text="Loading"
            fit
            height="60vh"
            highlight-current-row
            ref="multipleTable"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column label="序号" type="index" width="50" align="center">
              <template slot-scope="scope">
                <span>{{(page - 1) * pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column label="编号" min-width="50" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.code}}</span>
              </template>
            </el-table-column>
            <el-table-column label="名称" min-width="100" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="100">
              <template slot-scope="scope">
                <div>
                  <el-link type="primary" @click="editData(scope.row)">编辑</el-link>
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
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="addForm" :rules="addRules" ref="addForm" v-if="isAdd">
        <el-form-item label="编号" :label-width="formLabelWidth" prop="code">
          <el-input v-model="addForm.code" autocomplete="off">
            <template slot="prepend" v-if="!isAddSchool">{{selectTree}}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="editForm" :rules="editRules" ref="editForm" v-else>
        <el-form-item label="编号" :label-width="formLabelWidth" prop="code">
          <el-input v-model="editForm.code" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" v-if="isAdd">
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      listLoading: false,
      multipleSelection: [],
      dialogFormVisible: false,
      totalNum: 0,
      pageSize: 10,
      searchForm: {
        name: ""
      },
      page: 1,
      data: [],
      id: 1,
      defaultProps: {
        children: "children",
        label: "label"
      },
      editForm: {
        name: "",
        code: "",
        id: ""
      },
      editRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入编号", trigger: "blur" }]
      },
      addForm: {
        name: "",
        code: ""
      },
      addRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [
          { required: true, message: "请输入编号", trigger: "blur" },
          { min: 2, max: 2, message: "请输入两个字符", trigger: "blur" }
        ]
      },
      formLabelWidth: "100px",
      title: "新增",
      isAdd: true,
      selectTree: "",
      selectTreeId: "0",
      isAddSchool: false
    };
  },
  created() {
    this.getAllData(this.page);
  },
  methods: {
    handleNodeClick(data) {
      this.list = [];
      this.listLoading = true;
      this.page = 1;
      this.$http.get("/api/schools?id=" + data.id + "&page=" + this.page).then(
        res => {
          this.list = res.data.records;
          this.listLoading = false;
          this.totalNum = res.data.total;
        },
        res => {
          this.$router.push({
            path: "/" + res
          });
        }
      );
      this.selectTree = data.code;
      this.selectTreeId = data.id;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteData(row) {
      var ids = [];
      ids.push(row.id);

      console.log(ids);
      this.$confirm("确定要删除选择的院校？", "删除院校", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          var data = ids;
          this.$http.delete("/api/schools?ids=" + data).then(
            res => {
              if (res.data.respCode == "1") {
                this.$alert("删除成功", "成功", {
                  confirmButtonText: "确定"
                });
                this.page = 1;
                this.getAllData(this.page);
              } else {
                this.$alert(res.data.respCode, "失败", {
                  confirmButtonText: "确定"
                });
                this.getAllData(this.page);
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
    },
    deleteDataBatch() {
      //批量删除
      if (this.multipleSelection.length == 0) {
        this.$alert("请至少选中一条数据", "批量删除", {
          confirmButtonText: "确定"
        });
      } else {
        var ids = [];
        for (var i in this.multipleSelection) {
          ids.push(this.multipleSelection[i].id);
        }
        console.log(ids);
        this.$confirm("确定要删除选择的院校？", "删除院校", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        })
          .then(() => {
            var data = ids;
            this.$http.delete("/api/schools?ids=" + data).then(
              res => {
                if (res.data.respCode == "1") {
                  this.$alert("删除成功", "成功", {
                    confirmButtonText: "确定"
                  });
                  this.page = 1;
                  this.getAllData(this.page);
                } else {
                  this.$alert(res.data.respCode, "失败", {
                    confirmButtonText: "确定"
                  });
                  this.getAllData(this.page);
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
    },
    searchData() {
      this.list = [];
      this.listLoading = true;
      this.page = 1;
      this.$http
        .get("/api/schools?name=" + this.searchForm.name + "&page=" + this.page)
        .then(
          res => {
            this.list = res.data.records;
            this.listLoading = false;
            this.totalNum = res.data.total;
          },
          res => {
            this.$router.push({
              path: "/" + res
            });
          }
        );
    },
    getAllData(page) {
      (this.selectTree = ""), (this.selectTreeId = "0"), (this.list = []);
      this.listLoading = true;
      this.page = page;
      this.$http.get("/api/schools?" + "page=" + page).then(
        res => {
          this.list = res.data.records;
          this.listLoading = false;
          this.totalNum = res.data.total;
        },
        res => {
          this.$router.push({
            path: "/" + res
          });
        }
      );
      this.$http.get("/api/schools").then(
        res => {
          this.data = res.data;
          this.id = res.data[0].id;
        },
        res => {
          this.$router.push({
            path: "/" + res
          });
        }
      );
    },
    reset() {
      this.addForm.name = "";
      this.addForm.code = "";
    },
    addData() {
      this.reset();
      this.title = "新增";
      this.isAdd = true;
      if (this.selectTree != "") {
        this.isAddSchool = false;
      } else {
        this.isAddSchool = true;
      }

      this.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          if (this.isAdd == true) {
            //新增
            var data = {
              code: this.selectTree + this.addForm.code,
              name: this.addForm.name,
              parent_id: this.selectTreeId
            };
            this.$http.post("/api/schools", data).then(
              res => {
                if (res.data.respCode == "1") {
                  this.$alert("添加成功", "成功", {
                    confirmButtonText: "确定"
                  });
                  this.getAllData(this.page);
                } else {
                  this.$alert(res.data.respCode, "失败", {
                    confirmButtonText: "确定"
                  });
                  this.getAllData(this.page);
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
              name: this.editForm.name,
              id: this.editForm.id
            };
            this.$http.patch("/api/schools", data).then(
              res => {
                if (res.data.respCode == "1") {
                  this.$alert("修改成功", "成功", {
                    confirmButtonText: "确定"
                  });
                  this.getAllData(this.page);
                } else {
                  this.$alert(res.data.respCode, "失败", {
                    confirmButtonText: "确定"
                  });
                  this.getAllData(this.page);
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
      this.getAllData(this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getAllData(this.page);
    },
    resetData() {
      this.searchForm.name = "";
      this.page = 1;
      this.getAllData(this.page);
    },
    editData(row) {
      this.title = "编辑";
      this.isAdd = false;
      this.editForm.code = row.code;
      this.editForm.name = row.name;
      this.editForm.id = row.id;
      this.dialogFormVisible = true;
    }
  }
};
</script>
<style scoped>
.el-pagination {
  text-align: center !important;
  margin: 20px 0 !important;
}
.dashboard-editor-container {
  float: left;
  width: 20%;
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