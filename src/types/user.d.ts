export type user = {
  // 用户令牌
  token: string
  // 用户名
  account: string
  // 用户id
  id: number
  // 用户头像
  avatar: string
  // 刷新令牌
  refreshToken: string
}
export type userInfo = Omit<user, 'refreshToken' | 'token'> & {
  /** 关注 */
  likeNumber: number
  /** 收藏 */
  collectionNumber: number
  /** 积分 */
  score: number
  /** 优惠券 */
  couponNumber: number
  orderInfo: {
    /** 待付款 */
    paidNumber: number
    /** 待发货 */
    receivedNumber: number
    /** 待收货 */
    shippedNumber: number
    /** 已完成 */
    finishedNumber: number
  }
}
// 短信验证码类型，     登录   |     注册    |     修改手机号 |       忘记密码   |   绑定手机号
export type CodeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'

// 家庭档案-患者信息
export type patientInfo = {
  name: string
  // 患者姓名
  idCard: string
  // 患者身份证号
  gender: 0 | 1
  // 性别1男 0女
  genderValue?: string
  // 性别值
  defaultFlag: 0 | 1
  // 是否 设置为默认患者1 设置为默认0不设置
  id?: string
  // 患者信息id
  age?: number
  // 年龄
}

// 家庭档案-患者列表
export type PatientList = patientInfo[]

/**
 * 返回数据
 */
export interface Data {
  /**
   * 总页数
   */
  pageTotal: number
  /**
   * 数据
   */
  rows: Row[]
  /**
   * 总条数
   */
  total: number
}

// 问诊记录请求参数
export type patientConsultOrderListQuery = {
  /**
   * 当前页数，默认1
   */
  current?: number
  /**
   * 每页的大小默认10
   */
  pageSize?: number
  /**
   * 1问医生2极速问诊3开药问诊--默认是1
   */
  type?: number
}

// 问诊记录返回数据
export type patientConsultOrderListData = {
  total: number
  pageTotal: number
  rows: patientConsultOrderListDataRow[]
}

export type patientConsultOrderListDataRow = {
  id: string
  orderNo: string
  type: number
  createTime: string
  patientInfo: {
    id: string
    name: string
    idCard: string
    gender: number
    age: string
  }
  illnessDesc: string
  illnessTime: number
  consultFlag: number
  liverFunction: number
  renalFunction: number
  allergicHistory: number
  fertilityStatus: number
  docInfo: {
    id: string
    name: string
    avatar: string
    depName: string
    positionalTitles: string
    major: string
    hospitalName: string
    gradeName: string
    score: number
    consultationNum: number
    serviceFee: number
    status: number
  }
  prescriptionId: string
  recordId: string
  status: number
  statusValue: string
  cancelReason: string
  cancelReasonValue: string
  cancelProcess: string
  countdown: number
  payment: number
  evaluateFlag: string
  evaluateId: string
}
