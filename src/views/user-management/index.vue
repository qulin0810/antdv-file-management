<template>
  <div class="user-management">
    <a-card>
      <!-- 搜索组件 -->
      <UserSearch
        :job-options="jobOptions"
        @search="handleSearch"
        @reset="handleReset"
      />

      <!-- 用户列表组件 -->
      <UserList
        :user-data="currentUserList"
        :loading="loading"
        :pagination="pagination"
        @add="handleAdd"
        @edit="handleEdit"
        @toggle-status="handleToggleStatus"
        @delete="handleDelete"
        @table-change="handleTableChange"
        @retry="handleRetry"
        @reupload="handleReupload"
        @view-hierarchy="handleViewHierarchy"
      />
    </a-card>

    <!-- 用户编辑模态框组件 -->
    <UserFormModal
      :visible="editVisible"
      :is-edit="isEdit"
      :form-data="editForm"
      :job-options="jobOptions"
      @update:visible="editVisible = $event"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
    />

    <!-- 用户层级关系模态框组件 -->
    <UserHierarchyTree
      ref="hierarchyTreeRef"
      :modal-title="hierarchyTitle"
      :modal-tree-data="hierarchyTreeData"
      :selected-key="selectedUser?.key"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import UserSearch from './components/UserSearch.vue'
import UserList from './components/UserList.vue'
import UserFormModal from './components/UserFormModal.vue'
import UserHierarchyTree from './components/UserHierarchyTree.vue'
import type { User, UserFormData, Pagination, TreeNode } from './types'
import { createEmptyUserFormData, SubmitStatus, UserRole } from './types'
import { hierarchicalUserData } from './temp-data'

const { t } = useI18n()

defineOptions({
  name: 'UserManagement'
})

const loading = ref(false)
const editVisible = ref(false)
const isEdit = ref(false)
const hierarchyVisible = ref(false)
const selectedUser = ref<User | null>(null)
const editForm = reactive<UserFormData>(createEmptyUserFormData())
const currentUserList = ref<User[]>([])
const hierarchyTreeRef = ref<InstanceType<typeof UserHierarchyTree> | null>(null)
const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => {
    const currentLocale = localStorage.getItem('locale') || 'zh-CN'
    if (currentLocale === 'zh-CN') {
      return `共 ${total} 条记录`
    } else {
      return `${total} ${total === 1 ? 'record' : 'records'}`
    }
  }
})

// 层级关系相关
const hierarchyTitle = computed(() => {
  if (!selectedUser.value) return '用户层级关系'
  return `${selectedUser.value.username} 的层级关系`
})

const hierarchyTreeData = computed(() => {
  if (!selectedUser.value) return []
  return buildUserHierarchyTree(selectedUser.value)
})
// 当前搜索参数
const currentSearchParams = ref<{ username: string; email: string; job?: number; status?: string; role?: string; submitStatus?: SubmitStatus; pet?: string }>({
  username: '',
  email: '',
  job: undefined,
  status: undefined,
  role: undefined,
  submitStatus: undefined,
  pet: undefined
})
// 职业选项
const jobOptions = [
  { label: t('userManagement.teacher'), value: 1 },
  { label: t('userManagement.it'), value: 2 },
  { label: t('userManagement.doctor'), value: 3 },
  { label: t('userManagement.engineer'), value: 4 },
  { label: t('userManagement.designer'), value: 5 }
]

// 宠物选项
const petOptions = [
  { label: '小猫', value: '小猫' },
  { label: '小狗', value: '小狗' }
]

const allUserList = ref<User[]>([...hierarchicalUserData])

