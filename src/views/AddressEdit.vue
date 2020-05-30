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
  <div class="address-edit-box">
    <s-header :name="`${type == 'add' ? '新增地址' : '编辑地址'}`"></s-header>
    <van-address-edit
      class="edit"
      :area-list="areaList"
      :address-info="addressInfo"
      :show-delete="type == 'edit'"
      show-set-default
      show-search-result
      :search-result="searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import { Toast } from 'vant'
import sHeader from '@/components/SimpleHeader'
import { addAddress, EditAddress, DeleteAddress, getAddressDetail } from '../service/address'
import { tdist } from '@/common/js/utils'
export default {
  components: {
    sHeader
  },
  data() {
    return {
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {}
      },
      searchResult: [],
      type: 'add',
      addressId: '',
      addressInfo: {},
      from: ''
    }
  },
  async mounted() {
    // 省市区列表构造
    let _province_list = {}
    let _city_list = {}
    let _county_list = {}
    tdist.getLev1().forEach(p => {
      _province_list[p.id] = p.text
      tdist.getLev2(p.id).forEach(c => {
        _city_list[c.id] = c.text
        tdist.getLev3(c.id).forEach(q => _county_list[q.id] = q.text)
      })
    })
    this.areaList.province_list = _province_list
    this.areaList.city_list = _city_list
    this.areaList.county_list = _county_list

    const { addressId, type, from } = this.$route.query
    this.addressId = addressId
    this.type = type
    this.from = from || ''
    if (type == 'edit') {
      const { data: addressDetail } = await getAddressDetail(addressId)
      let _areaCode = ''
      const province = tdist.getLev1()
      Object.entries(this.areaList.county_list).forEach(([id, text]) => {
        // 先找出当前对应的区
        if (text == addressDetail.regionName) {
          // 找到区对应的几个省份
          const provinceIndex = province.findIndex(item => item.id.substr(0, 2) == id.substr(0, 2))
          // 找到区对应的几个市区
          const cityItem = Object.entries(this.areaList.city_list).filter(([cityId, cityName]) => cityId.substr(0, 4) == id.substr(0, 4))[0]
          // 对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
          if (province[provinceIndex].text == addressDetail.provinceName && cityItem[1] == addressDetail.cityName) {
            _areaCode = id
          }
        }
      })
      this.addressInfo = {
        id: addressDetail.addressId,
        name: addressDetail.userName,
        tel: addressDetail.userPhone,
        province: addressDetail.provinceName,
        city: addressDetail.cityName,
        county: addressDetail.regionName,
        addressDetail: addressDetail.detailAddress,
        areaCode: _areaCode,
        isDefault: !!addressDetail.defaultFlag
      }
    }
  },
  methods: {
    async onSave(content) {
      const params = {
        userName: content.name,
        userPhone: content.tel,
        provinceName: content.province,
        cityName: content.city,
        regionName: content.county,
        detailAddress: content.addressDetail,
        defaultFlag: content.isDefault ? 1 : 0,
      }
      if (this.type == 'edit') {
        params['addressId'] = this.addressId
      }
      const { message } = await this.type == 'add' ? addAddress(params) : EditAddress(params)
      Toast('保存成功')
      setTimeout(() => {
        this.$router.push({ path: `address?from=${this.from}` })
      }, 1000)

    },
    async onDelete() {
      const { data } = await DeleteAddress(this.addressId)
      Toast('删除成功')
      setTimeout(() => {
        this.$router.push({ path: 'address' })
      }, 1000)
    }
  }
}
</script>

<style lang="less">
  @import '../common/style/mixin';
  .address-edit-box {
    margin-top: 44px;
    .van-address-edit {
      .van-button--danger {
        background: @primary;
        border-color: @primary;
      }
      .van-switch--on {
        background: @primary;
      }
    }
  }
</style>
