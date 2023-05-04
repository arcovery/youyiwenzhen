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
// 微信登录
export function loginByWechatAPI() {
  return request<{
    code: number
    msg: string
    type: string
    url: string
    qrcode: string
  }>({
    method: 'GET',
    url: '/wechat/connect.php?act=login&appid=1599&appkey=953e44a9c89f435e1b3624fe89cf5c95&type=wx&redirect_uri=192.168.33.39:5173/login/callback'
  })
}

// 获取微信用户信息
export function getWechatUserInfoAPI(code: string) {
  return request<{
    code: number
    msg: string
    type: string
    access_token: string
    social_uid: string
    faceimg: string
    nickname: string
    location: string
    gender: string
    ip: string
  }>({
    method: 'GET',
    url: `/wechat/connect.php?act=callback&appid=1599&appkey=953e44a9c89f435e1b3624fe89cf5c95&type=wx&code=${code}`
  })
}
