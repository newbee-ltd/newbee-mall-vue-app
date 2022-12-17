<template>
  <div>
    <span class="center">支付已完成</span>
    <span class="center">正在为您跳转至订单界面...</span>
    <router-link class="center" to='/order'>
      <span class="font">若未正常跳转，请点击此处跳转</span>
    </router-link>
    <span class="center">或者，您也可以跳转至其他界面</span>
    <router-link class="center" to='/'>
      <span class="font">首页</span>
    </router-link>
    <router-link class="center" to='/category'>
      <span class="font">分类</span>
    </router-link>
    <router-link class="center" to='/cart'>
      <span class="font">购物车</span>
    </router-link>
    <router-link class="center" to='/user'>
      <span class="font"> 个人中心</span>
    </router-link>
  </div>
</template>

<script>
export default {
    mounted(){
      //setTimeout(()=>this.$router.push('/order'),30000)
      this.$router.push('/order')
    }
}
</script>

<style>
.center{
  display: flex;justify-content: center;
  font: 20px/1.5 'Microsoft YaHei',sans-serif;
  height: 50px;
}
.font{
  font: 20px/1.5 'Microsoft YaHei',sans-serif;
  height: 50px;
  text-decoration:none;
}
.font:hover{
  color: #0037ff;
  text-decoration:underline;
}
</style>
