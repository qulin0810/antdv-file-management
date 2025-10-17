<template>
  <div class="login-container">
    <div class="login-form">
      <a-card class="login-card" :bordered="false">
        <template #title>
          <div class="text-center">
            <h2 class="text-2xl font-bold mb-2">文件管理系统</h2>
            <p class="text-gray-500">欢迎登录</p>
          </div>
        </template>

        <a-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          @finish="handleLogin"
        >
          <a-form-item name="username">
            <a-input
              v-model:value="loginForm.username"
              size="large"
              placeholder="用户名"
              :prefix="h(UserOutlined)"
            />
          </a-form-item>

          <a-form-item name="password">
            <a-input-password
              v-model:value="loginForm.password"
              size="large"
              placeholder="密码"
              :prefix="h(LockOutlined)"
            />
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
              block
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>

        <div class="text-center text-gray-500 text-sm mt-4">
          <p>默认账号: admin / 123456</p>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  try {
    await loginFormRef.value?.validate()
    loading.value = true

    // 模拟登录请求
    setTimeout(() => {
      if (loginForm.username === 'admin' && loginForm.password === '123456') {
        message.success('登录成功')
        router.push('/')
      } else {
        message.error('用户名或密码错误')
      }
      loading.value = false
    }, 1000)
  } catch (error) {
    console.log('表单验证失败:', error)
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  width: 400px;
}

.login-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.ant-card-head) {
  border-bottom: none;
  padding: 24px 24px 0;
}

:deep(.ant-card-body) {
  padding: 24px;
}
</style>