const handleSearch = (searchParams?: { username: string; email: string; job?: number; status?: string; role?: string; submitStatus?: SubmitStatus; pet?: string }) => {
  // 更新当前搜索参数
  if (searchParams) {
    currentSearchParams.value = { ...searchParams }
  } else {
    // 如果没有参数，重置为默认值
    currentSearchParams.value = {
      username: '',
      email: '',
      job: undefined,
      status: undefined,
      role: undefined,
      submitStatus: undefined,
      pet: undefined
    }
  }
  
  loading.value = true
  // 模拟搜索延迟
  setTimeout(() => {
    let filteredList = [...allUserList.value]
    
    if (searchParams) {
      // 如果有搜索参数，进行过滤
      filteredList = allUserList.value.filter(user => {
        let match = true
        
        // 用户名搜索（模糊匹配）
        if (searchParams.username && !user.username.includes(searchParams.username)) {
          match = false
        }
        
        // 邮箱搜索（模糊匹配）
        if (searchParams.email && !user.email.includes(searchParams.email)) {
          match = false
        }
        
        // 职业搜索（精确匹配）
        if (searchParams.job && user.job !== searchParams.job) {
          match = false
        }
        
        // 状态搜索（精确匹配）
        if (searchParams.status && user.status !== searchParams.status) {
          match = false
        }
        
        // 角色搜索（精确匹配）
        if (searchParams.role && user.role !== searchParams.role) {
          match = false
        }
        
        // 提交状态搜索（精确匹配）
        if (searchParams.submitStatus && user.submitStatus !== searchParams.submitStatus) {
          match = false
        }
        
        // 宠物搜索（精确匹配）
        if (searchParams.pet && user.pet !== searchParams.pet) {
          match = false
        }
        
        return match
      })
    }
    
    // 更新分页信息
    pagination.total = filteredList.length
    
    // 计算当前页显示的数据
    const startIndex = (pagination.current - 1) * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    currentUserList.value = filteredList.slice(startIndex, endIndex)
    
    loading.value = false
  }, 500)
}

