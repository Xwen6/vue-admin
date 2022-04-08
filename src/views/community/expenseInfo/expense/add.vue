<template>
<div class="app-container">
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
    <el-form-item>
      <router-link :to="'/expenseInfo/expenses/list/'">
        <el-button type="primary" round>返回</el-button>
      </router-link>
    
      <el-button type="primary" @click="submitForm('expenseForm')" round>创建</el-button>
      <el-button @click="resetForm('expenseForm')" round>重置</el-button>
    </el-form-item>
  </el-form>
     



      

</div>

</template>

<script>

import house from "@/api/community/house.js"
import ImageCropper from '@/components/ImageCropper'
import expense from "@/api/community/expense.js"
import project from "@/api/community/expenseProject.js"

export default {
   components: { ImageCropper },
    data(){
        return{
       
         expenseForm: {
        
        },
        communityList:[],
        houseList:[],
        projectList:[],
        BASE_API: process.env.BASE_API, // 接口API地址
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0, // 上传组件id
        comm:{},

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
        };
    },

    created() {
      this.loadInfo()
    },

    methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            expense.add(this.expenseForm)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '新增成功!'
                    });
            })
            this.$router.push("/expenseInfo/expenses/list/");
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
        }
    
    
    }
}
</script>