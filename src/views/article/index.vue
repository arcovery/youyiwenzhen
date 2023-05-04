<template>
  <div @click="Router.push('/login')">article</div>
</template>

<script setup lang="ts">
import  { useRouter } from 'vue-router'
const Router = useRouter()
</script>

<style scoped></style>
