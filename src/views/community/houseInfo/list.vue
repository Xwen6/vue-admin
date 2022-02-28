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
     
      <router-link :to="'/community/house/add/'">
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
       <el-table-column prop="buildingName" label="所属楼栋名称" />
      <el-table-column prop="name" label="房产名称" />
      <el-table-column prop="ownerName" label="户主名称" />
      <el-table-column prop="ownerTel" label="联系方式" />
     
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

      <el-table-column prop="rooms" label="房间数" />

      <el-table-column prop="unit" label="单元" />

      <el-table-column prop="floor" label="楼层" />

      <el-table-column prop="description" label="备注" />
      
      <el-table-column prop="enterTime" label="入住日期"  />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">

        <el-button type="primary" size="mini" icon="el-icon-edit" @click="openUpdateBtn(scope.row.code)" >修改</el-button>
         

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
        <el-form :model="house" :rules="rules" ref="house" label-width="100px" class="demo-house">

        <el-form-item label="所属小区" prop="communityCode">
          <el-select v-model="house.communityCode" filterable placeholder="请选择所属小区">
            <el-option label="zhangsan" value="asdasd"></el-option>
            <el-option label="lisi" value="asdasd"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="所属楼栋" prop="buildingCode">
          <el-select v-model="house.buildingCode" filterable placeholder="请选择所属楼栋">
            <el-option label="123" value="BD20220223145525"></el-option>
            <el-option label="456" value="BD20220223145525"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="房产名称" prop="name">
          <el-input v-model="house.name" placeholder="请输入房产名称"></el-input>
        </el-form-item>

        <el-form-item label="户主名称" prop="ownerName">
          <el-input v-model="house.ownerName" placeholder="请输入户主名称"></el-input>
        </el-form-item>

        <el-form-item label="联系方式" prop="ownerName">
          <el-input v-model="house.ownerTel" placeholder="请输入户主名称"></el-input>
        </el-form-item>

         <el-form-item label="房间数" prop="rooms">
          <el-input v-model="house.rooms" placeholder="请输入房间数"></el-input>
        </el-form-item>

         <el-form-item label="单元" prop="unit">
          <el-input v-model="house.unit" placeholder="请输入单元"></el-input>
        </el-form-item>

        <el-form-item label="楼层" prop="floor">
          <el-input v-model="house.floor" placeholder="请输入楼层"></el-input>
        </el-form-item>

        <el-form-item label="入住日期" required>
          <el-col :span="11">
            <el-form-item prop="enterTime">
              <el-date-picker type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="house.enterTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="house.description"></el-input>
        </el-form-item>
      </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="updateBtn = false">取 消</el-button>
      <el-button type="primary" @click="update('house')">确 定</el-button>
      </span>
    </el-dialog>

</div>

</template>

<script>

import building from "@/api/community/building.js"
import house from "@/api/community/house.js"
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
            house:{},
            ids:[],
            BASE_API: process.env.BASE_API, // 接口API地址
            imagecropperShow: false, // 是否显示上传组件
            imagecropperKey: 0, // 上传组件id
            // 表单限制规则
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
        }
    },

    created() {
       this.getList();
    },

    methods:{
      getList(current=1){
          this.current = current
          house.getHouseList(this.current,this.size,this.QueryCondition)
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
           this.$confirm('此操作将永久删除房产记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
                house.deleteHouse(code)
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
        openUpdateBtn(code){
             // 根据code获取building
            house.getHouseByCode(code)
                .then(response =>{//
                //提示信息
                this.house = response.data.item
                console.log(this.house)
            })
          this.updateBtn = true
        },

        update(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
                 //调用update的方法
          house.updateHouse(this.house)
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










    