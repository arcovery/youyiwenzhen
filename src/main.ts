import { createApp } from 'vue'
import pinia from './stores/'
import App from './App.vue'
import router from './router'
import 'virtual:svg-icons-register'
import 'vant/lib/index.css'
import './styles/index.scss'
import '@/utils/permissions'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
