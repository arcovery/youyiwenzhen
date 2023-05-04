<template>
  <RouterView></RouterView>
  <van-tabbar route>
    <van-tabbar-item to="/home" name="home">
      <template #icon="{ active }">
        <SvgIcon :name="active ? 'home-index-active' : 'home-index-default'"></SvgIcon>
      </template>
      首页</van-tabbar-item
    >
    <van-tabbar-item to="/article" name="article">
      <template #icon="{ active }">
        <SvgIcon :name="active ? 'home-article-active' : 'home-article-default'"></SvgIcon>
      </template>
      健康百科</van-tabbar-item
    >
    <van-tabbar-item to="/notify" name="notify">
      <template #icon="{ active }">
        <SvgIcon :name="active ? 'home-notice-active' : 'home-notice-default'"></SvgIcon>
      </template>
      消息中心</van-tabbar-item
    >
    <van-tabbar-item to="/user" name="user">
      <template #icon="{ active }">
        <SvgIcon :name="active ? 'home-mine-active' : 'home-mine-default'"></SvgIcon>
      </template>
      我的</van-tabbar-item
    >
  </van-tabbar>
</template>

<script setup lang="ts" name="layout">
// import { watch } from 'vue'
// import { ref } from 'vue'
// import { useRoute } from 'vue-router'

// const active = ref()
// const route=useRoute()
// watch(() => route.name, () => {
// active.value=route.name

// }, {
//   immediate: true
// })
</script>

<style scoped></style>
