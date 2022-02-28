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

        <el-form-item>
        <el-select filterable v-model="QueryCondition.condition" clearable placeholder="所属成员">
          <el-option value="asdasd" label="ls"/>
          <el-option value="asd3asd" label="zs"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <!-- <el-input v-model="PetQuery.name" placeholder="车辆名称"/> -->
      <el-input placeholder="请输入内容"  v-model="select" class="input-with-select">
        <el-select v-model="select" slot="prepend" clearable placeholder="请选择">
        <el-option label="车辆牌照" value="QueryCondition.QueryCondition"></el-option>
        <el-option label="车辆名称" value="PetQuery.name"></el-option>
        </el-select>
      </el-input>
      </el-form-item> 

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

     <el-button type="warning" :disabled = "isDelBatchMerchantBtn" plain @click="batchDelete()" >批量删除</el-button>
     
      <router-link :to="'/community/building/add/'">
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

      <el-table-column prop="communityName" label="所属小区名称" />
      <el-table-column prop="name" label="楼栋名称" />
     
      <!-- <el-table-column
        prop="photo"
        header-align="center"
        align="center"
        label="宠物照片">
         <template slot-scope="scope">
            <el-popover placement="top-start" title="" trigger="hover">
               <img style="width: 50px; height: 50px" :src="scope.row.photo" alt="" slot="reference">
               <img style="width: 200px; height: 200px" :src="scope.row.photo" alt="">
            </el-popover>
         </template>
      </el-table-column> -->

      <el-table-column prop="house" label="总户数" />

      <el-table-column prop="description" label="备注" />
      
      <el-table-column prop="createTime" label="创建日期"  />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">

        <el-button type="primary" size="mini" icon="el-icon-edit" @click="openUpdatePetBtn(scope.row.code)" >修改</el-button>
         

        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataBycode(scope.row.code)">删除</el-button>
          
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
      title="修改楼栋信息"
      :visible.sync="updateBtn"
      width="60%"
      >
      <span>
        <el-form :model="building" :rules="rules" ref="building" label-width="100px" class="demo-building">

        <el-form-item label="所属小区" prop="userId">
          <el-select v-model="building.communityCode" filterable placeholder="请选择所属小区">
            <el-option label="zhangsan" value="asdasd"></el-option>
            <el-option label="lisi" value="asdasd"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="楼栋名称" prop="name">
          <el-input v-model="building.name" placeholder="请输入楼栋名称"></el-input>
        </el-form-item>

         <el-form-item label="总户数" prop="name">
          <el-input v-model="building.house" placeholder="请输入总户数"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="building.description"></el-input>
        </el-form-item>
      </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="updateBtn = false">取 消</el-button>
      <el-button type="primary" @click="update('building')">确 定</el-button>
      </span>
    </el-dialog>

</div>

</template>

<script>

import building from "@/api/community/building.js"
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
            building:{},
            ids:[],
            BASE_API: process.env.BASE_API, // 接口API地址
            imagecropperShow: false, // 是否显示上传组件
            imagecropperKey: 0, // 上传组件id
            rules: {
                name: [
                  { required: true, message: '请输入楼栋', trigger: 'blur' },
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
                ],
          }
        }
    },

    created() {
       this.getList();
    },

    methods:{
      getList(current=1){
          this.current = current
          building.getBuildingList(this.current,this.size,this.QueryCondition)
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

        //删除pet
        removeDataBycode(code){
           this.$confirm('此操作将永久删除车辆记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
                building.deleteBuilding(code)
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
        openUpdatePetBtn(code){
             // 根据code获取building
            building.getBuildingByCode(code)
                .then(response =>{//删除成功
                //提示信息
                this.building = response.data.item
                console.log(this.building)
            })
          this.updateBtn = true
        },

        update(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
                 //调用update的方法
          building.updateBuilding(this.building)
              .then(response =>{//update成功
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

          this.Pet.photo = data.url
      

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


  <el-table-column prop="CommunityName" label="所属小区" />
        <el-table-column prop="name" label="车位名称" />
        <el-table-column prop="estate" label="状态" > 
            <el-button type="success" plain disabled>成功按钮</el-button>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期"  />