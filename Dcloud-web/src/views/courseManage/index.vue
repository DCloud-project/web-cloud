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
        <el-table
          :data="list"
          v-loading="listLoading"
          element-loading-text="Loading"
          fit
          highlight-current-row
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
          <el-table-column label="课程名" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="课程号" min-width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="课程类别" min-width="100" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type=='1'">必修</span>
              <span v-if="scope.row.type=='2'">选修</span>
            </template>
          </el-table-column>
          <el-table-column label="课程介绍" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.description}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="150" align="center">
            <template slot-scope="scope">
              <span>{{moment(scope.row.createdTime).format("YYYY-MM-DD")}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建人员" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.createdName}}</span>
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
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="addForm" :rules="addRules" ref="addForm" v-if="isAdd">
        <el-form-item label="课程名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addForm.name" placeholder="输入课程名"></el-input>
        </el-form-item>
        <el-form-item label="课程类别" :label-width="formLabelWidth" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择课程类别">
            <el-option label="必修" value="1"></el-option>
            <el-option label="选修" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程介绍" :label-width="formLabelWidth" prop="description">
          <el-input v-model="addForm.description"></el-input>
        </el-form-item>
      </el-form>

      <el-form :model="editForm" :rules="editRules" ref="editForm" v-else>
        <el-form-item label="课程名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editForm.name" placeholder="输入课程名"></el-input>
        </el-form-item>
        <el-form-item label="课程类别" :label-width="formLabelWidth" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择课程类别">
            <el-option label="必修" value="1"></el-option>
            <el-option label="选修" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程介绍" :label-width="formLabelWidth" prop="description">
          <el-input v-model="editForm.description"></el-input>
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
let moment = require("moment");
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
      editForm: {
        id:"",
        name: "",
        type: "",
        description: ""
      },
      editRules: {
        name: [{ required: true, message: "请输入课程名", trigger: "blur" }],
        type: [{ required: true, message: "请选择课程类别", trigger: "blur" }]
      },
      addForm: {
        name: "",
        type: "",
        description: ""
      },
      addRules: {
        name: [{ required: true, message: "请输入课程名", trigger: "blur" }],
        type: [{ required: true, message: "请选择课程类别", trigger: "blur" }]
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
    moment,
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteData(row) {
      var ids = [];
      ids.push(row.id);
      this.$confirm("确定要删除选择的课程？", "删除课程", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          var data = ids;
          this.$http.delete("/api/courseManage?ids=" + data).then(
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
        this.$confirm("确定要删除选择的课程？", "删除课程", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        })
          .then(() => {
            var data = ids;
            this.$http.delete("/api/courseManage?ids=" + data).then(
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
        .get(
          "/api/courseManage?name=" +
            this.searchForm.name +
            "&page=" +
            this.page
        )
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
      this.$http.get("/api/courseManage?" + "page=" + page).then(
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
      this.addForm.type = "";
      this.addForm.description = "";
    },
    addData() {
      this.reset();
      this.title = "新增";
      this.isAdd = true;
      this.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          if (this.isAdd == true) {
            //新增
            var data = {
              name: this.addForm.name,
              type: this.addForm.type,
              email: localStorage.getItem("roleEmail"),
              description: this.addForm.description
            };
            this.$http.post("/api/courseManage", data).then(
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
            if(this.editForm.type=='必修'){
               this.editForm.type='1'
            }
            if(this.editForm.type=='选修'){
              this.editForm.type='2'
            }
            var data = {
              id:this.editForm.id,
              name: this.editForm.name,
              type: this.editForm.type,
              email: localStorage.getItem("roleEmail"),
              description: this.editForm.description
            };
            this.$http.patch("/api/courseManage", data).then(
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
      this.editForm.name = row.name;
      if (row.type == 1) {
        this.editForm.type = "必修";
      } else {
        this.editForm.type = "选修"
      }
      this.editForm.id=row.id;
      this.editForm.description = row.description;
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