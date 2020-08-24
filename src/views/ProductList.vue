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
  <div class="product-list-wrap">
    <div class="product-list-content">
      <header class="category-header wrap">
        <i class="nbicon nbfanhui" @click="goBack"></i>
        <div class="header-search">
          <i class="nbicon nbSearch"></i>
          <input
            type="text"
            class="search-title"
            @mouseenter="textEnter"
            @mouseleave="textLeave"
            v-model="keyword"/>
        </div>
        <span class="search-btn" @click="getSearch">搜索</span>
      </header>
      <van-tabs type="card" color="#1baeae" @click="changeTab" >
        <van-tab title="推荐" name=""></van-tab>
        <van-tab title="新品" name="new"></van-tab>
        <van-tab title="价格" name="price"></van-tab>
      </van-tabs>
    </div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="product-list-refresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        @offset="300"
      >
        <!-- <p v-for="item in list" :key="item">{{ item }}</p> -->
        <div class="product-item" v-for="(item, index) in productList" :key="index" @click="productDetail(item)">
          <img :src="prefix(item.goodsCoverImg)" />
          <div class="product-info">
            <p class="name">{{item.goodsName}}</p>
            <p class="subtitle">{{item.goodsIntro}}</p>
            <span class="price">￥ {{item.sellingPrice}}</span>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getQueryString } from '@/common/js/utils'
import { search } from '../service/good'
import { Toast } from 'vant'
export default {
  data() {
    return {
      keyword: this.$route.query.keyword || '',
      searchBtn: false,
      seclectActive: false,
      refreshing: false,
      list: [],
      loading: false,
      finished: false,
      productList: [],
      totalPage: 0,
      page: 1,
      orderBy: ''
    }
  },
  mounted() {
    // window.addEventListener('scroll', this.pageScroll)
    // setTimeout(() => {
    //     this.isLoading = false
    // }, 500)
    // this.init()
  },
  methods: {
    async init() {
      const { categoryId, from } = this.$route.query
      if (!categoryId && !this.keyword) {
        // Toast.fail('请输入关键词')
        this.finished = true
        this.loading = false;
        return
      }
      const { data, data: { list } } = await search({ pageNumber: this.page, goodsCategoryId: categoryId, keyword: this.keyword, orderBy: this.orderBy })
      this.productList = this.productList.concat(list)
      this.totalPage = data.totalPage
      this.loading = false;
      if (this.page >= data.totalPage) this.finished = true
    },
    goBack() {
      this.$router.go(-1)
    },
    productDetail(item) {
      this.$router.push({ path: `product/${item.goodsId}` })
    },
    textEnter() {

    },
    textLeave() {

    },
    getSearch() {
      this.onRefresh()
    },
    pageScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      scrollTop > 50 ? this.seclectActive = true : this.seclectActive = false
    },
    onLoad() {
      if (!this.refreshing && this.page < this.totalPage) {
        this.page = this.page + 1
      }
      if (this.refreshing) {
        this.productList = [];
        this.refreshing = false;
      }
      this.init()
    },
    onRefresh() {
      this.refreshing = true
      this.finished = false
      this.loading = true
      this.page = 1
      this.onLoad()
    },
    changeTab(name, title) {
      this.orderBy = name
      this.onRefresh()
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .product-list-content {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
    background: #fff;
    .category-header {
      .fj();
      width: 100%;
      height: 50px;
      line-height: 50px;
      padding: 0 15px;
      .boxSizing();
      font-size: 15px;
      color: #656771;
      z-index: 10000;
      &.active {
        background: @primary;
      }
      .icon-left {
        font-size: 25px;
        font-weight: bold;
      }
      .header-search {
        display: flex;
        width: 76%;
        height: 20px;
        line-height: 20px;
        margin: 10px 0;
        padding: 5px 0;
        color: #232326;
        background: #F7F7F7;
        .borderRadius(20px);
        .nbSearch {
          padding: 0 5px 0 20px;
          font-size: 17px;
        }
        .search-title {
          font-size: 12px;
          color: #666;
          background: #F7F7F7;
        }
    }
    .icon-More {
      font-size: 20px;
    }
    .search-btn {
      height: 28px;
      margin: 8px 0;
      line-height: 28px;
      padding: 0 5px;
      color: #fff;
      background: @primary;
      .borderRadius(5px);
      margin-top: 10px;
    }
  }
}
  .product-list-refresh {
    margin-top: 78px;
    .product-item {
      .fj();
      width: 100%;
      height: 120px;
      padding: 10px 0;
      border-bottom: 1px solid #dcdcdc;
      img {
        width: 140px;
        height: 120px;
        padding: 0 10px;
        .boxSizing();
      }
      .product-info {
          width: 56%;
          height: 120px;
          padding: 5px;
          text-align: left;
          .boxSizing();
          p {
            margin: 0
          }
          .name {
            width: 100%;
            max-height: 40px;
            line-height: 20px;
            font-size: 15px;
            color: #333;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .subtitle {
            width: 100%;
            max-height: 20px;
            padding: 10px 0;
            line-height: 25px;
            font-size: 13px;
            color: #999;
            overflow: hidden;
          }
          .price {
            color: @primary;
            font-size: 16px;
          }
      }
  }
}
</style>
