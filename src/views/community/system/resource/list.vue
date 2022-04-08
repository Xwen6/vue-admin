<template>
<div class="app-container" >
	<!-- <div class="x-container-wrapper" style="padding-bottom: 4px;"> -->
	<vxe-toolbar ref="xToolbar">
	  <template #buttons>			
		<vxe-button content="新增" icon="vxe-icon--plus" @click="onAddBtnClick"></vxe-button>
		<vxe-button content="修改" icon="vxe-icon--edit-outline" @click="onEditBtnClick" :disabled="modifyBtnDisabled"></vxe-button>
		<vxe-button content="删除" icon="vxe-icon--error" :disabled="removeBtnDisabled" @click="onDeleteBtnClick"></vxe-button>
		<vxe-button content="刷新" icon="el-icon-refresh" @click="onRefreshBtnClick"></vxe-button>
	  </template>
	 </vxe-toolbar>
  	 <!-- 树形表格 -->
			 <vxe-table
			   border
			   resizable
			   show-overflow
			   ref="xTree"
			   :height="treeHeight"
			   :show-header="true"
			   :tree-config="{children: 'children', line: true, expandRowKeys: ['0'], reserve: true,iconOpen: 'el-icon-caret-bottom', iconClose: 'el-icon-caret-right'}"
			   :radio-config="{labelField: 'name', trigger: 'row', highlight: true}"
			   @radio-change = "onSelectionChange"
			   row-id="id"
			   size="mini"
			   :loading="loading"
			   :data="treeData">
			   <vxe-table-column type="radio" tree-node title="名称"></vxe-table-column>
			   <vxe-table-column field="resourceType" title="类型">
				   <template #default="{ row }">
					 <span>{{ typeFormater(row) }}</span>
				   </template>
			   </vxe-table-column>
			   <vxe-table-column field="status" title="状态" type="html">
				   <template #default="{ row }">
					   <span v-if="row.status==1" style="color:#F56C6C">禁用</span>
					   <span v-if="row.status==0" style="color:#67C23A">启用</span>
				   </template>
			   </vxe-table-column>
			   <vxe-table-column field="id" title="ID"></vxe-table-column>
			 </vxe-table>
			<AddDialog ref="addDialog" @createSuccess="createSuccess"></AddDialog>
			<EditDialog ref="editDialog" @updateSuccess="updateSuccess"></EditDialog>
<!-- </div> -->
</div>

</template>

<script>


//import device from "@/api/community/device.js"
import menu from "@/api/community/system/resource.js"
import ImageCropper from '@/components/ImageCropper'
import AddDialog from '@/views/community/system/resource/components/AddDialog.vue'
import EditDialog from '@/views/community/system/resource/components/EditDialog.vue'

export default {
    components : {
		AddDialog,
		EditDialog
	},
    data(){
      return{
        treeData:[],
        loading : false,
        modifyBtnDisabled : true,
		removeBtnDisabled : true,
		treeHeight : '100%',
		currentNode : null
      }
    },

    created() {
       this.getList();
    },

    methods:{

		createSuccess(){
			this.getList();
			this.$forceUpdate();
		},
		updateSuccess(){
			this.getList();
			this.$forceUpdate();
		},

		onAddBtnClick() {
			this.$refs.addDialog.show(this.currentNode);
		},
		onEditBtnClick() {
			this.$refs.editDialog.show(this.currentNode);
		},

		onDeleteBtnClick () {
			this.$confirm('此操作将永久删除角色记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
				//let params = {id: this.currentNode.id};
                menu.delete(this.currentNode.id)
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
                  		message: '新增失败!'
               		 });
            		}
                })
            }) //点击取消，执行catch方法
            // 刷新页面
            //this.getList()
		},

		onRefreshBtnClick(){
			this.getList();
		},
     
    	getList(){
			this.loading = true;
    	    menu.list(" ").then(response =>{
			this.modifyBtnDisabled = true;
			this.removeBtnDisabled = true;
    	    //this.treeData = response.data.items
			const data = response.data.items;
			this.treeData = data;
			//console.log(data[0].id)
			this.loading = false;
    	    })
    	    .catch(error =>{
    	        console.log(error);
				this.loading = false;
    	    })
    	},

    	//   query() {

			// 	this.modifyBtnDisabled = true;
			// 	this.removeBtnDisabled = true;
			// 	const params = " ";
			// 	 menu.list(params).then(result => {
			// 		const data = result.data.tiems;
			// 		this.treeData = result.data.tiems;
			// 		this.loading = false;
			// 	}, error => {
			// 		console.log(error);
			// 		this.loading = false;
			// 	});
			// },

    	typeFormater(row){
			if(row.resourceType ==1){
				return "菜单"
			}else if(row.resourceType ==2){ 
				return "接口";
			}
			return '';
		},

    	getNodeById(id){
			const node = this.$refs.xTree.getRowById(id)
			return node;
		},

    	onSelectionChange({row}) {
			this.modifyBtnDisabled = true;
			this.removeBtnDisabled = true;
			if( row && row.id !=0 ){
				const node = this.getNodeById(row.parentId);
				console.log(node)
				this.currentNode = {};
				for(const f in row){
					this.currentNode[f] = row[f];
				}
				this.currentNode['parentText'] = node.name;

				this.modifyBtnDisabled = false;
				if(!row.isParent){
					this.removeBtnDisabled = false;
				}
			}else {
				this.currentNode = row;
				//console.log(row)
			}
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


