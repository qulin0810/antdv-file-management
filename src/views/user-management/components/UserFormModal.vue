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

      <!-- 修改时间 -->
      <a-form-item label="修改时间" name="modificationTime">
        <a-date-picker
          v-model:value="modificationTimeDate"
          placeholder="请选择修改时间"
          style="width: 100%"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </a-form-item>
      
      <!-- 爱好输入区域 -->
      <a-form-item label="爱好">
        <div class="hobbies-container">
          <div
            v-for="(hobby, index) in hobbies"
            :key="index"
            class="hobby-item"
          >
            <a-input
              v-model:value="hobbies[index]"
              :placeholder="`爱好 ${index + 1}`"
              class="hobby-input"
            />
            <a-button
              type="link"
              danger
              @click="removeHobby(index)"
              class="remove-btn"
            >
              删除
            </a-button>
          </div>
          <a-button
            type="dashed"
            @click="addHobby"
            class="add-hobby-btn"
          >
            <template #icon>
              <PlusOutlined />
            </template>
            添加爱好
          </a-button>
        </div>
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
import { reactive, ref, watch, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import type { UserFormData, HobbyItem } from '../types'
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
const localFormData = reactive<UserFormData>({
  ...createEmptyUserFormData(),
  hobbies: [] // 确保hobbies数组被初始化
})

// 计算属性确保hobbies数组始终存在
const hobbies = computed({
  get: () => {
    // 优先使用hobbies数组，如果没有则从hobbiesDisplay转换
    if (localFormData.hobbies && localFormData.hobbies.length > 0) {
      return localFormData.hobbies
    }
    // 如果hobbies为空但有hobbiesDisplay，转换为字符串数组
    if (localFormData.hobbiesDisplay && localFormData.hobbiesDisplay.length > 0) {
      return localFormData.hobbiesDisplay.map(item => item.hobby)
    }
    return []
  },
  set: (value) => {
    localFormData.hobbies = value
  }
})

// 修改时间的日期对象（用于DatePicker）
const modificationTimeDate = ref<string | null>(null)

// 监听修改时间的变化，转换为时间戳
watch(modificationTimeDate, (newDate) => {
  if (newDate) {
    localFormData.modificationTime = dayjs(newDate).valueOf()
  } else {
    localFormData.modificationTime = undefined
  }
})

// 监听localFormData.modificationTime的变化，转换为日期字符串用于回显
watch(() => localFormData.modificationTime, (newTimestamp) => {
  if (newTimestamp) {
    modificationTimeDate.value = dayjs(newTimestamp).format('YYYY-MM-DD')
  } else {
    modificationTimeDate.value = null
  }
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
  ],
  job: [
    { required: true, message: '请选择职业', trigger: 'change' }
  ],
  pet: [
    { required: false, message: '请选择宠物', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  modificationTime: [
    { required: false, message: '请选择修改时间', trigger: 'change' }
  ]
}

// 将爱好显示格式转换为提交格式
const convertHobbiesDisplayToSubmit = (hobbiesDisplay: HobbyItem[]): string[] => {
  if (!hobbiesDisplay || !Array.isArray(hobbiesDisplay)) return []
  return hobbiesDisplay.map(item => item.hobby).filter(Boolean)
}

// 将爱好提交格式转换为显示格式
const convertHobbiesSubmitToDisplay = (hobbies: string[]): HobbyItem[] => {
  if (!hobbies || !Array.isArray(hobbies)) return []
  return hobbies.filter(Boolean).map((hobby, index) => ({
    id: index + 1,
    hobby: hobby
  }))
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      // 当模态框打开时，根据是否是编辑模式来设置表单数据
      if (props.isEdit) {
        Object.assign(localFormData, props.formData)
        // 确保爱好数据正确设置
        if (props.formData.hobbiesDisplay && props.formData.hobbiesDisplay.length > 0) {
          localFormData.hobbies = props.formData.hobbiesDisplay.map(item => item.hobby)
        }
        // 设置修改时间的日期显示
        if (props.formData.modificationTime) {
          modificationTimeDate.value = dayjs(props.formData.modificationTime).format('YYYY-MM-DD')
        } else {
          modificationTimeDate.value = null
        }
      } else {
        // 新增模式时重置表单数据
        resetLocalFormData()
        modificationTimeDate.value = null
      }
    }
  },
  { immediate: true }
)

const handleOk = async () => {
  try {
    await formRef.value.validate()
    
    // 准备提交的数据
    const submitData = { ...localFormData }
    
    // 确保提交时hobbiesDisplay格式正确
    if (submitData.hobbies && submitData.hobbies.length > 0) {
      submitData.hobbiesDisplay = convertHobbiesSubmitToDisplay(submitData.hobbies)
    } else {
      submitData.hobbiesDisplay = []
    }
    
    emit('ok', submitData, props.isEdit)
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

const addHobby = () => {
  hobbies.value.push('')
}

const removeHobby = (index: number) => {
  hobbies.value.splice(index, 1)
}

const resetLocalFormData = () => {
  // 使用 Object.assign 和工厂函数重置表单数据
  const emptyForm = createEmptyUserFormData()
  Object.assign(localFormData, emptyForm)
  // 确保hobbies数组被正确重置
  localFormData.hobbies = []
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

<style scoped>
.hobbies-container {
  width: 100%;
}

.hobby-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.hobby-input {
  flex: 1;
}

.remove-btn {
  flex-shrink: 0;
  padding: 4px 8px;
}

.add-hobby-btn {
  width: 100%;
  margin-top: 8px;
}
</style>

<script lang="ts">
export default {
  name: 'UserFormModal'
}
</script>