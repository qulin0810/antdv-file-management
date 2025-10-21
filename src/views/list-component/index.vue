<template>
  <div class="ant-table-demo">
    <a-card title="Ant Design Table 封装示例" class="demo-card">
      <!-- 搜索区域 -->
      <div class="search-area">
        <a-space>
          <a-input
            v-model:value="searchParams.keyword"
            placeholder="搜索关键词"
            style="width: 200px"
          />
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-space>
      </div>

      <!-- 表格区域 -->
      <AntBasicTable
        ref="tableRef"
        :config="tableConfig"
        :data-source="tableData"
        :pagination="pagination"
        @change="handleTableChange"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
        @cell-event="handleCellEvent"
      >
        <!-- 自定义状态列插槽 -->
        <template #statusSlot="{ value }">
          <a-tag :color="getStatusColor(value)">
            {{ getStatusText(value) }}
          </a-tag>
        </template>

        <!-- 自定义操作列插槽 -->
        <template #customOperation="{ record }">
          <a-space>
            <a-button type="link" size="small" @click="handleCustomAction(record)">
              自定义操作
            </a-button>
          </a-space>
        </template>
      </AntBasicTable>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import AntBasicTable from './component/BasicTable.vue';
import type { AntTableConfig, TableData } from './component/type/index';

interface UserData extends TableData {
  id: number;
  name: string;
  age: number;
  status: 'active' | 'inactive' | 'deleted';
  email: string;
  department: string;
  joinDate: string;
}

const tableRef = ref();

const searchParams = reactive({
  keyword: '',
  status: '',
});

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const tableData = ref<UserData[]>([]);

const tableConfig: AntTableConfig = {
  loading: false,
  showIndex: true,
  bordered: true,
  size: 'middle',
  rowSelection: {
    type: 'checkbox',
  },
  pagination: true,
  scroll: { x: 1200 },
  columns: [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      sorter: true,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      align: 'center',
      sorter: (a: UserData, b: UserData) => a.age - b.age,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      slotName: 'statusSlot',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      type: 'switch',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
      type: 'select',
      options: [
        { label: '技术部', value: 'tech' },
        { label: '市场部', value: 'market' },
        { label: '人事部', value: 'hr' },
      ],
    },
    {
      title: '入职日期',
      dataIndex: 'joinDate',
      key: 'joinDate',
      width: 120,
      type: 'date',
      format: {
        type: 'date',
        dateFormat: 'YYYY-MM-DD',
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 200,
      fixed: 'right',
      type: 'operation',
      operation: [
        {
          title: '查看',
          type: 'link',
          onClick: (record: UserData) => handleView(record),
          visible: (record: UserData) => record.status !== 'deleted',
        },
        {
          title: '编辑',
          type: 'primary',
          onClick: (record: UserData) => handleEdit(record),
          disabled: (record: UserData) => record.status === 'deleted',
        },
        {
          title: '删除',
          type: 'danger',
          onClick: (record: UserData) => handleDelete(record),
          visible: (record: UserData) => record.status !== 'deleted',
        },
      ],
    },
    {
      title: '自定义操作',
      dataIndex: 'customOperation',
      key: 'customOperation',
      width: 150,
      slotName: 'customOperation',
    },
  ],
};

const mockData: UserData[] = [
  {
    id: 1,
    name: '张三',
    age: 28,
    status: 'active',
    email: 'zhangsan@example.com',
    department: 'tech',
    joinDate: '2022-01-15',
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    status: 'inactive',
    email: 'lisi@example.com',
    department: 'market',
    joinDate: '2021-08-20',
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    status: 'active',
    email: 'wangwu@example.com',
    department: 'hr',
    joinDate: '2023-03-10',
  },
];

onMounted(() => {
  loadTableData();
});

const loadTableData = () => {
  tableConfig.loading = true;
  
  setTimeout(() => {
    tableData.value = mockData;
    pagination.total = mockData.length;
    tableConfig.loading = false;
  }, 500);
};

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    active: 'green',
    inactive: 'orange',
    deleted: 'red',
  };
  return colorMap[status] || 'default';
};

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    active: '活跃',
    inactive: '非活跃',
    deleted: '已删除',
  };
  return textMap[status] || status;
};

const handleSearch = () => {
  pagination.current = 1;
  loadTableData();
};

const handleReset = () => {
  Object.assign(searchParams, {
    keyword: '',
    status: '',
  });
  pagination.current = 1;
  loadTableData();
};

const handleTableChange = (pag: any, filters: any, sorter: any) => {
  console.log('表格变化:', { pag, filters, sorter });
  Object.assign(pagination, pag);
  loadTableData();
};

const handleRowClick = (record: any, index: number) => {
  console.log('行点击:', record, index);
  message.info(`点击了: ${record.name}`);
};

const handleSelectionChange = (selectedRowKeys: any[], selectedRows: any[]) => {
  console.log('选择变化:', selectedRowKeys, selectedRows);
  message.info(`选中了 ${selectedRows.length} 条数据`);
};

const handleCellEvent = (type: string, value: any, record: any, dataIndex: string) => {
  console.log('单元格事件:', { type, value, record, dataIndex });
  
  switch (type) {
    case 'inputChange':
      message.info(`输入框值改变: ${value}`);
      break;
    case 'selectChange':
      message.info(`选择框值改变: ${value}`);
      break;
    case 'linkClick':
      message.info(`链接点击: ${value}`);
      break;
  }
};

const handleView = (record: UserData) => {
  message.info(`查看: ${record.name}`);
};

const handleEdit = (record: UserData) => {
  message.info(`编辑: ${record.name}`);
};

const handleDelete = (record: UserData) => {
  message.warning(`删除: ${record.name}`);
};

const handleCustomAction = (record: UserData) => {
  message.success(`自定义操作: ${record.name}`);
};
</script>

<style scoped>
.ant-table-demo {
  padding: 24px;
}

.demo-card {
  min-height: 600px;
}

.search-area {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}
</style>