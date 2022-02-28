<template>
<div class="app-container">
  <el-form :model="addPetForm" :rules="rules" ref="addPetForm" label-width="100px" class="demo-addPetForm">
     <el-form-item label="所属成员" prop="userId">
          <el-select v-model="addPetForm.userId" filterable placeholder="请选择所属成员">
            <el-option label="zhangsan" value="38"></el-option>
            <el-option label="lisi" value="38"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="宠物名称" prop="name">
          <el-input v-model="addPetForm.name" placeholder="请输入宠物名称名称"></el-input>
        </el-form-item>

        <el-form-item label="宠物颜色" prop="color">
          <el-input v-model="addPetForm.color" placeholder="请输入宠物颜色"></el-input>
        </el-form-item>

        <el-form-item label="收养日期" required>
          <el-col :span="11">
            <el-form-item prop="adoptTime">
          <el-date-picker
          v-model="addPetForm.adoptTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
            </el-form-item>
          </el-col>
        </el-form-item>

          <el-form-item label="宠物照片" >

            <el-popover placement="top-start" title="" trigger="hover"
             content="点击添加图片">
               <img style="width: 100px; height: 100px" :src="addPetForm.photo" alt="" slot="reference" @click="imagecropperShow=true" >
            </el-popover>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="addPetForm.remark"></el-input>
        </el-form-item>
    <el-form-item>

      <router-link :to="'/userInfo/pet/list/'">
        <el-button type="primary" round>返回</el-button>
      </router-link>
    
      <el-button type="primary" @click="submitForm('addPetForm')" round>创建</el-button>
      <el-button @click="resetForm('addPetForm')" round>重置</el-button>
    </el-form-item>
  </el-form>
     


    <image-cropper
	    v-show="imagecropperShow"
	    :width="300"
	    :height="300"
	    :key="imagecropperKey"
	    :url="BASE_API+'/ossService/file/uploadPetImage'"
	    field="file"
	    @close="close"
	    @crop-upload-success="cropSuccess"/>

      

</div>

</template>

<script>

import pet from "@/api/userInfo/pet.js"
import ImageCropper from '@/components/ImageCropper'

export default {
   components: { ImageCropper },
    data(){
        return{
        addPetForm: {
          name:'',
          userId: '',
          color: '',
          remark: '',
          photo:"https://xwe666.oss-cn-guangzhou.aliyuncs.com/user/carImage/2022/01/25/9786ae015b884becbc718cef8a8ecfc6file.png"
        },
        BASE_API: process.env.BASE_API, // 接口API地址
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0, // 上传组件id

        rules: {
          name: [
             { required: true, message: '请输入宠物名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
              
          color: [
            { required: true, message: '请输入宠物颜色', trigger: 'blur' }

          ],
          remark: [
            { required: false, message: '请填写备注', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '请选择所属成员', trigger: 'change' }
          ],
          adoptTime: [
            { required: true, message: '请选择收养日期', trigger: 'change' }
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
            pet.addPet(this.addPetForm)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '新增成功!'
                    });
            })
            this.$router.push("/userInfo/pet/list/");
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

          this.addPetForm.photo = data.url
      

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