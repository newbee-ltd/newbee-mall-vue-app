<template>
  <div>
    <h1>支付完成</h1>
    <van-button type="primary" size="small" @click="returnToMain()">返回主界面</van-button>
  </div>
</template>

<script>
export default {
    methods:{
        returnToMain(){
            this.$router.push('/')
        }
    }

}
</script>

<style>

</style>