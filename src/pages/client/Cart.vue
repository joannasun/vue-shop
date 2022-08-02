<template>
  <div class="Cart">
    <div v-if="orderList.length>0">
      <div class="cartTableHeader">
        <span>商品信息</span>
        <span>单价</span>
        <span>数量</span>
        <span>小计</span>
        <span>交易操作</span>
      </div>
      <ul class="orderList">
        <li v-for="(item,index) in orderList" :key="'order'+item.id">
          <div class="orderDetail">
            <img :src="require(`assets/img/${item.picture}.jpg`)" alt="商品图片" />
            <div class="goodsName">
              <p @click="navTo('/shop/goods/'+item.goodId)">{{item.goodName}}</p>
            </div>
            <span class="unitPrice">{{'￥'+item.price}}</span>
            <span class="num">{{item.goodQuantity}}</span>
            <span class="amount">{{'￥'+item.totalAmount}}</span>
            <button @click="deleteOrder(item.cartId)">删除</button>
          </div>
        </li>
      </ul>
      <div class="cartFooter">
        <span>应付金额：</span>
        <span class="total">{{'￥'+totalAmount}}</span>
        <button @click="dialogBottleVisible = true">下单</button>
      </div>
    </div>
    <p class="emptyTips" v-else>购物车还是空滴~</p>
    <el-dialog title="您有要回收的瓶子吗?" :visible.sync="dialogBottleVisible">
      <el-form :model="bottleForm">
        <el-form-item label="瓶子数量" :label-width="formLabelWidth">
          <el-input v-model="bottleForm.count" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="settleAccounts(bottleForm, false)" >No</el-button>
        <el-button type="primary" @click="settleAccounts(bottleForm, true)">Yes</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {getCartOrders,deleteCartInfo ,settleAccounts} from 'api/client';
import NumberInput from 'components/NumberInput';

export default {
  name: 'Cart',
  components:{
    NumberInput
  },
  computed:{
    ...mapState([
      'clientName'
    ]),
    totalAmount(){
      let amount = 0;
      this.orderList.map((item,index)=>{
        amount+=item.totalAmount;
      })
      return amount;
    }
  },
  data () {
    return {
      dialogBottleVisible: false,
      bottleForm: {
        count: 0,
      },
      formLabelWidth: '120px',
      orderList:[],
    }
  },

  methods:{
    getOrders(){
      const res = getCartOrders({userUid: this.clientName});
      res
      .then((data)=>{
        this.orderList=data;
        this.orderList.map((item,index)=>{
          item.temGoodsNum = item.goodQuantity;
        })
      })
      .catch((e)=>{
        alert(e);
      })
    },
    numberChange(newVal, cartId){
      this.orderList.map((item,index)=>{
        if(cartId===item.cartId){
          item.totalAmount = newVal*item.price;
        }
      })
    },
    deleteOrder(orderId){
      const res = deleteCartInfo({cartIds: [orderId]});
      res
      .then(()=>{
        alert('删除订单成功！');
        this.orderList.map((item,index)=>{
          if(item.cartId===orderId){
            this.orderList.splice(index,1);
          }
        })
      })
      .catch((e)=>{
        alert(e);
      })
    },
    navTo(route){
      this.$router.push(route);
    },
    settleAccounts(bottleForm, isRecyled){
      this.dialogBottleVisible = false;
      if(!isRecyled) {bottleForm.count = 0;}
      let cartIdList = [];
      this.orderList.map((item,index)=>{
        cartIdList.push(item.cartId);
      });
      let cartList = {
        cartIds: cartIdList,
        userUid: this.clientName,
        number: bottleForm.count
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
    }
  },

  mounted(){
    this.getOrders();
  },
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.Cart{
  width: 100%;
  .emptyTips{
      width: 200px;
      text-align: center;
      display: block;
      margin: 30px auto;
      color:@thirdColor;
      font-size: 20px;
  }
  .cartTableHeader{
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
      border-top: none;
      font-size: 13px;
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
        .unitPrice,.num,.amount{
          display: inline-block;
          vertical-align: top;
          width: 15%;
          height: 85px;
          line-height: 85px;
          text-align: center;
        }
        .NumberInput{
          position: relative;
          top: 25px;
        }
        button{
          position: absolute;
          right: 90px;
          bottom: 40px;
          width: 70px;
          height: 30px;
          border-radius: 3px;
          background-color: @falseColor;
          color:white;
          border: none;

        }
      }
    }
  }
  .cartFooter{
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding: 0 10px;
    border: 1px solid @borderColor;
    border-top: none;
    background-color: #f5f5f5;
    position: relative;
    span{
      color: @fontDefaultColor;
      display: inline-block;
      vertical-align: top;
    }
    .total{
      color:@falseColor;
      font-size: 25px;
      font-weight: 600;
    }
    button{
      position: absolute;
      right: 0;
      top: 0;
      width: 100px;
      height: 100%;
      background-color: @thirdColor;
      border: none;
      color:white;
      font-size: 20px;
    }
  }
}
</style>