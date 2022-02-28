<template>
<div class="app-container">
  <el-form :model="car" :rules="rules" ref="car" label-width="100px" class="demo-car">
     <el-form-item label="所属成员" prop="userId">
          <el-select v-model="car.userId" filterable placeholder="请选择所属成员">
            <el-option label="zhangsan" value="38"></el-option>
            <el-option label="lisi" value="38"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="车牌品牌" prop="name">
          <el-input v-model="car.name" placeholder="请输入车牌名称"></el-input>
        </el-form-item>
        <el-form-item label="车牌号码" prop="licensePlate">
          <el-input v-model="car.licensePlate" placeholder="请输入车牌号码"></el-input>
        </el-form-item>

        <el-form-item label="车辆颜色" prop="color">
          <el-input v-model="car.color" placeholder="请输入车辆颜色"></el-input>
        </el-form-item>

          <el-form-item label="成员照片" required>

            <el-popover placement="top-start" title="" trigger="hover"
             content="点击添加图片">
               <img style="width: 100px; height: 100px" :src="car.photo" alt="" slot="reference" @click="imagecropperShow=true" >
            </el-popover>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="car.remark"></el-input>
        </el-form-item>
    <el-form-item>

      <router-link :to="'/userInfo/car/list/'">
        <el-button type="primary" round>返回</el-button>
      </router-link>
    
      <el-button type="primary" @click="submitForm('car')" round>创建</el-button>
      <el-button @click="resetForm('car')" round>重置</el-button>
    </el-form-item>
  </el-form>
     


    <image-cropper
	    v-show="imagecropperShow"
	    :width="300"
	    :height="300"
	    :key="imagecropperKey"
	    :url="BASE_API+'/ossService/file/uploadCarImage'"
	    field="file"
	    @close="close"
	    @crop-upload-success="cropSuccess"/>

      

</div>

</template>

<script>

import car from "@/api/userInfo/car.js"
import ImageCropper from '@/components/ImageCropper'

export default {
   components: { ImageCropper },
    data(){
        return{
        car: {
          userId: '',
          name:'',
          licensePlate: '',
          color: '',
          remark: '',
          photo:"https://xwe666.oss-cn-guangzhou.aliyuncs.com/user/carImage/2022/01/25/9786ae015b884becbc718cef8a8ecfc6file.png"
        },
        BASE_API: process.env.BASE_API, // 接口API地址
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0, // 上传组件id

        rules: {
          name: [
             { required: true, message: '请输入车辆名称', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
              
          licensePlate: [
            { required: true, message: '请输入车牌', trigger: 'blur' },
            { min: 2, max: 11, message: '长度在2-8个字符', trigger: 'blur' }
          ],
          color: [
            { required: true, message: '请输入车辆颜色', trigger: 'blur' }

          ],
          remark: [
            { required: false, message: '请填写备注', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '请选择所属成员', trigger: 'change' }
          ],
        }
        };
    },

    created() {
    },

    methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            car.addCar(this.car)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '新增成功!'
                    });
            })
            this.$router.push("/userInfo/car/list/");
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

          this.car.photo = data.url
      

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