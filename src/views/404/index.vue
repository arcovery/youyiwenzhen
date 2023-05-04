<template>
  <div>404</div>
  <a
    class="icon"
    href="https://graph.qq.com/oauth2.0/authorize?client_id=102015968&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fconsult-patients.itheima.net%2Flogin%2Fcallback"
  >
    <img src="@/assets/qq.svg" alt="" />
  </a>

  <div class="icon" id="qq"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // 组件渲染完毕，使用QC生成QQ登录按钮，目的得到跳转链接
  window.QC.Login({
    btnId: 'qq'
  })
})
</script>

<style scoped></style>
