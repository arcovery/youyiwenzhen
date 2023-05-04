import type { UploadFile } from '@/types/consult'
import type { CodeType } from './../types/user.d'
import type { user } from '@/types/user'
import { request } from '@/utils/request'

// 登录--密码登录
export function loginPasswordAPI(data: { password: string; mobile: string }) {
  return request<user>({
    method: 'POST',
    url: '/login/password',
    data
  })
}

// 登录--验证码登录
export function loginCodeAPI(data: { mobile: string; code: string }) {
  return request<user>({
    method: 'POST',
    url: '/login',
    data
  })
}

// 登录--获取验证码
export function getCodeAPI(params: { mobile: string; type: CodeType }) {
  return request<{ code: string }>({
    method: 'GET',
    url: '/code',
    params
  })
}
// 上传文件、图片
export function uploadFileAPI(file: File) {
  const fd = new FormData()
  fd.append('file', file)
  return request<UploadFile>({
    method: 'POST',
    url: '/upload',
    data: fd
  })
}
