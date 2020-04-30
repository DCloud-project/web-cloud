<template>
  <div>
    <div class="app-container">
      <div class="form-style1">
        <span>数据字典</span>
        <el-divider></el-divider>
        <el-form
          :model="dictionaryForm"
          :rules="dictionaryRules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="中文标识" prop="name">
                <el-input v-model="dictionaryForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文标识" prop="code">
                <el-input v-model="dictionaryForm.code" :disabled="isEdit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="说明">
            <el-input type="textarea" v-model="dictionaryForm.description"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-style1" style="margin-top:20px">
        <span>数据项</span>
        <el-divider></el-divider>
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
          <el-table-column label="操作" min-width="150" align="center">
            <template slot-scope="scope">
              <div>
                <i class="el-icon-edit" @click="editItem(scope.row)"></i>
                <i
                  class="el-icon-delete"
                  @click="deleteItem(scope.row)"
                  style="color:red;margin-left:20px"
                ></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button icon="el-icon-plus" class="add_btn" size="small" @click="addItem()">新增</el-button>
      </div>
      <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <el-form
          :model="itemForm"
          :rules="itemFormRules"
          ref="itemForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="值" prop="value">
            <el-input
              v-model.number="itemForm.value"
              placeholder="请输入值"
              :disabled="title=='修改数据项'&&isEdit==true"
            ></el-input>
          </el-form-item>
          <el-form-item label="文本" prop="name">
            <el-input v-model="itemForm.name" placeholder="请输入文本"></el-input>
          </el-form-item>
          <el-form-item label="默认值">
            <el-radio v-model="itemForm.isDefault" label="1">是</el-radio>
            <el-radio v-model="itemForm.isDefault" label="0">否</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center;margin-bottom:10px">
          <el-button type="primary" @click="submitForm('itemForm')" style="width:180px">提交</el-button>
          <el-button @click="resetForm('itemForm')" style="width:180px">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <div
      slot="footer"
      style="text-align: right;color: #5d5b5b;font-size:14px;margin:10px;background: #fff;"
    >
      <el-button type="primary" style="width:180px" size="small" @click="submit('ruleForm')">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dictionaryForm: {
        code: "",
        name: "",
        description: ""
      },
      dictionaryRules: {
        code: [{ required: true, message: "请输入中文标识", trigger: "blur" }],
        name: [{ required: true, message: "请输入英文标识", trigger: "blur" }]
      },
      list: [],
      listLoading: false,
      dialogFormVisible: false,
      itemForm: {
        value: "",
        name: "",
        isDefault: "0"
      },
      value: "",
      title: "新增数据项",
      itemFormRules: {
        value: [
          { required: true, message: "请输入值", trigger: "blur" },
          { type: "number", message: "值必须为数字值" }
        ],
        name: [{ required: true, message: "请输入文本", trigger: "blur" }]
      },
      isEdit: false,
      dic: []
    };
  },
  created() {
    if (this.$route.query.code != undefined) {
      this.isEdit = true;
      this.getDetails(this.$route.query.code);
    }
  },
  methods: {
    getDetails(code) {
      this.listLoading = true;
      this.$http.get("/api/dictionaries?code=" + code).then(
        res => {
          this.listLoading = false;
          this.dictionaryForm = res.data.dict[0];
          this.dic = res.data.dict[0];
          this.list = res.data.detail;
        },
        res => {
          this.$router.push({
            path: "/" + res
          });
        }
      );
    },
    filterState(state) {
      if (state == "1") {
        return true;
      } else {
        return false;
      }
    },
    deleteItem(row) {
      //删除数据项
      for (var i in this.list) {
        if (this.list[i].value == row.value) {
          this.list.splice(i, 1);
          break;
        }
      }
      var data = [];
      data.push(row.id);
      this.$http.delete("/api/dictionaries?del_list=" + data).then(
        res => {
          if (res.data.respCode == "1") {
            this.$alert("数据项删除成功", "成功", {
              confirmButtonText: "确定"
            });
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
    },
    editItem(row) {
      //修改数据项
      console.log(row);
      this.itemForm.value = parseInt(row.value);
      this.itemForm.name = row.name;
      this.itemForm.isDefault = row.isDefault.toString();
      this.dialogFormVisible = true;
      this.title = "修改数据项";
    },
    addItem() {
      //新增数据项
      this.itemForm.value = "";
      this.itemForm.name = "";
      this.itemForm.isDefault = "0";
      this.dialogFormVisible = true;
      this.title = "新增数据项";
    },
    submitForm(formName) {
      //提交数据项
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.title == "新增数据项") {
            this.list.push({
              value: this.itemForm.value,
              name: this.itemForm.name,
              isDefault: this.itemForm.isDefault
            });
          } else {
            for (var i in this.list) {
              if (this.list[i].value == this.itemForm.value) {
                this.list[i].name = this.itemForm.name;
                this.list[i].isDefault = this.itemForm.isDefault;
                break;
              }
            }
          }
          this.dialogFormVisible = false;
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    // 提交数据字典
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEdit == false) {
            //添加数据字典
            var details = [];
            for (var i in this.list) {
              details.push({
                value: this.list[i].value,
                name: this.list[i].name,
                is_default: this.list[i].isDefault,
                dict_order: "0",
                code: this.list[i].value
              });
            }
            var data = {
              code: this.dictionaryForm.code,
              name: this.dictionaryForm.name,
              description: this.dictionaryForm.description,
              detail: details
            };
            this.$http.post("/api/dictionaries", data).then(
              res => {
                if (res.data.respCode == "1") {
                  this.$alert("数据字典添加成功", "成功", {
                    confirmButtonText: "确定"
                  });
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
            //修改数据字典
            var details = [];
            for (var i in this.list) {
              details.push({
                id: this.list[i].id,
                value: this.list[i].value,
                name: this.list[i].name,
                is_default: this.list[i].isDefault,
                dict_order: "0",
                code: this.list[i].value
              });
            }
            var data = {
              id: this.dictionaryForm.id,
              old_code: this.dic.code,
              new_code: this.dictionaryForm.code,
              old_name: this.dic.name,
              new_name: this.dictionaryForm.name,
              description: this.dictionaryForm.description,
              detail: details
            };
            this.$http.patch("/api/dictionaries", data).then(
              res => {
                // success callback
                if (res.data.respCode == "1") {
                  this.$alert("数据字典修改成功", "成功", {
                    confirmButtonText: "确定"
                  });
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
          }
        }
      });
    }
  }
};
</script>
<style scoped>
.form-style1 {
  background: #fff;
  padding: 20px;
  /* min-height: 85vh; */
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
.add_btn {
  width: 100%;
  margin-top: 20px;
}
</style>