<template>
  <div class="excel-upload">
    <a-card :title="title" class="upload-card">
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        layout="horizontal"
      >
        <!-- Excel文件上传 -->
        <a-form-item label="上传Excel文件" name="file">
          <a-upload
            v-model:file-list="fileList"
            name="file"
            :multiple="false"
            :before-upload="beforeUpload"
            :max-count="1"
            :accept="excelAcceptTypes"
            @remove="handleRemove"
          >
            <a-button>
              <upload-outlined />
              选择Excel文件
            </a-button>
            <template #tip>
              <div class="upload-tip">
                仅支持 Excel 文件 (.xlsx, .xls)，最大 {{ maxFileSize }}MB
              </div>
            </template>
          </a-upload>
        </a-form-item>

        <!-- 文件描述 -->
        <a-form-item label="文件描述" name="description">
          <a-textarea
            v-model:value="formState.description"
            placeholder="请输入文件描述（可选）"
            :rows="3"
            allow-clear
          />
        </a-form-item>

        <!-- 提交按钮 -->
        <a-form-item :wrapper-col="{ offset: 6, span: 16 }">
          <a-button
            type="primary"
            @click="handleSubmit"
            :loading="loading"
            :disabled="fileList.length === 0"
          >
            上传Excel文件
          </a-button>
          <a-button @click="handleReset" style="margin-left: 8px">
            重置
          </a-button>
        </a-form-item>
      </a-form>

      <!-- 上传进度 -->
      <div v-if="uploadProgress > 0" class="upload-progress">
        <a-progress
          :percent="uploadProgress"
          :status="uploadStatus"
          :stroke-color="{
            '0%': '#108ee9',
            '100%': '#87d068',
          }"
        />
        <div class="progress-text">
          {{ uploadProgressText }}
        </div>
      </div>

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
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance, UploadFile } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'

interface UploadFormData {
  description: string
  file?: File
}

interface UploadResult {
  success: boolean
  message: string
}

interface Props {
  title?: string
  maxFileSize?: number
  onUpload?: (file: File, description: string) => Promise<boolean>
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Excel文件上传',
  maxFileSize: 10,
  onUpload: undefined
})

const emit = defineEmits<{
  upload: [file: File, description: string]
}>()

const formRef = ref<FormInstance>()
const loading = ref(false)
const fileList = ref<UploadFile[]>([])
const uploadResult = ref<UploadResult | null>(null)
const uploadProgress = ref(0)
const uploadStatus = ref<'active' | 'success' | 'exception'>('active')

const formState = reactive<UploadFormData>({
  description: ''
})

const rules = {
  file: [
    { required: true, message: '请选择要上传的Excel文件', trigger: 'change' }
  ]
}

// Excel文件类型配置
const excelAcceptTypes = '.xlsx,.xls,.xlsm,.xlsb'
const excelMimeTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
]

const uploadProgressText = computed(() => {
  if (uploadProgress.value === 0) return '准备上传...'
  if (uploadProgress.value === 100) return '上传完成！'
  return `上传中... ${uploadProgress.value}%`
})

// 验证Excel文件类型
const isValidExcelFile = (file: File): boolean => {
  const fileName = file.name.toLowerCase()
  const fileExtension = fileName.split('.').pop()
  const isValidExtension = ['.xlsx', '.xls', '.xlsm', '.xlsb'].includes(`.${fileExtension}`)
  const isValidMimeType = excelMimeTypes.includes(file.type) || file.type === ''
  
  return isValidExtension && isValidMimeType
}

// 文件上传前验证
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  // 验证文件类型
  if (!isValidExcelFile(file)) {
    message.error('只能上传Excel文件 (.xlsx, .xls, .xlsm, .xlsb)！')
    return false
  }

  // 文件大小限制
  const isLtMaxSize = file.size / 1024 / 1024 < props.maxFileSize
  if (!isLtMaxSize) {
    message.error(`文件大小不能超过 ${props.maxFileSize}MB！`)
    return false
  }

  console.log('准备上传Excel文件:', {
    name: file.name,
    size: file.size,
    type: file.type
  })
  
  return false // 阻止自动上传，由提交时统一处理
}

// 移除文件
const handleRemove = () => {
  fileList.value = []
  uploadResult.value = null
  uploadProgress.value = 0
}

// 模拟上传进度
const simulateUploadProgress = () => {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      uploadProgress.value += Math.random() * 20
      if (uploadProgress.value >= 100) {
        uploadProgress.value = 100
        uploadStatus.value = 'success'
        clearInterval(interval)
        resolve()
      }
    }, 200)
  })
}

// 提交上传
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    
    if (fileList.value.length === 0) {
      message.error('请选择要上传的Excel文件')
      return
    }

    loading.value = true
    uploadResult.value = null
    uploadProgress.value = 0
    uploadStatus.value = 'active'

    const file = fileList.value[0]?.originFileObj
    if (!file) {
      throw new Error('文件不存在')
    }

    // 记录上传信息
    console.log('开始上传Excel文件:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      description: formState.description
    })

    // 如果有自定义上传处理函数，使用它
    if (props.onUpload) {
      const success = await props.onUpload(file, formState.description)
      uploadResult.value = {
        success,
        message: success 
          ? `Excel文件 "${file.name}" 上传成功！`
          : `Excel文件 "${file.name}" 上传失败，请重试`
      }
    } else {
      // 模拟上传过程
      await simulateUploadProgress()
      
      // 模拟上传结果
      const success = Math.random() > 0.2 // 80% 成功率
      uploadResult.value = {
        success,
        message: success 
          ? `Excel文件 "${file.name}" 上传成功！`
          : `Excel文件 "${file.name}" 上传失败，请重试`
      }
    }

    // 触发上传事件
    emit('upload', file, formState.description)

    if (uploadResult.value.success) {
      message.success('Excel文件上传成功！')
      handleReset()
    } else {
      message.error('Excel文件上传失败！')
    }

  } catch (error) {
    console.error('上传失败:', error)
    uploadStatus.value = 'exception'
    message.error('上传失败，请检查文件格式和大小')
  } finally {
    loading.value = false
  }
}

// 重置表单
const handleReset = () => {
  formRef.value?.resetFields()
  fileList.value = []
  uploadResult.value = null
  uploadProgress.value = 0
  uploadStatus.value = 'active'
}

// 暴露方法给父组件
defineExpose({
  reset: handleReset,
  getFile: () => fileList.value[0]?.originFileObj
})
</script>

<style scoped>
.excel-upload {
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

.upload-progress {
  margin-top: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 6px;
}

.progress-text {
  margin-top: 8px;
  text-align: center;
  color: #666;
  font-size: 12px;
}

.upload-result {
  margin-top: 16px;
}

.ant-form-item {
  margin-bottom: 16px;
}
</style>