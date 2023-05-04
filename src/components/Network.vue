<script lang="ts" setup></script>

<template>
  <div class="icon">
    <SvgIcon name="network-top" class="top"></SvgIcon>
    <SvgIcon name="network-dot" class="dot"></SvgIcon>
    <p style="color: #ccc;">网络无连接，请检查网络设置</p>
  <VanButton plain type="success" >点击刷新</VanButton>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  display: flex;
  justify-items: center;
  flex-direction: column;
  align-items: center;
}
.top {
  width: 6em;
  height: 6em;
}
.dot {
  width: 1.5em;
  height: 1.5em;
}
.van-button{
margin-top: 24px;
}
</style>
