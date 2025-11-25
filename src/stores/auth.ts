import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import router from '@/router'

interface UserInfo {
  id: string
  username: string
  role: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('token'))
  const userInfo = ref<UserInfo | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // 模拟登录请求
      return new Promise((resolve) => {
        setTimeout(() => {
          if (username === 'admin' && password === '123456') {
            // 模拟登录成功
            const mockToken = 'mock-jwt-token-' + Date.now()
            const mockUserInfo: UserInfo = {
              id: '1',
              username: 'admin',
              role: 'admin'
            }
            
            token.value = mockToken
            userInfo.value = mockUserInfo
            
            // 保存到本地存储
            localStorage.setItem('token', mockToken)
            localStorage.setItem('userInfo', JSON.stringify(mockUserInfo))
            
            message.success('登录成功')
            resolve(true)
          } else {
            message.error('用户名或密码错误')
            resolve(false)
          }
        }, 1000)
      })
    } catch (error) {
      console.error('登录失败:', error)
      message.error('登录失败，请重试')
      return false
    }
  }

  const logout = () => {
    token.value = null
    userInfo.value = null
    
    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    
    message.success('已退出登录')
    
    // 跳转到登录页
    router.push('/login')
  }

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUserInfo = localStorage.getItem('userInfo')
    
    if (storedToken && storedUserInfo) {
      try {
        token.value = storedToken
        userInfo.value = JSON.parse(storedUserInfo)
      } catch (error) {
        console.error('初始化认证信息失败:', error)
        // 清除无效的存储数据
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
      }
    }
  }

  // 初始化认证状态
  initializeAuth()

  return {
    // State
    token,
    userInfo,
    isAuthenticated,
    
    // Actions
    login,
    logout,
    initializeAuth
  }
})