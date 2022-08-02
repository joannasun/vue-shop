<template>
  <div class="EditGoods">
    <header class="clear">
      <span>商品编辑</span>
    </header>
    <div class="content">
      <div class="inputBox">
        <span>商品名称：</span>
        <TextInput class="long" placeholder="请输入商品名称" v-model="goodName" :initText="goodName"/>
      </div>
      <div class="inputBox">
        <span>选择类目：</span>
        <TextInput class="long" placeholder="请输类目" v-model="temTypeId" :initVal="String(initTypeId)" />
      </div>
      <div class="inputBox">
        <span>商品价格：</span>
        <TextInput class="long" placeholder="请输入价格" v-model="price" :initText="price"/>
      </div>
      <div class="inputBox">
        <span>图片地址：</span>
        <TextInput class="long" placeholder="请输入图片地址" v-model="goodsImg" :initText="goodsImg"/>
      </div>
        <div class="inputBox">
        <span>营养物质：</span>
        <TextInput class="long" placeholder="请输入营养物质" v-model="nutrientContent" :initText="nutrientContent"/>
      </div>
        <div class="inputBox">
        <span>过敏源：</span>
        <TextInput class="long" placeholder="请输入过敏源" v-model="allergyInformation" :initText="allergyInformation"/>
      </div>
      <div class="inputBox">
        <span>详情描述：</span>
        <TextInput class="long" placeholder="请输入简单描述" v-model="desc" :initText="desc"/>
      </div>
      <div class="btnBox">
        <button class="confirmBtn" @click="saveChange">保存修改</button>
        <button class="normalBtn" @click="back">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
import Popup from 'components/Popup';
import TextInput from 'components/TextInput';
import Radio from 'components/Radio';
import {getTypes, getGoodsList, addGoods} from 'api/client';
export default {
  name: 'EditGoods',
  components:{
    Popup,
    Radio,
    TextInput
  },
  data(){
    return{
      popupShow:false,
      id:this.$route.params.id,
      goodName:'',
      types:[],
      initTypeId:'',
      temTypeId:'',
      goodsImg:'',
      desc:'',
      price: '',
      nutrientContent:'',
      allergyInformation:''
    }
  },
  methods:{
    getTypes(){
      const res = getTypes();
      res
      .then((data)=>{
        this.types = data;
      })
      .catch((e)=>{
        alert(e)
      })
    },
    back(){
      this.$router.go(-1);
    },
    saveChange(){
      if(this.id==='new'){
        const res = addGoods({
          goodName:this.goodName,
          goodType:this.temTypeId,
          picture:this.goodsImg,
          goodDescription:this.desc,
          price:this.price,
        });
        res
        .then(()=>{
          alert('创建商品成功！')
          this.$router.go(-1);
        })
        .catch((e)=>{
          alert(e);
        })
      }else{
        const res = addGoods({
          goodId: this.id,
          goodName:this.goodName,
          goodType:this.temTypeId,
          picture:this.goodsImg,
          goodDescription:this.desc,
          price:this.price,
        });
        res
        .then(()=>{
          alert('修改成功！')
          this.$router.go(-1);
        })
        .catch((e)=>{
          alert(e);
        })
      }
     
    },
   
  },
  mounted(){
    this.getTypes();
    //新建商品
    if(this.id==='new'){

    }else{
  		const res = getGoodsList({goodId: this.id});
      res
      .then((data)=>{
        this.temTypeId = data[0].goodType;
        this.initTypeId = data[0].goodType;
        this.goodName = data[0].goodName;
        this.goodsImg = data[0].picture;
        this.price = data[0].price;
        this.desc = data[0].goodDescription;
      })
      .catch((e)=>{
        alert(e);
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.EditGoods{
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
      padding: 10px;
      textarea{
        width: 80%;
        height: 300px;
        border: 1px solid @borderColor;
      }
      .inputBox{
        margin-bottom: 30px;
        span{
          width: 90px;
          display: inline-block;
          color:@fontDefaultColor;
          font-weight: 600;
          vertical-align: middle;
        }
        .verTop{
          vertical-align: top;
        }
        .Radio /deep/ input:checked+.tipsBox{
          &:after{
            background-color:#337da4;
          }
        }
        .tips{
          font-weight: normal;
          width: auto;
          font-size: 13px;
          position: relative;
          left: 3px;
        }
        .val{
          width: auto;
          font-weight: 500;
          color:@fontDeepColor;
        }
        ul{
          display: inline-block;
          width: 500px;
          li{
            width: 100%;
            height: 40px;
            span{
              width: auto;
              font-size: 13px;
              font-weight: 500;
            }
            input{
              margin-right: 10px;
            }
            button{
              width: 50px;
              height: 25px;
              color:#d7514a;
              border:none;
              background-color: white;
              border-radius: 5px;
            }
          }
          .addSpec{
            text-align: center;
            line-height: 30px;
            background-color: #337da4;
            color:white;
            border: none;
            width: 100px;
            height: 30px;
            border-radius: 5px;
            font-size: 13px;
            cursor: pointer;
            margin:10px auto;
          }
        }
        .long{
          width: 900px;
        }
        .numInput{
          width: 30px;
          text-align: center;
          border: none;
          border-bottom: 2px solid @mainColor;
        }
      }
      .btnBox{
        margin: auto;
        display: block;
        width: 250px;
      }
      .confirmBtn{
        display: inline-block;
        margin-right: 30px;
        background-color: #337da4;
        color:white;
        border: none;
        width: 100px;
        height: 30px;
        border-radius: 5px;
        cursor: pointer;
      }
      .normalBtn{
        display: inline-block;
        background-color: grey;
        color:white;
        border: none;
        width: 100px;
        height: 30px;
        border-radius: 5px;
        cursor: pointer;
      }
  }
  .popupContent{
    padding: 10px;
    input{
      display: block;
      width: 400px;
      margin-bottom: 10px;
      height: 30px;
    }
    button{
        display: block;
        margin:auto;
        background-color: #333333;
        color:white;
        border: none;
        width: 100px;
        height: 30px;
        border-radius: 5px;
        cursor: pointer;
    }
  }
}
</style>