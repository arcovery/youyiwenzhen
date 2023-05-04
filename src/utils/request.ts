import router from '@/router'
import { useUserStore } from '@/stores'
import axios, { type Method } from 'axios'
import { showNotify } from 'vant'

const baseURL = import.meta.env.VITE_API_URL
// 创建示例对象
const instance = axios.create({
  // 基地址
  baseURL,
  // baseURL: import.meta.env.VITE_API_URL,
  // 请求超时时间
  timeout: 5000,
  // 是否携带cookie
  withCredentials: true
})

// 除了登录页面外，其他接口需要传token。
// 在Header中按照key为Authorization，值为Bearer {{token}} 的形式
// 在需要token的接口，没有传入token，传入token错误，或者token过期，返回的状态码是401 ，code不是10000
// 其他情况，接口调通返回的状态码都是200，接口中code，正常返回结果接口，10000，未能返回结果，code值不是10000

// 请求拦截
instance.interceptors.request.use((config) => {
  // 判断是否存在token
  if (useUserStore().user?.token && config.headers) {
    config.headers.Authorization = `Bearer ${useUserStore().user?.token}`
  }
  return config
})

// 响应拦截
instance.interceptors.response.use(
  // 成功回调
  (res) => {
    if (res.data.code != 10000) {
      showNotify(res.data.message || '系统错误')
      return Promise.reject(res.data)
    }
    // else {
    //   showNotify({ type: 'success', message: res.data.message })
    // }
    // 业务逻辑成功，返回响应数据，作为axios成功的结果
    return res.data
  },
  // 失败回调
  async (error) => {
    const config = error.config
    // __retryCount用来记录当前是第几次发送请求
    config.__retryCount = config.__retryCount || 0
    if (error.response?.status === 401) {
      // 清除token
      useUserStore().clearUser()
      showNotify('登录超时,请重新登录')
      router.push({ path: '/login', query: { returnUrl: router.currentRoute.value.fullPath } })
    } else {
      showNotify(`网络错误正在重试(${config.__retryCount})` || '系统错误')
    }
    console.log(error)

    //超时处理 error.config是一个对象，包含上方create中设置的三个参数
    if (config?.retry) return Promise.reject(error)

    //如果有响应内容，就直接返回错误信息，不再发送请求
    if (error?.response?.data) {
      return Promise.reject({ type: 'error', msg: error.response.data })
    }
    if (error.code === 'ERR_NETWORK') {
      //message为"Network Error"代表断网了
      showNotify('网络连接已断开，请检查网络')
      return Promise.reject({ type: 'warning', msg: '网络连接已断开，请检查网络' })
    }
    // 如果当前发送的请求大于等于设置好的请求次数时，不再发送请求，返回最终的错误信息
    if (config.__retryCount >= 3) {
      if (error.code === 'ECONNABORTED') {
        showNotify('请求超时，请检查网络')
        //网太慢了，5秒内没有接收到数据，这里的5000ms对应上方timeout设置的值
        return Promise.reject({ type: 'warning', msg: '请求超时，请检查网络' })
      }
      //除以上两种以外的所有错误，包括接口报错 400 500 之类的
      showNotify('出现错误，请稍后再试')
      return Promise.reject({ type: 'error', msg: '出现错误，请稍后再试' })
    }

    // 记录请求次数+1
    config.__retryCount += 1

    // 设置请求间隔 在发送下一次请求之前停留一段时间，时间为上方设置好的请求间隔时间
    const backOff = new Promise(function (resolve: any) {
      setTimeout(function () {
        resolve()
      }, 1000)
    })

    // 再次发送请求
    await backOff
    return await instance(config)

    // return Promise.reject(error)
  }
)

type Data<T> = {
  code: number
  message: string
  data: T
}
// 这个需要替换axios.request默认的响应成功后的结果类型
// 之前是：传 { name: string } 然后res是   res = { data: { name: string } }
// 但现在：在响应拦截器中返回了 res.data  也就是将来响应成功后的结果，和上面的类型一致吗？
// 所以要：request<数据类型，数据类型>() 这样才指定了 res.data 的类型
// 但是呢：后台返回的数据结构相同，所以可以抽取相同的类型

// 4. 请求工具函数
const request = <T>(data: { method: Method; url: string; data?: object; params?: object }) => {
  return instance.request<T, Data<T>>(data)
}

export { baseURL, instance, request }
