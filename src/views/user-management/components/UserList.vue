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
      :data-source="userList"
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
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 'active' ? 'green' : 'red'">
            {{ record.status === 'active' ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'role'">
          <a-tag :color="getRoleColor(record.role)">
            {{ record.role }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'job'">
          <span>{{ getJobLabel(record.job) }}</span>
        </template>
        <template v-else-if="column.key === 'department'">
          <span>{{ record.department || '-' }}</span>
        </template>
        <template v-else-if="column.key === 'position'">
          <span>{{ record.position || '-' }}</span>
        </template>
        <template v-else-if="column.key === 'phone'">
          <span>{{ record.phone || '-' }}</span>
        </template>
        <template v-else-if="column.key === 'address'">
          <span>{{ record.address || '-' }}</span>
        </template>
        <template v-else-if="column.key === 'remark'">
          <span>{{ record.remark || '-' }}</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-button
              type="link"
              size="small"
              :danger="record.status === 'active'"
              @click="handleToggleStatus(record)"
            >
              {{ record.status === 'active' ? '禁用' : '启用' }}
            </a-button>
            <a-popconfirm
              title="确定要删除这个用户吗？"
              @confirm="handleDelete(record)"
            >
              <a-button type="link" size="small" danger>删除</a-button>
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
import { ref, onMounted, onUnmounted } from 'vue'

defineOptions({
  name: 'UserList'
})

const props = defineProps<{
  userList: User[]
  loading: boolean
  pagination: Pagination
}>()

const emit = defineEmits<{
  add: []
  edit: [record: User]
  'toggle-status': [record: User]
  delete: [record: User]
  'table-change': [pag: any, filters: any, sorter: any, extra: any]
}>()

// 响应式表格宽度计算
const tableScrollX = ref(1800)

// 计算表格可用宽度
const calculateTableWidth = () => {
  const windowWidth = window.innerWidth
  const sidebarWidth = 200 // 左侧树形展开时的宽度
  const padding = 32 // 内容区域的内边距
  const margin = 16 // 表格容器的边距
  
  // 计算可用宽度 = 窗口宽度 - 侧边栏宽度 - 内边距 - 边距
  const availableWidth = windowWidth - sidebarWidth - padding - margin
  
  // 设置表格滚动宽度，最小为1200px
  tableScrollX.value = Math.max(availableWidth, 1200)
}

// 监听窗口大小变化
const handleResize = () => {
  calculateTableWidth()
}

onMounted(() => {
  calculateTableWidth()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 150,
    fixed: 'left'
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
    width: 120
  },
  {
    title: '职业',
    dataIndex: 'job',
    key: 'job',
    width: 120
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    width: 150
  },
  {
    title: '职位',
    dataIndex: 'position',
    key: 'position',
    width: 150
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    width: 150
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    width: 200
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 200
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right'
  }
]

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

const handleToggleStatus = (record: User) => {
  emit('toggle-status', record)
}

const handleDelete = (record: User) => {
  emit('delete', record)
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