<template>
<div class="app-container">

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="QueryCondition.beginDate"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="QueryCondition.endDate"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>


   <!--搜索条件 to do -->
        <el-form-item>
            <el-input
                placeholder="请输入内容"
                v-model="QueryCondition.condition"
                clearable>
            </el-input>
        </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

     <el-button type="warning" :disabled = "isDelBatchMerchantBtn" plain @click="batchDelete()" >批量删除</el-button>
     
      <router-link :to="'/community/community/add/'">
            <el-button type="primary"  >新增</el-button>
      </router-link>

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange">
      

      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (current - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>


      <el-table-column
        prop="thumb"
        header-align="center"
        align="center"
        label="图片">
         <template slot-scope="scope">
            <el-popover placement="top-start" title="" trigger="hover">
               <img style="width: 50px; height: 50px" :src="scope.row.thumb" alt="" slot="reference">
               <img style="width: 200px; height: 200px" :src="scope.row.thumb" alt="">
            </el-popover>
         </template>
      </el-table-column>

        <el-table-column prop="name" label="小区名称" />
        <el-table-column prop="developer" label="开发商名称" />
        <el-table-column prop="estate" label="物业名称" />
        <el-table-column prop="address" label="坐落地址" />
        <el-table-column prop="area" label="小区面积" />
        <el-table-column prop="greeningRate" label="绿化率" />
        <el-table-column prop="totalBuilding" label="总楼数" />
        <el-table-column prop="totalOwner" label="总户数" />
        <el-table-column prop="greeningRate" label="绿化率" />
        <el-table-column prop="introduction" label="简介" />
        <el-table-column prop="createTime" label="创建日期"  />

      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">

          
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="openUpdateCommunityBtn(scope.row.code)" >修改</el-button>
         

          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
          
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="current"
      :page-size="size"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />

    <!-- 修改的弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="updateBtn"
      width="60%"
      >
      <span>
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

  
        <el-form-item label="小区略缩图" required>

            <el-popover placement="top-start" title="" trigger="hover"
             content="点击添加图片">
               <img style="width: 100px; height: 100px" :src="community.thumb" alt="" slot="reference" @click="imagecropperShow=true" >
            </el-popover>
        </el-form-item>

        <el-form-item label="介绍" prop="introduction">
          <el-input  type="textarea" v-model="community.introduction" placeholder="请输入介绍"></el-input>
        </el-form-item>

      </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="updateBtn = false">取 消</el-button>
      <el-button type="primary" @click="update('community')">确 定</el-button>
      </span>
    </el-dialog>


    
    <image-cropper
	    v-show="imagecropperShow"
	    :width="300"
	    :height="300"
	    :key="imagecropperKey"
	    :url="BASE_API+'/ossService/file/UploadCommunityThumb'"
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
            list:null,
            current:1,
            size:3,
            total:0,
            updateBtn:false,
            QueryCondition:{},
            select:"",
            isDelBatchMerchantBtn:true,
            BASE_API: process.env.BASE_API, // 接口API地址
            imagecropperShow: false, // 是否显示上传组件
            imagecropperKey: 0, // 上传组件id
            community:{},
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
        }
    },

    created() {
       this.getList();
    },

    methods:{
      getList(current=1){
          this.current = current
          community.pageList(this.current,this.size,this.QueryCondition)
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
            this.QueryCondition={}
            //查询所有
            this.getList()
        },

        //删除讲师
        removeDataById(id){
           this.$confirm('此操作将永久删除小区记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
                community.deleteCommunity(id)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //回到列表页面
                    this.getList()
                })
            }) //点击取消，执行catch方法
        },

        handleSelectionChange(val){
         if(val.length>0){
            this.ids = [];
          for (let selectedItem of val) {
           this.ids.push(selectedItem.id);
          }
          for (var value of this.ids) {
            console.log(value);
          }  
          this.isDelBatchMerchantBtn = false
         }else{
           this.isDelBatchMerchantBtn = true
         }
        },
        batchDelete(){
            //后面再写
        },
        openUpdateCommunityBtn(code){
             // 根据ID获取Car
            community.getCommunityByCode(code)
                .then(response =>{//删除成功
                //提示信息
                this.community = response.data.item
                console.log(this.community)
            })
          this.updateBtn = true
        },
        update(formName){


        this.$refs[formName].validate((valid) => {
          if (valid) {
                 //调用删除的方法
          community.updateCommunity(this.community)
              .then(response =>{//删除成功
              //提示信息
              this.$message({
                  type: 'success',
                  message: '修改成功!'
              });
          })
            //回到列表页面
          this.getList() 
          this.updateBtn = false
              
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        

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

<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>