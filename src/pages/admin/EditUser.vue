<template>
  <div class="EditUser">
  	<header class="clear">
  		<span>用户管理</span>
			<el-input ref="input" type="text" placeholder="请输入用户昵称" v-model="inputVal" class="input-with-select">
				<el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
				<el-button slot="append" type="primary" size="small" icon ='el-icon-error' @click="reGetAllUser" ></el-button>
				<el-button slot="append" type="primary" size="small" icon ='el-icon-circle-plus-outline' @click="addUser(false)"></el-button>
			</el-input>
  	</header>
	<table className="userTable">
		<thead>
			<tr><th>用户ID</th><th>账号</th><th>昵称</th><th>联系电话</th><th>收货地址</th><th>账户余额</th><th>家庭成员</th></tr>
		</thead>
		<tbody>
				<tr v-for="(item,index) in userList" :key="'user'+item.id">
						<td>{{item.userId}}</td>
						<td>{{item.userUid}}</td>
						<td>{{item.userName}}</td>
						<td>{{item.telephone}}</td>
						<td>{{item.address}}</td>
						<td>{{item.balance}}</td>
						<td>{{item.familymembers}}</td>
						<td>
							<el-button type="primary" @click="openDrawer(item, true)" icon="el-icon-edit"></el-button>
							<el-button type="primary"  @click="deleteUser(item.userUid)" icon="el-icon-delete"></el-button>
						</td>
						<td></td>
				</tr>
		</tbody>
  </table>
  <el-drawer
		title="用户信息"
		:visible.sync="drawer"
		direction="rtl"
		:before-close="handleClose">
		<el-form :model="editData">
      <el-form-item label="用户ID" :label-width="formLabelWidth" >
        <el-input v-model="editData.userId" :disabled="true"></el-input>
      </el-form-item>
			<el-form-item label="账号" :label-width="formLabelWidth">
        <el-input v-model="editData.userUid" :disabled="true"></el-input>
      </el-form-item>
			<el-form-item label="昵称" :label-width="formLabelWidth">
        <el-input v-model="editData.userName" ></el-input>
      </el-form-item>
			<el-form-item label="密码" :label-width="formLabelWidth" v-if="!isEdit">
        <el-input v-model="editData.password" ></el-input>
      </el-form-item>
			<el-form-item label="联系电话" :label-width="formLabelWidth">
        <el-input v-model="editData.telephone" ></el-input>
      </el-form-item>
			<el-form-item label="收货地址" :label-width="formLabelWidth">
        <el-input v-model="editData.address" ></el-input>
      </el-form-item>
			<el-form-item label="余额" :label-width="formLabelWidth">
        <el-input v-model="editData.balance" type="number" disabled></el-input>
      </el-form-item>
      <el-form-item label="家庭成员" :label-width="formLabelWidth">
        <el-input v-model="editData.familymembers" type="number"></el-input>
      </el-form-item>
			<el-form-item>
				<el-button type="primary"  @click="editUser(editData)">确定</el-button>
			</el-form-item>
    </el-form>
	</el-drawer>
    
  </div>
</template>

<script>
import {getAllUser,getSearchUser,deleteUser, editUser} from 'api/client';
export default {
  name: 'EditUser',
  computed:{
  },
  data(){
  	return{
  		userList:[],
			drawer: false,
			formLabelWidth: '100px',
			editData: {
				userUid: '',
				telephone: '',
				address: '',
				balance: '',
				familymembers: ''
			},
			isEdit: false,
			inputVal:''
  	}
  },
  mounted(){
		this.getAllUser();
  },
  methods:{
		getAllUser(){
			const res = getAllUser({});
			res
			.then((users)=>{
				this.userList = users;
			})
			.catch((e)=>{
				alert(e)
			})	
		},
		reGetAllUser(){
			this.inputVal = '';
			this.getAllUser();
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
			this.editData = editItem;
			this.isEdit = isEdit;
		},
  	deleteUser(id){
  		const res = deleteUser(id);
  		res
  		.then(()=>{
  			alert('删除成功');
  			this.userList.map((item,index)=>{
  				if(item.userUid===id){
  					this.userList.splice(index,1);
  				}
  			})
  		})
  		.catch((e)=>{
  			alert(e);
  		})
  	},
  	searchUser(){
  		const val = this.inputVal;
  		const res = getSearchUser(val);
  		res
  		.then((data)=>{
  			this.userList = [data];
  		})
  		.catch((e)=>{
  			alert(e);
  		})
  	},
		editUser(data){
			const res = editUser(data);
			res
			.then((data)=>{
				this.drawer = false;
				if (this.isEdit) {
					alert('修改成功');
				}else{
					alert('添加成功');
					this.isEdit = false;
					this.getAllUser();
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