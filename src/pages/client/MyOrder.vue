<template>
  <div class="MyOrder">
    <ul class="tagList">
      <li :class="{selected:curIndex===index}" v-for="(item,index) in tagList" :key="'tag'+index" >
        {{item}}
      </li>
    </ul>
    <div class="orderBox">
      <div class="orderTableHeader">
        <span>商品</span>
        <span>单价</span>
        <span>数量</span>
        <span>实付款</span>
        <span>交易操作</span>
      </div>
      <ul class="orderList">
        <li v-for="(item,index) in orderList" :key="'order'+item.id">
          <div class="orderHeader">
            <span class="orderTime">{{item.createtime}}</span>
            <span class="orderId">{{'订单号：'+item.orderId}}</span>
            <span class="deleteBtn" @click="deleteOrder(item.orderId)"><i class="iconfont icon-close" /></span>
          </div>
          <div class="orderDetail" v-for="(goodInfo, index) in item.ordersItemInfos" :key="goodInfo.goodId+'detail'">
            <img :src="require(`assets/img/${goodInfo.picture}.jpg`)" alt="商品图片" />
            <div class="goodsName">
              <p @click="navTo('/shop/goods/'+goodInfo.goodId)">{{goodInfo.goodName}}</p>
            </div>
            <span class="unitPrice">{{'￥'+goodInfo.price}}</span>
            <span class="num">{{goodInfo.goodQuantity}}</span>
            <span class="amount">{{'￥'+goodInfo.totalAmount}}</span>
            <button  v-if="goodInfo.tblGoodReviewsInfoList === null" @click="showDia(goodInfo.goodId, goodInfo.orderId)">评价</button>
            <span v-else class="hasComment">已评价</span>
          </div>
        </li>
      </ul>
    </div>
    <el-dialog
      title="商品评价"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
       <el-rate
        v-model="rate"
        :colors="colors">
      </el-rate>
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendComment">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {getOrders,deleteOrder,getComment, editComment} from 'api/client';
import Popup from 'components/Popup';

export default {
  name: 'MyOrder',
  components:{
    Popup
  },
  computed:{
    ...mapState([
      'clientName'
    ]),
  },
  data () {
    return {
      tagList:['全部订单'],
      rate: 5,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      curIndex:0,
      orderList:[],
      popupShow:false,
      textarea:'',
      dialogVisible: false,
      goodId: '',
      orderId: '',
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
    showDia(goodId, orderId){
      this.dialogVisible = true;
      this.goodId = goodId;
      this.orderId = orderId;
    },
    navTo(route){
      this.$router.push(route);
    },
    
    getOrders(){
      const res = getOrders({
        userUid: this.clientName
      });
      res
      .then((data)=>{
        this.orderList=data
       
      })
      .catch((e)=>{
        alert(e);
      })
    },
    deleteOrder(orderId){
      const res = deleteOrder(orderId);
      res
      .then(()=>{
        alert('删除订单成功！');
        this.orderList.map((item,index)=>{
          if(item.orderId===orderId){
            this.orderList.splice(index,1);
          }
        })
      })
      .catch((e)=>{
        alert(e);
      })
    },

    sendComment(){
      if(this.rate <=0 || this.textarea==''){
        alert('评分和评价不能为空！');
        return;
      }
      const res = editComment({
        userUid: this.clientName,
        detail: this.textarea,
        goodId: this.goodId,
        rate: this.rate,
        orderId: this.orderId
      });
      res
      .then((data)=>{
        alert('评价成功');
        this.dialogVisible = false;
        this.getOrders();
      })
      .catch((e)=>{
        alert(e);
      })
    },
  
  },

  mounted(){
    // this.getOrderByState(-1);
    this.getOrders();
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.MyOrder{
  .tagList{
    li{
      text-align: center;
      display: inline-block;
      font-weight: 550;
      font-size: 18px;
      border-bottom: 2px solid @borderColor;
      cursor: pointer;
      padding: 10px 20px;
      position: relative;
      &:after{
        top:12px;
        right: 0;
        position:absolute;
        content:'';
        width: 1px;
        height: 15px;
        background-color: @borderColor;
      }
      &:last-child{
        &:after{
          display:none;
        }
      }
    }
    .selected{
      color:@thirdColor;
      border-bottom: 2px solid @thirdColor;
    }
  }
  .orderBox{
    width: 100%;
    margin-top: 20px;
    .orderTableHeader{
      width: 100%;
      height: 40px;
      background-color: #f5f5f5;
      border: 1px solid @borderColor;
      color: @fontDefaultColor;
      font-size: 14px;
      line-height: 40px;
      span{
        display: inline-block;
        width: 14%;
        &:first-child{
          width:40%;
          text-align: center;
        }
      }
    }
    .orderList{
      width: 100%;
      li{
        border: 1px solid @borderColor;
        font-size: 13px;
        margin-top: 10px;
        .orderHeader{
          background-color: #f1f1f1;
          height: 40px;
          line-height: 40px;
          padding: 0 5px;
          .orderTime{
            font-weight: 600;
          }
          .orderId,.state{
            margin-left: 10px;
          }
          .deleteBtn{
            float: right;
            cursor: pointer;
            i{

            }
          }
        }
        .orderDetail{
          width: 100%;
          padding: 10px;
          position: relative;
          overflow: hidden;
          img{
            width: 84px;
            height: 84px;
            display: inline-block;
          }
          .goodsName{
            display: inline-block;
            margin-left: 5px;
            width: 230px;
            vertical-align: top;
            p{
              cursor: pointer;
              line-height: 20px;
              &:hover{
                text-decoration:underline;
              }
            }
            span{
              color:@fontDefaultColor;
              display: block;
              margin-top: 10px;
            }
          }
          .unitPrice,.num,.amount,.hasComment{
            display: inline-block;
            vertical-align: top;
            width: 15%;
            height: 85px;
            line-height: 85px;
            text-align: center;
          }
          button{
            position: absolute;
            right: 90px;
            bottom: 40px;
            width: 70px;
            height: 30px;
            border-radius: 3px;
            background-color: @thirdColor;
            color:white;
            border: none;
          }
        }
      }
    }
  }
  .popupContent{
    padding: 10px;
    .scoreBox{
      width: 100%;
      height: 50px;
      position: relative;
      line-height: 50px;
      text-align: left;
      .tips{
        font-size: 15px;
        vertical-align: middle;
        display: inline-block;
      }
      i{
        cursor: pointer;
        vertical-align: middle;
        display: inline-block;
        font-size: 25px;
        margin-right: 5px;
        -webkit-text-stroke: 1px #f9bd4f;
      }
    }
    textarea{
      width: 400px;
      height: 80px;
      padding: 5px;
      border:1px solid @borderColor;
      display: block;
      margin-top: 10px;
    }
    button{
      display: block;
      margin: 10px auto;
      width: 70px;
      height: 30px;
      border-radius: 3px;
      background-color: #313541;
      color:white;
      border: none;
    }
  }
}
</style>