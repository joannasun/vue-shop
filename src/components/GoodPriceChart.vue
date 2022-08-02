<!-- GoodPriceChart -->
<template>
  <div id="main" :goodPrices = "goodPrices" style="width:700px; height:350px;"></div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'GoodPriceChart',
  props: ['goodPrices'],
  data () {
    return {
    };
  },


  mounted(){
    const priceArr =[];
    const dateArr =[];
    for ( const item of this.goodPrices) {
      priceArr.push(item.price);
      // dateArr.push(item.updateTime | dateformat("YYYY-MM-DD HH:mm"));
      dateArr.push( moment(item.updateTime).format("YYYY-MM-DD HH:mm"));

    }
    const echarts = require("echarts");
    let myChart = echarts.init(document.getElementById("main"));
    window.onresize = function () {
      myChat.resize()
    }
    const option = {
        xAxis: {
          type: 'category',
          data: dateArr,
          axisTick: {
            length: 10,
            interval: 1,
            margin: 10
          },
          axisLabel: {
            rotate: 60,
            margin: 10,
            height: 80
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: priceArr,
            type: 'line'
          }
        ]
      }
    myChart.setOption(option);
  }
}

</script>
<style lang='less' scoped>
@import "../assets/css/var.less";

</style>