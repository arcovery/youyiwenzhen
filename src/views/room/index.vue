<template>
  <div class="room-page">
    <nav-bar title="医生问诊室" />
    <room-status :status="consult?.status" :countdown="consult?.countdown" />
    <room-action
      @send-text="sendText"
      @send-image="sendImage"
      :disabled="consult?.status !== OrderType.ConsultChat"
    />
    <van-pull-refresh v-model="loading" @refresh="refresh">
      <RoomMessage :list="list" />
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import RoomAction from '@/views/room/components/RoomAction.vue'
import RoomMessage from '@/views/room/components/RoomMessage.vue'
import RoomStatus from '@/views/room/components/RoomStatus.vue'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { onMounted, onUnmounted } from 'vue'

import { useUserStore } from '@/stores'
import { baseURL } from '@/utils/request'
import { useRoute } from 'vue-router'

import { MsgType, OrderType } from '@/enums'
import { getConsultOrderDetail } from '@/services/consult'
import type { ConsultOrderItem, Image } from '@/types/consult'
import type { Message, TimeMessages } from '@/types/room'
import { showFailToast } from 'vant'
import { nextTick, ref } from 'vue'
const consult = ref<ConsultOrderItem>()

onMounted(async () => {
  // 查询订单详情信息
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
})

let socket: Socket
const list = ref<Message[]>([])
const store = useUserStore()
const route = useRoute()
// 组件卸载 关闭socket
onUnmounted(() => {
  socket.close()
})

// 组件挂载 开启socket
onMounted(() => {
  // 初始化socket
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${useUserStore().user?.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })

  // 监听socket
  socket.on('connect', () => {
    console.log('socket连接成功')
  })
  // 断开连接
  socket.on('disconnect', () => {
    console.log('断开连接')
  })
  // 错误消息
  socket.on('error', () => {
    console.log('错误消息')
  })

  // 首次打开
  let firstOpen = true
  // 聊天记录
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    // 准备转换常规消息列表
    const arr: Message[] = []
    data.forEach((item) => {
      arr.push({
        msgType: MsgType.Notify,
        msg: { content: item.createTime },
        createTime: item.createTime,
        id: item.createTime
      })
      arr.push(...item.items)
    })
    if (data.length === 0) return showFailToast('暂无聊天记录')
    time.value = data[0].createTime
    // 追加到聊天消息列表
    list.value.unshift(...arr)
    if (firstOpen) {
      firstOpen = false
      nextTick(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        })
      })
    }
  })
  // 订单状态
  socket.on('statusChange', async () => {
    const res = await getConsultOrderDetail(route.query.orderId as string)
    consult.value = res.data
  })
  // 接收消息
  socket.on('receiveChatMsg', async (event) => {
    list.value.push(event)
    await nextTick()

    // 接收消息,滚动底部
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  })
})

//  发送文字消息
const sendText = (text: string) => {
  // 发送信息需要  发送人  收消息人  消息类型  消息内容
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text }
  })
}

// 发送图片
const sendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}

//  刷新数据
const loading = ref<boolean>(false)
const time = ref()
const refresh = () => {
  // 触发下拉
  socket.emit('getChatMsgList', 20, time.value, route.query.orderId)
  loading.value = false
}
</script>
<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
