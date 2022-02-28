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
     
      <router-link :to="'/parkingSpace/packingSpace/add/'">
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
      <el-table-column prop="communityName" label="所属小区" />
        <el-table-column prop="name" label="车位名称" />
        <el-table-column prop="estate" label="状态"  align="center" >
          <template slot-scope="scope">
            <el-button type="success" v-if="scope.row.status==0" @click="changeStatus(scope.row.status,scope.row.id)" plain >闲置</el-button>
            <el-button type="danger" v-if="scope.row.status==1" @click="changeStatus(scope.row.status,scope.row.id)" plain >占用</el-button>
          </template>
        </el-table-column>
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
            <el-radio v-model="parkingSpace.status" label="0">闲置</el-radio>
            <el-radio v-model="parkingSpace.status" label="1">占用</el-radio>
        </el-form-item>

       

      </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="updateBtn = false">取 消</el-button>
      <el-button type="primary" @click="update('parkingSpace')">确 定</el-button>
      </span>
    </el-dialog>

</div>

</template>

<script>

import building from "@/api/community/building.js"
import community from "@/api/community/community.js"
import parkingSpace from "@/api/community/parkingSpace.js"
import ImageCropper from '@/components/ImageCropper'

export default {
    components: { ImageCropper },
    data(){
        return{
          parent:"",
            list:null,
            communityList: [],
            current:1,
            size:5,
            total:0,
            updateBtn:false,
            QueryCondition:{},
            select:"",
            isDelBatchMerchantBtn:true,
            parkingSpace:{},
            ids:[],
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
        }
    },

    created() {
       this.getList();
       this.loadInfo()
    },

    methods:{
      getList(current=1){
          this.current = current
          parkingSpace.pageList(this.current,this.size,this.QueryCondition)
          .then(response =>{
           
              this.list = response.data.items.items
              this.total = response.data.items.total
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

        changeStatus(status,id){
            this.$confirm('是否改变车位状态?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                if(status==0){
                  status=1
                }else{
                  status = 0
                }

                console.log(status,id);
                  parkingSpace.changeStatus(id,status)
                    .then(response =>{//删除成功
                    //回到列表页面
                    this.getList()
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    
                })

            }) //点击取消，执行catch方法
        },

        //删除pet
        removeDataBycode(code){
           this.$confirm('此操作将永久删除车辆记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
                parkingSpace.deleteParkingSpace(code)
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
            parkingSpace.getParkingSpaceByCode(code)
                .then(response =>{//删除成功
                //提示信息
                this.parkingSpace = response.data.item
                console.log(this.parkingSpace.status)
            })
          this.updateBtn = true
        },

        update(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
                 //调用update的方法
          parkingSpace.updateParkingSpace(this.parkingSpace)
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

         loadInfo(){
            community.getCommunityList()
             .then(response =>{
              this.communityList = response.data.item
        })
      }
    

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


