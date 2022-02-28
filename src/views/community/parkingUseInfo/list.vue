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
     
        <el-table-column prop="communityName" label="所属社区" />
        <el-table-column prop="parkingName" label="停车车位" />

        <el-table-column prop="licenseName" label="车牌号码"  />

        <el-table-column prop="owner" label="车辆所有人"  />
        <el-table-column prop="tel" label="联系方式"  />

         <el-table-column prop="estate" label="状态"  align="center" >
          <template slot-scope="scope">
            <el-button type="success" v-if="scope.row.type==0"  plain >售</el-button>
            <el-button type="danger" v-if="scope.row.type==1" plain >租</el-button>
          </template>
        </el-table-column>
          <el-table-column prop="cost" label="费用"  />
        <el-table-column prop="beginTime" label="开始日期"  />
        <el-table-column prop="endTime" label="结束时间"  />
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
  <el-form :model="parkingUse" :rules="rules" ref="parkingUse" label-width="100px" class="demo-parkingUse">

        <el-form-item label="所属社区" prop="communityCode">
           <el-select v-model="parkingUse.communityCode" filterable placeholder="请选择所属小区" @change="changeSelect">
            <el-option 
            v-for="item in communityList" 
             :key="item.code"
             :label="item.name"
             :value="item.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="停车位" prop="pkCode">
          <el-select v-model="parkingUse.pkCode" filterable placeholder="停车位">
            <el-option 
            v-for="item in parkingList" 
             :key="item.code"
             :label="item.name"
             :value="item.code"
            />
          </el-select>
        </el-form-item>

        
        <el-form-item label="车牌号码" prop="licenseName">
          <el-input v-model="parkingUse.licensePlate" placeholder="请输入车牌号码"></el-input>
        </el-form-item>

         <el-form-item label="所有者" prop="owner">
          <el-input v-model="parkingUse.owner" placeholder="请输入所有者"></el-input>
        </el-form-item>

          <el-form-item label="联系方式" prop="tel">
          <el-input v-model="parkingUse.tel" placeholder="请输入联系方式"></el-input>
        </el-form-item>

        <el-form-item label="车位类型" prop="type">
            <el-radio v-model="parkingUse.type" label="0">租</el-radio>
            <el-radio v-model="parkingUse.type" label="1">售</el-radio>
        </el-form-item>

          <el-form-item label="所有者" prop="cost">
          <el-input v-model="parkingUse.cost" placeholder="请输入费用"></el-input>
        </el-form-item>


         <el-form-item label="结束时间" required>
          <el-col :span="11">
            <el-form-item prop="beginTime">
                    <el-date-picker
          v-model="parkingUse.beginTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="结束时间" required>
          <el-col :span="11">
            <el-form-item prop="endTime">
              <el-date-picker type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="parkingUse.endTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>

        
      </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="updateBtn = false">取 消</el-button>
      <el-button type="primary" @click="update('parkingUse')">确 定</el-button>
      </span>
    </el-dialog>

</div>

</template>

<script>


import community from "@/api/community/community.js"
import parkingSpace from "@/api/community/parkingSpace.js"
import parkingUse from "@/api/community/parkingUse.js"
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
            communityList: [],
            parkingList: [],
            select:"",
            isDelBatchMerchantBtn:true,
            parkingUse:{},
            ids:[],
            BASE_API: process.env.BASE_API, // 接口API地址
            imagecropperShow: false, // 是否显示上传组件
            imagecropperKey: 0, // 上传组件id
            rules: {
           owner: [
                  { required: true, message: '请输入所有者', trigger: 'blur' },
                  { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ],
              
                licenseName: [
                  { required: false, message: '请输入车牌号码', trigger: 'blur' },
                  { min: 2, max: 11, message: '长度在2-8个字符', trigger: 'blur' }
                ],

                 tel: [
                  { required: true, message: '请输入联系方式', trigger: 'blur' },
                  { min: 11, max: 11, message: '长度在11个字符', trigger: 'blur' }
                ],
               
                cost: [
                  { required: true, message: '请输入费用', trigger: 'blur' }
                ],
                
                beginTime: [
                  { required: true, message: '请输入开始时间', trigger: 'blur' }
                ],
                endTime: [
                  { required: true, message: '请输入结束时间', trigger: 'blur' }
                ],

                 type: [
                  { required: true, message: '请选择车位类型', trigger: 'blur' }
                ],

                communityCode: [
                  { required: true, message: '请选择所属社区', trigger: 'change' }
                ],

                 pkCode: [
                  { required: true, message: '请选择停车位', trigger: 'change' }
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
        community.getCommunityList()
            .then(response =>{
            this.communityList = response.data.item
        })
      },
      changeSelect() {
      // 清空手机型号内容
      this.parkingUse.buildingCode = ''
      this.parkingList = []
      // console.log(this.communityList)
      // 遍历社区的下拉选项数组
       this.communityList.forEach(element => {
          if (this.parkingUse.communityCode === element.code) {
              console.log(element)
          this.parkingList = element.parkingSpaceVoList
          console.log(this.parkingList)
        }
        });
      },
      getList(current=1){
          this.current = current
          parkingUse.pageList(this.current,this.size,this.QueryCondition)
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

        removeDataBycode(id){
           this.$confirm('此操作将永久删除车辆记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
                parkingUse.deleteParkingSpaceUse(id)
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
        openUpdateBtn(id){
             // 根据code获取building
            parkingUse.getById(id)
                .then(response =>{//删除成功
                //提示信息
                this.parkingUse = response.data.item
                console.log(this.parkingUse)
            })
          this.updateBtn = true
        },

        update(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
                 //调用update的方法
          parkingUse.updateParkingSpaceUse(this.parkingUse)
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


