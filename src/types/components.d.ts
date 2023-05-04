import NavBar from '@/components/NavBar.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import RadioBtn from '@/components/RadioBtn.vue'
import Network from '@/components/Network.vue'
declare module 'vue' {
  // 3. 给 vue  添加全局组件类型，interface 和之前的合并
  interface GlobalComponents {
    // 4. 定义具体组件类型，typeof 获取到组件实例类型
    // typeof 作用是得到对应的TS类型
    NavBar: typeof NavBar
    SvgIcon: typeof SvgIcon
    RadioBtn: typeof RadioBtn
    Network: typeof Network
  }
}
