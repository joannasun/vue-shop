<template>
  <div class="MallShow">
    <FixedNav v-show="navShouldFixed">
      <div slot="navContent" class="container fixedNavContainer">
        <h3 class="fixedLeft" @click="navTo('/shop/show/index')">FOODSHOP</h3>
        <div class="fixedRight">
          <div class="searchBox">
            <div class="TipsInput tipsEle">
              <input
                type="text"
                placehold="请输入商品关键字"
                v-model="inputValue"
                ref="input"
                @keyup="goSearch"
              />
              <ul class="tipsBox tipsEle" v-show="isShow">
                <li 
                  v-for="(item,index) in list" 
                  :key="index"
                  @click="navTo('/shop/goods/'+item.goodId)"
                  class="tipsEle" 
                >
                  {{item.goodName}}
                </li>
              </ul>
            </div>
            <i class="iconfont icon-search" @click="goSearch"/>
          </div>
        </div>
      </div>
    </FixedNav>
    <div class="logo" ref="searchBar">
      <el-row>
        <el-col :span="6"><img src="../../assets/img/logo.jpeg"/></el-col>
        <el-col :span="18">
          <div class="searchBox">
            <div class="TipsInput tipsEle">
              <input
                type="text"
                placehold="请输入商品关键字"
                v-model="inputValue"
                ref="input"
                @keyup="goSearch"
              />
              <ul class="tipsBox tipsEle" v-show="isShow">
                <li 
                  v-for="(item,index) in list" 
                  :key="index"
                  @click="navTo('/shop/goods/'+item.goodId)"
                  class="tipsEle" 
                >
                  {{item.goodName}}
                </li>
              </ul>
            </div>
            <i class="iconfont icon-search" @click="goSearch"/>
          </div>
        </el-col>
      </el-row>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import TipsInput from 'components/TipsInput';
import FixedNav from 'components/FixedNav';
import {getTypes, getGoodsList, addGoods} from 'api/client';

export default {
  name: 'ShopShow',
  components:{
    TipsInput,
    FixedNav,
  },
  computed:{
    curPath(){
      return this.$route.path;
    }
  },
  data () {
    return {
      searchText:'',
      tips:[],
      navShouldFixed:false,
      inputValue: "",
      isShow: false,
      statu: true,
      list: []
    }
  },

  methods:{
    navTo(route){
      this.$router.push(route);
    },
    judgeCurPath(typeId){
      if(typeId===-1){
        if(this.curPath.indexOf('/show/index')>-1){
          return true;
        }else{
          return false;
        }
      }else{
        if(this.curPath.indexOf(`/show/goodsList/${typeId}`)>-1){
          return true;
        }else{
          return false;
        }
      }
    },
    selectType(typeId){
      //首页
      if(typeId===-1){
        this.navTo('/shop/show/index');
      }else{
        this.navTo('/shop/show/goodsList/'+typeId+'/all');
      }
    },
    searchTip(tip){
      alert(tip)
    },
    searchTextChange(text){
    },
    searchGood(){
      alert(searchText);
    },
    searchConfirm(){
      if(this.searchText.trim().length<=0){
        alert('输入不能为空！');
        return;
      }
      this.navTo(`/shop/show/goodsList/0/${this.searchText}`);
    },
    scrollHandle(){
      const top = this.$refs.searchBar.getBoundingClientRect().top;
      //还未到顶
      if(top>0){
        this.navShouldFixed=false;
      }
      //已经到顶
      else{
        this.navShouldFixed=true;
      }
    },
    search () {
      this.list = [];
      this.inputValue = this.$refs.input.value;
      // 判断展示列表，如果输入了就展示没输入就不展示
      if (this.inputValue.length > 0) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }

      const res = getGoodsList({goodName: this.inputValue});
      res
      .then((data)=>{
        console.log(data);
        this.list = data;
      })
      .catch((e)=>{
        alert(e);
      })
      
    },
    goSearch () {
      // 保持this的指向始终指向vue实例
      const that = this;
      if (!that.statu) {
        return;
      }
      that.statu = false;
      setTimeout(function () {
        console.log(new Date());
        that.search(); // 调用写好的方法
        that.statu = true;
      }, 1000)
    }

  },

  mounted(){
    //监听滚动事件
    document.addEventListener('scroll',this.scrollHandle,false);
  },

  destroyed(){
    document.removeEventListener('scroll',this.scrollHandle,false);
  },
  watch:{
    searchText(newVal,oldVal){
      this.searchTextChange(newVal);
    }
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.MallShow{
  width: 100%;
  .logo{
    display: block;
    // margin: -10px auto 30px;
    text-align: right;
    user-select:none;
    vertical-align: middle;
    img{
      display: inline-block;
      height: 100px;
      vertical-align: middle;
    }
    .searchBox{
      border: 2px solid #ccc;
      border-radius: 30px;
      width: 70%;
      height: 50px;
      line-height: 50px;
      vertical-align: middle;
      margin-top: 25px;
      .TipsInput{
        margin-left: 30px;
        width: 90%;
      }
      .icon-search{
        font-size: 24px;
        font-weight: bold;
        color:@thirdColor;
        cursor: pointer;
        position: relative;
        top: 4px;
      }
    }
  }
  .typeList{
    width: 100%;
    text-align: center;
    background-color: white;
    li{
      display: inline-block;
      width: 60px;
      margin: 0 50px;
      text-align: center;
      height: 30px;
      line-height: 20px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
    }
    .selected{
      color:@thirdColor;
      border-bottom: 3px solid @thirdColor;
    }
  }
    .fixedNavContainer{
    text-align: left;
    .fixedLeft{
      display: inline-block;
      vertical-align: middle;
      width: 30%;
      height: 100%;
      font-size:30px;
      color:@thirdColor;
      user-select: none;
      line-height: 64px;
      text-align: center;
      cursor: pointer;
    }
    .fixedRight{
      width: 70%;
      height: 100%;
      display: inline-block;
      vertical-align: middle;
      li{
        display: inline-block;
        width: 60px;
        margin: 0 30px;
        text-align: center;
        height: 30px;
        line-height: 20px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        position: relative;
        top: 4px;
      }
      .selected{
        color:@thirdColor;
        border-bottom: 3px solid @thirdColor;
      }
      .searchBox{
        border: 2px solid #ccc;
        border-radius: 20px;
        width: 70%;
        .TipsInput{
          width: 95%;
          .tipsEle{
            border-radius: 20px;
          }
        }
      }
      
    }
  }
  .TipsInput{
    position: relative;
    width:254px;
    display: inline-block;
    input{
      border:none;
      border-bottom: 1px solid @thirdColor;
      padding-left: 4px;
      width:100%;
      height:24px;
      border-bottom: none;
    }
    .tipsBox{
      position: absolute;
      // top: 45px;
      left: 0;
      width:100%;
      border:1px solid @borderColor;
      border-top:none;
      li{
        text-align: left;
        width:100%;
        height:25px;
        line-height: 25px;
        padding:0 6px;
        font-size:14px;
        cursor: pointer;
        background-color: white;
        &:hover{
          background-color:#f8f5f0;
          color:@thirdColor;
        }
      }
    }
  }
}
</style>