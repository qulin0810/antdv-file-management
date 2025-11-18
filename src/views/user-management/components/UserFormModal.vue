<template>
  <a-modal
    :open="visible"
    :title="isEdit ? '编辑用户' : '新增用户'"
    width="800px"
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
      <a-form-item label="职业" name="job">
        <a-select v-model:value="localFormData.job" placeholder="请选择职业" :options="props.jobOptions" />
      </a-form-item>
      <a-form-item label="喜欢的宠物" name="pet">
        <a-select v-model:value="localFormData.pet" placeholder="请选择宠物">
          <a-select-option value="小猫">小猫</a-select-option>
          <a-select-option value="小狗">小狗</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="localFormData.status">
          <a-radio value="active">启用</a-radio>
          <a-radio value="inactive">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
      
      <!-- 富文本编辑器 -->
      <a-form-item label="用户描述" name="richTextContent">
        <RichTextEditor
          v-model:modelValue="localFormData.richTextContent"
          title="用户描述编辑器"
          height="300px"
          @save="handleRichTextSave"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { UserFormData } from '../types'
import { createEmptyUserFormData } from '../types'
import RichTextEditor from '@/views/list-component/component/RichTextEditor.vue'

defineOptions({
  name: 'UserFormModal'
})

const props = withDefaults(defineProps<{
  visible: boolean
  isEdit: boolean
  formData: UserFormData
  jobOptions?: Array<{ label: string; value: number }>
}>(), {
  visible: false,
  isEdit: false,
  formData: () => createEmptyUserFormData(),
  jobOptions: () => []
})

const emit = defineEmits<{
  ok: [formData: UserFormData, isEdit: boolean]
  cancel: []
  'update:visible': [visible: boolean]
}>()

const formRef = ref()
const localFormData = reactive<UserFormData>(createEmptyUserFormData())

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
  ],
  job: [
    { required: true, message: '请选择职业', trigger: 'change' }
  ],
  pet: [
    { required: false, message: '请选择宠物', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      // 当模态框打开时，根据是否是编辑模式来设置表单数据
      if (props.isEdit) {
        Object.assign(localFormData, props.formData)
      } else {
        // 新增模式时重置表单数据
        resetLocalFormData()
      }
    }
  },
  { immediate: true }
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

const handleRichTextSave = (content: string) => {
  localFormData.richTextContent = content
  console.log('富文本内容已保存:', content)
}

const handleCancel = () => {
  emit('update:visible', false)
  emit('cancel')
  // 使用表单组件的内置重置方法
  resetForm()
}

const resetLocalFormData = () => {
  // 方法1: 使用 Object.assign 和工厂函数
  Object.assign(localFormData, createEmptyUserFormData())
  
  // 方法2: 也可以使用解构赋值
  // const emptyForm = createEmptyUserFormData()
  // Object.keys(emptyForm).forEach(key => {
  //   localFormData[key as keyof UserFormData] = emptyForm[key as keyof UserFormData]
  // })
}

const resetForm = () => {
  // 使用表单组件的内置重置方法
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // 同时重置本地数据以确保一致性
  resetLocalFormData()
}
</script>

<script lang="ts">
export default {
  name: 'UserFormModal'
}
</script>