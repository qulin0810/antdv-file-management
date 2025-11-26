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
          <a-form-item :label="t('userManagement.username')" name="username">
            <a-input
              v-model:value="searchForm.username"
              :placeholder="t('userManagement.enterUsername')"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="t('userManagement.email')" name="email">
            <a-input
              v-model:value="searchForm.email"
              :placeholder="t('userManagement.enterEmail')"
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
                {{ t('common.search') }}
              </a-button>
              <a-button @click="handleReset">
                <template #icon><reload-outlined /></template>
                {{ t('common.reset') }}
              </a-button>
              <a-button type="link" @click="toggleExpand">
                {{ expanded ? t('common.collapse') : t('common.expand') }}
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
          <a-form-item :label="t('userManagement.job')" name="job">
            <a-select
              v-model:value="searchForm.job"
              :placeholder="t('userManagement.selectJob')"
              allow-clear
              :options="jobOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="t('userManagement.status')" name="status">
            <a-select
              v-model:value="searchForm.status"
              :placeholder="t('userManagement.selectStatus')"
              allow-clear
              :options="statusOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="t('userManagement.role')" name="role">
            <a-select
              v-model:value="searchForm.role"
              :placeholder="t('userManagement.selectRole')"
              allow-clear
              :options="roleOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="t('userManagement.submitStatus')" name="submitStatus">
            <a-select
              v-model:value="searchForm.submitStatus"
              :placeholder="t('userManagement.selectSubmitStatus')"
              allow-clear
              :options="submitStatusOptions"
            />
          </a-form-item>
        </a-col>
      </a-row>
      
      <!-- 第三行：宠物搜索条件 -->
      <a-row :gutter="16" v-if="expanded">
        <a-col :span="6">
          <a-form-item :label="t('userManagement.pet')" name="pet">
            <a-select
              v-model:value="searchForm.pet"
              :placeholder="t('userManagement.selectPet')"
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
import { reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { SearchOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { SubmitStatus } from '../types'

const { t } = useI18n()

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
const jobOptions = computed(() => [
  { label: t('userManagement.teacher'), value: 1 },
  { label: t('userManagement.it'), value: 2 },
  { label: t('userManagement.doctor'), value: 3 },
  { label: t('userManagement.engineer'), value: 4 },
  { label: t('userManagement.designer'), value: 5 }
])

// 状态选项
const statusOptions = computed(() => [
  { label: t('userManagement.active'), value: 'active' },
  { label: t('userManagement.inactive'), value: 'inactive' }
])

// 角色选项
const roleOptions = computed(() => [
  { label: t('userManagement.admin'), value: 'admin' },
  { label: t('userManagement.user'), value: 'user' },
  { label: t('userManagement.guest'), value: 'guest' }
])

// 提交状态选项
const submitStatusOptions = computed(() => [
  { label: t('userManagement.success'), value: SubmitStatus.SUCCESS },
  { label: t('userManagement.failed'), value: SubmitStatus.FAILED },
  { label: t('userManagement.processing'), value: SubmitStatus.PROCESSING },
  { label: t('userManagement.reuploadStatus'), value: SubmitStatus.REUPLOAD }
])

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