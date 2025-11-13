<template>
  <div class="container">
    <div class="header">
      <h2>用户管理</h2>
      <a-button type="primary" @click="handleAdd">新增用户</a-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-form">
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="姓名">
          <a-input
            v-model:value="searchForm.name"
            placeholder="请输入姓名"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="年龄">
          <a-input
            v-model:value="searchForm.age"
            placeholder="请输入年龄"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="职业">
          <a-select
            v-model:value="searchForm.job"
            placeholder="请选择职业"
            allow-clear
            style="width: 200px"
            :options="jobOptions"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :loading="loading"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'job'">
          <span>{{ getJobLabel(record.job) }}</span>
        </template>
        
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 1 ? 'green' : 'red'">
            {{ record.status === 1 ? '已启用' : '已禁用' }}
          </a-tag>
        </template>

        <template v-if="column.key === 'action'">
          <a-space>
            <a-button 
              size="small" 
              :type="record.status === 1 ? 'default' : 'primary'"
              @click="handleToggleStatus(record)"
            >
              {{ record.status === 1 ? '禁用' : '启用' }}
            </a-button>
            <a-button 
              size="small" 
              danger 
              @click="handleDelete(record)"
            >
              删除
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 分页组件 -->
    <Pagination
      v-model:current="pagination.current"
      v-model:page-size="pagination.pageSize"
      :total="pagination.total"
      @change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { message, Modal } from 'ant-design-vue';
import Pagination from '../../components/Pagination.vue';

// 响应式数据
const loading = ref(false);
const dataSource = ref([]);

// 搜索表单
const searchForm = reactive({
  name: '',
  age: '',
  job: ''
});

// 职业选项
const jobOptions = [
  { label: '老师', value: 1 },
  { label: 'IT', value: 2 },
  { label: '医生', value: 3 },
  { label: '工程师', value: 4 },
  { label: '设计师', value: 5 }
];

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// 表格列配置
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '职业',
    dataIndex: 'job',
    key: 'job',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
  },
];

// 获取职业标签
const getJobLabel = (jobValue) => {
  const job = jobOptions.find(option => option.value === jobValue);
  return job ? job.label : '未知';
};

// 模拟数据 - 更真实的数据
const mockData = Array.from({ length: 156 }, (_, index) => ({
  id: index + 1,
  name: `用户${index + 1}`,
  age: Math.floor(Math.random() * 50) + 18,
  job: Math.floor(Math.random() * 5) + 1, // 随机分配职业值 1-5
  address: `北京市朝阳区第${index + 1}街道`,
  status: Math.random() > 0.3 ? 1 : 0,
  email: `user${index + 1}@example.com`,
  createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString()
}));

// 获取表格数据
const fetchData = async () => {
  loading.value = true;
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 1. 过滤数据（根据搜索条件）
    let filteredData = mockData.filter(item => {
      let match = true;
      
      // 姓名搜索（模糊匹配）
      if (searchForm.name && !item.name.includes(searchForm.name)) {
        match = false;
      }
      
      // 年龄搜索（精确匹配）
      if (searchForm.age && item.age.toString() !== searchForm.age) {
        match = false;
      }
      
      // 职业搜索（精确匹配）
      if (searchForm.job && item.job.toString() !== searchForm.job) {
        match = false;
      }
      
      return match;
    });
    
    // 2. 计算分页
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    // 3. 更新数据
    dataSource.value = pageData;
    pagination.total = filteredData.length;
    
    console.log(`当前页: ${pagination.current}, 每页: ${pagination.pageSize}, 总数: ${pagination.total}`);
    
  } catch (error) {
    console.error('数据加载失败:', error);
    message.error('数据加载失败');
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.current = 1; // 搜索时回到第一页
  fetchData();
};

// 重置搜索
const handleReset = () => {
  searchForm.name = '';
  searchForm.age = '';
  searchForm.job = '';
  pagination.current = 1;
  fetchData();
};

// 分页变化
const handlePageChange = (pageInfo) => {
  console.log('分页变化:', pageInfo);
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  fetchData();
};

// 删除功能
const handleDelete = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除用户"${record.name}"吗？此操作不可恢复。`,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      // 在实际项目中这里应该是调用删除API
      const index = mockData.findIndex(item => item.id === record.id);
      if (index !== -1) {
        mockData.splice(index, 1);
        fetchData(); // 重新加载数据
        message.success('删除成功');
      }
    },
  });
};

// 启用/禁用功能
const handleToggleStatus = (record) => {
  const newStatus = record.status === 1 ? 0 : 1;
  const action = newStatus === 1 ? '启用' : '禁用';
  
  Modal.confirm({
    title: '确认操作',
    content: `确定要${action}用户"${record.name}"吗？`,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      // 在实际项目中这里应该是调用更新状态API
      const user = mockData.find(item => item.id === record.id);
      if (user) {
        user.status = newStatus;
        fetchData(); // 重新加载数据
        message.success(`${action}成功`);
      }
    },
  });
};

// 新增用户
const handleAdd = () => {
  // 模拟新增用户
  const newUser = {
    id: mockData.length + 1,
    name: `新用户${mockData.length + 1}`,
    age: Math.floor(Math.random() * 30) + 20,
    job: Math.floor(Math.random() * 5) + 1, // 随机分配职业值 1-5
    address: '北京市海淀区',
    status: 1,
    email: `newuser${mockData.length + 1}@example.com`,
    createTime: new Date().toISOString()
  };
  
  mockData.unshift(newUser);
  pagination.current = 1; // 新增后回到第一页
  fetchData();
  message.success('新增用户成功');
};

// 生命周期
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.container {
  padding: 24px;
  background: white;
  border-radius: 8px;
  min-height: 500px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
}
</style>