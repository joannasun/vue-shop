<template>
  <div class="GoodsDetail">
    <div class="content">
      <div class="goodsInfo">
        <img class="infoLeft" :src="require(`assets/img/${goodsImg}.jpg`)" alt="商品图片" />
        <div class="infoRight">
          <div class="infoBox">
            <h3 class="name">{{goodName}}</h3>
          </div>
          <div class="infoBox">
            <p>{{goodsDesc}}</p>
          </div>
          <div class="infoBox">
            <h3 class="price">{{'¥'+goodsPrice}}</h3>
          </div>
          <div class="infoBox">
            <span>数量：</span>
            <NumberInput v-model="num" :min="1" :max="100"/>
          </div>
          <button class="buyBtn" @click="dialogBottleVisible = true">立即购买</button>
          <button @click="addToCart">加入购物车</button>
        </div>
      </div>
      <section class="msgBox leftContainer">
        <ul class="tagList">
          <li :class="{selected:curIndex===index}" v-for="(item,index) in tagList" :key="'tag'+index" @click="changeIndex(index)">
            {{item}}
          </li>
        </ul>
        <div class="commentBody" v-if="curIndex===0">
          <div v-if="commentList.length>0">
            <div class="rateBox">
              <span>好评率</span>
              <span class="rate">{{rate+'%'}}</span>
            </div>
            <ul class="commentList">
              <li v-for="(item,index) in commentList" :key="'comment'+index">
                <div class="userInfo">
                  <el-avatar icon="el-icon-user-solid">{{item.userUid}}</el-avatar>
                </div>
                <div class="commentInfo">
                  <p class="comment">{{item.detail}}</p>
                  <el-rate
                    v-model="item.rate"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="">
                  </el-rate>
                </div>
              </li>
            </ul>
          </div>
          <div class="noComment" v-else>暂时还没有评论~</div>
        </div>
        <div class="msgBody" v-else>
          <div class="inputBox">
            <el-descriptions v-if="clientName" title="价格曲线图"></el-descriptions>
            <div v-else class="banAsk">请先登录</div>
          </div>
          <GoodPriceChart :goodPrices ="goodPricesList"></GoodPriceChart>
          <el-descriptions title="商品详情">
            <el-descriptions-item label="商品名称:">{{goodName}}</el-descriptions-item>
            <el-descriptions-item label="商品描述:"> {{goodsDesc}}</el-descriptions-item>
            <el-descriptions-item label="商品品类">{{typeId}}</el-descriptions-item>
            <el-descriptions-item label="商品价格">{{'¥'+goodsPrice}}</el-descriptions-item>
            <el-descriptions-item label="过敏源:">{{allergyInformation}}</el-descriptions-item>
            <el-descriptions-item label="能量:">{{energy}}</el-descriptions-item>
            <el-descriptions-item label="营养物质：">{{nutrientContent}}</el-descriptions-item>
          </el-descriptions>
        </div>
      </section>
    </div>
    <el-dialog title="您有要回收的瓶子吗?" :visible.sync="dialogBottleVisible">
      <el-form :model="bottleGoodForm">
        <el-form-item label="瓶子数量" :label-width="formLabelWidth">
          <el-input v-model="bottleGoodForm.count" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="buyGood(bottleGoodForm, false)" >No</el-button>
        <el-button type="primary" @click="buyGood(bottleGoodForm, true)">Yes</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {getCartOrders, getGoodsInfo,getGoodPriceList,addOrder,getComment,getGoodsList, settleAccounts} from 'api/client';
import NumberInput from 'components/NumberInput';
import Radio from 'components/Radio';
import GoodsItem from 'components/GoodsItem';
import GoodPriceChart from 'components/GoodPriceChart';

