<!--
 * 严肃声明：
 * 开源版本请务必保留此注释头信息，若删除我方将保留所有法律责任追究！
 * 本系统已申请软件著作权，受国家版权局知识产权以及国家计算机软件著作权保护！
 * 可正常分享和学习源码，不得用于违法犯罪活动，违者必究！
 * Copyright (c) 2020 陈尼克 all rights reserved.
 * 版权所有，侵权必究！
 *
-->

<template>
  <div class="order-detail-box">
    <s-header :name="'订单详情'" @callback="close"></s-header>
    <div class="order-status">
      <div class="status-item">
        <label>订单状态：</label>
        <span>{{ detail.orderStatusString }}</span>
      </div>
      <div class="status-item">
        <label>订单编号：</label>
        <span>{{ detail.orderNo }}</span>
      </div>
      <div class="status-item">
        <label>下单时间：</label>
        <span>{{ detail.createTime }}</span>
      </div>
      <van-button v-if="[1,2,3].includes(detail.orderStatus)" style="margin-bottom: 10px" color="#1baeae" block @click="handleConfirmOrder(detail.orderNo)">确认收货</van-button>
      <van-button v-if="detail.orderStatus == 0" style="margin-bottom: 10px" color="#1baeae" block @click="showPayFn">去支付</van-button>
      <van-button v-if="detail.orderStatus == 0" block @click="cancelOrder(detail.orderNo)">取消订单</van-button>
      <van-button v-if="detail.orderStatus <= 4&&detail.orderStatus>=1" block @click="askRefund(detail.orderNo)">申请退款</van-button>
      <van-dropdown-menu v-if="detail.orderStatus <= 4&&detail.orderStatus>=1">
        <van-dropdown-item
        :title="droptitle"
        :options="optionRefund"
        @change="toggleoption"
        ></van-dropdown-item>
      </van-dropdown-menu>
      <div v-if="droptitle=='其他原因'">
        请在此输入您的退款理由：
        <input style="background-color: #bbb" ref="userreason" type="text"/>
      </div>
    </div>
    <div class="order-price">
      <div class="price-item">
        <label>商品金额：</label>
        <span>¥ {{ detail.totalPrice }}</span>
      </div>
      <div class="price-item">
        <label>配送方式：</label>
        <span>普通快递</span>
      </div>
    </div>
    <van-card
      v-for="item in detail.newBeeMallOrderItemVOS"
      :key="item.goodsId"
      style="background: #fff"
      :num="item.goodsCount"
      :price="item.sellingPrice"
      desc="全场包邮"
      :title="item.goodsName"
      :thumb="prefix(item.goodsCoverImg)"
    />
    <van-popup
      v-model="showPay"
      position="bottom"
      :style="{ height: '24%' }"
    >
      <div :style="{ width: '90%', margin: '0 auto', padding: '20px 0' }">
        <van-button :style="{ marginBottom: '10px' }" color="#1989fa" block @click="payOrder()">支付宝支付</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import sHeader from '@/components/SimpleHeader'
import { getOrderDetail, cancelOrder, confirmOrder, payOrder,refund } from '@/service/order'
import { Dialog, Toast } from 'vant'
export default {
  components: {
    sHeader
  },
  data() {
    return {
      detail: {},
      showPay: false,
      droptitle:'请选择您的退款原因',
      nowvalue:-1,
      optionRefund:[
        {text:'质量不好',value:0},
        {text:'发货太慢',value:1},
        {text:'款式不喜欢',value:2},
        {text:'其他原因',value:3}
      ]
    }
  },
  mounted() {
    this.init()

  },
  methods: {
    async init() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      });
      const { id } = this.$route.query
      const { data } = await getOrderDetail(id)
      this.detail = data
      Toast.clear()
    },
    cancelOrder(id) {
      Dialog.confirm({
        title: '确认取消订单？',
      }).then(() => {
        cancelOrder(id).then(res => {
          if (res.resultCode === 200) {
            Toast('删除成功')
            this.init()
          }
        })
      }).catch(() => {
        // on cancel
      });
    },
    handleConfirmOrder(id) {
      Dialog.confirm({
        title: '是否确认收货？',
      }).then(() => {
        confirmOrder(id).then(res => {
          if (res.resultCode === 200) {
            Toast('确认成功')
            this.init()
          }
        })
      }).catch(() => {
        // on cancel
      });
    },
    showPayFn() {
      this.showPay = true
    },
    async payOrder() {
      Toast.loading
      const orderNo = this.detail.orderNo
      console.log(orderNo)
      const {data}=await payOrder(orderNo)
      // this.$router.push({ path: 'order' })
      this.showPay = false
      this.init()
      document.write(data);
    },
    close() {
      Dialog.close()
    },
    async askRefund(orderNo){
      if(this.nowvalue<3&&this.nowvalue>=0){
        await refund(orderNo,this.optionRefund[this.nowvalue].text)
      }else if(this.nowvalue==4&&this.$refs.userreason.value!==null){
        await refund(orderNo,this.$refs.userreason.value)
      }else{
        await refund(orderNo,'用户未填写理由')
      }
      this.init()
    },
    toggleoption(value){
      this.droptitle=this.optionRefund[value].text
      this.nowvalue=value
    }
  }
}
</script>

<style lang="less" scoped>
  .order-detail-box {
    background: #f7f7f7;
    .order-status {
      background: #fff;
      margin-top: 44px;
      padding: 20px;
      font-size: 15px;
      .status-item {
        margin-bottom: 10px;
        label {
          color: #999;
        }

      }
    }
    .order-price {
      background: #fff;
      margin: 20px 0;
      padding: 20px;
      font-size: 15px;
      .price-item {
        margin-bottom: 10px;
        label {
          color: #999;
        }

      }
    }
    .van-card {
      margin-top: 0;
    }
    .van-card__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
</style>
