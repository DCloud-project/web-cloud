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
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="用户名" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.username}}</span>
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
        <el-table-column label="邮箱" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.email}}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" min-width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.role}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="50" align="center">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.state"
              plain
              @click="changeState(scope.row)"
              size="small"
            >{{scope.row.stateName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="所属机构" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.school}}</span>
          </template>
        </el-table-column>
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
        <el-form-item label="手机号码" prop="tel">
          <el-input v-model="ruleForm.tel" :disabled="title=='修改用户信息'" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="ruleForm.sex" label="0">男</el-radio>
          <el-radio v-model="ruleForm.sex" label="1">女</el-radio>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="ruleForm.role" placeholder="请选择角色" style="width:100%">
            <el-option
              v-for="item in ruleForm.roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
        return callback(new Error("手机号不能为空"));
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
      list: [
        {
          username: "赖啦啦啦",
          sex: "1",
          tel: "13215002576",
          email: "123@qq.com",
          role: "管理员",
          type: "1",
          state: "primary",
          stateName: "正常",
          school: "福州大学"
        }
      ],
      AllData: [],
      listLoading: false,
      multipleSelection: [],
      dialogFormVisible: false,
      ruleForm: {
        username: "",
        tel: "",
        sex: "0",
        roles: [],
        role: "",
        email: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        role: [{ required: true, message: "请选择角色", trigger: "change" }],
        tel: [{ required: true, validator: checkPhone, trigger: "blur" }],
        email: [
          {
            required: false,
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      },
      totalNum: 1,
      title: "新增用户",
      pageSize: 10,
      formInline: {
        username: "",
        state: ""
      }
    };
  },
  methods: {
    changeState(row) {
      if (row.type == "1") {
        row.state = "danger";
        row.stateName = "禁用";
        row.type = "0";
      } else {
        row.state = "primary";
        row.stateName = "正常";
        row.type = "1";
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    deleteData() {
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
          .then(() => {})
          .catch(() => {});
      }
    },
    showUserInfo() {
      this.list = [];
      this.listLoading = true;
      //获取用户信息
    },
    reset() {
      this.ruleForm.username = "";
      this.ruleForm.tel = "";
      this.ruleForm.sex = "0";
      this.ruleForm.role = "";
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
      this.formInline.username = "";
      this.showUserInfo();
    },
    editData(row){
      this.title="修改用户信息";
      this.dialogFormVisible=true;
    },
      permissionAssign(row){
     this.$router.push({path:"/userManage/permissionAssignment",query:{username:row.username}});
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