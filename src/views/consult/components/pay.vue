<script setup lang="ts">
import { createConsultOrder, getConsultOrderPre, getConsultOrderPayUrl } from '@/services/consult'
import { getPatientDetailAPI } from '@/services/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData, PartialConsult } from '@/types/consult'
import type { patientInfo } from '@/types/user'
import { closeToast, showConfirmDialog, showDialog, showLoadingToast, showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
const store = useConsultStore()

const payInfo = ref<ConsultOrderPreData>()
const loadData = async () => {
  const res = await getConsultOrderPre({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  })
  payInfo.value = res.data
  // 设置默认优惠券
  store.setCoupon(payInfo.value.couponId)
}

const patient = ref<patientInfo>()
const loadPatient = async () => {
  if (!store.consult.patientId) return
  const res = await getPatientDetailAPI(store.consult.patientId)
  patient.value = res.data
}

// 组件挂载初始化数据
type Key = keyof PartialConsult
onMounted(() => {
  const validKeys: Key[] = [
    'type',
    'illnessType',
    'depId',
    'illnessDesc',
    'illnessTime',
    'consultFlag',
    'patientId'
  ]
  const valid = validKeys.every((key) => store.consult[key] !== undefined)
  if (!valid) {
    return showDialog({
      title: '温馨提示',
      message: '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付！',
      closeOnPopstate: false
    }).then(() => {
      router.push('/')
    })
  }

  loadData()
  loadPatient()
})

// 提交订单
const agree = ref<boolean>(false)
const loading = ref<boolean>(false)
const show = ref<boolean>(false)
const paymentMethod = ref<0 | 1>()
const ordId = ref('')
const submit = async () => {
  if (!agree.value) return showToast('请勾选我已同意支付协议')
  loading.value = true
  const res = await createConsultOrder(store.consult)
  ordId.value = res.data.id
  show.value = true
  loading.value = false
  // store.clear()
}

// 生成订单后不可离开
onBeforeRouteLeave(() => {
  if (ordId.value) return false
})

// 生辰订单后不可关闭支付抽屉
const router = useRouter()
const onClose = async () => {
  try {
    await showConfirmDialog({
      title: '关闭支付',
      message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
      cancelButtonText: '仍要关闭',
      confirmButtonText: '继续支付'
    })
    return false
  } catch {
    ordId.value = ''
    router.push('/user/consult')
    return true
  }
}

// 跳转支付
const pay = async () => {
  if (paymentMethod.value === undefined) return showToast('请选择支付方式')
  showLoadingToast({ message: '跳转支付', duration: 0 })
  let res
  try {
    res = await getConsultOrderPayUrl({
      orderId: ordId.value,
      paymentMethod: paymentMethod.value,
      payCallback: 'http://localhost:5173/room'
    })
    window.location.href = res.data.payUrl
  } catch (err) {
    closeToast()
  }
}
</script>

<template>
  <div class="consult-pay-page" v-if="payInfo && patient">
    <nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell title="实付款" :value="`¥${payInfo.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient.name} | ${patient.genderValue} | ${patient.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <van-submit-bar
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      @click="submit"
      :loading="loading"
    />
  </div>
  <van-action-sheet
    v-model:show="show"
    title="选择支付方式"
    :closeable="false"
    :before-close="onClose"
  >
    <div class="pay-type">
      <p class="amount">￥{{ payInfo?.actualPayment }}</p>
      <van-cell-group>
        <van-cell title="微信支付" @click="paymentMethod = 0">
          <template #icon><svg-icon name="consult-wechat" /></template>
          <template #extra><van-checkbox :checked="paymentMethod == 0" /></template>
        </van-cell>
        <van-cell title="支付宝支付" @click="paymentMethod = 1">
          <template #icon><svg-icon name="consult-alipay" /></template>
          <template #extra><van-checkbox :checked="paymentMethod == 1" /></template>
        </van-cell>
      </van-cell-group>
      <div class="btn">
        <van-button
          type="primary"
          :close-on-popstate="false"
          @click="pay"
          :loading="loading"
          round
          block
          >立即支付</van-button
        >
      </div>
    </div>
  </van-action-sheet>
</template>
<style lang="scss" scoped>
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .svg-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
