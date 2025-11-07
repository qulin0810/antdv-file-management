<template>
  <a-modal
    v-model:open="visible"
    :title="isEdit ? '编辑用户' : '新增用户'"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
    >
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="formData.username" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item label="角色" name="role">
        <a-select v-model:value="formData.role" placeholder="请选择角色">
          <a-select-option value="admin">管理员</a-select-option>
          <a-select-option value="user">普通用户</a-select-option>
          <a-select-option value="guest">访客</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="formData.status">
          <a-radio value="active">启用</a-radio>
          <a-radio value="inactive">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'

export interface UserItem {
  key: string
  username: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createTime: string
}

interface Props {
  visible: boolean
  isEdit: boolean
  formData?: Partial<UserItem>
}

interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'ok', formData: any, isEdit: boolean): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  formData: () => ({
    username: '',
    email: '',
    role: 'user',
    status: 'active'
  })
})

const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const localFormData = reactive({
  username: '',
  email: '',
  role: 'user',
  status: 'active' as 'active' | 'inactive'
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

const visible = ref(props.visible)

watch(() => props.visible, (newVal) => {
  visible.value = newVal
})

watch(() => props.formData, (newVal) => {
  Object.assign(localFormData, newVal)
}, { deep: true, immediate: true })

const handleOk = async () => {
  try {
    await formRef.value?.validate()
    emit('ok', { ...localFormData }, props.isEdit)
    visible.value = false
    emit('update:visible', false)
  } catch (error) {
    console.log('表单验证失败:', error)
  }
}

const handleCancel = () => {
  visible.value = false
  emit('update:visible', false)
  emit('cancel')
  formRef.value?.resetFields()
}
</script>

<script lang="ts">
export default {
  name: 'UserFormModal'
}
</script>