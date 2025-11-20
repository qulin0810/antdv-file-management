<template>
  <div class="user-upload">
    <a-card title="用户文件上传" class="upload-card">
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        layout="horizontal"
      >
        <!-- 用户选择 -->
        <a-form-item label="选择用户" name="username">
          <a-select
            v-model:value="formState.username"
            placeholder="请选择用户"
            allow-clear
            show-search
            :filter-option="filterUserOption"
            @change="handleUserChange"
          >
            <a-select-option
              v-for="user in userList"
              :key="user.key"
              :value="user.username"
            >
              {{ user.username }} ({{ user.email }})
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- 文件上传 -->
        <a-form-item label="上传文件" name="file">
          <a-upload
            v-model:file-list="fileList"
            name="file"
            :multiple="false"
            :before-upload="beforeUpload"
            :max-count="1"
            @remove="handleRemove"
            :disabled="!formState.username"
          >
            <a-button :disabled="!formState.username">
              <upload-outlined />
              选择文件
            </a-button>
            <template #tip>
              <div class="upload-tip" v-if="!formState.username">
                请先选择用户
              </div>
              <div class="upload-tip" v-else>
                支持单个文件上传，最大 10MB
              </div>
            </template>
          </a-upload>
        </a-form-item>

        <!-- 文件描述 -->
        <a-form-item label="文件描述" name="description">
          <a-textarea
            v-model:value="formState.description"
            placeholder="请输入文件描述"
            :rows="3"
            allow-clear
            :disabled="!formState.username"
          />
        </a-form-item>

        <!-- 提交按钮 -->
        <a-form-item :wrapper-col="{ offset: 6, span: 16 }">
          <a-button
            type="primary"
            @click="handleSubmit"
            :loading="loading"
            :disabled="!formState.username || fileList.length === 0"
          >
            上传文件
          </a-button>
          <a-button @click="handleReset" style="margin-left: 8px">
            重置
          </a-button>
        </a-form-item>
      </a-form>

      <!-- 上传结果展示 -->
      <div v-if="uploadResult" class="upload-result">
        <a-alert
          :message="uploadResult.message"
          :type="uploadResult.success ? 'success' : 'error'"
          show-icon
        />
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance, UploadFile } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'
import type { User } from '@/views/user-management/types'

interface UploadFormData {
  username: string
  description: string
  file?: File
}

interface UploadResult {
  success: boolean
  message: string
}

// 模拟用户数据
const mockUsers: User[] = [
  {
    key: '1',
    username: '张三',
    email: 'zhangsan@example.com',
    role: 'admin',
    status: 'active',
    createTime: '2024-01-01'
  },
  {
    key: '2',
    username: '李四',
    email: 'lisi@example.com',
    role: 'user',
    status: 'active',
    createTime: '2024-01-02'
  },
  {
    key: '3',
    username: '王五',
    email: 'wangwu@example.com',
    role: 'user',
    status: 'inactive',
    createTime: '2024-01-03'
  },
  {
    key: '4',
    username: '赵六',
    email: 'zhaoliu@example.com',
    role: 'guest',
    status: 'active',
    createTime: '2024-01-04'
  }
]

const formRef = ref<FormInstance>()
const loading = ref(false)
const fileList = ref<UploadFile[]>([])
const userList = ref<User[]>([])
const uploadResult = ref<UploadResult | null>(null)

const formState = reactive<UploadFormData>({
  username: '',
  description: ''
})

const rules = {
  username: [
    { required: true, message: '请选择用户', trigger: 'change' }
  ],
  file: [
    { required: true, message: '请选择要上传的文件', trigger: 'change' }
  ]
}

// 初始化用户列表
onMounted(() => {
  userList.value = mockUsers
})

// 用户搜索过滤
const filterUserOption = (input: string, option: any) => {
  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

// 用户选择变化
const handleUserChange = (value: string) => {
  console.log('选择的用户:', value)
  // 清空文件列表和结果
  fileList.value = []
  uploadResult.value = null
}

// 文件上传前验证
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  // 文件大小限制 10MB
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('文件大小不能超过 10MB!')
    return false
  }
  
  console.log('准备上传文件:', file)
  return false // 阻止自动上传，由提交时统一处理
}

// 移除文件
const handleRemove = () => {
  fileList.value = []
  uploadResult.value = null
}

// 提交上传
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    
    if (fileList.value.length === 0) {
      message.error('请选择要上传的文件')
      return
    }

    loading.value = true
    uploadResult.value = null

    // 模拟上传过程
    const file = fileList.value[0]?.originFileObj
    if (!file) {
      throw new Error('文件不存在')
    }

    // 这里应该是实际的上传逻辑
    console.log('开始上传文件:', {
      username: formState.username,
      description: formState.description,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })

    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 模拟上传结果
    const success = Math.random() > 0.3 // 70% 成功率
    uploadResult.value = {
      success,
      message: success 
        ? `文件 "${file.name}" 上传成功！用户：${formState.username}`
        : `文件 "${file.name}" 上传失败，请重试`
    }

    if (success) {
      message.success('文件上传成功！')
      handleReset()
    } else {
      message.error('文件上传失败！')
    }

  } catch (error) {
    console.error('上传失败:', error)
    message.error('上传失败，请检查表单')
  } finally {
    loading.value = false
  }
}

// 重置表单
const handleReset = () => {
  formRef.value?.resetFields()
  fileList.value = []
  uploadResult.value = null
}
</script>

<style scoped>
.user-upload {
  max-width: 600px;
  margin: 0 auto;
}

.upload-card {
  margin: 20px;
}

.upload-tip {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}

.upload-result {
  margin-top: 16px;
}

.ant-form-item {
  margin-bottom: 16px;
}
</style>