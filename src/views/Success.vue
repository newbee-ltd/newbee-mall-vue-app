<template>
  <div>
    <h1>支付完成</h1>
    <h2>正在为您跳转至订单界面...</h2>
  </div>
</template>

<script>
export default {
    mounted(){
      // setTimeout(()=>this.$router.push('/order'),10000)
      this.$router.push('/order')
    }

}
</script>

<style>

</style>