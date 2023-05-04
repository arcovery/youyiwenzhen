<script setup lang="ts">
import { bindMobile, loginByQQ, sendMobileCode } from '@/services/user'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const openId = ref<any>('')
const isNeedBind = ref(false)

import { codeRules, mobileRules } from '@/utils/rules'

const mobile = ref('')
const code = ref('')
// 登录成功
const store = useUserStore()
const router = useRouter()
const loginSuccess = (res: { data: user }) => {
  store.setUser(res.data)
  router.replace('/user')
  showSuccessToast('登录成功')
}
const bind = async () => {
  // 校验通过
  const res = await bindMobile({
    mobile: mobile.value,
    code: code.value,
    openId: openId.value
  })
  loginSuccess(res)
}
onMounted(async () => {
  if (route.query.type === 'wx') {
    const res = await axios({
      url: `/wechat/connect.php?act=callback&appid=1599&appkey=953e44a9c89f435e1b3624fe89cf5c95&type=wx&code=${route.query.code}`
    })
    if (res.data.code === -1) {
      showFailToast(res.data.msg)
      router.push('/login')
      return
    }
    console.log(res)
    openId.value = res.data.social_uid
    loginByQQ({
      openId: res.data.social_uid,
      source: 'wx',
      nickname: res.data.nickname,
      avatar: res.data.faceimg
    })
      .then((res) => {
        loginSuccess(res)
        // 登录成功
      })
      .catch(() => {
        // 登录失败
        isNeedBind.value = true
      })
  }
})

// 发送验证码
import { useUserStore } from '@/stores'
import type { user } from '@/types/user'
import { showSuccessToast, type FormInstance, showFailToast } from 'vant'
import { onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const form = ref<FormInstance>()
const time = ref(0)
let timeId: number
const send = async () => {
  if (time.value > 0) return
  await form.value?.validate('mobile')
  const res = await sendMobileCode(mobile.value, 'bindMobile')
  showSuccessToast('发送成功')
  code.value = res.data.code
  time.value = 60
  // 倒计时
  clearInterval(timeId)
  timeId = window.setInterval(() => {
    time.value--
    if (time.value <= 0) window.clearInterval(timeId)
  }, 1000)
}
onUnmounted(() => {
  window.clearInterval(timeId)
})
</script>

<template>
  <div class="login-page" v-if="isNeedBind">
    <nav-bar></nav-bar>
    <div class="login-head">
      <h3>手机绑定</h3>
    </div>
    <van-form autocomplete="off" ref="form" @submit="bind">
      <van-field
        name="mobile"
        v-model="mobile"
        :rules="mobileRules"
        placeholder="请输入手机号"
      ></van-field>
      <van-field name="code" v-model="code" :rules="codeRules" placeholder="请输入验证码">
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="send">
            {{ time > 0 ? `${time}s后再次发送` : '发送验证码' }}
          </span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit"> 立即绑定 </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .svg-icon {
    margin-right: 10px;
  }
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
