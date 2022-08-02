<template>
  <div class="Orders">
    <header class="clear">
  		<span>订单管理</span>
  	</header>
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
            <span class="orderTime">{{'订单号：'+item.orderId}}</span>
            <span class="orderId">{{'创建时间：'+ format(item.createTime)}}</span>
            <span class="orderId">{{'修改时间：'+ format(item.updateTime)}}</span>
            <span class="deleteBtn" @click="deleteOrder(item.orderId)"><i class="iconfont icon-close" /></span>
          </div>
          <div class="orderDetail" v-for="(goodInfo, index) in item.ordersItemInfos" :key="goodInfo.goodId+'detail'">
            <img :src="require(`assets/img/${goodInfo.picture}.jpg`)" alt="商品图片" />
            <div class="goodsName">
              {{goodInfo.goodName}}
            </div>
            <span class="unitPrice">{{'￥'+goodInfo.price}}</span>
            <span class="num">{{goodInfo.goodQuantity}}</span>
            <span class="amount">{{'￥'+goodInfo.totalAmount}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {getOrders,deleteOrder} from 'api/client';
import moment from 'moment'

export default {
  name: 'Orders',
  
  data(){
  	return{
  		orderList:[]
  	}
  },
  methods:{
		format(time){
			return moment(time).format("YYYY-MM-DD HH:mm");
		},
  	changeTag(){
  		const res = getOrders({});
  		res
  		.then((orders)=>{
  			this.orderList = orders;
  		})
  		.catch((e)=>{
  			alert(e);
  		})
  	},
  	editOrder(id){
  		this.$router.push('/backstage/orders/'+id)
  	},
  	deleteOrder(id){
  		const res = deleteOrder(id);
  		res
  		.then(()=>{
  			alert('删除成功');
  			this.orderList.map((item,index)=>{
  				if(item.orderId===id){
  					this.orderList.splice(index,1);
  				}
  			})
  		})
  		.catch((e)=>{
  			alert(e);
  		})
  	}
  },
  mounted(){
  	this.changeTag();
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.Orders{
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
		padding: 5px;
		.ordersTable{
			width: 100%;
			th{
				text-align: center;
			}
			tbody{
				tr{
					td{
						max-width: 100px;
						min-width: 30px;
						text-align: center;
						button{
							display: block;
							overflow: hidden;
							margin-bottom: 5px;
						}
					}
				}
			}
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
}
</style>