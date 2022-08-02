<template>
  <div class="Messages">
    <header class="clear">
  		<span>留言管理</span>
  	</header>
    <el-table class="content"
      :data="tableData"
      height="450"
      style="width: 100%"
      >
      <el-table-column 
        v-for="col in cols"
        :prop="col.prop" :label="col.label" width="150">
      </el-table-column>
      <el-table-column align="right" width="200">
        <!-- <template slot="header" slot-scope="scope">
          <el-button
            size="mini"
            @click="addComment(false)" icon ='el-icon-circle-plus-outline'></el-button>
        </template> -->
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            @click="handleEdit(scope, true)">Edit</el-button> -->
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      title="评论信息"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose">
      <el-form :model="editData">
        <el-form-item label="评价id" :label-width="formLabelWidth" >
          <el-input v-model="editData.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="editData.userUid" ></el-input>
        </el-form-item>
        <el-form-item label="评价详情" :label-width="formLabelWidth" v-if="!isEdit">
          <el-input v-model="editData.detail" ></el-input>
        </el-form-item>
        <el-form-item label="商品id" :label-width="formLabelWidth">
          <el-input v-model="editData.goodId" ></el-input>
        </el-form-item>
        <el-form-item label="用户评分" :label-width="formLabelWidth">
          <el-input v-model="editData.rate" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="editComment(editData)">确定</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
  import {getCommentList,editComment,deleteComment} from 'api/client';

  export default {
    name: 'EditComment',

    data() {
      return {
        tableData:[],
        cols: [
          {prop: 'id', label: '评价id'},
          {prop: 'userUid', label: '用户名称'},
          {prop: 'detail', label: '评价详情'},
          {prop: 'goodId', label: '商品id'},
          {prop: 'rate', label: '用户评分'},
        ],
        formLabelWidth: '100px',
			  isEdit: false,
			  drawer: false,
        editData: {
          id: '',
          userUid: '',
          detail: '',
          goodId: '',
          rate: ''
        }
      }
    },
    
    methods: {
      getCommentList(){
        const res = getCommentList({});
        res.then((msgs)=>{
          this.tableData = msgs;
        })
        .catch((e)=>{
          alert(e);
        })
      },
      handleEdit(editItem, isEdit) {
        this.drawer = true;
        this.editData = editItem.row;
        this.isEdit = isEdit;
      },
      handleDelete(commentId){
        const res = deleteComment(commentId);
        res
        .then(()=>{
          alert('删除成功');
          this.tableData.map((item,index)=>{
            if(item.id===commentId){
              this.tableData.splice(index,1);
            }
          })
        })
        .catch((e)=>{
          alert(e);
        })
      },
      addComment(isEdit){
        this.drawer = true;
        this.isEdit = isEdit;
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      editComment(data){
        const res = editComment(data);
        res
        .then((data)=>{
          this.drawer = false;
          if (this.isEdit) {
            alert('修改评论成功');
          }else{
            alert('添加评论成功');
            this.isEdit = false
            this.getCommentList();
          }
        })
        .catch((e)=>{
          alert(e);
        })
      },
    },
    mounted(){
  	  this.getCommentList();
    },
  }
</script>
<style scoped lang="less">
@import "../../assets/css/var.less";
.Messages{
	header{
		width: 100%;
		height: 40px;
		line-height: 40px;
		span{
			float: left;
		}
	}
	.content{
		width: 100%;
		background-color: white;
		position: relative;
		top: -3px;
		padding: 20px;
		.msgList{
			li{
				width: 100%;
				border: 1px solid @borderColor;
				padding: 10px;
				position: relative;
				margin-bottom: 5px;
				img{
					position: absolute;
					width: 48px;
					height: 48px;
					display: inline-block;
					margin-right: 20px;
					top: 50%;
					margin-top: -24px;
				}
				.info{
					display: inline-block;
					margin-left: 70px;
					max-width: 820px;
					font-size: 13px;
					.name{
						font-size: 15px;
					}
					.goods{
						color:@mainColor;
						font-size: 13px;
						margin-top: 10px;
					}
					p{
						margin-top: 10px;
						color:@fontDefaultColor;
					}
					.replyContent{
					}
				}
				.operate{
					display: inline-block;
					width: 150px;
					height: 60px;
					position: absolute;
					margin-top: -30px;
					top: 50%;
					right:10px;
					text-align: right;
					div{
						text-align: right;
						color:@fontDefaultColor;
						margin-bottom: 15px;
					}
					button{
						width: 50px;
						height: 25px;
						color:@secondColor;
						border: 1px solid @secondColor;
						background-color: white;
						border-radius: 5px;
					}
				}
			}
		}
	}
	.popupContent{
		width: 300px;
		padding: 8px;
		textarea{
			width: 100%;
			height: 100px;
			display: block;
			border: 1px solid @borderColor;
			padding: 3px;
		}
		button{
			display: block;
			width: 70px;
			height: 30px;
			margin:10px auto 5px;
			background-color:  #333333;
			color:white;
			border: none;
		}
	}
}
</style>