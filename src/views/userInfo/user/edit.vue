<template>
<div class="app-container">

   <el-form :model="addUserInfoForm" :rules="rules" ref="addUserInfoForm" label-width="100px" class="demo-addUserInfoForm">
        <el-form-item label="所示小区" prop="communityCode">
          <el-select v-model="addUserInfoForm.communityCode" filterable placeholder="请选择所属社区">
            <el-option label="碧桂园" value="biguiy"></el-option>
            <el-option label="豪园" value="haoyuan"></el-option>
          </el-select>
        </el-form-item>

         <el-form-item label="所属房产" prop="houseCode">
          <el-select v-model="addUserInfoForm.houseCode" filterable placeholder="请选择所属房产">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="成员名称" prop="name">
          <el-input v-model="addUserInfoForm.name" placeholder="请输入成员名称"></el-input>
        </el-form-item>

        <el-form-item label=" 身 份 证" prop="identityId">
          <el-input v-model="addUserInfoForm.identityId" placeholder="请输入身份证"></el-input>
        </el-form-item>

        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="addUserInfoForm.phone" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        
        <el-form-item label="成员职业" prop="occupation">
          <el-input v-model="addUserInfoForm.occupation" placeholder="请输入联系方式"></el-input>
        </el-form-item>

        <el-form-item label="出生日期" required>
          <el-col :span="11">
            <el-form-item prop="birth">
              <el-date-picker type="date" placeholder="选择日期" v-model="addUserInfoForm.birth" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="addUserInfoForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
        <el-form-item label="成员类型" prop="ownerType">
          <el-radio-group v-model="addUserInfoForm.ownerType">
            <el-radio label="1">业主</el-radio>
            <el-radio label="2">家庭成员</el-radio>
             <el-radio label="3">租户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="addUserInfoForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('addUserInfoForm')">立即创建</el-button>
          <el-button @click="resetForm('addUserInfoForm')">重置</el-button>
        </el-form-item>
      </el-form>

     



</div>

</template>

<script>

import users from "@/api/userInfo/user.js"

export default {
    data(){
        return{
            list:null,

            userInfo:{},
          updateUserInfoForm: {
          name: '',
          //    name: '',
           communityCode: '',
           houseCode: '',
           identityId: '',
           birth: '',
           phone:'',
           occupation:'',
          // gender:'',
           ownerType:'',
          // //photo:''
           remark: ''
        },
          rules: {
            name: [
              { required: true, message: '请输入活动名称', trigger: 'blur' },
              { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            identityId: [
              { required: true, message: '请输身份证', trigger: 'blur' },
              { min: 18, max: 18, message: '长度在18字符', trigger: 'blur' }
            ],
            phone: [
              { required: true, message: '请输入手机号码', trigger: 'blur' },
              { min: 11, max: 11, message: '长度在11个字符', trigger: 'blur' }
            ],
            occupation: [
              { required: true, message: '请输入职业', trigger: 'blur' }

            ],
            communityCode: [
              { required: true, message: '请选择所属社区', trigger: 'change' }
            ],
            houseCode: [
              { required: true, message: '请选择所属房产', trigger: 'change' }
            ],
            birth: [
              { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
            ],
            date2: [
              { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
            ],
            type: [
              { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
            ],
            ownerType: [
              { required: true, message: '请选择成员类型', trigger: 'change' }
            ],
            remark: [
              { required: false, message: '请填写备注', trigger: 'blur' }
            ]
          }
        }
    },

    created() {
      this.getList();
    },

    methods:{
        getList(id){
          this.current = current
          users.getUserInfoList(this.current,this.size,this.userInfoQuery)
          .then(response =>{
              this.list = response.data.items
              this.total = response.data.total
          })
          .catch(error =>{
              console.log(error);
          }) 
        },
        //清空数据
        resetData(){
            //清空对象数据
            this.userInfoQuery={}
            //查询所有
            this.getList()
        },


        // 提交表单
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              console.log(this.addUserInfoForm.ownerType)
               //调用删除的方法
                users.addUserInfo(this.addUserInfoForm)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '新增成功!'
                    });
                    //回到列表页面
                    this.getList()
                })
              alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
    
    }
}
</script>