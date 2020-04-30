<template>
  <div class="app-container">
    <div class="form-style">
      <el-form
        ref="experienceForm"
        :model="experienceForm"
        label-width="150px"
        style="width: 80%;margin: 0 20px;"
      >
        <el-form-item
          label="签到经验值："
          prop="checkExperience"
          :rules="[
      { required: true, message: '签到经验值不能为空'},
      { type: 'number', message: '签到经验值必须为数字值'}
    ]"
        >
          <el-input v-model.number="experienceForm.checkExperience"></el-input>
        </el-form-item>

        <el-form-item
          label="活动/作业经验值："
          prop="workExperience"
          :rules="[
      { required: true, message: '活动/作业经验值不能为空'},
      { type: 'number', message: '活动/作业经验值必须为数字值'}
    ]"
        >
          <el-input v-model.number="experienceForm.workExperience"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item
              v-for="(level, index) in experienceForm.levels"
              :label="'出勤等级' + (index+1)"
              :key="level.key"
              :prop="'levels.' + index + '.value'"
              :rules="[
        {required: true, message: '等级不能为空', trigger: 'blur'},
        {type: 'number', message: '等级必须为数字值'}]"
            >
              <el-input v-model.number="level.value">
                <template slot="prepend">LV</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item
              v-for="(attendance, index) in experienceForm.attendances"
              :label="'出勤率' + (index+1)"
              :key="attendance.key"
              :prop="'attendances.' + index + '.value'"
              :rules="{
      required: true, message: '出勤率不能为空', trigger: 'blur'
    }"
            >
              <el-row :gutter="20">
                <el-col :span="18">
                  <el-input v-model="attendance.value"></el-input>
                </el-col>
                <el-col :span="1" style="margin-right:25px">
                  <i
                    class="el-icon-circle-plus"
                    @click="addLevelAndAttend()"
                    style="color:#409eff;font-size:27px;"
                    v-show="index+1==experienceForm.levels.length"
                  ></i>
                </el-col>
                <el-col :span="1">
                  <i
                    class="el-icon-remove"
                    @click.prevent="removeLevelAndAttend(attendance)"
                    style="color:red;font-size:27px"
                    v-show="index!=0||experienceForm.levels.length>1"
                  ></i>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="签到距离KM："
          prop="distance"
          :rules="[
      { required: true, message: '距离不能为空'},
      { type: 'number', message: '距离必须为整数值'}
    ]"
        >
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              表示学生只有在老师一定距离范围内签到才可签到成功。
              <br />默认0，表示不限定距离。
            </div>
            <el-input v-model.number="experienceForm.distance"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item style="text-align:center">
          <el-button type="primary" @click="onSubmit('experienceForm')" style="width:40%">保存</el-button>
          <el-button @click="resetForm('experienceForm')" style="width:40%">重置为初始值</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      experienceForm: {
        levels: [
          {
            value: ""
          }
        ],
        attendances: [
          {
            value: ""
          }
        ],
        checkExperience: "",
        workExperience: "",
        distance: -1
      },
      experienceFormInit: {
        levels: [
          {
            value: 0
          },
          {
            value: 1
          },
          {
            value: 2
          },
          {
            value: 3
          },
          {
            value: 4
          }
        ],
        attendances: [
          {
            value: "0%"
          },
          {
            value: "0%~20%"
          },
          {
            value: "20%~50%"
          },
          {
            value: "50%~70%"
          },
          {
            value: "70%~100%"
          }
        ],
        checkExperience: 2,
        workExperience: 2,
        distance: 0
      }
    };
  },
  created() {
    this.experienceForm = this.experienceFormInit;
  },
  methods: {
    removeLevelAndAttend(attendItem) {
      //   var index = this.experienceForm.levels.indexOf(levelItem);
      //   if (index !== -1) {
      //     this.experienceForm.levels.splice(index, 1);
      //   }
      var index1 = this.experienceForm.attendances.indexOf(attendItem);
      if (index1 !== -1) {
        this.experienceForm.attendances.splice(index1, 1);
      }
      if (index1 !== -1) {
        this.experienceForm.levels.splice(index1, 1);
      }
    },
    addLevelAndAttend() {
      this.experienceForm.levels.push({
        value: "",
        key: Date.now() + 0
      });
      this.experienceForm.attendances.push({
        value: "",
        key: Date.now() + 1
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var num = [];
          var k=[];
          for (var i in this.experienceForm.levels) {
            num.push(this.experienceForm.levels[i].value);
          }

          if (this.isContinuityNum(num)) {
            //判断输入等级是否连续
            console.log("连续");
          } else {
            this.$alert("设置的等级不连续", "失败", {
              confirmButtonText: "确定"
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.experienceForm = this.experienceFormInit;
    },
    //判断等级是否是连续的
    isContinuityNum(num) {
      let array = [];
      if (num instanceof Array) {
        array = [...num];
      } else {
        array = Array.from(num.toString()); //转换为数组
      }

      var i = array[0];
      var isContinuation = true;
      for (var e in array) {
        if (array[e] != i) {
          isContinuation = false;
          break;
        }
        i++;
      }
      return isContinuation;
    }
  }
};
</script>