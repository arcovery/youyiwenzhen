import type { FieldRule } from 'vant'

export const mobileRules: FieldRule[] = [
  { required: true, message: '请输入手机号', trigger: ['onBlur', 'onChange'] },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['onBlur', 'onChange'] }
]
export const passwordRules: FieldRule[] = [
  { required: true, message: '请输入密码', trigger: ['onBlur', 'onChange'] },
  {
    pattern: /^\w{8,24}$/,
    message: '密码格式不正确,应为大于8位,小于24位',
    trigger: ['onBlur', 'onChange']
  }
]

export const nameRules: FieldRule[] = [
  { required: true, message: '请输入姓名', trigger: ['onBlur', 'onChange'] },
  {
    pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
    message: '中文2-16个字符',
    trigger: ['onBlur', 'onChange']
  }
]

export const idCardRules: FieldRule[] = [
  { required: true, message: '请输入身份证号', trigger: ['onBlur', 'onChange'] },
  {
    pattern: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
    message: '身份证号不正确',
    trigger: ['onBlur', 'onChange']
  }
]

export const codeRules: FieldRule[] = [
  { required: true, message: '请输入验证码', trigger: ['onBlur', 'onChange'] },
  { pattern: /^\d{6}$/, message: '验证码6个数字', trigger: ['onBlur', 'onChange'] }
]
