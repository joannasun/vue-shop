<template>
    <li class="GoodsItem">
      <div class="imgBox">
        <img v-if="img" :src="require(`assets/img/${img}.jpg`)" alt="商品图片" @click="navTo('/shop/goods/'+id)"/>
        <el-image v-else>
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
      <div class="goodsInfo">
        <div class="goodStyle">
          <span class="price">{{'¥'+price}}</span>
          <span class="saleNo">{{salenumber + '+人付款'}}</span>
        </div>
        <span class="goodsName ellipsis" @click="navTo('/shop/goods/'+id)">{{name}}</span>
        
      </div>
    </li>
</template>

<script>
export default {
  name: 'GoodsItem',
  props:{
    id:{
      type:String,
      default:0
    },
    img:{
      type:String,
      default:''
    },
    name:{
      type:String,
      default:''
    },
    price:{
      type:Number,
      default:0
    },
    salenumber: {
      type: Number,
      default:0
    }
  },
  data(){
    return{
    }
  },
  methods:{
    navTo(route){
      this.$router.push(route);
    },
  }
}
</script>

<style scoped lang="less">
@import "../assets/css/var.less";
.GoodsItem{
  display: inline-block;
  width: 220px;
  height: 360px;
  overflow: hidden;
  &:hover{
    img{
      transform:scale(1.05);
    }
  }
  .imgBox{
    width: 100%;
    height: 266px;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
      cursor: pointer;
      transition:transform 0.5s;
    }
  }
  .goodsInfo{
    width: 100%;
    height: 60px;
    font-size: 14px;
    .goodStyle{
      height: 35px;
      display: flex;
      justify-content: space-between;
      line-height: 35px;
    }
    .goodsName{
      display: block;
      text-align: center;
      cursor: pointer;
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: 600;
      line-height: 20px;
      &:hover{
        color:@thirdColor;
      }
    }
    .price{
      display: block;
      text-align: center;
      color:@falseColor;
      font-size: 30px;
    }
    .saleNo{
      display: block;
      text-align: center;
    }
  }
}
</style>