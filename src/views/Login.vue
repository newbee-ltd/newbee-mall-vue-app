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
  <div class="login">
    <s-header :name="type === PAGE_TYPE.LOGIN ? '登录' : '注册'" :back="'/home'"></s-header>
    <img class="logo" src="//s.weituibao.com/1582958061265/mlogo.png" alt="">
    <div v-if="type === PAGE_TYPE.LOGIN" class="login-body login">
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div class="verify">
          <Verify ref="loginVerifyRef" @error="error" :showButton="false" @success="success" :width="'100%'"
                  :height="'40px'" :fontSize="'16px'" :type="2"></Verify>
        </div>
        <div style="margin: 16px;">
          <div class="link-register" @click="toggle(PAGE_TYPE.REGISTER)">立即注册</div>
          <van-button round block type="info" color="#1baeae" native-type="submit">登录</van-button>
        </div>
      </van-form>
    </div>
    <div v-else class="login-body register">
      <van-form @submit="onSubmit">
        <van-field
          v-model="username1"
          name="username1"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password1"
          type="password"
          name="password1"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div class="verify">
          <Verify
            ref="loginVerifyRef"
            @error="error"
            :showButton="false"
            @success="success"
            :width="'100%'"
            :height="'40px'"
            :fontSize="'16px'"
            :type="2">
          </Verify>
        </div>
        <div style="margin: 16px;">
          <div class="link-login" @click="toggle(PAGE_TYPE.LOGIN)">已有登录账号</div>
          <van-button round block type="info" color="#1baeae" native-type="submit">注册</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import sHeader from '@/components/SimpleHeader'
import { register } from '@/service/user'
import Verify from 'vue2-verify'

const PAGE_TYPE = {
  LOGIN: Symbol(),
  REGISTER: Symbol()
}
export default {
  data () {
    return {
      PAGE_TYPE,
      username: '',
      password: '',
      username1: '',
      password1: '',
      type: PAGE_TYPE.LOGIN,
      verify: false,
      fullPath: '/'
    }
  },
  components: {
    sHeader,
    Verify
  },
  created () {
    this.fullPath = this.$route.query.to
  },
  methods: {
    dealTriVer () {
      this.$refs.loginVerifyRef.$refs.instance.checkCode()
    },
    toggle (v) {
      this.verify = false
      this.type = v
    },
    async onSubmit (values) {
      this.dealTriVer()
      if (!this.verify) {
        this.$toast.fail('验证码未填或填写错误!')
        return
      }
      const loading = this.$toast.loading({
        message: this.type === PAGE_TYPE.LOGIN
          ? '登录中...' : '',
        forbidClick: true
      })
      if (this.type === PAGE_TYPE.LOGIN) {
        this.$store.dispatch('login', {
          'loginName': values.username,
          'passwordMd5': this.$md5(values.password)
        }).then(() => {
          this.$router.replace({
            path: this.fullPath
          })
        }).catch(() => {
          // show error message or do something
        }).finally(() => {
          loading.clear()
        })
      } else {
        register({
          'loginName': values.username1,
          'password': values.password1
        }).then(() => {
          this.$toast.success('注册成功')
          this.type = PAGE_TYPE.LOGIN
        }).catch(err => {
          // show error message or do something
        }).finally(() => {
          loading.clear()
        })
      }
    },
    success (obj) {
      this.verify = true
      // 回调之后，刷新验证码
      obj.refresh()
    },
    error (obj) {
      this.verify = false
      // 回调之后，刷新验证码
      obj.refresh()
    }
  },
}
</script>

<style lang="less">
  .login {
    .logo {
      width: 120px;
      height: 120px;
      display: block;
      margin: 80px auto 0px;
    }

    .login-body {
      padding: 0 20px;
    }

    .login {
      .link-register {
        font-size: 14px;
        margin-bottom: 20px;
        color: #1989fa;
        display: inline-block;
      }
    }

    .register {
      .link-login {
        font-size: 14px;
        margin-bottom: 20px;
        color: #1989fa;
        display: inline-block;
      }
    }

    .verify-bar-area {
      margin-top: 24px;

      .verify-left-bar {
        border-color: #1baeae;
      }

      .verify-move-block {
        background-color: #1baeae;
        color: #fff;
      }
    }

    .verify {
      > div {
        width: 100%;
      }

      display: flex;
      justify-content: center;

      .cerify-code-panel {
        margin-top: 16px;
      }

      .verify-code {
        width: 40% !important;
        float: left !important;
      }

      .verify-code-area {
        float: left !important;
        width: 54% !important;
        margin-left: 14px !important;

        .varify-input-code {
          width: 90px;
          height: 38px !important;
          border: 1px solid #e9e9e9;
          padding-left: 10px;
          font-size: 16px;
        }

        .verify-change-area {
          line-height: 44px;
        }
      }
    }
  }
</style>
