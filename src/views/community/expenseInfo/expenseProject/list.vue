<template>
<div class="app-container">

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="ExpenseProjectQuery.beginDate"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="ExpenseProjectQuery.endDate"
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
                v-model="ExpenseProjectQuery.condition"
                clearable>
            </el-input>
        </el-form-item>
   

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

     <el-button type="warning" :disabled = "isDelBatchMerchantBtn" plain @click="batchDelete()" >批量删除</el-button>
     
      <el-button type="warning"  plain @click="addBtn=true" >新增</el-button>

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
     
        <el-table-column prop="communityName" label="所属社区" />
        <el-table-column prop="name" label="项目名称" />

          <el-table-column prop="createTime" label="创建时间"  />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">

        <el-button type="primary" size="mini" icon="el-icon-edit" @click="openUpdateBtn(scope.row.id)" >修改</el-button>
         

        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataBycode(scope.row.id)">删除</el-button>
          
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
      title="修改收费项目信息"
      :visible.sync="updateBtn"
      width="60%"
      >
      <span>
  <el-form :model="expenseProjectForm" :rules="rules" ref="expenseProjectForm" label-width="100px" class="demo-expenseProjectForm">

        <el-form-item label="所属社区" prop="communityCode">
           <el-select v-model="expenseProjectForm.communityCode" filterable placeholder="请选择所属小区">
            <el-option 
            v-for="item in communityList" 
             :key="item.code"
             :label="item.name"
             :value="item.code"
            />
          </el-select>
        </el-form-item>

        
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="expenseProjectForm.name" placeholder=" 请输入项目名称"></el-input>
        </el-form-item>

        
      </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="updateBtn = false">取 消</el-button>
      <el-button type="primary" @click="update('expenseProjectForm')">确 定</el-button>
      </span>
    </el-dialog>


        <!-- 添加的弹框 -->
    <el-dialog
      title="添加收费项目信息"
      :visible.sync="addBtn"
      width="60%"
      >
      <span>
  <el-form :model="expenseProjectForm" :rules="rules" ref="expenseProjectForm" label-width="100px" class="demo-expenseProjectForm">

        <el-form-item label="所属社区" prop="communityCode">
           <el-select v-model="expenseProjectForm.communityCode" filterable placeholder="请选择所属小区">
               <el-option value="CM20220224143310">com</el-option>
            <el-option 
            v-for="item in communityList" 
             :key="item.code"
             :label="item.name"
             :value="item.code"
            />
          </el-select>
        </el-form-item>

        
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="expenseProjectForm.name" placeholder=" 请输入项目名称"></el-input>
        </el-form-item>

        
      </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="addBtn = false">取 消</el-button>
      <el-button type="primary" @click="addExpensesProject('expenseProjectForm')">确 定</el-button>
      </span>
    </el-dialog>

</div>

</template>

<script>


import community from "@/api/community/community.js"
import expenseProject from "@/api/community/expenseProject.js"
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
            addBtn:false,
            updateBtn:false,
            ExpenseProjectQuery:{},
            select:"",
            isDelBatchMerchantBtn:true,
            expenseProjectForm:{},
            ids:[],
            BASE_API: process.env.BASE_API, // 接口API地址
            imagecropperShow: false, // 是否显示上传组件
            imagecropperKey: 0, // 上传组件id
            rules: {
           name: [
                  { required: true, message: '请输入设备名称', trigger: 'blur' },
                  { min: 1, max: 20, message: '长度在 1-20 个字符', trigger: 'blur' }
                ],
        

                communityCode: [
                  { required: true, message: '请选择所属社区', trigger: 'change' }
                ]
          }
        }
    },

    created() {
       this.getList();
       //this.loadInfo()
    },

    methods:{
      loadInfo(){
        community.getCommunityList()
            .then(response =>{
            this.communityList = response.data.item
        })
      },
     
      getList(current=1){
          this.current = current
          expenseProject.pageList(this.current,this.size,this.ExpenseProjectQuery)
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
            this.expenseProjectQuery={}
            //查询所有
            this.getList()
        },

        removeDataBycode(id){
           this.$confirm('此操作将永久删除车辆记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
                expenseProject.deleteById(id)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //回到列表页面
                })
                this.getList()
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
        openUpdateBtn(id){
             // 根据code获取building
            expenseProject.getById(id)
                .then(response =>{//删除成功
                //提示信息
                this.expenseProjectForm = response.data.item
                console.log(this.expenseProjectForm)
            })
          this.updateBtn = true
        },

        update(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
                 //调用update的方法
          expenseProject.updateExpensesProject(this.expenseProjectForm)
              .then(response =>{//update成功
              //提示信息
              this.$message({
                  type: 'success',
                  message: '修改成功!'
              });
          })
            //回到列表页
          this.updateBtn = false
              
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
         this.getList() 
        },

        addExpensesProject(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
                 //调用update的方法
          expenseProject.addExpensesProject(this.expenseProjectForm)
              .then(response =>{//update成功
              //提示信息
              this.$message({
                  type: 'success',
                  message: '修改成功!'
              });
          })
            //回到列表页
          this.updateBtn = false
              
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
         this.getList() 
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

<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>


