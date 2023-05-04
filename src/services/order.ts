import type { AddressItem, Logistics, OrderDetail, OrderPre } from '@/types/order'
import { request } from '@/utils/request'

// 查看处方
export function getPrescriptionPic(id: string) {
  return request<{ url: string }>({
    method: 'GET',
    url: '/patient/consult/prescription/' + id
  })
}

// 取消订单
export function cancelOrderAPI(id: string) {
  return request({
    method: 'PUT',
    url: '/patient/order/cancel/' + id
  })
}

// 删除订单
export function deleteOrderAPI(id: string) {
  return request({
    method: 'DELETE',
    url: '/patient/order/' + id
  })
}

// 查询药品订单预支付信息
export function getMedicalOrderPre(params: { prescriptionId: string }) {
  return request<OrderPre>({
    url: '/patient/medicine/order/pre',
    method: 'GET',
    params
  })
}

// 获取收货地址列表
export function getAddressList() {
  return request<AddressItem[]>({
    url: '/patient/order/address',
    method: 'GET'
  })
}

// 创建药品订单
export const createMedicalOrder = (data: { id: string; addressId: string; couponId?: string }) =>
  request<{ id: string }>({
    url: '/patient/medicine/order',
    method: 'POST',
    data
  })
// 获取药品订单详情
export const getMedicalOrderDetail = (id: string) =>
  request<OrderDetail>({
    url: `/patient/medicine/order/detail/${id}`,
    method: 'GET'
  })

// 获取药品订单物流信息
export const getMedicalOrderLogistics = (id: string) =>
  request<Logistics>({
    method: 'GET',
    url: `/patient/order/${id}/logistics`,
  })
