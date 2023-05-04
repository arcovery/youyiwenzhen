<script setup lang="ts">
import { getPatientConsultOrderListAPI } from '@/services/user'
import ConsultItem from './consult-item.vue'
import type { ConsultType } from '@/enums'
import { ref } from 'vue'
import type { patientConsultOrderListDataRow } from '@/types/user'
const props = defineProps<{
  type: ConsultType
}>()
// 获取列表数据
const loading = ref<boolean>(false)
const finished = ref<boolean>(false)
const list = ref<patientConsultOrderListDataRow[]>([])
let currentPage = 1
const onLoad = async () => {
  const res = await getPatientConsultOrderListAPI({
    current: currentPage,
    pageSize: 10,
    type: props.type
  })
  list.value.push(...res.data.rows)
  currentPage++
  loading.value = false
  if (res.data.pageTotal < currentPage) {
    finished.value = true
  }
}

// 删除订单
const deleteOrder = (id: string) => {
  list.value = list.value.filter(item => item.id !== id)
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <consult-item @on-delete="deleteOrder" v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
