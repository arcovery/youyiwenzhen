<script setup lang="ts">
import { getDeptListAPI } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { TopDep } from '@/types/consult'
import { computed } from 'vue'
import { onMounted, ref } from 'vue'

const list = ref<TopDep[]>([])
const active = ref(0)

// 组件挂载获取数据
onMounted(async () => {
  const res = await getDeptListAPI()
  list.value = res.data
})

// 二级科室
const subDepList = computed(() => {
  return list.value[active.value]?.child
})

// 跳转时记录科室到问诊记录
const store = useConsultStore()
</script>

<template>
  <div class="consult-dep-page">
    <NavBar title="选择科室" />
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item v-for="items in list" :key="items.id" :title="items.name" />
      </van-sidebar>
      <div class="sub-dep">
        <router-link
          to="/consult/illness"
          @click="store.setDep(items.id)"
          v-for="items in subDepList"
          :key="items.id"
          >{{ items.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  //   padding-top: 46px;
  .wrapper {
    height: calc(100vh - 46px);
    overflow: hidden;
    display: flex;
    .sub-dep {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      > a {
        display: block;
        padding: 14px 30px;
        color: var(--cp-dark);
      }
    }
  }
}
</style>
