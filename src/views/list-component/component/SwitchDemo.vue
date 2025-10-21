<template>
  <div class="switch-demo">
    <a-card title="Switch 开关列演示" class="demo-card">
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
      <div class="ant-basic-table">
        <a-table
          ref="tableRef"
          :columns="processedColumns"
          :data-source="tableData"
          :pagination="paginationConfig"
          :row-selection="rowSelectionConfig"
          :loading="tableConfig.loading"
          :bordered="tableConfig.bordered ?? true"
          :size="tableConfig.size ?? 'middle'"
          :scroll="tableConfig.scroll"
          @change="handleTableChange"
          @row-click="handleRowClick"
          row-key="id"
        >
          <!-- 自定义单元格渲染 -->
          <template #bodyCell="{ column, record, index }">
            <div class="ant-table-column">
              <!-- 输入框列 -->
              <a-input
                v-if="column.type === 'input'"
                :value="getCellValue(column, record)"
                :disabled="isDisabled(column, record)"
                @change="(e) => handleCellEvent('inputChange', e.target?.value ?? e, record, column.dataIndex)"
                @blur="(e) => handleCellEvent('inputBlur', e.target.value, record, column.dataIndex)"
                @focus="(e) => handleCellEvent('inputFocus', e.target.value, record, column.dataIndex)"
              />

              <!-- 下拉选择列 -->
              <a-select
                v-else-if="column.type === 'select'"
                :value="getCellValue(column, record)"
                :options="column.options"
                :disabled="isDisabled(column, record)"
                @change="(value) => handleCellEvent('selectChange', value, record, column.dataIndex)"
                @focus="() => handleCellEvent('selectFocus', getCellValue(column, record), record, column.dataIndex)"
                style="width: 100%"
              />

              <!-- 日期选择列 -->
              <a-date-picker
                v-else-if="column.type === 'date'"
                :value="getCellValue(column, record) ? dayjs(getCellValue(column, record)) : null"
                :disabled="isDisabled(column, record)"
                @change="(date) => handleCellEvent('dateChange', date ? dayjs(date).format('YYYY-MM-DD') : null, record, column.dataIndex)"
                style="width: 100%"
              />

              <!-- 链接列 -->
              <a-link
                v-else-if="column.type === 'link'"
                :disabled="isDisabled(column, record)"
                @click="() => handleCellEvent('linkClick', getCellValue(column, record), record, column.dataIndex)"
              >
                {{ getCellValue(column, record) }}
              </a-link>

              <!-- Switch开关列 -->
              <a-switch
                v-else-if="column.type === 'switch'"
                :checked="getCellValue(column, record)"
                :disabled="isDisabled(column, record)"
                @change="(checked) => handleCellEvent('switchChange', checked, record, column.dataIndex)"
              />

              <!-- 操作列 -->
              <div v-else-if="column.type === 'operation'" class="operation-buttons">
                <template v-for="(op, idx) in column.operation" :key="idx">
                  <a-button
                    v-if="op.visible?.(record) !== false"
                    :type="op.type || 'default'"
                    :disabled="op.disabled?.(record)"
                    size="small"
                    @click="() => op.onClick(record)"
                    class="operation-btn"
                  >
                    {{ op.title }}
                  </a-button>
                </template>
              </div>

              <!-- 自定义插槽 -->
              <template v-else-if="column.slotName">
                <slot
                  :name="column.slotName"
                  :value="getCellValue(column, record)"
                  :record="record"
                  :index="index"
                />
              </template>

              <!-- 自定义渲染 -->
              <template v-else-if="column.render">
                {{ column.render(getCellValue(column, record), record, index) }}
              </template>

              <!-- 默认文本渲染 -->
              <span v-else>{{ formatValue(getCellValue(column, record), record, column) }}</span>
            </div>
          </template>

          <!-- 空状态 -->
          <template #emptyText>
            <a-empty :description="emptyText" />
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import type { AntTableConfig } from './type/index';

interface UserData {
  id: number;
  name: string;
  age: number;
  status: 'active' | 'inactive' | 'deleted';
  email: string;
  department: string;
  joinDate: string;
  enabled: boolean;
  notifications: boolean;
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
  scroll: { x: 1400 },
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
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      align: 'center',
      type: 'switch',
    },
    {
      title: '通知',
      dataIndex: 'notifications',
      key: 'notifications',
      width: 100,
      align: 'center',
      type: 'switch',
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
    enabled: true,
    notifications: false,
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    status: 'inactive',
    email: 'lisi@example.com',
    department: 'market',
    joinDate: '2021-08-20',
    enabled: false,
    notifications: true,
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    status: 'active',
    email: 'wangwu@example.com',
    department: 'hr',
    joinDate: '2023-03-10',
    enabled: true,
    notifications: true,
  },
];

const emptyText = '暂无数据';

const paginationConfig = computed(() => {
  if (!tableConfig.pagination) return false;
  
  const defaultPagination = {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
  };

  return typeof tableConfig.pagination === 'object'
    ? { ...defaultPagination, ...tableConfig.pagination }
    : defaultPagination;
});

const rowSelectionConfig = computed(() => {
  if (!tableConfig.rowSelection) return undefined;

  return {
    selectedRowKeys: [],
    onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
      handleSelectionChange(selectedRowKeys, selectedRows);
    },
    ...tableConfig.rowSelection,
  };
});

const processedColumns = computed(() => {
  const columns = [...tableConfig.columns] as any[];
  
  if (tableConfig.showIndex) {
    columns.unshift({
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_: any, __: any, index: number) => {
        const pagination = paginationConfig.value;
        if (pagination && typeof pagination === 'object') {
          return (pagination.current! - 1) * pagination.pageSize! + index + 1;
        }
        return index + 1;
      },
    });
  }

  return columns.map(col => ({
    ...col,
    title: col.title || '',
  }));
});

const getCellValue = (column: any, record: any) => {
  return record[column.dataIndex];
};

const isDisabled = (column: any, record: any) => {
  if (typeof column.disabled === 'function') {
    return column.disabled(record);
  }
  return column.disabled ?? false;
};

const formatValue = (value: any, record: any, column: any) => {
  if (column.format) {
    const { type, formatter } = column.format;
    if (type === 'custom' && formatter) {
      return formatter(value, record);
    }
  }
  return value;
};

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
  message.success(`点击了行: ${record.name} (索引: ${index})`);
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
    case 'switchChange':
      message.success(`Switch状态改变: ${dataIndex} = ${value}`);
      // 在实际项目中，这里应该调用API更新数据
      const user = mockData.find(item => item.id === record.id);
      if (user) {
        (user as any)[dataIndex] = value;
      }
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
.switch-demo {
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

.ant-basic-table {
  width: 100%;
}

.ant-table-column {
  display: flex;
  align-items: center;
  min-height: 32px;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.operation-btn {
  white-space: nowrap;
}
</style>