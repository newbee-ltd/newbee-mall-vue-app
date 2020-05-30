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
  <div ref="wrapper" class="scroll-wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    // 点击列表是否派发click事件
    click: {
      type: Boolean,
      default: true
    },
    // 是否开启横向滚动
    scrollX: {
      type: Boolean,
      default: false
    },
    // 是否派发滚动事件
    listenScroll: {
      type: Boolean,
      default: false
    },
    // 列表的数据
    scrollData: {
      type: Array,
      default: null
    },
    // 是否派发滚动到底部的事件，用于上拉加载
    pullup: {
      type: Boolean,
      default: false
    },
    // 是否派发顶部下拉的事件，用于下拉刷新
    pulldown: {
      type: Boolean,
      default: false
    },
    // 是否派发列表滚动开始的事件
    beforeScroll: {
      type: Boolean,
      default: false
    },
    // 当数据更新后，刷新scroll的延时
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted() {
    // 在 DOM 渲染完毕后初始化 better-scroll
    setTimeout(() => {
      this.initScroll()
    }, 20)
  },
  methods: {
    initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      // better-scroll 初始化
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX
      })
      // 是否派发滚动事件
      if (this.listenScroll) {
        const self = this
        this.scroll.on('scroll', (position) => {
          self.$emit('scroll', position)
        })
      }
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            // 派发滚动到底部的事件
            this.$emit('scrollToEnd')
          }
        })
      }
      if (this.pulldown) {
        this.scroll.on('touchend', (pos) => {
          // 下拉动作
          if (pos.y > 50) {
            // 下拉刷新
            this.$emit('pulldown')
          }
        })
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          // 列表滚动前触发
          this.$emit('beforeScroll')
        })
      }
    },
    disable() {
      // 代理 better-scroll 的 disable 方法
      this.scroll && this.scroll.disable()
    },
    enable() {
        // 代理 better-scroll 的 enable 方法
        this.scroll && this.scroll.enable()
    },
    refresh() {
        // 代理 better-scroll 的 refresh 方法
        this.scroll && this.scroll.refresh()
    },
    scrollTo() {
        // 代理 better-scroll 的 scrollTo 方法
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
        // 代理 better-scroll 的 scrollToElement 方法
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    // 监听数据的变化，重新计算高度
    data() {
      setTimeout(() => {
          this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>

<style lang="less" scoped>
  .scroll-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
