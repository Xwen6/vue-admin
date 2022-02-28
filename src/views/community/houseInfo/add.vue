<template>
<div class="app-container">
  <el-form :model="addHouseForm" :rules="rules" ref="addHouseForm" label-width="100px" class="demo-addHouseForm">
    
    <el-form-item label="所属小区" prop="communityCode">
          <el-select v-model="addHouseForm.communityCode" filterable placeholder="请选择所属小区" @change="changeSelect">
            <el-option 
            v-for="item in communityList" 
             :key="item.code"
             :label="item.name"
             :value="item.code"
            />
          </el-select>
      </el-form-item>

    <el-form-item label="所属楼栋" prop="buildingCode">
        <el-select v-model="addHouseForm.buildingCode" filterable placeholder="请选择所属楼栋">
          <el-option 
            v-for="item in buildingList" 
             :key="item.code"
             :label="item.name"
             :value="item.code"
          />
        </el-select>
    </el-form-item>
    
         <el-form-item label="房产名称" prop="name">
          <el-input v-model="addHouseForm.name" placeholder="请输入房产名称"></el-input>
        </el-form-item>

        <el-form-item label="户主名称" prop="ownerName">
          <el-input v-model="addHouseForm.ownerName" placeholder="请输入户主名称"></el-input>
        </el-form-item>

        <el-form-item label="联系方式" prop="ownerName">
          <el-input v-model="addHouseForm.ownerTel" placeholder="请输入户主名称"></el-input>
        </el-form-item>

         <el-form-item label="房间数" prop="rooms">
          <el-input v-model="addHouseForm.rooms" placeholder="请输入房间数"></el-input>
        </el-form-item>

         <el-form-item label="单元" prop="unit">
          <el-input v-model="addHouseForm.unit" placeholder="请输入单元"></el-input>
        </el-form-item>

        <el-form-item label="楼层" prop="floor">
          <el-input v-model="addHouseForm.floor" placeholder="请输入楼层"></el-input>
        </el-form-item>

        <el-form-item label="入住时间" prop="enterTime">
        <el-date-picker
          v-model="addHouseForm.enterTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="addHouseForm.description"></el-input>
        </el-form-item>

    <el-form-item>
      <router-link :to="'/community/house/list/'">
        <el-button type="primary" round>返回</el-button>
      </router-link>
    
      <el-button type="primary" @click="submitForm('addHouseForm')" round>创建</el-button>
      <el-button @click="resetForm('addHouseForm')" round>重置</el-button>
    </el-form-item>
  </el-form>
     



      

</div>

</template>

<script>

import house from "@/api/community/house.js"
import ImageCropper from '@/components/ImageCropper'
import community from "@/api/community/community.js"

export default {
   components: { ImageCropper },
    data(){
        return{
       
         addHouseForm: {
          name:'',
          communityCode: '',
          buildingCode:'',
          ownerName:'',
          description: '',
          ownerTel:'',
          rooms:'',
          util:'',
          floor:'',
          enterTime:''
        },
        communityList: [],
        buildingList: [],
        BASE_API: process.env.BASE_API, // 接口API地址
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0, // 上传组件id
        comm:{},

        rules: {
            communityCode: [
             { required: true, message: '请选择所属小区', trigger: 'change' }
           ],

           buildingCode: [
             { required: true, message: '请选择所属楼栋', trigger: 'change' }
           ],
            name: [
             { required: true, message: '请输入房产名称', trigger: 'blur' },
             { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
           ],
            ownerName: [
             { required: true, message: '请输入户主名称', trigger: 'blur' },
             { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
           ],
           ownerTel: [
             { required: true, message: '请输入联系方式', trigger: 'blur' },
             { min: 11, max: 11, message: '长度11个字符', trigger: 'blur' }
           ],
           rooms: [
             { required: true, message: '请输入房间数', trigger: 'blur' },
             { min: 1, max: 2, message: '长度在 1 到 2 个字符', trigger: 'blur' }
           ],
           unit: [
             { required: true, message: '请输入单元', trigger: 'blur' },
             { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
           ],
           floor: [
             { required: true, message: '请输入楼层', trigger: 'blur' },
             { min: 1, max: 2, message: '长度在 1 到 2 个字符', trigger: 'blur' }
           ],
           enterTime: [
             { required: true, message: '请输入住时间', trigger: 'blur' },
           ],
           description: [
             { required: false, message: '请输入备注', trigger: 'blur' },
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
            house.addHouse(this.addHouseForm)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '新增成功!'
                    });
            })
            this.$router.push("/community/house/list/");
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
      },
      changeSelect() {
      // 清空手机型号内容
      this.addHouseForm.buildingCode = ''
      // console.log(this.communityList)
      // 遍历社区的下拉选项数组
       this.communityList.forEach(element => {
          if (this.addHouseForm.communityCode === element.code) {
              console.log(element)
          this.buildingList = element.children
          console.log(this.buildingList)
        }
        });
    }
    
    
    }
}
</script>