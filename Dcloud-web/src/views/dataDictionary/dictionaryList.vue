<template>
  <div class="app-container">
    <div class="form-style">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" size="small" @click="addData()" icon="el-icon-plus">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" size="small" @click="deleteDatas()" icon="el-icon-delete">删除</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="resetData()">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="searchData()">查询</el-button>
        </el-form-item>
        <el-form-item label="中文标识：" style="float:right">
          <el-input placeholder="请输入中文标识" size="small" v-model="formInline.chineseMark"></el-input>
        </el-form-item>
        <el-form-item label="英文标识：" style="float:right">
          <el-input placeholder="请输入英文标识" size="small" v-model="formInline.englishMark"></el-input>
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
        <el-table-column label="中文标识" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="英文标识" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column label="说明" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" min-width="150">
          <template slot-scope="scope">
            <div>
              <el-link type="primary" @click="details(scope.row)">详情</el-link>
              <el-divider direction="vertical"></el-divider>
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
    <el-dialog title="数据字典详情" :visible.sync="dialogFormVisible">
      <span>数据字典</span>
      <el-divider></el-divider>
      <el-form :model="itemForm" ref="itemForm" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="中文标识">
              <el-input v-model="itemForm.name" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文标识">
              <el-input v-model="itemForm.code" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="说明">
          <el-input v-model="itemForm.description" disabled></el-input>
        </el-form-item>
      </el-form>
      <span>数据项</span>
      <el-divider></el-divider>
      <el-table
        :data="dataItem"
        v-loading="dataItemLoading"
        element-loading-text="Loading"
        fit
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      >
        <el-table-column label="序号" type="index" width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index}}</span>
          </template>
        </el-table-column>
        <el-table-column label="值" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.value}}</span>
          </template>
        </el-table-column>
        <el-table-column label="文本" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="默认值" min-width="100" align="center">
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="filterState(scope.row.isDefault)"></i>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          chinese: "性别",
          english: "sex",
          des: ""
        }
      ],
      listLoading: false,
      multipleSelection: [],
      totalNum: 0,
      pageSize: 10,
      formInline: {
        chineseMark: "",
        englishMark: ""
      },
      page: 1,
      dialogFormVisible: false,
      itemForm: {
        name: "",
        code: "",
        description: ""
      },
      dataItem: [],
      dataItemLoading: false
    };
  },
  created() {
    this.showDictionary(this.page);
  },
  methods: {
    filterState(state) {
      if (state == "1") {
        return true;
      } else {
        return false;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection);
    },
    deleteDatas() {
      //批量删除
      if (this.multipleSelection.length == 0) {
        this.$alert("请至少选中一条数据", "批量删除", {
          confirmButtonText: "确定"
        });
      } else {
        var codes = [];
        for (var i in this.multipleSelection) {
          codes.push({ code: this.multipleSelection[i].code });
        }
        console.log(codes);
        this.$confirm("确定要删除选择的数据字典？", "删除数据字典", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        })
          .then(() => {
            var data = codes;
            this.$axios
              .post("/api/dictionary/delDict", data, this.config)
              .then(res => {
                if (res.data.respCode == "1") {
                  this.$alert("数据字典删除成功", "成功", {
                    confirmButtonText: "确定"
                  });
                  this.page = 1;
                  this.showDictionary(this.page);
                } else {
                  this.$alert(res.data.respCode, "失败", {
                    confirmButtonText: "确定"
                  });
                  this.showDictionary(this.page);
                }
                this.listLoading = false;
              });
          })
          .catch(() => {});
      }
    },
    deleteData(row) {
      //删除
      var codes = [];
      codes.push({ code: row.code });
      this.$confirm("确定要删除该项数据字典？", "删除数据字典", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          var data = codes;
          this.$axios
            .post("/api/dictionary/delDict", data, this.config)
            .then(res => {
              if (res.data.respCode == "1") {
                this.$alert("数据字典删除成功", "成功", {
                  confirmButtonText: "确定"
                });
                this.page = 1;
                this.showDictionary(this.page);
              } else {
                this.$alert(res.data.respCode, "失败", {
                  confirmButtonText: "确定"
                });
                this.showDictionary(this.page);
              }
              this.listLoading = false;
            });
        })
        .catch(() => {});
    },
    searchData() {
      //查询
      this.list = [];
      this.listLoading = true;
      // if (this.formInline.chineseMark == "" && this.formInline.chineseMark == "") {
      //   this.showDictionary(this.page);
      // } else {
      this.page = 1;
      var data = {
        page: this.page,
        name: this.formInline.chineseMark,
        code: this.formInline.englishMark
      };
      this.$axios
        .post("/api/dictionary/queryList", data, this.config)
        .then(res => {
          this.listLoading = false;
          this.totalNum = res.data.total;
          if (this.totalNum != 0) {
            // delete res.data[0];
            this.list = res.data.records;
          }
        });
      // }
    },
    showDictionary(page) {
      //获取数据
      this.list = [];
      this.listLoading = true;
      this.page = page;
      var data = {
        page: this.page
      };
      this.$axios
        .post("/api/dictionary/getList", data, this.config)
        .then(res => {
          this.listLoading = false;
          console.log(res.data);
          this.totalNum = res.data.total;
          if (this.totalNum != 0) {
            // delete res.data[0];
            this.list = res.data.records;
          }
        });
    },

    handleCurrentChange(val) {
      //分页
      console.log(val);
      this.page = val;
      this.showDictionary(this.page);
    },
    resetData() {
      //重置
      this.formInline.chineseMark = "";
      this.formInline.englishMark = "";
      this.page = 1;
      this.showDictionary(this.page);
    },
    addData() {
      //新增数据字典
      this.$router.push({
        path: "/dataDictionary/addDictionary"
      });
    },
    editData(row) {
      //修改数据字典
      this.$router.push({
        path: "/dataDictionary/addDictionary",
        query: { code: row.code }
      });
    },
    details(row) {
      //查看详情
      this.dialogFormVisible = true;
      this.dataItemLoading = true;
      var data = {
        code: row.code
      };
      this.$axios
        .post("/api/dictionaryDetail/getDetail", data, this.config)
        .then(res => {
          this.dataItemLoading = false;
          console.log(res.data.detail);
          this.itemForm = res.data.dict[0];
          this.dataItem = res.data.detail;
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