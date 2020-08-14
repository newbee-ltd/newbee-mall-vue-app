/**
 * 严肃声明：
 * 开源版本请务必保留此注释头信息，若删除我方将保留所有法律责任追究！
 * 本系统已申请软件著作权，受国家版权局知识产权以及国家计算机软件著作权保护！
 * 可正常分享和学习源码，不得用于违法犯罪活动，违者必究！
 * Copyright (c) 2020 陈尼克 all rights reserved.
 * 版权所有，侵权必究！
 */

import { getCart } from '@/service/cart'
import { login, getUserInfo, logout } from '@/service/user'
import { setLocal } from '@/common/js/utils'

export default {
  updateCart ({ commit }) {
    getCart().then(({ data }) => {
      commit('addCart', {
        count: data.length || 0
      })
    })
  },
  getUserInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(({ data }) => {
        commit('SET_USER', data)
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  login ({ commit, dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      login(params).then(({ data }) => {
        setLocal('token', data)
        console.log(data)
        commit('SET_TOKEN', data)
        dispatch('getUserInfo')
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  logout ({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        setLocal('token', '')
        commit('SET_TOKEN', '')
        commit('SET_USER', {})
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
}