const handleReset = () => {
  // 重置搜索参数
  currentSearchParams.value = {
    username: '',
    email: '',
    job: undefined,
    status: undefined,
    role: undefined,
    submitStatus: undefined,
    pet: undefined
  }
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

const handleToggleStatus = (record: User, newStatus: string) => {
  const index = allUserList.value.findIndex(item => item.key === record.key)
  if (index > -1) {
    allUserList.value[index].status = newStatus
    // 重新搜索以更新显示
    handleSearch()
  }
}

const handleDelete = (record: User) => {
  const index = allUserList.value.findIndex(item => item.key === record.key)
  if (index > -1) {
    allUserList.value.splice(index, 1)
    // 重新搜索以更新显示
    handleSearch()
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
    // 模拟提交状态跟踪
    // 如果有富文本内容，设置提交状态为进行中
    if (formData.richTextContent && formData.richTextContent.trim()) {
      formData.submitStatus = SubmitStatus.PROCESSING
    }

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
      const index = allUserList.value.findIndex(item => item.key === formData.key)
      if (index > -1) {
        // 模拟提交状态结果
        if (formData.richTextContent && formData.richTextContent.trim()) {
          // 随机设置提交状态结果（模拟实际业务场景）
          const randomStatus = Math.random() > 0.3 ? SubmitStatus.SUCCESS : SubmitStatus.FAILED
          updatedUser.submitStatus = randomStatus
          updatedUser.richTextContent = formData.richTextContent
        }
        
        Object.assign(allUserList.value[index], updatedUser)
        // 重新搜索以更新显示
        handleSearch()
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
      
      // 模拟提交状态结果
      if (formData.richTextContent && formData.richTextContent.trim()) {
        // 随机设置提交状态结果（模拟实际业务场景）
        const randomStatus = Math.random() > 0.3 ? SubmitStatus.SUCCESS : SubmitStatus.FAILED
        newUser.submitStatus = randomStatus
        newUser.richTextContent = formData.richTextContent
      }
      
      // 添加到本地数据
      allUserList.value.unshift(newUser)
      // 重新搜索以更新显示
      handleSearch()
    }
    
    clearTimeout(timeoutId)
    // 关闭模态框
    editVisible.value = false
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('请求超时，请重试')
        // 设置提交状态为失败
        if (formData.richTextContent && formData.richTextContent.trim()) {
          formData.submitStatus = SubmitStatus.FAILED
        }
      } else {
        console.error('操作失败:', error.message)
        // 设置提交状态为失败
        if (formData.richTextContent && formData.richTextContent.trim()) {
          formData.submitStatus = SubmitStatus.FAILED
        }
      }
    } else {
      console.error('操作失败:', error)
      // 设置提交状态为失败
      if (formData.richTextContent && formData.richTextContent.trim()) {
        formData.submitStatus = SubmitStatus.FAILED
      }
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

// 处理重试操作
const handleRetry = (record: User) => {
  const index = allUserList.value.findIndex(item => item.key === record.key)
  if (index > -1) {
    // 设置状态为进行中
    allUserList.value[index].submitStatus = SubmitStatus.PROCESSING
    // 模拟重试过程
    setTimeout(() => {
      // 随机设置重试结果
      const randomStatus = Math.random() > 0.5 ? SubmitStatus.SUCCESS : SubmitStatus.FAILED
      allUserList.value[index].submitStatus = randomStatus
      // 重新搜索以更新显示
      handleSearch()
    }, 2000)
  }
}

// 处理重新上传操作
const handleReupload = (record: User) => {
  const index = allUserList.value.findIndex(item => item.key === record.key)
  if (index > -1) {
    // 设置状态为进行中
    allUserList.value[index].submitStatus = SubmitStatus.PROCESSING
    // 模拟重新上传过程
    setTimeout(() => {
      // 随机设置重新上传结果
      const randomStatus = Math.random() > 0.7 ? SubmitStatus.SUCCESS : SubmitStatus.REUPLOAD
      allUserList.value[index].submitStatus = randomStatus
      // 重新搜索以更新显示
      handleSearch()
    }, 2000)
  }
}

// 处理查看层级关系
const handleViewHierarchy = (record: User) => {
  selectedUser.value = record
  hierarchyVisible.value = true
  // 使用 nextTick 确保组件已渲染
  nextTick(() => {
    if (hierarchyTreeRef.value) {
      hierarchyTreeRef.value.openModal()
    }
  })
}

// 处理树节点选择
const handleTreeSelect = (node: TreeNode) => {
  console.log('选中节点:', node)
  // 可以在这里添加选中节点的处理逻辑，比如跳转到用户详情等
}

// 构建用户层级关系树
const buildUserHierarchyTree = (user: User): TreeNode[] => {
  const treeNodes: TreeNode[] = []
  
  // 根据用户角色构建不同的层级结构
  if (user.role === UserRole.ADMIN) {
    // 如果是admin，显示完整的层级结构
    const adminNode: TreeNode = {
      key: user.key,
      title: `${user.username} (系统管理员)`,
      username: user.username,
      role: UserRole.ADMIN,
      status: user.status,
      email: user.email,
      children: []
    }
    
    // 查找所有隶属于该admin的useradmin
    const userAdmins = allUserList.value.filter(u =>
      (u.role === UserRole.USER_ADMIN || u.adminType === 'useradmin') && u.parentAdmin === user.username
    )
    
    // 查找所有隶属于该admin的guestadmin
    const guestAdmins = allUserList.value.filter(u =>
      (u.role === UserRole.GUEST_ADMIN || u.adminType === 'guestadmin') && u.parentAdmin === user.username
    )
    
    // 构建useradmin节点
    const userAdminNodes = userAdmins.map(admin => ({
      key: admin.key,
      title: `${admin.username} (用户管理员)`,
      username: admin.username,
      role: admin.role,
      status: admin.status,
      email: admin.email,
      children: buildUserChildren(admin.username, 'user')
    }))
    
    // 构建guestadmin节点
    const guestAdminNodes = guestAdmins.map(admin => ({
      key: admin.key,
      title: `${admin.username} (访客管理员)`,
      username: admin.username,
      role: admin.role,
      status: admin.status,
      email: admin.email,
      children: buildUserChildren(admin.username, 'guest')
    }))
    
    adminNode.children = [...userAdminNodes, ...guestAdminNodes]
    treeNodes.push(adminNode)
    
  } else if (user.role === UserRole.USER_ADMIN || user.adminType === 'useradmin') {
    // 如果是useradmin，显示该管理员及其管理的用户，以及所属的admin
    const userNode: TreeNode = {
      key: user.key,
      title: `${user.username} (用户管理员)`,
      username: user.username,
      role: user.role,
      status: user.status,
      email: user.email,
      children: buildUserChildren(user.username, 'user')
    }
    
    // 查找所属的admin
    if (user.parentAdmin) {
      const admin = allUserList.value.find(u => u.username === user.parentAdmin)
      if (admin) {
        const adminNode: TreeNode = {
          key: admin.key,
          title: `${admin.username} (系统管理员)`,
          username: admin.username,
          role: admin.role,
          status: admin.status,
          email: admin.email,
          children: [userNode]
        }
        treeNodes.push(adminNode)
      } else {
        treeNodes.push(userNode)
      }
    } else {
      treeNodes.push(userNode)
    }
    
  } else if (user.role === UserRole.GUEST_ADMIN || user.adminType === 'guestadmin') {
    // 如果是guestadmin，显示该管理员及其管理的访客，以及所属的admin
    const guestNode: TreeNode = {
      key: user.key,
      title: `${user.username} (访客管理员)`,
      username: user.username,
      role: user.role,
      status: user.status,
      email: user.email,
      children: buildUserChildren(user.username, 'guest')
    }
    
    // 查找所属的admin
    if (user.parentAdmin) {
      const admin = allUserList.value.find(u => u.username === user.parentAdmin)
      if (admin) {
        const adminNode: TreeNode = {
          key: admin.key,
          title: `${admin.username} (系统管理员)`,
          username: admin.username,
          role: admin.role,
          status: admin.status,
          email: admin.email,
          children: [guestNode]
        }
        treeNodes.push(adminNode)
      } else {
        treeNodes.push(guestNode)
      }
    } else {
      treeNodes.push(guestNode)
    }
    
  } else if (user.role === UserRole.USER || user.role === UserRole.GUEST) {
    // 如果是普通用户或访客，显示完整的层级链：user → admin → admin
    const leafNode: TreeNode = {
      key: user.key,
      title: user.username,
      username: user.username,
      role: user.role,
      status: user.status,
      email: user.email,
      isLeaf: true
    }
    
    // 查找所属的管理员
    if (user.parentAdmin) {
      const admin = allUserList.value.find(u => u.username === user.parentAdmin)
      if (admin) {
        const adminNode: TreeNode = {
          key: admin.key,
          title: `${admin.username} (${admin.adminType === 'useradmin' ? '用户管理员' : '访客管理员'})`,
          username: admin.username,
          role: admin.role,
          status: admin.status,
          email: admin.email,
          children: [leafNode]
        }
        
        // 查找管理员所属的admin
        if (admin.parentAdmin) {
          const topAdmin = allUserList.value.find(u => u.username === admin.parentAdmin)
          if (topAdmin) {
            const topAdminNode: TreeNode = {
              key: topAdmin.key,
              title: `${topAdmin.username} (系统管理员)`,
              username: topAdmin.username,
              role: topAdmin.role,
              status: topAdmin.status,
              email: topAdmin.email,
              children: [adminNode]
            }
            treeNodes.push(topAdminNode)
          } else {
            treeNodes.push(adminNode)
          }
        } else {
          treeNodes.push(adminNode)
        }
      } else {
        treeNodes.push(leafNode)
      }
    } else {
      treeNodes.push(leafNode)
    }
  }
  
  return treeNodes
}

// 构建用户子节点
const buildUserChildren = (adminUsername: string, userType: 'user' | 'guest'): TreeNode[] => {
  const children: TreeNode[] = []
  
  // 根据用户类型查找对应的用户
  const targetRole = userType === 'user' ? UserRole.USER : UserRole.GUEST
  const users = allUserList.value.filter(u =>
    u.role === targetRole && u.parentAdmin === adminUsername
  )
  
  // 如果没有找到直接关联的用户，显示一些示例数据
  if (users.length === 0) {
    const exampleUsers = userType === 'user'
      ? ['user1', 'user2', 'user3']
      : ['guest1', 'guest2', 'guest3']
    
    exampleUsers.forEach((username, index) => {
      children.push({
        key: `example-${userType}-${index}`,
        title: username,
        username: username,
        role: targetRole,
        status: 'active',
        isLeaf: true
      })
    })
  } else {
    users.forEach(user => {
      children.push({
        key: user.key,
        title: user.username,
        username: user.username,
        role: user.role,
        status: user.status,
        email: user.email,
        isLeaf: true
      })
    })
  }
  
  return children
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