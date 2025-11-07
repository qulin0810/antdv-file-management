<template>
  <div class="user-management">
    <a-card>
      <!-- 搜索组件 -->
      <UserSearch
        @search="handleSearch"
        @reset="handleReset"
      />

      <!-- 用户列表组件 -->
      <UserList
        :user-list="userList"
        :loading="loading"
        :pagination="pagination"
        @add="handleAdd"
        @edit="handleEdit"
        @toggle-status="handleToggleStatus"
        @delete="handleDelete"
        @table-change="handleTableChange"
      />
    </a-card>

    <!-- 用户编辑模态框组件 -->
    <UserFormModal
      v-model:visible="editVisible"
      :is-edit="isEdit"
      :form-data="editForm"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { TableProps } from 'ant-design-vue'
import UserSearch from './components/UserSearch.vue'
import UserList from './components/UserList.vue'
import UserFormModal from './components/UserFormModal.vue'

interface UserItem {
  key: string
  username: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createTime: string
}

const loading = ref(false)
const editVisible = ref(false)
const isEdit = ref(false)

const editForm = reactive({
  username: '',
  email: '',
  role: 'user',
  status: 'active' as 'active' | 'inactive'
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`
})

const userList = ref<UserItem[]>([
  {
    key: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createTime: '2024-01-15 10:30'
  },
  {
    key: '2',
    username: 'user1',
    email: 'user1@example.com',
    role: 'user',
    status: 'active',
    createTime: '2024-01-16 14:20'
  },
  {
    key: '3',
    username: 'user2',
    email: 'user2@example.com',
    role: 'user',
    status: 'inactive',
    createTime: '2024-01-17 09:15'
  },
  {
    key: '4',
    username: 'guest1',
    email: 'guest1@example.com',
    role: 'guest',
    status: 'active',
    createTime: '2024-01-18 16:45'
  }
])

const handleSearch = () => {
  loading.value = true
  // 模拟搜索延迟
  setTimeout(() => {
    loading.value = false
    pagination.total = userList.value.length
  }, 500)
}

const handleReset = () => {
  handleSearch()
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(editForm, {
    username: '',
    email: '',
    role: 'user',
    status: 'active'
  })
  editVisible.value = true
}

const handleEdit = (record: UserItem) => {
  isEdit.value = true
  Object.assign(editForm, record)
  editVisible.value = true
}

const handleToggleStatus = (record: UserItem) => {
  record.status = record.status === 'active' ? 'inactive' : 'active'
}

const handleDelete = (record: UserItem) => {
  const index = userList.value.findIndex(item => item.key === record.key)
  if (index > -1) {
    userList.value.splice(index, 1)
  }
}

const handleTableChange: TableProps['onChange'] = (pag, filters, sorter, extra) => {
  pagination.current = pag?.current || 1
  pagination.pageSize = pag?.pageSize || 10
  handleSearch()
}

const handleEditOk = (formData: any, isEditMode: boolean) => {
  if (isEditMode) {
    // 编辑逻辑
    const index = userList.value.findIndex(item => item.key === formData.key)
    if (index > -1) {
      Object.assign(userList.value[index], formData)
    }
  } else {
    // 新增逻辑
    const newUser: UserItem = {
      key: Date.now().toString(),
      ...formData,
      createTime: new Date().toLocaleString()
    }
    userList.value.unshift(newUser)
  }
}

const handleEditCancel = () => {
  // 可以在这里添加取消时的清理逻辑
}

// 初始化加载数据
handleSearch()
</script>

<style scoped>
.user-management {
  min-height: 100%;
}
</style>