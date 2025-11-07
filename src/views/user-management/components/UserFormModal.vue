<template>
  <a-modal
    :open="visible"
    :title="isEdit ? '编辑用户' : '新增用户'"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="localFormData"
      :rules="rules"
      layout="vertical"
    >
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="localFormData.username" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="localFormData.email" placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item label="角色" name="role">
        <a-select v-model:value="localFormData.role" placeholder="请选择角色">
          <a-select-option value="admin">管理员</a-select-option>
          <a-select-option value="user">普通用户</a-select-option>
          <a-select-option value="guest">访客</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="localFormData.status">
          <a-radio value="active">启用</a-radio>
          <a-radio value="inactive">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { UserFormData } from '../types'

defineOptions({
  name: 'UserFormModal'
})

interface Props {
  visible: boolean
  isEdit: boolean
  formData: UserFormData
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  isEdit: false,
  formData: () => ({
    username: '',
    email: '',
    role: 'user',
    status: 'active'
  })
})

const emit = defineEmits<{
  ok: [formData: UserFormData, isEdit: boolean]
  cancel: []
  'update:visible': [visible: boolean]
}>()

const formRef = ref()
const localFormData = reactive<UserFormData>({
  username: '',
  email: '',
  role: 'user',
  status: 'active'
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

watch(
  () => props.formData,
  (newVal) => {
    Object.assign(localFormData, newVal)
  },
  { deep: true, immediate: true }
)

const handleOk = async () => {
  try {
    await formRef.value.validate()
    emit('ok', { ...localFormData }, props.isEdit)
    emit('update:visible', false)
  } catch (error) {
    console.log('表单验证失败:', error)
  }
}

const handleCancel = () => {
  emit('update:visible', false)
  emit('cancel')
  formRef.value.resetFields()
}
</script>