<template>
	<vxe-modal v-model="visible" :title="title" width="600" @hide="onDialogHide">
	 <template #default>
			  <vxe-form ref="xForm" :data="formData" :rules="formRules" title-align="right" title-width="100" @submit="onFormSubmit">
				  <vxe-form-item title="父节点" field="parentText" span="24"  :item-render="{}">
					  
					  <vxe-pulldown ref="parentDropdown" transfer>
						  <template #default>
								<vxe-input v-model="formData.parentText" readonly suffix-icon="vxe-icon--search" placeholder="" @click="clickParentField" @suffix-click="clickParentField"></vxe-input>
						  </template>
							<template #dropdown>
								<vxe-table
								  border
								  resizable
								  show-overflow
								  ref="xTree"
								  height="350"
								  :show-header="true"
								  :tree-config="{children: 'children', line: true, expandRowKeys: ['0'], reserve: true,iconOpen: 'el-icon-caret-bottom', iconClose: 'el-icon-caret-right'}"
								  :radio-config="{labelField: 'name', trigger: 'row', highlight: true}"
								  @radio-change = "onSelectionChange"
								  row-id="id"
								  size="mini"
								  :data="treeData">
								  <vxe-table-column type="radio" tree-node title="父节点"></vxe-table-column>
								</vxe-table>
							</template>
					  </vxe-pulldown>
				  </vxe-form-item>
				  
				  <vxe-form-item title="类型" field="resourceType" span="12">
					  <template #default="scope">
							<vxe-radio name="resourceType" v-model="formData.resourceType" label="1" content="菜单"></vxe-radio>
							<vxe-radio name="resourceType" v-model="formData.resourceType" label="2" content="按钮"></vxe-radio>
					  </template>
				  </vxe-form-item>
				  
				  <vxe-form-item title="状态" field="status" span="12">
					  <template #default="scope">
							<vxe-radio name="status" v-model="formData.status" label="0" content="启用"></vxe-radio>
							<vxe-radio name="status" v-model="formData.status" label="1" content="禁用"></vxe-radio>
					  </template>
				  </vxe-form-item>

				  <vxe-form-item title="名称" field="name" span="24">
					  <template #default="scope">
							<vxe-input v-model.trim="formData.name" placeholder="" @change="$refs.xForm.updateStatus(scope)"></vxe-input>
					  </template>
				  </vxe-form-item>

				   <vxe-form-item title="排序" field="weight" span="24">
					  <template #default="scope">
							<vxe-input v-model="formData.weight" placeholder="" type="integer" @change="$refs.xForm.updateStatus(scope)"></vxe-input>
					  </template>
				  </vxe-form-item>

				    <vxe-form-item title="地址/路由" field="url" span="24">
					  <template #default="scope">
							<vxe-input v-model.trim="formData.url" placeholder="" @change="$refs.xForm.updateStatus(scope)"></vxe-input>
					  </template>
				  </vxe-form-item>

				  
				  <vxe-form-item align="center" span="24">
					<template #default>
					  <vxe-button status="primary" type="submit">提交</vxe-button>
					  <vxe-button @click="visible = false">取消</vxe-button>
					</template>
				  </vxe-form-item>
				</vxe-form>
	 </template>
	</vxe-modal>
</template>

<script>
	// import * as notify from '@/utils/notify'
	import menu from "@/api/community/system/resource.js"
	export default {
		data(){
			var validateId = (rule, value, callback) => {

				let pattern = new RegExp(/^\d+$|^\d+[.]?\d+$/)
				if(!pattern.test(this.formData.id)){
					return new Error("2")
				}
				let params = {id: this.formData.id};
        		idIsExist(params).then(result => {
					this.idExist = result.data.obj;
					if(result.data.obj){
					return new Error("123")
				}
				}, error => {
					console.log(error);
				});
				if(this.idExist){
					return new Error("2")
				}
      		};
			return {
				visible : false,
				treeData : [],
				formData : {
					name : '',
					url : '',
					parentId : '0',
					parentText : '/',
					resourceType : '1',
					weight: 0,
					status : '1',
					id:''
				},
				formRules: {

					name : [{
						required: true,
						message:"请输入名称"
					},{
						max : 30,
						message:"2"
					}],

					weight : [{
						required: true,
						message: "请输入顺序"
					},{
						type: 'number',
						min : 0,
						max : 999999,
						message : "范围在0-999999"
					}]
					
				}
			}
		},
		methods : {
			show (currentNode) {
				this.visible = true;
				if(currentNode&&currentNode.id != 0){
					// this.formData.nodePath = currentNode.nodePath + '/' + currentNode.id			
				this.formData.parentId= currentNode.id
				this.formData.parentText = currentNode.name
				}
			},
			onFormSubmit() {
				const thiz = this;
				thiz.visible = false;
				let params = this.formData;
				menu.add(params).then(response =>{
					 //提示信息
              		if(response.code==20000){
              		    this.$message({
              		    type: 'success',
              		    message: '新增成功!'
              		});
              		thiz.$emit('createSuccess')
            		}else{
               		this.$message({
                  		type: 'error',
                  		message: '新增失败!'
               		 });
            		}
				})
				//thiz.$emit('createSuccess')
			},	
			query() {
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
			onDialogHide(){			
				for(const f in this.formData) {							
					this.formData[f] = ''
				}	
				
				this.formData.parentId= '0'
				this.formData.parentText = '/'
				this.formData.resourceType = '1'
				this.formData.weight=0
				this.formData.status ='1'

				
				this.$refs.xForm.clearValidate();
			},
			onSelectionChange({
				row
			}) {
				this.formData.nodePath = row.nodePath + '/' + row.id
				this.formData.parentId= row.id
				this.formData.parentText = row.name
				this.$refs.parentDropdown.hidePanel()
				this.$refs.xForm.clearValidate('parentText')
			},
			clickParentField(){
				this.$refs.parentDropdown.togglePanel()
				this.query()
			}
		},
		computed:{
			title(){
				return "新增"
			}
		},
		watch : {
			'$i18n.locale'() {
				
			 }
		}
	}
</script>

<style>
</style>
