<template>
  <a-modal
    v-model:open="visible"
    :title="formTitle"
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
      <a-form-item label="文件名称" name="name">
        <a-input
          v-model:value="formState.name"
          placeholder="请输入文件名称"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="文件类型" name="type">
        <a-select
          v-model:value="formState.type"
          placeholder="请选择文件类型"
          allow-clear
        >
          <a-select-option value="folder">文件夹</a-select-option>
          <a-select-option value="file">文件</a-select-option>
          <a-select-option value="image">图片</a-select-option>
          <a-select-option value="document">文档</a-select-option>
          <a-select-option value="video">视频</a-select-option>
          <a-select-option value="audio">音频</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="所属部门" name="department">
        <a-select
          v-model:value="formState.department"
          placeholder="请选择所属部门"
          allow-clear
        >
          <a-select-option value="tech">技术部</a-select-option>
          <a-select-option value="design">设计部</a-select-option>
          <a-select-option value="product">产品部</a-select-option>
          <a-select-option value="marketing">市场部</a-select-option>
          <a-select-option value="hr">人力资源部</a-select-option>
          <a-select-option value="finance">财务部</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="上传文件" name="file">
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

      <a-form-item label="文件描述" name="description">
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

interface FileFormData {
  name: string
  type: string
  department: string
  description: string
  file?: File
}

interface Props {
  visible: boolean
  editData?: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
  submit: [data: FileFormData]
}>()

const formRef = ref<FormInstance>()
const confirmLoading = ref(false)
const fileList = ref<UploadFile[]>([])

const formState = reactive<FileFormData>({
  name: '',
  type: '',
  department: '',
  description: ''
})

const rules = {
  name: [
    { required: true, message: '请输入文件名称', trigger: 'blur' },
    { min: 1, max: 50, message: '文件名称长度在1-50个字符之间', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择文件类型', trigger: 'change' }
  ],
  department: [
    { required: true, message: '请选择所属部门', trigger: 'change' }
  ]
}

const formTitle = computed(() => {
  return props.editData ? '编辑文件' : '新建文件'
})

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const resetForm = () => {
  formRef.value?.resetFields()
  fileList.value = []
  Object.assign(formState, {
    name: '',
    type: '',
    department: '',
    description: ''
  })
}

watch(
  () => props.editData,
  (newVal) => {
    if (newVal) {
      Object.assign(formState, {
        name: newVal.name || '',
        type: newVal.type || '',
        department: newVal.department || '',
        description: newVal.description || ''
      })
      // 如果是编辑模式，清空文件列表
      fileList.value = []
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

const handleOk = async () => {
  try {
    await formRef.value?.validate()
    
    confirmLoading.value = true
    
    // 准备提交数据
    const submitData: FileFormData = {
      ...formState,
      file: fileList.value[0]?.originFileObj
    }
    
    emit('submit', submitData)
    
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
</script>

<style scoped>
.ant-form-item {
  margin-bottom: 16px;
}
</style>