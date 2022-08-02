<template>
  <div class="EditUser">
  	<header class="clear">
  		<span>商品批次管理</span>
		  <el-button slot="append" type="primary" size="small" icon ='el-icon-circle-plus-outline' @click="addUser(false)"></el-button>
  	</header>
	<table className="userTable">
		<thead>
			<tr><th>商品ID</th><th>商品数量</th><th>过期时间</th></tr>
		</thead>
		<tbody>
				<tr v-for="(item,index) in batchList" :key="'user'+item.id">
						<td>{{item.goodId}}</td>
						<td>{{item.number}}</td>
						<td>{{item.expiryDate | dateformat("YYYY-MM-DD HH:mm")}}</td>
						<td>
							<el-button type="primary" @click="openDrawer(item, true)" icon="el-icon-edit"></el-button>
							<el-button type="primary"  @click="deleteBatch(item.id)" icon="el-icon-delete"></el-button>
						</td>
						<td></td>
				</tr>
		</tbody>
  </table>
  <el-drawer
		title="批次管理"
		:visible.sync="drawer"
		direction="rtl"
		:before-close="handleClose">
		<el-form :model="editData">
      <el-form-item label="商品ID" :label-width="formLabelWidth" >
        <el-input v-model="editData.goodId" :disabled="true">{{this.$route.params.id}}</el-input>
      </el-form-item>
			<el-form-item label="商品数量" :label-width="formLabelWidth">
        <el-input v-model="editData.number" ></el-input>
      </el-form-item>
			<el-form-item label="过期时间" :label-width="formLabelWidth">
				<el-date-picker
					v-model="editData.expiryDate"
					type="datetime"
					placeholder="选择日期时间"
					:default-time="editData.expiryDate">
				</el-date-picker>
        <!-- <el-input v-model= "editData.expiryDate " >{{editData.expiryDate | dateformat('YYYY-MM-DD HH\:mm')}}</el-input> -->
      </el-form-item>
			<el-form-item>
				<el-button type="primary"  @click="editBatch(editData)">确定</el-button>
			</el-form-item>
    </el-form>
	</el-drawer>
    
  </div>
</template>

<script>
import {getAllBatches,deleteBatch, editBatch} from 'api/client';

export default {
  name: 'EditBatches',
  computed:{
  },
  data(){
  	return{
  		batchList:[],
			drawer: false,
			formLabelWidth: '100px',
			editData: {
				goodId: this.$route.params.id,
				number: '',
				expiryDate: ''
			},
			isEdit: false,
			inputVal:''
  	}
  },
  mounted(){
		this.getAllBatches();
    this.editData.goodId = this.$route.params.id;
  },
  methods:{
		getAllBatches(){
			const res = getAllBatches({goodId: this.editData.goodId});
			res
			.then((users)=>{
				this.batchList = users;
			})
			.catch((e)=>{
				alert(e)
			})	
		},
		
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {});
		},
		openDrawer(editItem, isEdit) {
			this.drawer = true;
      // editItem.expiryDate = editItem.expiryDate | dateformat('YYYY-MM-DD HH\:mm');
			this.editData = editItem;
			this.isEdit = isEdit;
		},
  	deleteBatch(id){
  		const res = deleteBatch(id);
  		res
  		.then(()=>{
  			alert('删除成功');
  			this.batchList.map((item,index)=>{
  				if(item.id===id){
  					this.batchList.splice(index,1);
  				}
  			})
  		})
  		.catch((e)=>{
  			alert(e);
  		})
  	},
  	
		editBatch(data){
			const res = editBatch(data);
			res
			.then((data)=>{
				this.drawer = false;
				if (this.isEdit) {
					alert('修改成功');
				}else{
					alert('添加成功');
					this.isEdit = false;
					this.getAllBatches();
				}
			})
			.catch((e)=>{
				alert(e);
			})
  	},
		addUser(isEdit){
			this.drawer = true;
			this.isEdit = isEdit;
		}
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.EditUser{
	header{
		width: 100%;
		height: 40px;
		line-height: 40px;
		span{
			float: left;
		}
		div{
			height: 20px;
			float: right;
      input{
        border: none;
        border-bottom: 1px solid #337da4;
        background-color: rgba(0,0,0,0);
        width: 180px;
        padding-left: 10px;
      }
			button{
        position: relative;
        top: -1px;
        border: none;
        background-color: rgba(0,0,0,0);
				i{
					font-size: 17px;
          color:#337da4;
				}
			}
		}
	}
}
</style>