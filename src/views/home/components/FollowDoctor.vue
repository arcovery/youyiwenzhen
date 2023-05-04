<script setup lang="ts">
import { getDoctorListAPI } from '@/services/consult'
import DoctorCard from './DoctorCard.vue'
import { useWindowSize } from '@vueuse/core'
import { ref } from 'vue'
import type { Doctor } from '@/types/consult'

const { width } = useWindowSize()
const List = ref<Doctor[]>([])
const getList = async () => {
  const res = await getDoctorListAPI({
    current: 1,
    pageSize: 10
  })
  List.value = res.data.rows
  console.log(res)
}
getList()
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <van-swipe
        class="my-swipe"
        :width="(150 / 375) * width"
        :show-indicators="false"
        :loop="false"
      >
        <van-swipe-item v-for="item in List" :key="item.id">
          <DoctorCard :item="item" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
