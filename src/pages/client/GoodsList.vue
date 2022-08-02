<template>
  <div class="GoodsList">
    <div class="sortBox">
      <span class="title">排序：</span>
      <span :class="['normal',{selected:sortMode===0}]" @click="changeSortMode(0)">默认</span>
      <span :class="['normal',{selected:sortMode!==0}]" @click="changeSortMode('price')">
        价格
        <i :class="['iconfont','icon-arrows-4-7',{'selected':sortMode===1}]" /><i :class="['iconfont','icon-arrows-4-7',{'selected':sortMode===2}]" />
      </span>
      <span :class="['normal',{selected:sortMode!==0}]" @click="changeSortMode('salenumber')">
        销量
        <i :class="['iconfont','icon-arrows-4-7',{'selected':sortMode===3}]" /><i :class="['iconfont','icon-arrows-4-7',{'selected':sortMode===4}]" />
      </span>
    </div>
    <ul class="result" v-loading="loading">
      <GoodsItem 
        v-for="(item,index) in sortedList" 
        :style="{marginRight: (index+1)%4===0?'0px':'25px'}"
        :key="+item.goodId"
        :id="item.goodId"
        :img="item.picture"
        :name="item.goodName"
        :price="item.price"
      />
      <p class="noGoods" v-if="goodsList.length<=0">抱歉，没有找到相关商品~</p>
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
  </div>
</template>

<script>
import {getGoodsList} from 'api/client';
import GoodsItem from 'components/GoodsItem';

export default {
  name: 'GoodsList',
  components:{
    GoodsItem
  },
  computed:{
    typeId(){
      return this.$route.params.typeId || 0;
    },
    keyword(){
      return this.$route.params.keyword || '';
    },
    sortedList(){
      let temList = this.goodsList.slice();
      if(this.sortMode===0){
        return temList;
      }else if(this.sortMode===1){
        return temList.sort((a,b)=>{
          return a.price - b.price;
        })
      }else if(this.sortMode===2){
        return temList.sort((a,b)=>{
          return b.price - a.price;
        })
      }else if(this.sortMode===3){
        return temList.sort((a,b)=>{
          return a.salenumber - b.salenumber;
        })
      }else if(this.sortMode===4){
        return temList.sort((a,b)=>{
          return b.salenumber - a.salenumber;
        })
      }
    }
  },
  data () {
    return {
      goodsList:[],
      sortMode:0,//0默认，1价格升序，2价格降序
      currentPage: 1,
      pageSize: 5,
      total: 100,
      loading: false,
    }
  },

  methods:{
    getGoodsList(typeId){
      const res = getGoodsList({goodType: typeId});
      res.then((data)=>{
        this.goodsList = data;
      })
      .catch((e)=>{
        alert(e);
      })
    },
    changeSortMode(mode){
      if(mode==='price'){
        this.sortMode = this.sortMode=== 1 ? 2 : 1;
      }else if(mode==='salenumber'){
        this.sortMode = this.sortMode=== 3 ? 4 : 3;
      }else{
        this.sortMode = 0;
      }
    },
    handleSizeChange(val) {
      this.loading = true;
      console.log(`每页 ${val} 条`);
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
  },

  mounted(){
    //类别页
   this.getGoodsList(this.typeId);
  },

  watch:{
    $route(to,from){
      this.sortMode = 0;
      this.getGoodsList(this.typeId);
    }
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.GoodsList{
  .sortBox{
    width: 90%;
    border-top: 1px dotted @borderColor;
    border-bottom: 1px dotted @borderColor;
    margin: 30px auto;
    padding-bottom: 30px;
    padding-top: 30px;
    span{
      font-size: 13px;
    }
    .title{
      color:@fontDefaultColor;
      display: inline-block;
      margin-right: 10px;
    }
    .normal{
      cursor: pointer;
      color:@fontDefaultColor;
      display: inline-block;
      margin-right: 10px;
    }
    .iconfont{
      color:@fontDefaultColor;
      display: inline-block;
      position: relative;
      left: -3px;
      &:last-of-type{
        transform:rotate(180deg);
        left: -6px;
      }
    }
    .selected{
      color:@thirdColor;
    }
  }
  .noGoods{
    margin: 38px auto;
    text-align: center;
    color:@thirdColor;
    font-size: 18px;
  }
}
</style>