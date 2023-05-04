<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <KnowledgeCard v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import { getConsultListAPI } from '@/services/consult'
import type { KnowledgeType, Knowledge } from '@/types/consult'

const props = defineProps<{ type: KnowledgeType }>()
// 列表组件
const loading = ref<boolean>(false)

const finished = ref<boolean>(false)
const current = ref<number>(1)
const pageSize = ref<number>(10)
const list = ref<Knowledge[]>([])
const onLoad = async () => {
  const res = await getConsultListAPI({
    current: current.value,
    pageSize: pageSize.value,
    type: props.type
  })
  list.value.push(...res.data.rows)

  // 数据全部加载完成
  if (current.value >= res.data.pageTotal) {
    finished.value = true
  } else {
    current.value++
  }
  // 加载状态结束
  loading.value = false
}
</script>

<style lang="scss" scoped>
.knowledgeList {
  padding: 0 15px;
}
</style>
