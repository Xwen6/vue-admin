<template>
<div class="app-container">

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">

        <el-form-item>
            <el-input
                placeholder="请输入角色名称"
                v-model="Query.name"
                clearable>
            </el-input>
        </el-form-item>
   
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
       <el-button type="primary" @click="openAddForm()" plain>新增</el-button>
      <!-- <el-button type="default" @click="resetData()">清空</el-button> -->
    </el-form>
<!--  <el-button type="warning" :disabled = "isDelBatchMerchantBtn" plain @click="batchDelete()" >批量删除</el-button> -->
     
      <!-- <router-link :to="'/deviceInfo/device/add'">
            <el-button type="primary"  >新增</el-button>
      </router-link> -->

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
     
        <el-table-column prop="name" label="名称" align="center" />
        <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope" center>
            <el-alert
                v-if="scope.row.status==0"
                center
                title="启用"
                type="success"
                :closable="false">
            </el-alert>
            <el-alert
                v-if="scope.row.status==1"
                title="禁用"
                center
                type="error"
                :closable="false">
            </el-alert>
             <!-- <el-button v-show="scope.row.status==0" size="20px" type="success" plain>启用</el-button> -->
             <!-- <el-button v-show="scope.row.status==1" size="20px" type="danger" plain>禁用</el-button> -->
        </template>
        </el-table-column>


        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column prop="updateTime" label="修改时间" align="center" />
        
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
      title="修改角色"
      :visible.sync="updateBtn"
      width="60%"
      >
      <span>
  <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="100px" class="demo-roleForm">

        
        <el-form-item label="角色id" prop="id">
          <el-input :disabled="true" v-model="roleForm.id" placeholder=" 请输入ID"></el-input>
        </el-form-item>

         <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>

        <el-form-item label="排序" prop="weight">
            <template>
                <el-input-number v-model="roleForm.weight" controls-position="right" @change="handleChange" :min="0" :max="10"></el-input-number>
            </template>
        </el-form-item>

        
          <el-form-item label="状态" prop="status">
            <template>
                <el-radio v-model="roleForm.status" :label=0>启用</el-radio>
                <el-radio v-model="roleForm.status" :label=1>禁用</el-radio>
                 <!-- <el-radio-group v-model="addForm.status" @change="agreeChange(addForm.status)">
                  <el-radio :label="0"  >启用</el-radio>
                  <el-radio :label="1" >禁用</el-radio>
                </el-radio-group> -->
            </template>
        </el-form-item>
        
      </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="updateBtn = false">取 消</el-button>
      <el-button type="primary" @click="update('roleForm')">确 定</el-button>
      </span>
    </el-dialog>

     <!-- 新增的弹框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="openAddFormBtn"
      width="60%"
      >
      <span>
  <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-addForm">


         <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>

        <el-form-item label="排序" prop="weight">
            <template>
                <el-input-number v-model="addForm.weight" controls-position="right" @change="handleChange" :min="0" :max="10"></el-input-number>
            </template>
        </el-form-item>

        
          <el-form-item label="状态" prop="status">
            <template>
                <el-radio v-model="addForm.status" :label=0>启用</el-radio>
                <el-radio v-model="addForm.status" :label=1 >禁用</el-radio>
            </template>
        </el-form-item>
        
      </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="openAddFormBtn = false">取 消</el-button>
      <el-button type="primary" @click="addRole('addForm')">确 定</el-button>
      </span>
    </el-dialog>

</div>

</template>

<script>




//import device from "@/api/community/device.js"
import roleConfig from "@/api/community/system/role.js"
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
            openAddFormBtn:false,
            Query:{ "name":'' },
            select:"",
            isDelBatchMerchantBtn:true,
            roleForm:{},
            addForm:{},
            ids:[],
            BASE_API: process.env.BASE_API, // 接口API地址
            imagecropperShow: false, // 是否显示上传组件
            imagecropperKey: 0, // 上传组件id
            rules: {
                name: [
                  { required: true, message: '请输入角色名称', trigger: 'blur' },
                  { min: 1, max: 20, message: '长度在 1-20 个字符', trigger: 'blur' }
                ],
              
                weight: [
                  { required: false, message: '请输入角色顺序', trigger: 'blur' }
                ],

                 status: [
                  { required: true, message: '请选择状态', trigger: 'blur' }
                ]
          }
        }
    },

    created() {
       this.getList()
    },

    methods:{

        agreeChange(val){
          console.log(val)
          if(val==1){  this.$notify({
          title: '警告',
          message: '禁用角色，会解除绑定改角色下的账号哦',
          type: 'warning'
        });
        }
        
        },

        addRole(formName){
        this.$refs[formName].validate((valid) => {
        if(valid){
              roleConfig.add(this.addForm.name,this.addForm.weight,this.addForm.status)
              .then(response =>{//update成功
              //提示信息
              if(response.code==20000){
                  this.$message({
                  type: 'success',
                  message: '新增成功!'
              });
              this.getList() 
            }else{
                this.$message({
                  type: 'error',
                  message: '新增失败!'
                });
            }
          })
            //回到列表页面
            this.getList() 
            this.openAddFormBtn = false
            this.$refs[formName].resetFields();
        }else{

        }
        })

    },
        openAddForm(){
            this.openAddFormBtn=true;
        },

        handleChange(value) {
            this.roleForm.weight = value;
        },
     
    
      getList(current=1){
          this.current = current
          roleConfig.pageList(this.current,this.size,this.Query)
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
            this.Query={}
            //查询所有
            this.getList()
        },

        removeDataBycode(id){
           this.$confirm('此操作将永久删除角色记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
                roleConfig.delete(id)
                    .then(response =>{//删除成功
                   //提示信息
              		if(response.code==20000){
              		    this.$message({
              		    type: 'success',
              		    message: '删除成功!'
              		});
              		this.updateSuccess()
            		}else{
               		this.$message({
                  		type: 'error',
                  		message: response.message
               		 });
            		}
                })
            }) //点击取消，执行catch方法
            // 刷新页面
            //this.getList()
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

        updateSuccess(){
			    this.getList();
			  this.$forceUpdate();
		    },

        batchDelete(){
            //后面再写
        },
        openUpdateBtn(id){
             // 根据code获取building
            roleConfig.getById(id)
                .then(response =>{//删除成功
                //提示信息
                this.roleForm = response.data.item
                //console.log(this.parkingUse)
            })
          this.updateBtn = true
        },

        update(formName){
        //调用update的方法
         this.$refs[formName].validate((valid) => {
            roleConfig.update(this.roleForm)
              .then(response =>{//update成功
              //提示信息
              if(response.code==20000){
                  this.$message({
                  type: 'success',
                  message: '修改成功!'
              });
              this.getList() 
            }else{
                this.$message({
                  type: 'error',
                  message: '修改失败!'
                });
            }
          })
            //回到列表页面
        this.getList() 
        this.updateBtn = false
        })
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


