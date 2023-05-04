import router from '@/router'
import { useUserStore } from '@/stores'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { showNotify } from 'vant'

// 白名单
const whiteList = ['/login', '/register']

// 进度条配置
nProgress.configure({
  showSpinner: false
})
// 前置路由守卫
router.beforeEach((to, from, next) => {
  nProgress.start()
  // 如果有token则放行
  if (useUserStore().user?.token) {
    // 如果有token访问白名单则重定向到首页
    if (whiteList.includes(to.path)) {
      next({ path: '/home' })
    }
    next()
  }
  //否则跳转登录页面
  else {
    if (!whiteList.includes(to.path)) {
      showNotify('请先登录')
      next({ path: '/login', query: { returnUrl: to.fullPath } })
    }
    next()
  }
})
// 后置路由守卫
router.afterEach((to) => {
  document.title = `${to.meta.title || ''}-优医问诊`
  nProgress.done()
})
