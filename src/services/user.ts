import type {
  PatientList,
  patientConsultOrderListData,
  patientConsultOrderListQuery,
  patientInfo,
  userInfo
} from '@/types/user'
import { request } from '@/utils/request'

// 我的-获取个人用户信息
export function myUserAPI() {
  return request<userInfo>({
    method: 'GET',
    url: '/patient/myUser'
  })
}

// 家庭档案-患者信息
export function patientInfoAPI(id: string) {
  return request<patientInfo>({
    method: 'GET',
    url: `/patient/info/${id}`
  })
}

// 家庭档案-患者列表
export function patientListAPI() {
  return request<PatientList>({
    method: 'GET',
    url: `/patient/mylist`
  })
}

// 问诊-添加患者信息
export function addPatientAPI(data: patientInfo) {
  return request({
    method: 'POST',
    url: '/patient/add',
    data
  })
}

//问诊-编辑患者信息
export function editPatientAPI(data: patientInfo) {
  return request({
    method: 'PUT',
    url: '/patient/update',
    data
  })
}

// 问诊-删除患者信息
export function delPatientAPI(id: string) {
  return request({
    method: 'DELETE',
    url: `/patient/del/${id}`
  })
}

// 查询患者详情
export const getPatientDetailAPI = (id: string) =>
  request<patientInfo>({
    method: 'GET',
    url: `/patient/info/${id}`
  })


// 查询问诊记录
export function getPatientConsultOrderListAPI(params: patientConsultOrderListQuery) {
  return request<patientConsultOrderListData>({
    method: 'GET',
    url: '/patient/consult/order/list',
    params
  })
}
