<script setup lang="ts">
import { loginPasswordAPI, loginCodeAPI, getCodeAPI } from '@/services/public'
import { useUserStore } from '@/stores'
import { showDialog, showNotify, type FormInstance } from 'vant'
import { ref } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { useRouter } from 'vue-router'
import { onUnmounted } from 'vue'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
const router = useRouter()
const route=useRoute()
const store = useUserStore()
// 定义表单对象
const mobile = ref<string>('13230000001')
const password = ref<string>('abc12345')
const form = ref<FormInstance>()
//同意协议
const agree = ref(false)

// 点击显示密码
const passwordShow = ref<boolean>(false)

// 登录事件
const onSubmit = async () => {
  if (!agree.value) {
    return showDialog({
      title: '温馨提示',
      message: '我已阅读用户协议及隐私条款',
      theme: 'round-button'
    }).then(() => {
      agree.value = true
    })
  }

  const res = isPass.value
    ? await loginPasswordAPI({ mobile: mobile.value, password: password.value })
    : await loginCodeAPI({ mobile: mobile.value, code: code!.value })

  if (res.code === 10000) {
    showNotify({ type: 'success', message: '登录成功' })
    store.setUser(res.data)
    router.push(route.query.returnUrl as string || '/')
  }
}

// 短信密码切换
const isPass = ref<boolean>(true)
const code = ref<string>('')
const time = ref<number>(0)
let timeId: number
// 显示发送验证码
const showSendCode = ref(false)
watch(
  mobile,
  async () => {
    try {
      await form.value?.validate('mobile')
      showSendCode.value = true
    } catch (error) {
      showSendCode.value = false
    }
  },
  { immediate: true }
)
// 发送验证码
const sendCode = async () => {
  if (time.value > 0 && showSendCode.value) return
  time.value = 60
  // 再次发送短信倒计时
  window.clearInterval(timeId)
  timeId = window.setInterval(() => {
    time.value--
    if (time.value <= 0) {
      window.clearInterval(timeId)
    }
  }, 1000)
  const res = await getCodeAPI({ mobile: mobile.value, type: 'login' })
  if (res.code === 10000) {
    code.value = res.data.code
    showNotify({ type: 'success', message: '验证码已发送' })
  }
}

//
onUnmounted(() => {
  window.clearInterval(timeId)
})
</script>

<template>
  <div class="login-page">
    <NavBar right-text="注册" @click-right="$router.push('/register')"></NavBar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信登录' }}</h3>
      <a href="javascript:;">
        <span @click="isPass = !isPass">{{ isPass ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form ref="form" autocomplete="off" @submit="onSubmit">
      <van-field
        placeholder="请输入手机号"
        name="mobile"
        :rules="mobileRules"
        v-model="mobile"
        type="tel"
      ></van-field>
      <van-field
        v-if="isPass"
        placeholder="请输入密码"
        :rules="passwordRules"
        v-model="password"
        :type="passwordShow ? 'text' : 'password'"
        @click-right-icon="passwordShow = !passwordShow"
        :right-icon="passwordShow ? 'eye-o' : 'closed-eye'"
      ></van-field>
      <van-field :rules="codeRules" v-model="code" v-else placeholder="短信验证码">
        <template #button>
          <span :class="{ active: time > 0 || !showSendCode }" class="btn-send" @click="sendCode">{{
            time > 0 ? `${time}s后再次发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/logo.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
    &-page {
      padding-top: 46px;
    }
  &-head {
    display: flex;
    padding: 30px 30px 50px;
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
