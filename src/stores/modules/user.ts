import type { user } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  // 命名空间
  'userInfo',
  () => {
    // 用户信息
    const user = ref<user>()

    // 设置用户状态
    const setUser = (u: user) => {
      user.value = u
    }

    // 清空用户信息
    const clearUser = () => {
      user.value = undefined
    }
    return {
      user,
      setUser,
      clearUser
    }
  },
  {
    //持久化存储配置
    persist: true
  }
)
