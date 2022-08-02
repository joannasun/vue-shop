<template>
  <div class="ClientLogin" :style="{width:width+'px',height:height+'px'}">
    <div class="content">
      <h3>FOODSHOP</h3>
      <div class="tag">
        <span @click="setIndex(0)" :class="{selected:curIndex===0}">登录</span>
        <span @click="setIndex(1)" :class="{selected:curIndex===1}">注册</span>
      </div>
     
      <div class="formBox" v-show="curIndex===0">
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="80px">
          <el-form-item label="账号" prop="userUid">
            <el-input v-model="loginForm.userUid" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <!-- <el-form-item label="登录角色" prop="userRole">
            <el-select v-model="loginForm.userRole" clearable placeholder="请选择">
              <el-option
                v-for="item in ['用户','管理员']"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="formBox" v-show="curIndex===1">
        <el-form :model="regForm" :rules="regRules" ref="regForm"  label-width="80px">
          <el-form-item prop="userUid"  label="昵称">
            <el-input v-model="regForm.userUid" type="text" placeholder="请输入昵称" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
          <el-form-item prop="password"  label="密码">
            <el-input  v-model="regForm.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock" show-password></el-input>
          </el-form-item>
          <el-form-item prop="verifycode" label="验证码">
            <div style="display:flex">
              <el-input
              v-model="regForm.verifycode"
              placeholder="请输入验证码"
              @keyup.enter.native="login('regForm')"
              ></el-input>
              <span @click="refreshCode">
                <Identify :identifyCode="identifyCode"></Identify>
              </span>
            </div>
          </el-form-item>
          <el-form-item size="small">
            <el-button type="primary" @click="signup">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import {getClientSize} from 'util/util'
import Identify from 'pages/client//Identify'
import {login, signup} from 'api/client'

export default {
  name: 'ShopLogin',
  computed:{
    width(){
      return getClientSize().width;
    },
    height(){
      return getClientSize().height;
    },
  },
  components: { Identify },
  data () {
    const validateVerifycode = (rule, value, callback) => {
      const newVal = value.toLowerCase()
      const identifyStr = this.identifyCode.toLowerCase()
      if (newVal === '') {
        callback(new Error('请输入验证码'))
      } else if (newVal !== identifyStr) {
        console.log('validateVerifycode:', value)
        callback(new Error('验证码不正确!'))
      } else {
        callback()
      }
    }
    return {
      curIndex:0,
      identifyCodes: '3456789ABCDEFGHGKMNPQRSTUVWXY',
      identifyCode: '',
      regForm: {
        userUid: '',
        password: '',
        verifycode: ''
      },
      regRules: {
        verifycode: [
          { required: true, trigger: 'blur', validator: validateVerifycode }
        ],
        userUid: [
          { required: true, message: '请设置用户名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
        password: [
          {required: true, trigger: 'blur', message: '请输入密码'},
          {pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/, message: '包含数字字母两种元素且密码位数为6-18'}
        ]
      },
      loginForm: {
        userUid: '',
        password: '',
        // userRole: '用户'
      },
      loginRules: {
        userUid: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' },
        ],
        // userRole: [
        //   { required: true, trigger: 'change', message: '请选择登录身份' },

        // ]
      }
     
    }
  },
  mounted() {
    // 验证码初始化
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  methods:{
    ...mapMutations({
      setClientName: 'SET_CLIENT_NAME',
      setAdminName: 'SET_ADMIN_NAME',
      setRoleState: 'ROLE'
    }),
    setIndex(index){
      if(index===this.curIndex){
        return;
      }
      this.curIndex = index;
    },
    login(){
      const res = login({
        userUid:this.loginForm.userUid,
        password:this.loginForm.password,
      });
      res
      .then((data)=>{
        const loginRole = data.roles.indexOf('admin');
        if (loginRole > -1) {
          this.setAdminName(data.userUid);
          this.$router.replace('/backstage');
        } else {        
          this.setClientName(data.userUid);
          this.$router.push('/');
        }
      })
      .catch((e)=>{
        alert(e)
      })
    },
    signup(){
      const res = signup({
        userUid:this.regForm.userUid,
        password:this.regForm.password,
       
      });
      res
      .then((data)=>{
        alert('注册成功');
        this.curIndex = 0;
      })
      .catch((e)=>{
        alert(e)
      })
    },
    // 生成随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 切换验证码
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    // 生成四位随机验证码
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.ClientLogin{
  // background-color: @bgColor;
  position: relative;
  background: url('../../assets/img/bg.jpg') no-repeat;
    background-size: 100% 100%;
  .content{
    width: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -260px;
    margin-left: -150px;
    text-align: center;
    overflow: hidden;
    h3{
      color:@secondColor;
      font-size: 50px;
    }
    .tag{
      margin-top: 20px;
      color:@fontDefaultColor;
      margin-bottom: 20px;
      span{
        display: inline-block;
        width: 50px;
        text-align: center;
        margin: 0 10px;
        padding: 10px 0;
        cursor: pointer;
      }
      .selected{
        border-bottom: 2px solid @secondColor;
        color:@secondColor
      }
    }
    input{
      border-radius: 0;
      box-shadow: none;
      background: #fff;
      padding: 14px;
      width: 80%;
      border: 1px solid @borderColor;
      margin-bottom: 10px;
    }
    button{
      width: 90%;
      background: @secondColor;
      box-shadow: none;
      border: 0;
      border-radius: 3px;
      line-height: 41px;
      color: #fff;
      cursor: pointer;
      margin-top: 20px;
    }
  }
}
</style>
