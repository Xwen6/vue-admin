<template>
<div class="app-container">

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="添加购买时间">
        <el-date-picker
          v-model="DeviceQuery.beginDate"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="DeviceQuery.endDate"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

              <!--搜索条件 to do -->
        <el-form-item>
            <el-input
                placeholder="请输入社区名称"
                v-model="DeviceQuery.communityName"
                clearable>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-input
                placeholder="请输入设备名称"
                v-model="DeviceQuery.name"
                clearable>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-input
                placeholder="请输入品牌"
                v-model="DeviceQuery.brand"
                clearable>
            </el-input>
        </el-form-item>
   

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

     <el-button type="warning" :disabled = "isDelBatchMerchantBtn" plain @click="batchDelete()" >批量删除</el-button>
     
      <router-link :to="'/deviceInfo/device/add'">
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
     
        <el-table-column prop="communityName" label="所属社区" />
        <el-table-column prop="name" label="设备名称" />

        <el-table-column prop="brand" label="设备品牌"  />

        <el-table-column prop="price" label="设备价格"  />
        <el-table-column prop="quantity" label="购买数量"  />

        <el-table-column prop="buyTime" label="购买时间"  />
         <el-table-column prop="durableYears" label="预计使用年限(年)"  />
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
      title="修改楼栋信息"
      :visible.sync="updateBtn"
      width="60%"
      >
      <span>
  <el-form :model="deviceForm" :rules="rules" ref="deviceForm" label-width="100px" class="demo-deviceForm">

        <el-form-item label="所属社区" prop="communityCode">
           <el-select v-model="deviceForm.communityCode" filterable placeholder="请选择所属小区">
            <el-option 
            v-for="item in communityList" 
             :key="item.code"
             :label="item.name"
             :value="item.code"
            />
          </el-select>
        </el-form-item>

        
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="deviceForm.name" placeholder=" 请输入设备名称"></el-input>
        </el-form-item>

         <el-form-item label="设备品牌" prop="brand">
          <el-input v-model="deviceForm.brand" placeholder="请输入设备品牌"></el-input>
        </el-form-item>

          <el-form-item label="设备价格" prop="price">
          <el-input v-model="deviceForm.price" placeholder="请输入设备价格"></el-input>
        </el-form-item>

        
          <el-form-item label="设备数量" prop="quantity">
          <el-input v-model="deviceForm.quantity" placeholder="请输入设备数量"></el-input>
        </el-form-item>

         <el-form-item label="预计使用年限" prop="durableYears">
          <el-input v-model="deviceForm.durableYears" placeholder="请输入设备数量"></el-input>
        </el-form-item>

          <el-form-item label="购买时间" required>
          <el-col :span="11">
            <el-form-item prop="buyTime">
                    <el-date-picker
          v-model="deviceForm.buyTime"
          type="datetime"
          placeholder="选择购买时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
            </el-form-item>
          </el-col>
        </el-form-item>

        
      </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="updateBtn = false">取 消</el-button>
      <el-button type="primary" @click="update('deviceForm')">确 定</el-button>
      </span>
    </el-dialog>

</div>

</template>

<script>




import device from "@/api/community/device.js"
import expense from "@/api/community/expense.js"
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
            DeviceQuery:{},
            select:"",
            isDelBatchMerchantBtn:true,
            deviceForm:{},
            ids:[],
            BASE_API: process.env.BASE_API, // 接口API地址
            imagecropperShow: false, // 是否显示上传组件
            imagecropperKey: 0, // 上传组件id
            rules: {
           name: [
                  { required: true, message: '请输入设备名称', trigger: 'blur' },
                  { min: 1, max: 20, message: '长度在 1-20 个字符', trigger: 'blur' }
                ],
              
                brand: [
                  { required: false, message: '请输入设备品牌', trigger: 'blur' },
                  { min: 1, max: 20, message: '长度在1-20个字符', trigger: 'blur' }
                ],

                 price: [
                  { required: true, message: '请输入设备价格', trigger: 'blur' },
                  { min: 1, max: 6, message: '长度在1-6个字符', trigger: 'blur' }
                ],

                  quantity: [
                  { required: true, message: '请输入设备数量', trigger: 'blur' },
                  { min: 1, max: 3, message: '长度在1-3个字符', trigger: 'blur' }
                ],

                  durableYears: [
                  { required: true, message: '请输入设备预计使用年限', trigger: 'blur' },
                  { min: 1, max: 2, message: '长度在1-2个字符', trigger: 'blur' }
                ],
        
                
                buyTime: [
                  { required: true, message: '请输入购买时间', trigger: 'blur' }
                ],
        

                communityCode: [
                  { required: true, message: '请选择所属社区', trigger: 'change' }
                ]
          }
        }
    },

    created() {
       this.getList();
       this.loadInfo()
    },

    methods:{
      loadInfo(){
        expense.getSelectList()
                 .then(response =>{
                    this.communityList = response.data.items
            })
        },


     
      getList(current=1){
          this.current = current
          device.pageList(this.current,this.size,this.DeviceQuery)
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
            this.DeviceQuery={}
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
                device.deleteById(id)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //回到列表页面
                
                })
            }) //点击取消，执行catch方法
                this.getList()
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
            device.getById(id)
                .then(response =>{//删除成功
                //提示信息
                this.deviceForm = response.data.item
                console.log(this.parkingUse)
            })
          this.updateBtn = true
        },

        update(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
                 //调用update的方法
          device.updateDevice(this.deviceForm)
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


