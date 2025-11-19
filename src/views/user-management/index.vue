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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import UserSearch from './components/UserSearch.vue'
import UserList from './components/UserList.vue'
import UserFormModal from './components/UserFormModal.vue'
import type { User, UserFormData, Pagination } from './types'
import { createEmptyUserFormData, SubmitStatus } from './types'

defineOptions({
  name: 'UserManagement'
})

const loading = ref(false)
const editVisible = ref(false)
const isEdit = ref(false)
const editForm = reactive<UserFormData>(createEmptyUserFormData())
const currentUserList = ref<User[]>([])
const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条记录`
})
// 职业选项
const jobOptions = [
  { label: '老师', value: 1 },
  { label: 'IT', value: 2 },
  { label: '医生', value: 3 },
  { label: '工程师', value: 4 },
  { label: '设计师', value: 5 }
]

// 宠物选项
const petOptions = [
  { label: '小猫', value: '小猫' },
  { label: '小狗', value: '小狗' }
]

const allUserList = ref<User[]>([
  {
    key: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    job: 2, // IT
    pet: '小猫',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-15 10:30',
    modificationTime: 1705311000000, // 2024-01-15 10:30
    department: '技术部',
    position: '系统管理员',
    phone: '13800138001',
    address: '北京市朝阳区建国门外大街1号',
    remark: '系统管理员，负责系统维护',
    richTextContent: '<p>系统管理员账户，拥有最高权限。</p><p>负责系统维护和用户管理。</p>'
  },
  {
    key: '2',
    username: 'user1',
    email: 'user1@example.com',
    role: 'user',
    job: 1, // 老师
    pet: '小狗',
    status: 'active',
    submitStatus: SubmitStatus.FAILED,
    createTime: '2024-01-16 14:20',
    modificationTime: 1705400400000, // 2024-01-16 14:20
    department: '教学部',
    position: '高级讲师',
    phone: '13800138002',
    address: '上海市浦东新区陆家嘴金融中心',
    remark: '负责前端开发课程教学',
    richTextContent: '<p>前端开发讲师，擅长Vue.js和React。</p>'
  },
  {
    key: '3',
    username: 'user2',
    email: 'user2@example.com',
    role: 'user',
    job: 3, // 医生
    pet: '小猫',
    status: 'inactive',
    submitStatus: SubmitStatus.PROCESSING,
    createTime: '2024-01-17 09:15',
    modificationTime: 1705482900000, // 2024-01-17 09:15
    department: '医疗部',
    position: '主治医师',
    phone: '13800138003',
    address: '广州市天河区珠江新城',
    remark: '内科主治医师，擅长心血管疾病',
    richTextContent: '<p>心血管内科专家，拥有10年临床经验。</p>'
  },
  {
    key: '4',
    username: 'guest1',
    email: 'guest1@example.com',
    role: 'guest',
    job: 4, // 工程师
    pet: '小狗',
    status: 'active',
    submitStatus: SubmitStatus.REUPLOAD,
    createTime: '2024-01-18 16:45',
    modificationTime: 1705581900000, // 2024-01-18 16:45
    department: '研发部',
    position: '高级工程师',
    phone: '13800138004',
    address: '深圳市南山区科技园',
    remark: '负责后端系统架构设计',
    richTextContent: '<p>后端架构师，精通微服务和分布式系统。</p>'
  },
  {
    key: '5',
    username: 'guest2',
    email: 'guest2@example.com',
    role: 'guest',
    job: 5, // 设计师
    pet: '小猫',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-19 11:30',
    modificationTime: 1705656600000, // 2024-01-19 11:30
    department: '设计部',
    position: 'UI设计师',
    phone: '13800138005',
    address: '杭州市西湖区文三路',
    remark: '负责产品界面设计和用户体验优化',
    richTextContent: '<p>UI/UX设计师，专注于用户体验设计。</p>'
  },
  {
    key: '6',
    username: 'manager1',
    email: 'manager1@example.com',
    role: 'admin',
    job: 2, // IT
    pet: '小狗',
    status: 'active',
    submitStatus: SubmitStatus.FAILED,
    createTime: '2024-01-20 08:45',
    modificationTime: 1705733100000, // 2024-01-20 08:45
    department: '管理部',
    position: '项目经理',
    phone: '13800138006',
    address: '成都市武侯区天府软件园',
    remark: '负责项目管理与团队协调',
    richTextContent: '<p>项目经理，擅长敏捷开发和团队管理。</p>'
  },
  {
    key: '7',
    username: 'teacher1',
    email: 'teacher1@example.com',
    role: 'user',
    job: 1, // 老师
    pet: '小猫',
    status: 'active',
    submitStatus: SubmitStatus.PROCESSING,
    createTime: '2024-01-21 13:20',
    modificationTime: 1705821600000, // 2024-01-21 13:20
    department: '教学部',
    position: '课程顾问',
    phone: '13800138007',
    address: '南京市鼓楼区新街口',
    remark: '负责课程咨询和学员服务',
    richTextContent: '<p>课程顾问，提供专业的学习建议。</p>'
  },
  {
    key: '8',
    username: 'doctor1',
    email: 'doctor1@example.com',
    role: 'user',
    job: 3, // 医生
    pet: '小狗',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-22 10:15',
    modificationTime: 1705904100000, // 2024-01-22 10:15
    department: '医疗部',
    position: '副主任医师',
    phone: '13800138008',
    address: '武汉市武昌区光谷',
    remark: '外科副主任医师，擅长微创手术',
    richTextContent: '<p>外科专家，精通微创手术技术。</p>'
  },
  {
    key: '9',
    username: 'engineer1',
    email: 'engineer1@example.com',
    role: 'user',
    job: 4, // 工程师
    pet: '小猫',
    status: 'inactive',
    submitStatus: SubmitStatus.REUPLOAD,
    createTime: '2024-01-23 15:30',
    modificationTime: 1705995000000, // 2024-01-23 15:30
    department: '研发部',
    position: '测试工程师',
    phone: '13800138009',
    address: '西安市雁塔区高新区',
    remark: '负责软件测试和质量保证',
    richTextContent: '<p>测试工程师，专注于自动化测试。</p>'
  },
  {
    key: '10',
    username: 'designer1',
    email: 'designer1@example.com',
    role: 'user',
    job: 5, // 设计师
    pet: '小狗',
    status: 'active',
    submitStatus: SubmitStatus.FAILED,
    createTime: '2024-01-24 11:45',
    modificationTime: 1706075100000, // 2024-01-24 11:45
    department: '设计部',
    position: '交互设计师',
    phone: '13800138010',
    address: '重庆市渝北区光电园',
    remark: '负责产品交互设计和原型制作',
    richTextContent: '<p>交互设计师，专注于用户体验研究。</p>'
  }
])

const handleSearch = (searchParams?: { username: string; email: string; job?: number; status?: string; role?: string; submitStatus?: SubmitStatus; pet?: string }) => {
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