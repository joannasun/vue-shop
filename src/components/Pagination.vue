<template>
  <div class="block" style="margin-top: 15px">
    <el-pagination
      align="center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[16, 32, 48, 88]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="goodsList.length"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "pagination",
  props: {
    goodsList: {
      type: Array,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 20,
    },
    pageSize: {
      type: Number,
      default: 5,
    },
  },
  data(){
      return{
      }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('handleSizeChange',val)
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange',val)
    },
  },
};
</script>

<style>
</style>
