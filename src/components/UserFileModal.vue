<template>
  <a-modal
    v-model:open="visible"
    :title="modalTitle"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    width="600px"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      layout="horizontal"
    >
      <a-form-item label="选择用户" name="username">
        <a-select
          v-model:value="formState.username"
          placeholder="请选择用户"
          allow-clear
          show-search
          :filter-option="filterUserOption"
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

      <a-form-item v-if="mode === 'upload'" label="上传文件" name="file">
        <a-upload
          v-model:file-list="fileList"
          name="file"
          :multiple="false"
          :before-upload="beforeUpload"
          :max-count="1"
          @remove="handleRemove"
        >
          <a-button>
            <upload-outlined />
            选择文件
          </a-button>
        </a-upload>
      </a-form-item>

      <a-form-item v-if="mode === 'download'" label="选择文件" name="selectedFile">
        <a-select
          v-model:value="formState.selectedFile"
          placeholder="请选择要下载的文件"
          allow-clear
        >
          <a-select-option 
            v-for="file in userFiles" 
            :key="file.id" 
            :value="file.id"
          >
            {{ file.name }} ({{ file.type }})
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item v-if="mode === 'upload'" label="文件描述" name="description">
        <a-textarea
          v-model:value="formState.description"
          placeholder="请输入文件描述"
          :rows="3"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance, UploadFile } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'
import type { User } from '../views/user-management/types'
import { mockFileDownload } from '../utils/fileDownload'

interface FileFormData {
  username: string
  description: string
  file?: File
  selectedFile?: string
}

interface UserFile {
  id: string
  name: string
  type: string
  size: number
  uploadTime: string
  username: string
}

interface Props {
  visible: boolean
  mode: 'upload' | 'download'
  userList: User[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
  upload: [data: { username: string; file: File; description: string }]
  download: [data: { username: string; fileId: string }]
}>()

const formRef = ref<FormInstance>()
const confirmLoading = ref(false)
const fileList = ref<UploadFile[]>([])

const formState = reactive<FileFormData>({
  username: '',
  description: '',
  selectedFile: ''
})

// 模拟用户文件数据
const userFiles = ref<UserFile[]>([
  {
    id: '1',
    name: '项目文档.docx',
    type: 'document',
    size: 1024000,
    uploadTime: '2024-01-15 10:30',
    username: 'admin'
  },
  {
    id: '2',
    name: '用户数据.xlsx',
    type: 'excel',
    size: 512000,
    uploadTime: '2024-01-16 14:20',
    username: 'user1'
  },
  {
    id: '3',
    name: '产品图片.png',
    type: 'image',
    size: 2048000,
    uploadTime: '2024-01-17 09:15',
    username: 'user2'
  },
  {
    id: '4',
    name: '会议记录.pdf',
    type: 'pdf',
    size: 1536000,
    uploadTime: '2024-01-18 16:45',
    username: 'admin'
  }
])

const rules = {
  username: [
    { required: true, message: '请选择用户', trigger: 'change' }
  ],
  file: [
    { required: true, message: '请选择要上传的文件', trigger: 'change' }
  ],
  selectedFile: [
    { required: true, message: '请选择要下载的文件', trigger: 'change' }
  ]
}

const modalTitle = computed(() => {
  return props.mode === 'upload' ? '上传文件' : '下载文件'
})

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const resetForm = () => {
  formRef.value?.resetFields()
  fileList.value = []
  Object.assign(formState, {
    username: '',
    description: '',
    selectedFile: ''
  })
}

const filterUserOption = (input: string, option: any) => {
  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

const handleOk = async () => {
  try {
    await formRef.value?.validate()
    
    confirmLoading.value = true
    
    if (props.mode === 'upload') {
      if (!fileList.value.length) {
        throw new Error('请选择要上传的文件')
      }
      
      const submitData = {
        username: formState.username,
        file: fileList.value[0]?.originFileObj as File,
        description: formState.description
      }
      
      emit('upload', submitData)
    } else {
      const submitData = {
        username: formState.username,
        fileId: formState.selectedFile as string
      }
      
      emit('download', submitData)
    }
    
    // 重置表单
    resetForm()
    visible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    confirmLoading.value = false
  }
}

const handleCancel = () => {
  resetForm()
  visible.value = false
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  // 这里可以添加文件验证逻辑
  console.log('上传文件:', file)
  return false // 阻止自动上传，由提交时统一处理
}

const handleRemove = () => {
  fileList.value = []
}

// 监听用户选择变化，过滤文件列表
watch(
  () => formState.username,
  (username) => {
    if (username) {
      // 根据选择的用户名动态生成文件列表
      const filteredFiles = [
        {
          id: '1',
          name: `${username}_项目文档.docx`,
          type: 'document',
          size: 1024000,
          uploadTime: '2024-01-15 10:30',
          username: username
        },
        {
          id: '2',
          name: `${username}_用户数据.xlsx`,
          type: 'excel',
          size: 512000,
          uploadTime: '2024-01-16 14:20',
          username: username
        },
        {
          id: '3',
          name: `${username}_产品图片.png`,
          type: 'image',
          size: 2048000,
          uploadTime: '2024-01-17 09:15',
          username: username
        },
        {
          id: '4',
          name: `${username}_会议记录.pdf`,
          type: 'pdf',
          size: 1536000,
          uploadTime: '2024-01-18 16:45',
          username: username
        }
      ]
      userFiles.value = filteredFiles
    } else {
      // 重置文件列表为空
      userFiles.value = []
    }
  }
)
</script>

<style scoped>
.ant-form-item {
  margin-bottom: 16px;
}
</style>