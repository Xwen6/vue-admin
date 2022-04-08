<template>
<div class="app-container">
    <div>
            <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
            <el-select v-model="roleId" @change="getList(roleId)" filterable placeholder="请选择角色">
                <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
      <el-button type="primary" icon="el-icon-check" @click="save()">保存</el-button>
      <!-- <el-button type="default" @click="resetData()">清空</el-button> -->
    </el-form>
    </div>
	<div class="x-container-wrapper" style="padding-bottom: 4px;">
        <el-tree
            :data="treeData"
            show-checkbox
            ref="tree"
            node-key="id"
            :default-expanded-keys="[0]"
            :default-checked-keys=resourceIds
            :props="defaultProps">
        </el-tree>
    </div>
</div>

</template>

<script>


//import device from "@/api/community/device.js"
import menu from "@/api/community/system/resource.js"
import roleConfig from "@/api/community/system/role.js"
import roleResource from "@/api/community/system/roleResource.js"
export default {
    data(){
      return{
        treeData: [],
        roleId: 0,
        Params:{
            resourceId: [],
            roleId: 0
        },
        resourceIds: [],
        checkKey: [],
        roleList: [],
		currentNode: null,
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },

    created() {
       this.getList("");
       this.getRoleList();
    },

    methods:{
        save(){
            this.Params.resourceId = this.$refs.tree.getCheckedKeys();
            this.Params.roleId = this.roleId;
            roleResource.save(this.Params).then(response =>{
               if(response.code = 20000){
                    this.$message({
                    message: '保存成功',
                    type: 'success'
                });
               }else{
                    this.$message({
                    message: '保存失败，原因：'+response.message,
                    type: 'success'
                    });
               }
            })
        },
        getRoleList(){
            roleConfig.getList().then(response =>{
                this.roleList = response.data.items;
                this.roleId = this.roleList[0].id
                this.getResourceIds(this.roleId)
            })
        },

		// onRefreshBtnClick(){
		// 	this.getList();
		// },

        getResourceIds(id){
            roleResource.getIds(id).then(response =>{
                const data = response.data.items;
                if(data.length>0){
                    this.resourceIds = data
                }
                else {
                    this.resourceIds = [];
                }
                //this.$forceUpdate();
            })
        },

     
    	getList(roleId){
    	    menu.list(" ").then(response =>{
			const data = response.data.items;
			this.treeData = data;
            if(roleId!=""){
                this.resourceIds = []
                this.$forceUpdate();
                this.getResourceIds(roleId);
            }
    	    })
    	    .catch(error =>{
    	        console.log(error);
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


