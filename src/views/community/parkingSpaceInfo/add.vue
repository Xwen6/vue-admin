<template>
<div class="app-container">
  <el-form :model="parkingSpace" :rules="rules" ref="parkingSpace" label-width="100px" class="demo-parkingSpace">
  
        <el-form-item label="所属小区" prop="communityCode">
         <el-select v-model="parkingSpace.communityCode" filterable placeholder="请选择所属小区">
            <el-option 
            v-for="item in communityList" 
             :key="item.code"
             :label="item.name"
             :value="item.code"
            />
          </el-select>
        </el-form-item>
         <el-form-item label="楼栋名称" prop="name">
          <el-input v-model="parkingSpace.name" placeholder="请输入楼栋名称"></el-input>
        </el-form-item>

         <el-form-item label="状态" prop="status">
            <el-radio v-model="parkingSpace.status" label=0 checked>闲置</el-radio>
            <el-radio v-model="parkingSpace.status" label=1 >占用</el-radio>
        </el-form-item>

    <el-form-item>
      <router-link :to="'/community/building/list/'">
        <el-button type="primary" round>返回</el-button>
      </router-link>
    
      <el-button type="primary" @click="submitForm('parkingSpace')" round>创建</el-button>
      <el-button @click="resetForm('parkingSpace')" round>重置</el-button>
    </el-form-item>
  </el-form>
     



      

</div>

</template>

<script>

import parkingSpace from "@/api/community/parkingSpace.js"
import community from "@/api/community/community.js"
import ImageCropper from '@/components/ImageCropper'

export default {
   components: { ImageCropper },
    data(){
        return{
        parkingSpace: {
          name:'',
          communityCode: '',
          status: 0,
        },
        communityList: [],

        BASE_API: process.env.BASE_API, // 接口API地址
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0, // 上传组件id

        rules: {
            name: [
                { required: true, message: '请输入车位名称', trigger: 'blur' },
                { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
            ],
            communityCode: [
                { required: true, message: '请选择所属小区', trigger: 'change' }
            ],
            status: [
                { required: true, message: '请选择车位状态', trigger: 'change' }
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
            parkingSpace.addParkingSpace(this.parkingSpace)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '新增成功!'
                    });
            })
            this.$router.push("/parkingSpace/packingSpace/list/");
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