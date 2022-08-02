<template>
  <div class="MyData">
    <el-form :model="userForm">
      <el-form-item label="账号" :label-width="formLabelWidth">
        <el-input v-model="userForm.userUid" disabled></el-input>
      </el-form-item>
      <el-form-item label="昵称" :label-width="formLabelWidth">
        <el-input v-model="userForm.userName" ></el-input>
      </el-form-item>
      <el-form-item label="余额" :label-width="formLabelWidth">
        <el-input v-model="userForm.balance" type="number" disabled></el-input>
      </el-form-item>
      <el-form-item label="联系电话" :label-width="formLabelWidth">
        <el-input v-model="userForm.telephone" type="number"></el-input>
      </el-form-item>
      <el-form-item label="家庭成员" :label-width="formLabelWidth">
        <el-input v-model="userForm.familymembers" type="number"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-button type="primary" @click="popupShow = true ">修改密码</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="updateUserData">保存</el-button>
    <el-dialog
      title="修改密码"
      :visible.sync="popupShow"
      width="30%"
      :before-close="handleClose">
       <el-form :model="pwdForm" :rules="pwdRules">
        <el-form-item label="原密码" :label-width="formLabelWidth">
          <el-input v-model="pwdForm.oldPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="pwdForm.newPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="请再次输入新密码" :label-width="formLabelWidth">
          <el-input v-model="pwdForm.confirmPwd" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePwd">确认修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex';
import {getSearchUser, editUser} from 'api/client';
import Popup from 'components/Popup';

export default {
  name: 'MyData',
  components:{
    Popup
  },
  computed:{
    ...mapState([
      'clientName'
    ]),
  },
  data () {
    const validateOldpwd = (rule, value, callback) => {
      if (value!==this.password) {
        callback(new Error('输入的密码不正确！'))
      } else {
        callback()
      }
    }
    const validateNewpwd = (rule, value, callback) => {
    if (value!==this.pwdForm.newPwd) {
      callback(new Error('两次输入的密码不一致！'))
    } else {
      callback()
    }
  }
    return {
      popupShow:false,
      formLabelWidth: '150px',
      userForm: {
        userUid: '',
        balance:'',
        address:'',
        telephone: '',
        userName: '',
        password: '',
        userId: '',
        familymembers: ''
      },
      pwdForm: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      pwdRules: {
        oldPwd: [{required: true, trigger: 'blur', message: '请输入原密码', validator: validateOldpwd}],
        newPwd: [
          {required: true, trigger: 'blur', message: '请输入新密码'},
          {pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/, message: '包含数字字母两种元素且密码位数为6-18'}
        ],
        confirmPwd:[
          {required: true, trigger: 'blur', message: '请再次输入密码', validator: validateNewpwd}
        ]
      }
    }
  },

  methods:{
    ...mapMutations({
      setClientName: 'SET_CLIENT_NAME',
    }),
    handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {});
		},
    updateUserData(){
      const res = editUser(this.userForm);
			res
			.then((data)=>{  
				alert('修改成功!');
        this.setClientName(this.userForm.userUid);
			})
			.catch((e)=>{
				alert(e);
			})
    },
    updatePwd(){
      const res = editUser({
        userId: this.userForm.userId,
        userUid:this.userForm.userUid,
        password:this.pwdForm.newPwd,
      });
      res.then(()=>{
        this.pwdForm.oldPwd = '';
        this.pwdForm.newPwd = '';
        this.pwdForm.confirmPwd = '';
        this.password = this.pwdForm.newPwd;
        this.popupShow = false;
        alert('修改密码成功!');
      })
      .catch((e)=>{
        alert(e);
      })
    }
  },

  mounted(){
    const res = getSearchUser(this.clientName);
    res
    .then((data)=>{
      this.userForm = {
        userId: data.userId,
        userUid: data.userUid,
        balance:data.balance,
        address:data.address,
        telephone:data.telephone,
        userName: data.userName,
        password: data.password
      }

    })
    .catch((e)=>{
      alert(e)
    })
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.MyData{
  ul{
    width: 100%;
    overflow: hidden;
    li{
      margin-bottom: 30px;
      &:first-child{
        height:60px;
        line-height: 60px;
        span{
          position: relative;
          bottom: 18px;
        }
      }
      span{
        display: inline-block;
        width: 100px;
        height: 20px;
      }
      img{
        display: inline-block;
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      p{
        display: inline-block;
      }
      input{
        width: 280px;
        border: none;
        text-align: center;
        border-bottom: 2px solid @thirdColor;
      }
      .long{
      }
      button{
        background-color: white;
        border: 1px solid @thirdColor;
        color:@thirdColor;
        width: 80px;
        height: 30px;
      }
    }
  }
  .saveBtn{
    background-color: @thirdColor;
    border: none;
    color: white;
    width: 110px;
    height: 35px;
    display: block;
    margin: 10px auto;
  }
  .popupContent{
    padding: 20px;
    input{
      display: block;
      border: none;
      border-bottom: 1px solid #313541;
      margin-bottom: 16px;
      font-size: 13px;
      padding: 5px;
      width: 200px;
    }
    button{
      background-color: #333333;
      border: none;
      color: white;
      width: 80px;
      height: 32px;
      display: block;
      margin: 20px auto 5px;
    }
  }
}
</style>