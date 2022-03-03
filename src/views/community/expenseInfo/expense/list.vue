<template>
<div class="app-container">

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="ExpenseQuery.beginDate"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="ExpenseQuery.endDate"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

        <!--搜索条件 to do -->
        <el-form-item>
            <el-input
                placeholder="请输入所属小区"
                v-model="ExpenseQuery.communityName"
                clearable>
            </el-input>
        </el-form-item>
        <!--搜索条件 to do -->
        <el-form-item>
            <el-input
                placeholder="请输入缴费人"
                v-model="ExpenseQuery.houseName"
                clearable>
            </el-input>
        </el-form-item>
        <!--搜索条件 to do -->
        <el-form-item>
            <el-input
                placeholder="请输入收费项目"
                v-model="ExpenseQuery.projectName"
                clearable>
            </el-input>
        </el-form-item>
   

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

     <el-button type="warning" :disabled = "isDelBatchMerchantBtn" plain @click="batchDelete()" >批量删除</el-button>
     
      <router-link :to="'/expenseInfo/expenses/add/'">
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
       <el-table-column prop="projectName" label="缴费项目" />
       <el-table-column prop="houseName" label="缴费人" />
      <el-table-column prop="amountTotal" label="应收金额" />
      <el-table-column prop="amountPaid" label="实收金额" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="createTime" label="缴费时间"  />
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
      title="修改楼栋信息"
      :visible.sync="updateBtn"
      width="60%"
      >
      <span>
        <el-form :model="expenseForm" :rules="rules" ref="expenseForm" label-width="100px" class="demo-expenseForm">

        <el-form-item label="所属小区" prop="communityCode">
          <el-select v-model="expenseForm.communityCode" filterable placeholder="请选择所属小区" @change="changeSelect">
             <el-option 
            v-for="item in communityList" 
             :key="item.code"
             :label="item.name"
             :value="item.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="缴费人" prop="houseCode">
          <el-select v-model="expenseForm.houseCode" filterable placeholder="请选择缴费人">
            <el-option 
            v-for="item in houseList" 
             :key="item.code"
             :label="item.name"
             :value="item.code"
            />
          </el-select>
        </el-form-item>

         <el-form-item label="缴费项目" prop="projectCode">
          <el-select v-model="expenseForm.projectCode" filterable placeholder="请选择缴费项目">
           <el-option 
            v-for="item in projectList" 
             :key="item.code"
             :label="item.name"
             :value="item.code"
            />
          </el-select>
        </el-form-item>

         <el-form-item label="应收金额" prop="amountTotal">
          <el-input v-model="expenseForm.amountTotal" placeholder="请输入应收金额"></el-input>
        </el-form-item>

        <el-form-item label="实收金额" prop="amountPaid">
          <el-input v-model="expenseForm.amountPaid" placeholder="请输入实收金额"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="expenseForm.remark"></el-input>
        </el-form-item>
      </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="updateBtn = false">取 消</el-button>
      <el-button type="primary" @click="update('expenseForm')">确 定</el-button>
      </span>
    </el-dialog>

</div>

</template>

<script>

import building from "@/api/community/building.js"
import house from "@/api/community/house.js"
import ImageCropper from '@/components/ImageCropper'
import expense from '@/api/community/expense.js'

export default {
    components: { ImageCropper },
    data(){
        return{
            list:null,
            current:1,
            size:3,
            total:0,
            communityList:[],
            houseList:[],
            projectList:[],
            updateBtn:false,
            ExpenseQuery:{
                beginDate:"",
                endDate:"",
                communityName:"",
                houseName:"",
                projectName:""
            },
            select:"",
            isDelBatchMerchantBtn:true,
            expenseForm:{},
            ids:[],
            BASE_API: process.env.BASE_API, // 接口API地址
            imagecropperShow: false, // 是否显示上传组件
            imagecropperKey: 0, // 上传组件id
            // 表单限制规则
            rules: {
                communityCode: [
                  { required: true, message: '请选择所属小区', trigger: 'change' }
                ],

                houseCode: [
                  { required: true, message: '请选择缴费人', trigger: 'change' }
                ],
                 projectCode: [
                  { required: true, message: '请选择缴费项目', trigger: 'change' }
                ],
                 amountTotal: [
                  { required: true, message: '请输入应收金额', trigger: 'blur' },
                  { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                 amountPaid: [
                  { required: true, message: '请输入实收金额', trigger: 'blur' },
                  { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                remark: [
                  { required: false, message: '请输入备注', trigger: 'blur' },
                ]      
          }
        }
    },

    created() {
       this.loadInfo()
       this.getList();
    },

    methods:{
      getList(current=1){
          this.current = current
          expense.pageList(this.current,this.size,this.ExpenseQuery)
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
            this.ExpenseQuery={}
            //查询所有
            this.getList()
        },

        loadInfo(){
        expense.getSelectList()
                 .then(response =>{
                    this.communityList = response.data.items
                    this.houseList = response.data.items.houseVoList
                    this.projectList = response.data.items.expensesProjectList
            })
        },
         changeSelect() {
             // 清空内容
             this.expenseForm.houseList = ''
             this.expenseForm.projectList = ''
             // console.log(this.communityList)
             // 遍历社区的下拉选项数组
              this.communityList.forEach(element => {
                 if (this.expenseForm.communityCode === element.code) {
                     console.log(element)
                 this.houseList = element.houseVoList
                 this.projectList = element.expensesProjectList
                
            }
            });
        },

        //删除pet
        removeDataBycode(id){
           this.$confirm('此操作将永久删除房产记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
                expense.deleteById(id)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //回到列表页面
                    
                })
                 this.getList();
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
            expense.getById(id)
                .then(response =>{//
                //提示信息
                this.expenseForm = response.data.item
                // console.log(this.expense)
            })
          this.updateBtn = true
        },

        update(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
                 //调用update的方法
          expense.updateExpenses(this.expenseForm)
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
          //this.getList();
        });
           this.getList() 
        },
       
    

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










    