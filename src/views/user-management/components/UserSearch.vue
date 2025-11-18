<template>
  <div class="search-area mb-6">
    <a-form
      ref="searchFormRef"
      :model="searchForm"
      layout="vertical"
      @finish="handleSearch"
    >
      <!-- 第一行：固定按钮始终在第一排 -->
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="用户名" name="username">
            <a-input
              v-model:value="searchForm.username"
              placeholder="请输入用户名"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="邮箱" name="email">
            <a-input
              v-model:value="searchForm.email"
              placeholder="请输入邮箱"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <!-- 占位符，确保按钮位置固定 -->
        </a-col>
        <a-col :span="6">
          <a-form-item>
            <a-space>
              <a-button type="primary" html-type="submit">
                <template #icon><search-outlined /></template>
                搜索
              </a-button>
              <a-button @click="handleReset">
                <template #icon><reload-outlined /></template>
                重置
              </a-button>
              <a-button type="link" @click="toggleExpand">
                {{ expanded ? '收起' : '展开' }}
                <template #icon>
                  <down-outlined v-if="!expanded" />
                  <up-outlined v-else />
                </template>
              </a-button>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
      
      <!-- 第二行：展开时显示的额外搜索条件 -->
      <a-row :gutter="16" v-if="expanded">
        <a-col :span="6">
          <a-form-item label="职业" name="job">
            <a-select
              v-model:value="searchForm.job"
              placeholder="请选择职业"
              allow-clear
              :options="jobOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="状态" name="status">
            <a-select
              v-model:value="searchForm.status"
              placeholder="请选择状态"
              allow-clear
              :options="statusOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="角色" name="role">
            <a-select
              v-model:value="searchForm.role"
              placeholder="请选择角色"
              allow-clear
              :options="roleOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="提交状态" name="submitStatus">
            <a-select
              v-model:value="searchForm.submitStatus"
              placeholder="请选择提交状态"
              allow-clear
              :options="submitStatusOptions"
            />
          </a-form-item>
        </a-col>
      </a-row>
      
      <!-- 第三行：宠物搜索条件 -->
      <a-row :gutter="16" v-if="expanded">
        <a-col :span="6">
          <a-form-item label="喜欢的宠物" name="pet">
            <a-select
              v-model:value="searchForm.pet"
              placeholder="请选择宠物"
              allow-clear
              :options="petOptions"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { SearchOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { SubmitStatus } from '../types'

defineOptions({
  name: 'UserSearch'
})

const props = withDefaults(defineProps<{
  jobOptions?: Array<{ label: string; value: number }>
}>(), {
  jobOptions: () => []
})

const emit = defineEmits<{
  search: [form: { username: string; email: string; job?: number; status?: string; role?: string; submitStatus?: SubmitStatus; pet?: string }]
  reset: []
}>()

const searchFormRef = ref()
const expanded = ref(false)
const searchForm = reactive({
  username: '',
  email: '',
  job: undefined as number | undefined,
  status: undefined as string | undefined,
  role: undefined as string | undefined,
  submitStatus: undefined as SubmitStatus | undefined,
  pet: undefined as string | undefined
})

// 职业选项
const jobOptions = [
  { label: '老师', value: 1 },
  { label: 'IT', value: 2 },
  { label: '医生', value: 3 },
  { label: '工程师', value: 4 },
  { label: '设计师', value: 5 }
]

// 状态选项
const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' }
]

// 角色选项
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
  { label: '访客', value: 'guest' }
]

// 提交状态选项
const submitStatusOptions = [
  { label: '成功', value: SubmitStatus.SUCCESS },
  { label: '失败', value: SubmitStatus.FAILED },
  { label: '进行中', value: SubmitStatus.PROCESSING },
  { label: '重新上传', value: SubmitStatus.REUPLOAD }
]

// 宠物选项
const petOptions = [
  { label: '小猫', value: '小猫' },
  { label: '小狗', value: '小狗' }
]

const handleSearch = () => {
  emit('search', { ...searchForm })
}

const handleReset = () => {
  if (searchFormRef.value) {
    searchFormRef.value.resetFields()
  }
  emit('reset')
}

const toggleExpand = () => {
  expanded.value = !expanded.value
}
</script>

<script lang="ts">
export default {
  name: 'UserSearch'
}
</script>

<style scoped>
.search-area {
  width: 100%;
}

/* 确保表单控件宽度为100% */
.search-area :deep(.ant-input),
.search-area :deep(.ant-select) {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-area :deep(.ant-col) {
    margin-bottom: 16px;
  }
  
  .search-area :deep(.ant-form-item) {
    margin-bottom: 0;
  }
}
</style>