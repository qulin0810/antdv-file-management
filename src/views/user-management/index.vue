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
import { createEmptyUserFormData } from './types'

defineOptions({
  name: 'UserManagement'
})

const loading = ref(false)
const editVisible = ref(false)
const isEdit = ref(false)
const editForm = reactive<UserFormData>(createEmptyUserFormData())
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
  // 使用更优雅的方式重置表单数据
  resetEditForm()
  editVisible.value = true
}

const resetEditForm = () => {
  // 方法1: 使用 Object.assign 和工厂函数
  Object.assign(editForm, createEmptyUserFormData())
  
  // 方法2: 也可以使用解构赋值
  // const emptyForm = createEmptyUserFormData()
  // Object.keys(emptyForm).forEach(key => {
  //   editForm[key as keyof UserFormData] = emptyForm[key as keyof UserFormData]
  // })
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

const handleTableChange = (pag: { current?: number; pageSize?: number }, filters: any, sorter: any, extra: any) => {
  pagination.current = pag?.current || 1
  pagination.pageSize = pag?.pageSize || 10
  handleSearch()
}

const handleEditOk = async (formData: UserFormData, isEditMode: boolean) => {
  // 表单验证
  if (!formData.username.trim()) {
    console.error('用户名不能为空')
    return
  }
  if (!formData.email.trim()) {
    console.error('邮箱不能为空')
    return
  }
  if (!formData.role) {
    console.error('请选择角色')
    return
  }

  loading.value = true
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

    if (isEditMode) {
      // 调用编辑API
      const response = await fetch(`/api/users/${formData.key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      })
      
      if (!response.ok) {
        throw new Error(`更新用户失败: ${response.status} ${response.statusText}`)
      }
      
      const updatedUser = await response.json()
      
      // 更新本地数据
      const index = userList.value.findIndex(item => item.key === formData.key)
      if (index > -1) {
        Object.assign(userList.value[index], updatedUser)
      }
    } else {
      // 调用新增API
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      })
      
      if (!response.ok) {
        throw new Error(`创建用户失败: ${response.status} ${response.statusText}`)
      }
      
      const newUser = await response.json()
      
      // 添加到本地数据
      userList.value.unshift(newUser)
    }
    
    clearTimeout(timeoutId)
    // 关闭模态框
    editVisible.value = false
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('请求超时，请重试')
      } else {
        console.error('操作失败:', error.message)
      }
    } else {
      console.error('操作失败:', error)
    }
    // 这里可以添加错误提示，比如使用 message 组件
    // message.error('操作失败，请重试')
  } finally {
    loading.value = false
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