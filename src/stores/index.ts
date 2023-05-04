// 创建pinia实例
import { createPinia } from 'pinia'
// 持久化存储
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// 创建pinia
const pinia = createPinia()
// 使用pinia插件
pinia.use(piniaPluginPersistedstate)
// 导出pinia实例，给main使用
export default pinia
// 模块化,统一导出，代码简洁，入口唯一
export * from './modules/user'
export * from './modules/consult'
