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
      :visible="editVisible"
      :is-edit="isEdit"
      :form-data="editForm"
      @update:visible="editVisible = $event"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import UserSearch from './components/UserSearch.vue'
import UserList from './components/UserList.vue'
import UserFormModal from './components/UserFormModal.vue'
import type { User, UserFormData, Pagination } from './types'

defineOptions({
  name: 'UserManagement'
})

const loading = ref(false)
const editVisible = ref(false)
const isEdit = ref(false)
const editForm = reactive<UserFormData>({
  username: '',
  email: '',
  role: 'user',
  status: 'active'
})
const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条记录`
})
const userList = ref<User[]>([
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

const handleEdit = (record: User) => {
  isEdit.value = true
  Object.assign(editForm, record)
  editVisible.value = true
}

const handleToggleStatus = (record: User) => {
  record.status = record.status === 'active' ? 'inactive' : 'active'
}

const handleDelete = (record: User) => {
  const index = userList.value.findIndex(item => item.key === record.key)
  if (index > -1) {
    userList.value.splice(index, 1)
  }
}

const handleTableChange = (pag: any, filters: any, sorter: any, extra: any) => {
  pagination.current = pag?.current || 1
  pagination.pageSize = pag?.pageSize || 10
  handleSearch()
}

const handleEditOk = (formData: UserFormData, isEditMode: boolean) => {
  if (isEditMode) {
    // 编辑逻辑
    const index = userList.value.findIndex(item => item.key === formData.key)
    if (index > -1) {
      Object.assign(userList.value[index], formData)
    }
  } else {
    // 新增逻辑
    const newUser: User = {
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

onMounted(() => {
  // 初始化加载数据
  handleSearch()
})
</script>

<style scoped>
.user-management {
  min-height: 100%;
}
</style>