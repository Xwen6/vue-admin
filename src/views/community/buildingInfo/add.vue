<template>
<div class="app-container">
  <el-form :model="addbuildingForm" :rules="rules" ref="addbuildingForm" label-width="100px" class="demo-addbuildingForm">
     <el-form-item label="所属小区" prop="communityCode">
          <el-select v-model="addbuildingForm.communityCode" filterable placeholder="请选择所属小区">
            <el-option 
            v-for="item in communityList" 
             :key="item.code"
             :label="item.name"
             :value="item.code"
            />
          </el-select>
      </el-form-item>
         <el-form-item label="楼栋名称" prop="name">
          <el-input v-model="addbuildingForm.name" placeholder="请输入楼栋名称"></el-input>
        </el-form-item>

         <el-form-item label="总户数" prop="house">
          <el-input v-model="addbuildingForm.house" placeholder="请输入总户数"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="addbuildingForm.description"></el-input>
        </el-form-item>

    <el-form-item>
      <router-link :to="'/community/building/list/'">
        <el-button type="primary" round>返回</el-button>
      </router-link>
    
      <el-button type="primary" @click="submitForm('addbuildingForm')" round>创建</el-button>
      <el-button @click="resetForm('addbuildingForm')" round>重置</el-button>
    </el-form-item>
  </el-form>
     



      

</div>

</template>

<script>

import building from "@/api/community/building.js"
import community from "@/api/community/community.js"
import ImageCropper from '@/components/ImageCropper'

export default {
   components: { ImageCropper },
    data(){
        return{
        addbuildingForm: {
          name:'',
          communityCode: '',
          description: '',
          house: '',
        },
        communityList: [],

        BASE_API: process.env.BASE_API, // 接口API地址
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0, // 上传组件id

        rules: {
          name: [
             { required: true, message: '请输入楼栋名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
              
          house: [
            { required: true, message: '请输入总户数', trigger: 'blur' },
            { min: 1, max: 3, message: '长度在 1 到 3 个字符', trigger: 'blur' }

          ],
          description: [
            { required: false, message: '请填写备注', trigger: 'blur' }
          ],
          communityCode: [
            { required: true, message: '请选择所属小区', trigger: 'change' }
          ]
        }
        };
    },

    created() {
     this.loadInfo()
    },

    methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            building.addBuilding(this.addbuildingForm)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '新增成功!'
                    });
            })
            this.$router.push("/community/building/list/");
            alert('submit!')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      loadInfo(){
        community.getCommunityList()
                 .then(response =>{
                    this.communityList = response.data.item
        })
      }
    
    }
}
</script>