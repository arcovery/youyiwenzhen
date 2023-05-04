<template>
  <van-nav-bar
    :title="title"
    :right-text="rightText"
    left-arrow
    @click-left="onClickLeft"
    fixed
  />
</template>

<script setup lang="ts" name="navbar">
import { useRouter } from 'vue-router'
const props = defineProps<{
  title?: string
  rightText?: string
  back?: () => void
  submit?: () => void
}>()

const router = useRouter()

const onClickLeft = () => {
  if (props.back) {
    return props.back()
  }
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}

</script>

<style lang="scss" scoped>
:deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
