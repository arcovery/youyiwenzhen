// 高德地图配置
interface Window {
  _AMapSecurityConfig: {
    securityJsCode: string
  }
  QC: {
    Login: {
      check(): boolean
      getMe(cb: (openId: string) => void): void
    }
  }
}
