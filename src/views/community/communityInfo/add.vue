<template>
<div class="app-container">
  <el-form :model="community" :rules="rules" ref="community" label-width="100px" class="demo-community">
      <el-form-item label="小区名称" prop="name">
          <el-input v-model="community.name" placeholder="请输入小区名称"></el-input>
        </el-form-item>

         <el-form-item label="开发商名称" prop="developer">
          <el-input v-model="community.developer" placeholder="请输入开发商名称"></el-input>
        </el-form-item>

         <el-form-item label="物业名称" prop="estate">
          <el-input v-model="community.estate" placeholder="请输入物业名称"></el-input>
        </el-form-item>

         <el-form-item label="坐落地址" prop="address">
          <el-input v-model="community.address" placeholder="请输入地址"></el-input>
        </el-form-item>

         <el-form-item label="小区面积" prop="area">
          <el-input v-model="community.area" placeholder="请输入小区面积"></el-input>
        </el-form-item>

         <el-form-item label="小区绿化率" prop="greeningRate">
          <el-input v-model="community.greeningRate" placeholder="请输入小区绿化率"></el-input>
        </el-form-item>

         <el-form-item label="总楼数" prop="totalBuilding">
          <el-input v-model="community.totalBuilding" placeholder="请输入总楼数"></el-input>
        </el-form-item>

         <el-form-item label="总户数" prop="totalOwner">
          <el-input v-model="community.totalOwner" placeholder="请输入总户数"></el-input>
        </el-form-item>
          <el-form-item label="社区略缩图" >

            <el-popover placement="top-start" title="" trigger="hover"
             content="点击添加图片">
               <img style="width: 100px; height: 100px" :src="community.thumb" alt="" slot="reference" @click="imagecropperShow=true" >
            </el-popover>
        </el-form-item>

      <el-form-item label="介绍" prop="introduction">
          <el-input  type="textarea" v-model="community.introduction" placeholder="请输入介绍"></el-input>
        </el-form-item>
    <el-form-item>

      <router-link :to="'/community/community/list/'">
        <el-button type="primary" round>返回</el-button>
      </router-link>
    
      <el-button type="primary" @click="submitForm('community')" round>创建</el-button>
      <el-button @click="resetForm('community')" round>重置</el-button>
    </el-form-item>
  </el-form>
     


    <image-cropper
	    v-show="imagecropperShow"
	    :width="300"
	    :height="300"
	    :key="imagecropperKey"
	    :url="BASE_API+'/ossService/file/uploadcommunityThumb'"
	    field="file"
	    @close="close"
	    @crop-upload-success="cropSuccess"/>

      

</div>

</template>

<script>

import community from "@/api/community/community.js"
import ImageCropper from '@/components/ImageCropper'

export default {
   components: { ImageCropper },
    data(){
        return{
      
        community: {
        
          photo:"https://xwe666.oss-cn-guangzhou.aliyuncs.com/user/carImage/2022/01/25/9786ae015b884becbc718cef8a8ecfc6file.png"
        },
         communityList: {
          buildingList: {}
        },
         
        BASE_API: process.env.BASE_API, // 接口API地址
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0, // 上传组件id

        rules: {
        name: [
                  { required: true, message: '请输入小区名称', trigger: 'blur' },
                  { min: 2, max: 5, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
              
                developer: [
                  { required: true, message: '请输入开发商名称', trigger: 'blur' },
                  { min: 2, max: 11, message: '长度在2-8个字符', trigger: 'blur' }
                ],
                  estate: [
                  { required: true, message: '请输入物业名称', trigger: 'blur' },
                  { min: 2, max: 11, message: '长度在2-8个字符', trigger: 'blur' }
                ],
                  address: [
                  { required: true, message: '请输入小区坐落地址', trigger: 'blur' },
                ],
                  area: [
                  { required: true, message: '请输入小区面积', trigger: 'blur' },
                  { min: 2, max: 11, message: '长度在2-8个字符', trigger: 'blur' }
                ],
                  greeningRate: [
                  { required: true, message: '请输入小区绿化率', trigger: 'blur' },
                  { min: 2, max: 11, message: '长度在2-8个字符', trigger: 'blur' }
                ],
                  totalBuilding: [
                  { required: true, message: '请输入小区总楼数', trigger: 'blur' },
                  { min: 2, max: 11, message: '长度在2-8个字符', trigger: 'blur' }
                ],
                  totalOwner: [
                  { required: true, message: '请输入小区总户数', trigger: 'blur' },
                  { min: 2, max: 11, message: '长度在2-8个字符', trigger: 'blur' }
                ],
          
                introduction: [
                  { required: false, message: '请填写介绍', trigger: 'blur' }
                ]
        }
        };
    },

    created() {
    },

    methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            community.addCommunity(this.community)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '新增成功!'
                    });
            })
            this.$router.push("/community/community/list/");
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
      
         // 上传成功后的回调函数
          cropSuccess(data) {
          console.log(data)
          this.imagecropperShow = false

          this.community.thumb = data.url
      

          // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
          this.imagecropperKey = this.imagecropperKey + 1
           },
            close() {
          this.imagecropperShow = false
          // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
          this.imagecropperKey = this.imagecropperKey + 1
        },
        // toAddPage(){
        //     this.$router.push('/car/edit');
        // }
        
    
    }
}
</script>