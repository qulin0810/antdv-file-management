<template>
  <div class="search-area mb-6">
    <a-form
      ref="searchFormRef"
      :model="searchForm"
      layout="vertical"
      @finish="handleSearch"
    >
      <div class="search-grid">
        <!-- 第一行：固定按钮始终在第一排 -->
        <div class="search-row">
          <a-form-item label="用户名" name="username" class="search-item">
            <a-input
              v-model:value="searchForm.username"
              placeholder="请输入用户名"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="邮箱" name="email" class="search-item">
            <a-input
              v-model:value="searchForm.email"
              placeholder="请输入邮箱"
              allow-clear
            />
          </a-form-item>
          
          <!-- 占位符，确保按钮位置固定 -->
          <div class="search-item placeholder"></div>
          
          <!-- 固定按钮位置 -->
          <div class="button-item">
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
          </div>
        </div>
        
        <!-- 第二行：展开时显示的额外搜索条件 -->
        <div class="search-row" v-if="expanded">
          <a-form-item label="职业" name="job" class="search-item">
            <a-select
              v-model:value="searchForm.job"
              placeholder="请选择职业"
              allow-clear
              :options="jobOptions"
            />
          </a-form-item>
          <a-form-item label="状态" name="status" class="search-item">
            <a-select
              v-model:value="searchForm.status"
              placeholder="请选择状态"
              allow-clear
              :options="statusOptions"
            />
          </a-form-item>
          <a-form-item label="角色" name="role" class="search-item">
            <a-select
              v-model:value="searchForm.role"
              placeholder="请选择角色"
              allow-clear
              :options="roleOptions"
            />
          </a-form-item>
          <!-- 占位符，确保布局一致 -->
          <div class="search-item placeholder"></div>
        </div>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { SearchOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons-vue'

defineOptions({
  name: 'UserSearch'
})

const props = withDefaults(defineProps<{
  jobOptions?: Array<{ label: string; value: number }>
}>(), {
  jobOptions: () => []
})

const emit = defineEmits<{
  search: [form: { username: string; email: string; job?: number; status?: string; role?: string }]
  reset: []
}>()

const searchFormRef = ref()
const expanded = ref(false)
const searchForm = reactive({
  username: '',
  email: '',
  job: undefined as number | undefined,
  status: undefined as string | undefined,
  role: undefined as string | undefined
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

.search-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  align-items: start;
}

.search-item {
  margin-bottom: 0;
}

.search-item :deep(.ant-form-item-label) {
  text-align: left;
}

.search-item :deep(.ant-form-item-control) {
  width: 100%;
}

.search-item :deep(.ant-input),
.search-item :deep(.ant-select) {
  width: 100%;
}

.button-item {
  display: flex;
  align-items: flex-end;
  margin-bottom: 0;
}

.button-item :deep(.ant-form-item) {
  margin-bottom: 0;
  width: 100%;
}

.button-item :deep(.ant-form-item-control) {
  display: flex;
  justify-content: flex-start;
}

.placeholder {
  visibility: hidden;
  height: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .search-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .search-row {
    grid-template-columns: 1fr;
  }
  
  .button-item :deep(.ant-form-item-control) {
    justify-content: center;
  }
}
</style>