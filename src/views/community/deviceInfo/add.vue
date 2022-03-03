<template>
<div class="app-container">
  <el-form :model="deviceForm" :rules="rules" ref="deviceForm" label-width="100px" class="demo-deviceForm">
    
   <el-form-item label="所属社区" prop="communityCode">
           <el-select v-model="deviceForm.communityCode" filterable placeholder="请选择所属小区">

            <el-option lable="com" value="CM20220224161956" />

            <el-option 
            v-for="item in communityList" 
             :key="item.code"
             :label="item.name"
             :value="item.code"
            />
          </el-select>
        </el-form-item>

        
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="deviceForm.name" placeholder=" 请输入设备名称"></el-input>
        </el-form-item>

         <el-form-item label="设备品牌" prop="brand">
          <el-input v-model="deviceForm.brand" placeholder="请输入设备品牌"></el-input>
        </el-form-item>

          <el-form-item label="设备价格" prop="price">
          <el-input v-model="deviceForm.price" placeholder="请输入设备价格"></el-input>
        </el-form-item>

        
          <el-form-item label="设备数量" prop="quantity">
          <el-input v-model="deviceForm.quantity" placeholder="请输入设备数量"></el-input>
        </el-form-item>

         <el-form-item label="预计使用年限" prop="durableYears">
          <el-input v-model="deviceForm.durableYears" placeholder="请输入设备数量"></el-input>
        </el-form-item>

          <el-form-item label="购买时间" required>
          <el-col :span="11">
            <el-form-item prop="buyTime">
                    <el-date-picker
          v-model="deviceForm.buyTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
            </el-form-item>
          </el-col>
        </el-form-item>

    <el-form-item>
      <router-link :to="'/deviceInfo/device/list/'">
        <el-button type="primary" round>返回</el-button>
      </router-link>
    
      <el-button type="primary" @click="submitForm('deviceForm')" round>创建</el-button>
      <el-button @click="resetForm('deviceForm')" round>重置</el-button>
    </el-form-item>
  </el-form>
     



      

</div>

</template>

<script>

import device from "@/api/community/device.js"
import ImageCropper from '@/components/ImageCropper'
import community from "@/api/community/community.js"
import expense from "@/api/community/expense.js"

export default {
   components: { ImageCropper },
    data(){
        return{
       
         deviceForm: {
             name:"",
             brand:"",
             price:"",
             quantity:"",
             buyTime:"",
             durableYears:''
         },
        communityList: [],
        BASE_API: process.env.BASE_API, // 接口API地址
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0, // 上传组件id
        comm:{},

        rules: {
                name: [
                  { required: true, message: '请输入设备名称', trigger: 'blur' },
                  { min: 1, max: 20, message: '长度在 1-20 个字符', trigger: 'blur' }
                ],
              
                brand: [
                  { required: false, message: '请输入设备品牌', trigger: 'blur' },
                  { min: 1, max: 20, message: '长度在1-20个字符', trigger: 'blur' }
                ],

                 price: [
                  { required: true, message: '请输入设备价格', trigger: 'blur' },
                  { min: 1, max: 6, message: '长度在1-6个字符', trigger: 'blur' }
                ],

                  quantity: [
                  { required: true, message: '请输入设备数量', trigger: 'blur' },
                  { min: 1, max: 3, message: '长度在1-3个字符', trigger: 'blur' }
                ],

                  durableYears: [
                  { required: true, message: '请输入设备预计使用年限', trigger: 'blur' },
                  { min: 1, max: 2, message: '长度在1-2个字符', trigger: 'blur' }
                ],
        
                
                buyTime: [
                  { required: true, message: '请输入购买时间', trigger: 'blur' }
                ],
        

                communityCode: [
                  { required: true, message: '请选择所属社区', trigger: 'change' }
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
            device.addDevice(this.deviceForm)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '新增成功!'
                    });
            })
            this.$router.push("/deviceInfo/device/list/");
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
        expense.getSelectList()
                 .then(response =>{
                    this.communityList = response.data.items
            })
        }
    
    
    }
}
</script>