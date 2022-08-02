<template>
  <div class="Goods">
    <header class="clear">
  		<span>商品管理</span>
  	</header>
  	<Tag :tagList="tagTextList" @indexChange="changeTag"/>
  	<div class="content">
  		<ul class="clear">
  			<li v-for="(item,index) in goodsList" :key="'goods'+item.goodId">
  				<img :src="require(`assets/img/${item.picture}.jpg`)" alt="" />
  				<span>{{item.goodName}}</span>
  				<span>{{item.price}}</span>
  				<div>
  					<button class="normalBtn" @click="navTo('/backstage/goods/'+item.goodId)">编辑</button>
  					<button @click="deleteGoods(item.goodId)" class="deleteBtn">删除</button>
  					<button @click="navTo('/backstage/goods/batch/'+item.goodId)" class="normalBtn">批次</button>
  				</div>
  			</li>
  			<li>
  				<div class="addGoods" @click="navTo('/backstage/goods/new')">
  					<div>+</div>
  					点击增加商品
  				</div>
  			</li>
  		</ul>
  	</div>
  </div>
</template>

<script>
import {getTypes, getGoodsList, deleteGoods} from 'api/client';

import Tag from 'components/Tag';
import Popup from 'components/Popup';
export default {
  name: 'Goods',
  components:{
  	Tag,
  	Popup
  },
  computed:{
  	tagTextList(){
  		let temArr = [];
  		this.tags.map((item,index)=>{
  			temArr.push(item.goodType)
  		});
  		return temArr;
  	}
  },
  data(){
  	return{
  		tags:[],
  		goodsList:[],
  		curIndex:0,
  	}
  },
  methods:{
  	changeTag(index){
  		this.curIndex = index;
  		const res = getGoodsList({goodType: this.tags[index].goodType});
  		res
  		.then((goods)=>{
  			this.goodsList = goods;
  		})
  		.catch((e)=>{
  			alert(e);
  		})
  	},
  	getTypes(){
  		const res = getTypes();
  		res.then((data)=>{
  			this.tags = data;
  			this.changeTag(this.curIndex);
  		})
  		.catch((e)=>{
  			alert(e);
  		})
  	},
  	
  	navTo(route){
  		this.$router.push(route);
  	},
    deleteGoods(id){
      const res = deleteGoods(id);
      res
      .then(()=>{
        this.goodsList.map((item,index)=>{
          if(item.goodId===id){
            this.goodsList.splice(index,1)
          }
        })
      })
      .catch((e)=>{
        alert(e);
      })
    },
  },
  mounted(){
  	this.getTypes();
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.Goods{
	header{
		width: 100%;
		height: 40px;
		line-height: 40px;
		span{
			float: left;
		}
		button{
			float: right;
			background-color: #337da4;
			color:white;
			border: none;
			width: 80px;
			height: 30px;
			border-radius: 5px;
		}
	}
	.content{
		position: relative;
		background-color: white;
		width: 100%;
		top: -2px;
		ul{
			padding: 10px;
			li{
				float: left;
				display: inline-block;
				width: 200px;
				height: 300px;
				text-align: center;
				margin-right: 20px;
				img{
					width: 100%;
					height: 200px;
					border: 1px solid @borderColor;
				}
				span{
					font-size: 13px;
					display: block;
					margin: 10px 0;
					color:@fontDefaultColor;
				}
				.normalBtn{
					width: 50px;
					height: 25px;
					color:@mainColor;
					border: 1px solid @mainColor;
					background-color: white;
					border-radius: 5px;
					margin-right: 5px;
				}
				.deleteBtn{
					width: 50px;
					height: 25px;
					color:@falseColor;
					border: 1px solid @falseColor;
					background-color: white;
					border-radius: 5px;
				}
				.addGoods{
					width: 100%;
					height: 200px;
					text-align: center;
					cursor: pointer;
					border: 1px solid @borderColor;
					color:@fontDefaultColor;
					div{
						margin: 50px auto 10px;
						border-radius: 50%;
						border:2px solid @fontDefaultColor;
						width: 40px;
						height: 40px;
						font-size: 30px;
						text-align: center;
						line-height: 30px;
					}
				}
        &:last-of-type{
          margin-right: 0;
        }
			}
		}
	}
	.popupContent{
		padding: 20px;
		input{
			display: block;
			width: 200px;
			height: 30px;
			border: none;
			border-bottom: 2px solid #333333;
      margin-top: 20px;
		}
		button{
			display: block;
			margin: 30px auto 0;
			background-color: #333333;
			color:white;
			border: none;
			width: 80px;
			height: 30px;
			border-radius: 5px;
		}
	}
}
</style>