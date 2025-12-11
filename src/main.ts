import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import router from './router'
import App from './App.vue'
import i18n from './locales'
import { permissionDirective } from './directives/permission'
import 'ant-design-vue/dist/reset.css'
import 'virtual:uno.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(i18n)

// 注册全局指令
app.directive('permission', permissionDirective)

app.mount('#app')