export default {
  name: 'GoodsDetail',
  components:{
    NumberInput,
    Radio,
    GoodsItem,
    GoodPriceChart,
    
  },
  computed:{
    ...mapState([
      'clientName'
    ]),
    id(){
      return this.$route.params.id;
    },
  },
  data () {
    return {
      dialogBottleVisible: false,
      bottleGoodForm: {
        count: 0,
      },
      formLabelWidth: '120px',
      allergyInformation:'',
      energy:null,
      nutrientContent:'',
      goodsImg:'',
      goodName:'',
      goodsDesc:'',
      goodsPrice:'',
      goodId: '',
      specs:[],
      typeId:'',
      temSpecId:0,
      num:1,
      askContent:'',
      tagList:['商品评价','商品详情'],
      curIndex:0,
      rate:'',
      commentList:[],
      goodsList:[],
      goodPricesList: [],
    }
  },

  methods:{
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    changeIndex(i){
      this.curIndex = i;
    },
    getGoodPriceList(goodId){
      const res = getGoodPriceList(goodId);
      res.then((data)=>{
        this.goodPricesList = data;
      })
      .catch((e)=>{
        alert(e);
      })
    },
    getGoodsInfo(id){
      const res = getGoodsInfo(id);
      res
      .then((data)=>{
        this.goodsImg = data.picture;
        this.goodName = data.goodName;
        this.goodsPrice = data.price;
        this.goodsDesc = data.goodDescription;
        this.goodId = data.goodId;
        this.typeId = data.goodType;
        this.allergyInformation = data.allergyInformation;
        this.energy = data.energy;
        this.nutrientContent= data.nutrientContent;

        this.getTypeGoodsList(data.goodType);
        this.getGoodPriceList(this.goodId);

      })
      .catch((e)=>{
        alert(e);
      })
    },

    postAsk(){
      if(this.askContent.trim().length<=0){
        return;
      }
      // const res = askGoodsMsg({
      //   msg:this.askContent,
      //   goodsId:this.id,
      // });
      // res
      // .then(()=>{
      //   let time = new Date();
      //   this.msgList.unshift({
      //     id:'new',
      //     content:this.askContent,
      //     state:0,
      //     asker:this.clientName,
      //     time:time.getMonth()+1+'-'+time.getDate(),
      //     reply:{}
      //   });
      //   this.askContent = '';
      // })
      // .catch((e)=>{
      //   alert(e);
      // })
    },

    addToCart(){
      if(!this.clientName){
        alert('请先登录！');
        return;
      }
      const res = addOrder({
        goodId:this.goodId,
        goodName:this.goodName,
        goodQuantity:this.num,
        price:this.goodsPrice,
        userUid:this.clientName
      });
      res
      .then(()=>{
        alert('加入购物车成功！请前往 个人中心->购物车 结算')
      })
      .catch((e)=>{
        alert(e);
      })
    },
    buyGood(bottleGoodForm, isRecyled){
      this.dialogBottleVisible = false;
      if(!this.clientName){
        alert('请先登录！');
        return;
      }
      if(!isRecyled) {bottleGoodForm.count = 0;}
      const addRes = addOrder({
        goodId:this.goodId,
        goodName:this.goodName,
        goodQuantity:this.num,
        price:this.goodsPrice,
        userUid:this.clientName
      });
      addRes
      .then(()=>{
        const getRes = getCartOrders({userUid: this.clientName});
        getRes
          .then((data)=>{
            this.orderList=data;
            let cartIdList = [];
            this.orderList.map((item,index)=>{
              cartIdList.push(item.cartId);
            });
            let cartList = {
              cartIds: cartIdList,
              userUid: this.clientName,
              number: bottleGoodForm.count
            }
            const res = settleAccounts(cartList);
            res
            .then(()=>{
              alert('下单成功！');
              this.orderList = [];
            })
            .catch((e)=>{
              alert(e);
            })
          })
      })
      .catch((e)=>{
        alert(e);
        return;
      })
      
      
      
    },
    getComment(goodId){
      const res = getComment({goodId});
      res
      .then((data)=>{
        if(Object.keys(data).length<=0){
          this.rate = '';
          this.commentList = [];
          return;
        }
        this.commentList = data;
        let totalRate = 1;
        for (let i =0; i < data.length; i++){
          totalRate += data[i].rate;
        }
        this.rate = (totalRate/(data.length/5)).toFixed(2);
      })
      .catch((e)=>{
        alert(e);
      })
    },

    getTypeGoodsList(typeId){
      const res = getGoodsList({goodType: typeId});
      res.then((data)=>{
        this.goodsList = data;
      })
      .catch((e)=>{
        alert(e);
      })
    },
    
  },
  mounted(){
    this.getGoodsInfo(this.id); 
    this.getComment(this.id);
  },

  watch:{
    $route(to,from){
      this.getGoodsInfo(to.params.id);
      this.getComment(to.params.id);
    }
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.GoodsDetail{
  .content{
    width: 100%;
    padding-top: 20px;
    .goodsInfo{
      width: 100%;
      overflow: hidden;
      .infoLeft{
        display: inline-block;
        width: 400px;
        height: 400px;
        float: left;
      }
      .infoRight{
        display: inline-block;
        float: right;
        width: 700px;
        .infoBox{
          margin-bottom: 30px;
          .name{
            font-size: 20px;
          }
          p{
            color:@fontDefaultColor;
            font-size: 15px;
          }
          .price{
            font-size: 35px;
            color:@falseColor;
          }
          span{
            color:@fontDefaultColor;
            font-size: 13px;
            display: inline-block;
            width: 50px;
          }
          .tips{
            width: auto;
            margin: 0 20px 0 5px;
          }
          .NumberInput{
            display: inline-block;
            vertical-align: middle;
          }
        }
        button{
          background-color: #b4a078;
          width: 170px;
          height: 50px;
          color:white;
          border: none;
          font-size: 19px;
          margin-right: 20px;
          margin-top: 10px;
          &:hover{
            opacity:0.8;
          }
        }
        .buyBtn{
          border: 1px solid #b4a078;
          color:#b4a078;
          background-color: #f5f3ef;
        }
      }
    }
    .msgBox{
      margin: 50px 0;
      border: 1px solid @borderColor;
      padding-top: 0;
      .tagList{
        width: 100%;
        height: 40px;
        border-bottom: 1px solid @borderColor;
        background-color: #f5f5f5;
        li{
          width: 170px;
          height: 42px;
          position: relative;
          top: -2px;
          display: inline-block;
          text-align: center;
          line-height: 40px;
          font-size: 13px;
          cursor: pointer;
          &:hover{
            color:@thirdColor;
          }
        }
        .selected{
          background-color: white;
          border-top: 4px solid @thirdColor;
        }
      }
      .commentBody{
        padding: 20px;
        min-height: 300px;
        .rateBox{
          margin-bottom: 10px;
          span{
            color:@fontDefaultColor;
            display: inline-block;
            margin-right: 10px;
          }
          .rate{
            color:@falseColor;
            font-weight: 600;
            font-size: 30px;
          }
        }
        .commentList{
          width: 100%;
          li{
            width: 100%;
            display: block;
            margin: 0 auto;
            border-bottom:1px solid @borderColor;
            padding: 20px 0;
            .userInfo{
              width: 80px;
              display: inline-block;
              text-align: center;
              img{
                margin: auto;
                display: block;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-bottom: 6px;
              }
              span{
                font-size: 13px;
                color:@fontDefaultColor;
              }
            }
            .commentInfo{
              display: inline-block;
              vertical-align: top;
              .starList{
                i{
                  color:#f9bd4f;
                }
              }
              .specName,.time{
                color:@fontDefaultColor;
                font-size: 13px;
                margin-top: 10px;
              }
              .comment{
                margin-top: 10px;
              }
            }
          }
        }
        .noComment{
          width: 100%;
          text-align: center;
          color:@thirdColor;
          padding-top: 30px;
        }
      }
      .msgBody{
        padding: 20px;
        min-height: 300px;
        .inputBox{
          margin-top: 20px;
          textarea{
            width: 88%;
            height: 50px;
            padding: 5px;
            border:2px solid @borderColor;
            display: inline-block;
            overflow: hidden;
          }
          .titlePrice{
            float: left;
            width: 10%;
            height: 50px;
            position: relative;
            display: inline-block;
            overflow: hidden;
            background-color: white;
            border: 2px solid @fontShallowColor;
            color:@fontDefaultColor;
            line-height: 50px;
          }
          .banAsk{
            background-color: @fontShallowColor;
            text-align: center;
            font-size: 12px;
            line-height: 50px;
            color:white;
            user-select:none;
          }
        }
        .msgList{
          margin-top: 20px;
          li{
            border-bottom: 1px solid @borderColor;
            padding: 10px 0;
            .ask,.answer{
              margin: 8px 0;
              width: 100%;
              .note{
                display: inline-block;
                color:white;
                text-align: center;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                font-size: 10px;
                line-height: 20px;
              }
              .text{
                font-size: 14px;
              }
              .tipsInfo{
                float: right;
                font-size: 14px;
                color:@fontDefaultColor;
              }
            }
            .ask{
              .note{
                background-color: @falseColor;
              }
            }
            .answer{
              .note{
                background-color: @mainColor;
              }
            }
          }
        }
      }
    }
    .typeGoods{
      margin: 50px 0;
      border: 1px solid @borderColor;
      padding-top: 0;
      .title{
        text-align: center;
        width: 100%;
        height: 40px;
        line-height: 40px;
        background-color: #f5f5f5;
        font-weight: 600;
        border-bottom: 1px solid @borderColor;
      }
      .list{
        .GoodsItem{
          display:block;
          border-bottom:1px dotted @borderColor;
          margin: 0 auto;
        }
      }
    }
  }
  .ban{
    user-select: none;
    cursor:not-allowed;
  }
}
</style>