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
            <el-option label="已禁用" value="1"></el-option>
            <el-option label="已启用" value="2"></el-option>
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
            <span>{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="110" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.note}}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色状态" min-width="50" align="center">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.state"
              plain
              @click="changeState(scope.row)"
              size="small"
            >{{scope.row.stateName}}</el-button>
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
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>

        <el-form-item label="角色状态" v-if="title=='编辑角色'">
          <el-radio v-model="ruleForm.type" label="0">禁用</el-radio>
          <el-radio v-model="ruleForm.type" label="1">启用</el-radio>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="ruleForm.note" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;margin-bottom:10px">
        <el-button type="primary" @click="submitForm('ruleForm')" style="width:180px">确定</el-button>
        <el-button @click="resetForm('ruleForm')" style="width:180px">取消</el-button>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center;color: #5d5b5b;font-size:14px" v-if="title=='新增角色'">
        <span>新增角色默认为已启用</span>
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
          username: "超管",
          note: "超级管理员",
          type: "1",
          state: "primary",
          stateName: "已启用"
        }
      ],
      AllData: [],
      listLoading: false,
      dialogFormVisible: false,
      ruleForm: {
        username: "",
        type: "0",
        note: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      totalNum: 1,
      title: "新增角色",
      pageSize: 10,
      formInline: {
        role: "",
        state: ""
      }
    };
  },
  created() {
    // this.showUserInfo();
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
    },
    resetData() {},
    reset() {
      this.ruleForm.username = "";
      this.ruleForm.note = "";
    },
    changeState(row) {
      if (row.type == "1") {
        row.state = "danger";
        row.stateName = "已禁用";
        row.type = "0";
      } else {
        row.state = "primary";
        row.stateName = "已启用";
        row.type = "1";
      }
    },
    editData(row) {
      this.ruleForm.username = "";
      this.ruleForm.note = "";
      this.ruleForm.type = row.type;
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
        .then(() => {})
        .catch(() => {});
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
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
    permissionAssign(row){
     this.$router.push({path:"/roleManage/permissionAssignment",query:{username:row.username}});
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
