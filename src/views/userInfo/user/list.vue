<template>
<div class="app-container">

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="userInfoQuery.beginDate"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="userInfoQuery.endDate"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-form-item>
        <el-input v-model="userInfoQuery.name" placeholder="成员名称"/>
      </el-form-item>

       <el-form-item>
        <el-input v-model="userInfoQuery.identityId" placeholder="身份证"/>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

 <el-button type="primary" plain @click="addDataBtn = true" >新增成员</el-button>
    <el-button type="warning" :disabled = "isDelBatchMerchantBtn" plain @click="batchDelete()" >批量删除</el-button>

    <!-- 表格 -->
    <el-table
      ref="multipleTable"
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


      <el-table-column prop="communityCode" label="所属社区" width="80" />

      <el-table-column prop="houseCode" label="所属房产" />

      <el-table-column prop="name" label="名称" width="160"/>

      <el-table-column
        prop="image"
        header-align="center"
        align="center"
        label="图片">
         <template slot-scope="scope">
            <el-popover placement="top-start" title="" trigger="hover">
               <img style="width: 50px; height: 50px" :src="scope.row.image" alt="" slot="reference">
               <img style="width: 200px; height: 200px" :src="scope.row.image" alt="">
            </el-popover>
         </template>
      </el-table-column>

      
      <el-table-column prop="identityId" label="身份证" width="160"/>
      <el-table-column prop="phone" label="手机号码" width="160"/>
      <el-table-column prop="occupation" label="职业" width="160"/>
      <el-table-column prop="birth" label="出生日期" width="160"/>
      <el-table-column label="性别" width="80">
        <template slot-scope="scope">
          {{ scope.row.gender===1?'男':'女' }}
        </template>
      </el-table-column>
      <el-table-column prop="ownerType" label="成员类型" width="160"/>
      <el-table-column prop="remark" label="备注" width="160"/>
      <el-table-column prop="createTime" label="创建时间" width="160"/>

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">

          <!-- <router-link :to="'/user/edit/'+scope.row.id"> -->
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="openUpdateUserInfo(scope.row.id)" >修改</el-button>
          <!-- </router-link> -->

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
        <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="100px" class="demo-userInfo">
        <el-form-item label="所示小区" prop="communityCode">
          <el-select v-model="userInfo.communityCode" filterable placeholder="请选择所属社区">
            <el-option label="碧桂园" value="CM2020011400001"></el-option>
            <el-option label="豪园" value="CM2020011400001"></el-option>
          </el-select>
        </el-form-item>

         <el-form-item label="所属房产" prop="houseCode">
          <el-select v-model="userInfo.houseCode" filterable placeholder="请选择所属房产">
            <el-option label="区域一" value="CM2020011400001"></el-option>
            <el-option label="区域二" value="CM2020011400001"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="成员名称" prop="name">
          <el-input v-model="userInfo.name" placeholder="请输入成员名称"></el-input>
        </el-form-item>

        <el-form-item label=" 身 份 证" prop="identityId">
          <el-input v-model="userInfo.identityId" placeholder="请输入身份证"></el-input>
        </el-form-item>

        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="userInfo.phone" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        
        <el-form-item label="成员职业" prop="occupation">
          <el-input v-model="userInfo.occupation" placeholder="请输入联系方式"></el-input>
        </el-form-item>

        <el-form-item label="出生日期" required>
          <el-col :span="11">
            <el-form-item prop="birth">
              <el-date-picker type="date" placeholder="选择日期" v-model="userInfo.birth" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="成员照片" required>

            <el-popover placement="top-start" title="" trigger="hover"
             content="点击添加图片">
               <img style="width: 100px; height: 100px" :src="userInfo.image" alt="" slot="reference" @click="imagecropperShow2=true" >
            </el-popover>
        </el-form-item>

         <el-form-item label="成员性别" prop="gender">
          <el-radio-group v-model="userInfo.gender">
            <el-radio :label=1>男</el-radio>
            <el-radio :label=2>女</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="addUserInfoForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
        <el-form-item label="成员类型" prop="ownerType">
          <el-radio-group v-model="userInfo.ownerType">
            <el-radio :label=1>业主</el-radio>
            <el-radio :label=2>家庭成员</el-radio>
             <el-radio :label=3>租户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="userInfo.remark"></el-input>
        </el-form-item>
      </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="updateBtn = false">取 消</el-button>
      <el-button type="primary" @click="update('userInfo')">确 定</el-button>
      </span>
    </el-dialog>

     <!-- add的弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="addDataBtn"
      width="60%" >
      <span>
         <el-form :model="addUserInfoForm" :rules="rules" ref="addUserInfoForm" label-width="100px" class="demo-addUserInfoForm">
        <el-form-item label="所示小区" prop="communityCode">
          <el-select v-model="addUserInfoForm.communityCode" filterable placeholder="请选择所属社区">
            <el-option label="碧桂园" value="biguiy"></el-option>
            <el-option label="豪园" value="haoyuan"></el-option>
          </el-select>
        </el-form-item>

         <el-form-item label="所属房产" prop="houseCode">
          <el-select v-model="addUserInfoForm.houseCode" filterable placeholder="请选择所属房产">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="成员名称" prop="name">
          <el-input v-model="addUserInfoForm.name" placeholder="请输入成员名称"></el-input>
        </el-form-item>


        <el-form-item label=" 身 份 证" prop="identityId">
          <el-input v-model="addUserInfoForm.identityId" placeholder="请输入身份证"></el-input>
        </el-form-item>

        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="addUserInfoForm.phone" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        
        <el-form-item label="成员职业" prop="occupation">
          <el-input v-model="addUserInfoForm.occupation" placeholder="请输入联系方式"></el-input>
        </el-form-item>

        <el-form-item label="出生日期" required>
          <el-col :span="11">
            <el-form-item prop="birth">
              <el-date-picker type="date" placeholder="选择日期" v-model="addUserInfoForm.birth" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="成员照片" required>

            <el-popover placement="top-start" title="" trigger="hover"
             content="点击添加图片">
               <img style="width: 100px; height: 100px" :src="addUserInfoForm.image" alt="" slot="reference" @click="imagecropperShow=true" >
            </el-popover>
        </el-form-item>

        <el-form-item label="成员性别" prop="gender">
          <el-radio-group v-model="addUserInfoForm.gender">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="addUserInfoForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
        <el-form-item label="成员类型" prop="ownerType">
          <el-radio-group v-model="addUserInfoForm.ownerType">
            <el-radio label="1">业主</el-radio>
            <el-radio label="2">家庭成员</el-radio>
             <el-radio label="3">租户</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="addUserInfoForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('addUserInfoForm')">立即创建</el-button>
          <el-button @click="resetForm('addUserInfoForm')">重置</el-button>
          <el-button @click="addDataBtn = false">取 消</el-button>
        </el-form-item>
      </el-form>  
      </span>
    </el-dialog>

    <image-cropper
	    v-show="imagecropperShow"
	    :width="300"
	    :height="300"
	    :key="imagecropperKey"
	    :url="BASE_API+'/ossService/file/uploadUserPhoto'"
	    field="file"
	    @close="close"
	    @crop-upload-success="cropSuccess"/>

    <image-cropper
	    v-show="imagecropperShow2"
	    :width="300"
	    :height="300"
	    :key="imagecropperKey2"
	    :url="BASE_API+'/ossService/file/uploadUserPhoto'"
	    field="file"
	    @close="close2"
	    @crop-upload-success="cropSuccess2"/>




   
