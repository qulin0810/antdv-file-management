<template>
  <div>
    <!-- 操作按钮 -->
    <div class="action-area mb-4">
      <a-space>
        <a-button type="primary" @click="handleAdd">
          <template #icon><user-add-outlined /></template>
          新增用户
        </a-button>
      </a-space>
    </div>

    <!-- 用户列表 -->
    <a-table
      :columns="columns"
      :data-source="userData"
      :pagination="pagination"
      :loading="loading"
      :scroll="{ x: tableScrollX }"
      @change="handleTableChange"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'username'">
          <user-outlined class="mr-1" />
          {{ column.title }}
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'role'">
          <a-tag :color="getRoleColor(record.role)">
            {{ record.role }}
          </a-tag>
        </template>
        
        <template v-else-if="column.key === 'status'">
          <a-switch
            :checked="record.status === 'active'"
            checked-children="启用"
            un-checked-children="禁用"
            @change="handleSwitchChangeWrapper(record)"
          />
        </template>
        
        <template v-else-if="column.key === 'submitStatus'">
          <a-tag :color="getSubmitStatusColor(record.submitStatus)">
            {{ getSubmitStatusText(record.submitStatus) }}
          </a-tag>
        </template>
        
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
            
            <!-- 根据提交状态显示不同的操作按钮 -->
            <template v-if="record.submitStatus === SubmitStatus.FAILED">
              <a-button type="link" size="small" @click="handleRetry(record)" style="color: #ff4d4f;">
                重试
              </a-button>
            </template>
            
            <template v-if="record.submitStatus === SubmitStatus.REUPLOAD">
              <a-button type="link" size="small" @click="handleReupload(record)" style="color: #faad14;">
                重新上传
              </a-button>
            </template>
            
            <a-popconfirm
              title="确定要删除这个用户吗？"
              @confirm="handleDelete(record)"
            >
              <a-button type="link" size="small" danger>
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { UserAddOutlined, UserOutlined } from '@ant-design/icons-vue'
import type { User, Pagination } from '../types'
import { SubmitStatus } from '../types'

defineOptions({
  name: 'UserList'
})

const props = defineProps<{
  userData: User[]
  loading: boolean
  pagination: Pagination
}>()

const emit = defineEmits<{
  add: []
  edit: [record: User]
  'toggle-status': [record: User, newStatus: string]
  delete: [record: User]
  'table-change': [pag: any, filters: any, sorter: any, extra: any]
  'reupload': [record: User]
  'retry': [record: User]
}>()

// 列配置 - 完整版本，包含操作列
const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 120
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 200
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80
  },
  {
    title: '提交状态',
    dataIndex: 'submitStatus',
    key: 'submitStatus',
    width: 120,
    customRender: ({ text }: { text: SubmitStatus }) => {
      return getSubmitStatusText(text)
    }
  },
  {
    title: '职业',
    dataIndex: 'job',
    key: 'job',
    width: 100,
    customRender: ({ text }: { text: number }) => {
      return getJobLabel(text)
    }
  },
  {
    title: '喜欢的宠物',
    dataIndex: 'pet',
    key: 'pet',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 150
  },
  {
    title: '操作',
    key: 'action',
    width: 250,
    fixed: 'right'
  }
]

// 智能表格宽度计算
// 当列数较少时，使用精确列宽总和
// 当列数较多时，使用响应式宽度计算
const getTableScrollX = () => {
  const columnCount = columns.length
  const totalWidth = columns.reduce((total, column) => total + (column.width || 0), 0)
  
  // 如果列数少于5列，使用精确列宽总和
  if (columnCount <= 5) {
    return totalWidth
  }
  
  // 如果列数较多，使用响应式宽度计算
  // 这里可以调用 useDynamicTableScrollWidth 或者设置一个较大的固定值
  return Math.max(totalWidth, 1200) // 确保至少1200px宽度
}

const tableScrollX = getTableScrollX()

// 调试信息
console.log('列数:', columns.length)
console.log('列宽总和:', tableScrollX)
console.log('表格滚动宽度策略:', columns.length <= 5 ? '精确列宽' : '响应式宽度')


// 职业选项
const jobOptions = [
  { label: '老师', value: 1 },
  { label: 'IT', value: 2 },
  { label: '医生', value: 3 },
  { label: '工程师', value: 4 },
  { label: '设计师', value: 5 }
]

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    admin: 'red',
    user: 'blue',
    guest: 'orange'
  }
  return colors[role] || 'default'
}

// 获取提交状态颜色
const getSubmitStatusColor = (status?: SubmitStatus) => {
  if (!status) return 'default'
  
  const statusMap: Record<SubmitStatus, string> = {
    [SubmitStatus.SUCCESS]: 'green',
    [SubmitStatus.FAILED]: 'red',
    [SubmitStatus.PROCESSING]: 'blue',
    [SubmitStatus.REUPLOAD]: 'orange'
  }
  
  return statusMap[status] || 'default'
}

// 获取提交状态文本
const getSubmitStatusText = (status?: SubmitStatus) => {
  if (!status) return '未提交'
  
  const statusMap: Record<SubmitStatus, string> = {
    [SubmitStatus.SUCCESS]: '成功',
    [SubmitStatus.FAILED]: '失败',
    [SubmitStatus.PROCESSING]: '进行中',
    [SubmitStatus.REUPLOAD]: '重新上传'
  }
  
  return statusMap[status] || '未知'
}

// 获取职业标签
const getJobLabel = (jobValue?: number) => {
  if (!jobValue) return '未知'
  const job = jobOptions.find(option => option.value === jobValue)
  return job ? job.label : '未知'
}

const handleAdd = () => {
  emit('add')
}

const handleEdit = (record: User) => {
  emit('edit', record)
}

const handleStatusChange = (record: User, newStatus: string) => {
  emit('toggle-status', record, newStatus)
}

const handleSwitchChangeWrapper = (record: User) => {
  return (checked: boolean) => {
    const newStatus = checked ? 'active' : 'inactive'
    handleStatusChange(record, newStatus)
  }
}

const handleSwitchChange = (record: User, checked: boolean) => {
  const newStatus = checked ? 'active' : 'inactive'
  handleStatusChange(record, newStatus)
}

const handleDelete = (record: User) => {
  emit('delete', record)
}

const handleRetry = (record: User) => {
  emit('retry', record)
}

const handleReupload = (record: User) => {
  emit('reupload', record)
}

const handleTableChange = (pag: any, filters: any, sorter: any, extra: any) => {
  emit('table-change', pag, filters, sorter, extra)
}
</script>

<script lang="ts">
export default {
  name: 'UserList'
}
</script>

<style scoped>
.action-area {
  width: 100%;
}
</style>