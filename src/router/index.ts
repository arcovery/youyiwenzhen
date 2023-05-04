import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/layout',
      name: 'layout',
      component: () => import('@/views/layout/index.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/home/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/article',
          name: 'article',
          component: () => import('@/views/article/index.vue'),
          meta: { title: '健康百科' }
        },
        {
          path: '/consult',
          name: 'consult',
          component: () => import('@/views/consult/index.vue'),
          meta: { title: '咨询' }
        },

        {
          path: '/notify',
          name: 'notify',
          component: () => import('@/views/notify/index.vue'),
          meta: { title: '消息提醒' }
        },

        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/user/index.vue'),
          meta: { title: '个人中心' }
        }
      ]
    },
    {
      path: '/consult/fast',
      name: 'fast',
      component: () => import('@/views/consult/components/fast.vue'),
      meta: { title: '极速问诊' }
    },
    {
      path: '/consult/dep',
      name: 'dep',
      component: () => import('@/views/consult/components/dep.vue'),
      meta: { title: '设置科室' }
    },
    {
      path: '/consult/illness',
      name: 'illness',
      component: () => import('@/views/consult/components/illness.vue'),
      meta: { title: '病情描述' }
    },
    {
      path: '/consult/pay',
      name: 'pay',
      component: () => import('@/views/consult/components/pay.vue'),
      meta: { title: '支付' }
    },
    {
      path: '/user/patient',
      name: 'patient',
      component: () => import('@/views/user/components/patient.vue'),
      meta: { title: '家庭档案' }
    },
    {
      path: '/room',
      name: 'room',
      component: () => import('@/views/room/index.vue'),
      meta: { title: '咨询室' },
      beforeEnter(to) {
        if (to.query.payResult === 'false') return '/user/consult'
      }
    },
    {
      path: '/user/consult',
      component: () => import('@/views/user/components/consult-page.vue'),
      meta: { title: '问诊记录' }
    },
    {
      path: '/order/pay',
      component: () => import('@/views/order/order-pay.vue'),
      meta: { title: '药品支付' }
    },
    {
      path: '/order/pay/result',
      component: () => import('@/views/order/OrderPayResult.vue'),
      meta: { title: '药品支付结果' }
    },
    {
      path: '/order/:id',
      component: () => import('@/views/order/OrderDetail.vue'),
      meta: { title: '药品订单详情' }
    },
    {
      path: '/order/logistics/:id',
      component: () => import('@/views/order/OrderLogistics.vue'),
      meta: { title: '物流详情' }
    },
    {
      path: '/login/callback',
      name: 'callback',
      component: () => import('@/views/login/components/callback.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/404/index.vue')
    },
    { path: '/', redirect: '/home' },
    // 404 page must be placed at the end !!!
    { path: '/:catchAll(.*)', redirect: '/404' }
  ]
})

export default router