</div>

</template>

<script>

import users from "@/api/userInfo/user.js"
import ImageCropper from '@/components/ImageCropper'

export default {
  components: { ImageCropper },
    data(){
        return{
          list:null,
          current:1,
          size:5,
          total:0,
          userInfoQuery:{},
          userInfo:{},
          ids:[],
          updateBtn:false,
          addDataBtn:false,
          isDelBatchMerchantBtn:true,
          BASE_API: process.env.BASE_API, // 接口API地址
          imagecropperShow: false, // 是否显示上传组件
          imagecropperKey: 0, // 上传组件id

          imagecropperShow2:false,
          imagecropperKey2:100,

          addUserInfoForm: {
          name: '',
          //    name: '',
          communityCode: '',
           houseCode: '',
           identityId: '',
           birth: '',
           phone:'',
           occupation:'',
           gender:'',
           ownerType:'',
           image:'https://xwe666.oss-cn-guangzhou.aliyuncs.com/user/userPhoto/2022/01/25/aabc52caae15423080ca3810e94ad97501.jpg',
           remark: ''
        },
          rules: {
            name: [
              { required: true, message: '请输入活动名称', trigger: 'blur' },
              { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            identityId: [
              { required: true, message: '请输身份证', trigger: 'blur' },
              { min: 18, max: 18, message: '长度在18字符', trigger: 'blur' }
            ],
            image: [
              { required: true, message: '请输入手机号码', trigger: 'blur' },
              { min: 11, max: 11, message: '长度在11个字符', trigger: 'blur' }
            ],
            occupation: [
              { required: true, message: '请输入职业', trigger: 'blur' }

            ],
            communityCode: [
              { required: true, message: '请选择所属社区', trigger: 'change' }
            ],
            houseCode: [
              { required: true, message: '请选择所属房产', trigger: 'change' }
            ],
            birth: [
              { required: true, message: '请选择日期', trigger: 'change' }
            ],
            ownerType: [
              { required: true, message: '请选择成员类型', trigger: 'change' }
            ],
             gender: [
              { required: true, message: '请选择性别', trigger: 'change' }
            ],
            remark: [
              { required: false, message: '请填写备注', trigger: 'blur' }
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
          users.getUserInfoList(this.current,this.size,this.userInfoQuery)
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
            this.userInfoQuery={}
            //查询所有
            this.getList()
        },

        //删除讲师
        removeDataById(id){
           this.$confirm('此操作将永久删除讲师记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
                users.deleteUserInfo(id)
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
        // 提交表单
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              console.log(this.addUserInfoForm.ownerType)
      
                users.addUserInfo(this.addUserInfoForm)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '新增成功!'
                    });
                    //回到列表页面
                    this.getList()
                })
              alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },

        openUpdateUserInfo(id){
          this.userInfo = {}
          // 根据ID获取UserInfo
            users.getUserInfoById(id)
                .then(response =>{//删除成功
                //提示信息
                this.userInfo = response.data.item
                console.log(this.userInfo)
            })
          this.updateBtn = true
        },

        update(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              console.log(this.addUserInfoForm.ownerType)
                
          users.updateUserInfo(this.userInfo)
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

          this.addUserInfoForm.image = data.url
      

          // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
          this.imagecropperKey = this.imagecropperKey + 1
           },
            close() {
          this.imagecropperShow = false
          // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
          this.imagecropperKey = this.imagecropperKey + 1
        },

           // 上传成功后的回调函数
          cropSuccess2(data) {
          console.log(data)
          this.imagecropperShow2 = false

          this.userInfo.image = data.url

          // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
          this.imagecropperKey2 = this.imagecropperKey2 + 1
           },
          // 关闭上传组件
          close2() {
          this.imagecropperShow2 = false
          // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
          this.imagecropperKey2 = this.imagecropperKey2 + 1
        }
    
    }
}
</script>