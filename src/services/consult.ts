import type { PaymentMethod } from '@/enums'
import type {
  PartialConsult,
  ConsultOrderPreData,
  ConsultOrderPreParams,
  DoctorPage,
  FollowType,
  KnowledgePage,
  KnowledgeParams,
  TopDep,
  ConsultOrderItem
} from '@/types/consult'
import { request } from '@/utils/request'

//首页-查询推荐/减脂/饮食健康/关注页面--百科文章列表
export function getConsultListAPI(params: KnowledgeParams) {
  return request<KnowledgePage>({
    method: 'GET',
    url: '/patient/home/knowledge',
    params
  })
}

// 首页 - 关注的医生列表
export function getDoctorListAPI(params: KnowledgeParams) {
  return request<DoctorPage>({
    method: 'GET',
    url: '/home/page/doc',
    params
  })
}

// 首页 - 关注-关注医生操作
export function followDoctorAPI({ id, type = 'doc' }: { id: string; type?: FollowType }) {
  return request({
    method: 'POST',
    url: 'like',
    data: {
      id,
      type
    }
  })
}

// 找医生--查询所有科室-层级
export function getDeptListAPI() {
  return request<TopDep[]>({
    method: 'GET',
    url: '/dep/all'
  })
}

// 拉取预支付订单信息
export function getConsultOrderPre(params: ConsultOrderPreParams) {
  return request<ConsultOrderPreData>({
    method: 'GET',
    url: '/patient/consult/order/pre',
    params
  })
}

// 生成订单
export function createConsultOrder(data: PartialConsult) {
  return request<{ id: string }>({
    method: 'POST',
    url: '/patient/consult/order',
    data
  })
}

// 获取支付地址  0 是微信  1 支付宝
export function getConsultOrderPayUrl(data: {
  paymentMethod: PaymentMethod
  orderId: string
  payCallback: string
}) {
  return request<{
    payUrl: string
  }>({
    method: 'POST',
    url: '/patient/consult/pay',
    data
  })
}

// 查询订单详情信息
export function getConsultOrderDetail(orderId: string) {
  return request<ConsultOrderItem>({
    url: '/patient/consult/order/detail',
    method: 'GET',
    params: { orderId }
  })
}
