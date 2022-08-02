<template>
  <el-container class="MallIndex">
    <el-aside class="asideStyle">
      <ul ref="typeList" class="typeList">
        <li 
          v-for="(item,index) in typeList" 
          :key="'type'+item.goodType" 
           @click="selectType(item.goodType)"
        >
          {{item.goodType}} {{item.count}}
        </li>
      </ul>
    </el-aside>
    <el-main class="typeSection section">
      <ul class="content" v-loading="loading">
        <GoodsItem 
          v-for="(item,index) in goodsList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" 
          :style="{marginRight: (index+1)%4===0?'0px':'15px'}"
          :key="+item.goodId"
          :id="item.goodId"
          :img="item.picture"
          :name="item.goodName"
          :price="item.price"
          :salenumber = "item.salenumber"
        />
      </ul>
      <Pagination
        :goodsList="goodsList"
        :total="goodsList.length"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >
      </Pagination>
    </el-main>
  </el-container>
</template>

<script>
import {getTypes,getGoodsList} from 'api/client';
import SectionHeader from 'components/SectionHeader';
import ZoomImg from 'components/ZoomImg';
import GoodsItem from 'components/GoodsItem';
import Pagination from 'components/Pagination';
import {getClientSize,getScrollWidth} from 'util/util';

export default {
  name: 'ShopIndex',
  components:{
    SectionHeader,
    ZoomImg,
    GoodsItem,
    Pagination
  },
  computed:{
    clientWidth(){
      return getClientSize().width-getScrollWidth()+'px';
    },
    curPath(){
      return this.$route.path;
    }
  },
  data () {
    return {
      currentPage: 1,
      pageSize: 16,
      total: 100,
      loading: false,
      typeList:[],
      goodsList:[],
      initTimestamp:0,
      newTimestamp:0,
      timer:null,
      h:0,
      m:0,
      s:0,
    }
  },

  methods:{
    handleSizeChange(val) {
      this.loading = true;
      this.currentPage = 1;
      this.pageSize = val;
      this.loading = false;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      this.loading = true;
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.loading = false;
    },

    filterGoodsByType(typeid){
      return this.goodsList.filter((item)=>{
        return item.typeId===typeid;
      });
    },
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
    getGoodsList(data){
      
      const res = getGoodsList(data);
      res.then((data)=>{
        this.goodsList = data;
      })
      .catch((e)=>{
        alert(e);
      })
    },
    selectType(typeId){
     
      this.navTo('/shop/show/goodsList/'+typeId+'/all');
      // this.getGoodsList({goodType: typeId});
    },
    scrollHandle(){
      const top = this.$refs.typeList.getBoundingClientRect().top;
      //还未到顶
      if(top>0){
        this.navShouldFixed=false;
      }
      //已经到顶
      else{
        this.navShouldFixed=true;
      }
    }
  },

  mounted(){
    //获取数据
    const res = getTypes();
    res
    .then((data)=>{
      this.typeList = data;
      this.getGoodsList({});
    })
    .catch((e)=>{
      alert(e);
    });

    //记录打开网页再加四小时的时间
    this.initTimestamp = new Date().getTime()+(4*60*60*1000);
    this.timer = setInterval(()=>{
      this.newTimestamp = new Date().getTime();
      let diff = parseInt((this.initTimestamp-this.newTimestamp)/1000);
      diff = diff%(86400*365)%(86400*30)%86400;
      this.h = new String(Math.floor(diff/3600)).padStart(2,'0');
      diff = diff%3600;
      this.m = new String(Math.floor(diff/60)).padStart(2,'0');
      diff = diff%60;
      this.s = new String(diff).padStart(2,'0');
    },1000);
  },

  beforeDestroy(){
    clearInterval(this.timer);
    this.timer = null;
  },

}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.MallIndex{
  width: 100%;
  .asideStyle{
    width: 200px !important;
    border-radius: 20px;
  }
    
  .typeList{
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: #F2F6FC;
    li{
      display: inline-block;
      width: 70px;
      margin: 0 50px;
      text-align: center;
      height: 80px;
      line-height: 80px;
      font-weight: 600;
      font-size: 18px;
      cursor: pointer;
      color: #1e2e3c;
      &:hover{
      color: #FF5000;
      }
    } 
  }
  
  .section{
    overflow: hidden;
    border: 2px solid #eee;
    border-radius: 20px;
    margin-left: 10px;
    background-color: #F2F6FC;
  }
  .newGoods{
    margin-top: 440px;
  }
  .flashSale{
    .content{
      border: 1px solid @borderColor;
      height: 376px;
      position: relative;
      .left{
        vertical-align: top;
        display: inline-block;
        width: 20%;
        height: 100%;
        position: relative;
        background-image: url(//yanxuan.nosdn.127.net/c9aeb62a3f79123d793d8c49b6698b09.jpg);
        background-repeat: no-repeat;
        background-size: 100%;
        text-align: center;
        color: #615548;
        cursor: pointer;
        .title{
          font-size: 26px;
          font-weight: 500;
          margin-top: 60px;
        }
        hr{
          width: 20px;
          height: 2px;
          background-color: #615548;
          border: none;
          margin-top: 20px;
        }
        .tips{
          font-size: 18px;
          margin-top: 20px;
        }
        .countBox{
          margin-top: 20px;
          .time{
            width: 42px;
            height: 42px;
            line-height: 42px;
            font-size: 19px;
            display: inline-block;
            color: white;
            background-color: #615548;
          }
        }
        .allBtn{
          width:110px;
          height: 33px;
          line-height: 33px;
          font-size: 13px;
          background-color: #a7936e;
          color:white;
          border-radius: 20px;
          margin:50px auto;
        }
      }
      .right{
        vertical-align: top;
        display: inline-block;
        width: 80%;
        height: 100%;
        position: relative;
        overflow: hidden;
        li{
          display: inline-block;
          width: 50%;
          height: 50%;
          overflow: hidden;
          .leftImg{
            width: 180px;
            height: 100%;
            display: inline-block;
          }
          .rightBox{
            display: inline-block;
            width: 240px;
            height: 100%;
            overflow: hidden;
            .goodsName{
              font-size: 15px;
              cursor: pointer;
              margin-top: 16px;
              &:hover{
                color:@thirdColor;
              }
            }
            .less{
              margin-top: 16px;
              .lessBar{
                display: inline-block;
                width: 150px;
                height: 10px;
                background-color: #ffe5e5;
                border:1px solid #f2cecd;
                border-radius: 10px;
              }
              .lessNum{
                color:@fontDefaultColor;
                font-size: 13px;
              }
            }
            .price{
              margin-top: 16px;
              .nowPrice{
                color: @falseColor;
                font-size: 20px;
              }
              .beforePrice{
                color:@fontDefaultColor;
                text-decoration:line-through;
                margin-left: 10px;
                font-size: 14px;
              }
            }
            .buyBtn{
              margin-top: 16px;
              width: 120px;
              height: 30px;
              color:white;
              background-color: @falseColor;
              text-align: center;
              line-height: 30px;
              cursor: pointer;
            }
          }
          &:nth-of-type(1){
            border-bottom: 1px solid @borderColor;
            border-right: 1px solid @borderColor;
          }
          &:nth-of-type(2){
            border-bottom: 1px solid @borderColor;
          }
          &:nth-of-type(3){
            border-right: 1px solid @borderColor;
          }
        }
      }
    }
  }
  .maker{
    .content{
      .left,.center,.right{
        display: inline-block;
        height: 320px;
        width: 32%;
      }
      .left,.center{
        margin-right: 7px;
        .makerInfo{
          p{
            text-align: center;
          }
          hr{
            width: 60px;
          }
          .large{
            margin-top: 50px;
            margin-bottom: 10px;
            font-size: 26px;
          }
          .small{
            margin-top: 10px;
            font-size: 14px;
          }
        }
      }
      .right{
        .ZoomImg{
          width: 100%;
          height: 49%;
          .makerInfo{
            p{
              text-align: left;
              margin-left: 30px;
            }
            hr{
              width: 60px;
              position: relative;
              left: -122px;
            }
            .large{
              margin-top: 30px;
              margin-bottom: 10px;
              font-size: 20px;
            }
            .small{
              margin-top: 10px;
              font-size: 12px;
            }
          }
          &:first-child{
            margin-bottom:7px;
          }
        }
      }
    }
  }
  
}
</style>