<template>
  <div>
    <!-- 操作按钮 -->
    <div class="action-area mb-4">
      <a-space>
        <a-button type="primary" @click="$emit('add')">
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
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="$emit('edit', record)">
              编辑
            </a-button>
            <a-button 
              type="link" 
              size="small" 
              :danger="record.status === 'active'"
              @click="$emit('toggle-status', record)"
            >
              {{ record.status === 'active' ? '禁用' : '启用' }}
            </a-button>
            <a-popconfirm
              title="确定要删除这个用户吗？"
              @confirm="$emit('delete', record)"
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
import type { TableProps } from 'ant-design-vue'
import { UserAddOutlined, UserOutlined } from '@ant-design/icons-vue'

export interface UserItem {
  key: string
  username: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createTime: string
}

interface Props {
  userList: UserItem[]
  loading: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
    showSizeChanger: boolean
    showQuickJumper: boolean
    showTotal: (total: number) => string
  }
}

interface Emits {
  (e: 'add'): void
  (e: 'edit', record: UserItem): void
  (e: 'toggle-status', record: UserItem): void
  (e: 'delete', record: UserItem): void
  (e: 'table-change', pag: any, filters: any, sorter: any, extra: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: '20%'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: '25%'
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: '15%'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '15%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: '15%'
  },
  {
    title: '操作',
    key: 'action',
    width: '10%'
  }
]

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    admin: 'red',
    user: 'blue',
    guest: 'orange'
  }
  return colors[role] || 'default'
}

const handleTableChange: TableProps['onChange'] = (pag, filters, sorter, extra) => {
  emit('table-change', pag, filters, sorter, extra)
}
</script>

<style scoped>
.action-area {
  width: 100%;
}
</style>

<script lang="ts">
export default {
  name: 'UserList'
}
</script>