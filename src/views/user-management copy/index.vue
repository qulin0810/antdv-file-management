<template>
  <div class="user-management">
    <a-card>
      <!-- 搜索区域 -->
      <div class="search-area mb-6">
        <a-form
          ref="searchFormRef"
          :model="searchForm"
          layout="inline"
          @finish="handleSearch"
        >
          <a-form-item label="用户名" name="username">
            <a-input
              v-model:value="searchForm.username"
              placeholder="请输入用户名"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="邮箱" name="email">
            <a-input
              v-model:value="searchForm.email"
              placeholder="请输入邮箱"
              allow-clear
            />
          </a-form-item>
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
            </a-space>
          </a-form-item>
        </a-form>
      </div>

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
    </a-card>

    <!-- 用户编辑模态框 -->
    <a-modal
      v-model:open="editVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
    >
      <a-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        layout="vertical"
      >
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="editForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="editForm.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="角色" name="role">
          <a-select v-model:value="editForm.role" placeholder="请选择角色">
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="guest">访客</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="editForm.status">
            <a-radio value="active">启用</a-radio>
            <a-radio value="inactive">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { TableProps, FormInstance } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  UserAddOutlined,
  UserOutlined
} from '@ant-design/icons-vue'

interface UserItem {
  key: string
  username: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createTime: string
}

const searchFormRef = ref<FormInstance>()
const editFormRef = ref<FormInstance>()
const loading = ref(false)
const editVisible = ref(false)
const isEdit = ref(false)

const searchForm = reactive({
  username: '',
  email: ''
})

const editForm = reactive({
  username: '',
  email: '',
  role: 'user',
  status: 'active'
})

const editRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`
})

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

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    admin: 'red',
    user: 'blue',
    guest: 'orange'
  }
  return colors[role] || 'default'
}

const handleSearch = () => {
  loading.value = true
  // 模拟搜索延迟
  setTimeout(() => {
    loading.value = false
    pagination.total = userList.value.length
  }, 500)
}

const handleReset = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

const handleAdd = () => {
  isEdit.value = false
  editFormRef.value?.resetFields()
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

const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  pagination.current = pag?.current || 1
  pagination.pageSize = pag?.pageSize || 10
  handleSearch()
}

const handleEditOk = async () => {
  try {
    await editFormRef.value?.validate()
    
    if (isEdit.value) {
      // 编辑逻辑
      console.log('编辑用户:', editForm)
    } else {
      // 新增逻辑
      const newUser: UserItem = {
        key: Date.now().toString(),
        ...editForm,
        createTime: new Date().toLocaleString()
      }
      userList.value.unshift(newUser)
    }
    
    editVisible.value = false
  } catch (error) {
    console.log('表单验证失败:', error)
  }
}

const handleEditCancel = () => {
  editVisible.value = false
}

// 初始化加载数据
handleSearch()
</script>

<style scoped>
.user-management {
  min-height: 100%;
}
</style>