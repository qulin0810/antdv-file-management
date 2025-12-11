# Ant Design Vue Table 封装组件

这是一个基于 Ant Design Vue 的表格组件封装，提供了更便捷的配置方式和丰富的功能。

## 组件结构

```
list-component/
├── index.vue                    # 主页面示例
├── component/
│   ├── BasicTable.vue           # 基础表格组件
│   ├── TableColumn.vue          # 表格列组件
│   └── type/
│       └── index.ts             # TypeScript 类型定义
└── README.md                    # 本文档
```

## 快速开始

### 1. 基础用法

```vue
<template>
  <AntBasicTable
    :config="tableConfig"
    :data-source="tableData"
    :pagination="pagination"
    @change="handleTableChange"
  />
</template>

<script setup lang="ts">
import AntBasicTable from './component/BasicTable.vue';
import type { AntTableConfig } from './component/type';

const tableConfig: AntTableConfig = {
  loading: false,
  showIndex: true,
  bordered: true,
  size: 'middle',
  pagination: true,
  columns: [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      align: 'center',
    },
  ],
};

const tableData = ref([
  { id: 1, name: '张三', age: 28 },
  { id: 2, name: '李四', age: 32 },
]);

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 2,
});
</script>
```

### 2. 列类型支持

#### 文本列
```typescript
{
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
  width: 120,
}
```

#### 输入框列
```typescript
{
  title: '备注',
  dataIndex: 'remark',
  key: 'remark',
  type: 'input',
  placeholder: '请输入备注',
}
```

#### 下拉选择列
```typescript
{
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  type: 'select',
  options: [
    { label: '启用', value: 'active' },
    { label: '禁用', value: 'inactive' },
  ],
}
```

#### 日期选择列
```typescript
{
  title: '创建时间',
  dataIndex: 'createTime',
  key: 'createTime',
  type: 'date',
  format: {
    type: 'date',
    dateFormat: 'YYYY-MM-DD',
  },
}
```

#### 操作列
```typescript
{
  title: '操作',
  dataIndex: 'operation',
  key: 'operation',
  type: 'operation',
  operation: [
    {
      title: '查看',
      type: 'link',
      onClick: (record) => handleView(record),
      visible: (record) => record.status !== 'deleted',
    },
    {
      title: '编辑',
      type: 'primary',
      onClick: (record) => handleEdit(record),
      disabled: (record) => record.status === 'deleted',
    },
  ],
}
```

#### 自定义插槽列
```typescript
{
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  slotName: 'statusSlot',
}
```

```vue
<template>
  <AntBasicTable :config="tableConfig" :data-source="tableData">
    <template #statusSlot="{ value }">
      <a-tag :color="getStatusColor(value)">
        {{ getStatusText(value) }}
      </a-tag>
    </template>
  </AntBasicTable>
</template>
```

### 3. 表格配置

#### 基础配置
```typescript
const tableConfig: AntTableConfig = {
  loading: false,           // 加载状态
  showIndex: true,          // 显示序号列
  bordered: true,           // 边框
  size: 'middle',           // 表格大小
  pagination: true,         // 分页
  scroll: { x: 1200 },      // 滚动配置
  rowSelection: {           // 行选择配置
    type: 'checkbox',
  },
  columns: [],              // 列配置
};
```

#### 分页配置
```typescript
const pagination = {
  current: 1,               // 当前页
  pageSize: 10,             // 每页大小
  total: 100,               // 总条数
  showSizeChanger: true,    // 显示页大小切换器
  showQuickJumper: true,    // 显示快速跳转
};
```

### 4. 事件处理

```vue
<template>
  <AntBasicTable
    :config="tableConfig"
    :data-source="tableData"
    @change="handleTableChange"
    @row-click="handleRowClick"
    @selection-change="handleSelectionChange"
    @cell-event="handleCellEvent"
  />
</template>

<script setup lang="ts">
const handleTableChange = (pagination, filters, sorter) => {
  console.log('表格变化:', { pagination, filters, sorter });
};

const handleRowClick = (record, index) => {
  console.log('行点击:', record, index);
};

const handleSelectionChange = (selectedRowKeys, selectedRows) => {
  console.log('选择变化:', selectedRowKeys, selectedRows);
};

const handleCellEvent = (type, value, record, dataIndex) => {
  console.log('单元格事件:', { type, value, record, dataIndex });
};
</script>
```

### 5. 高级功能

#### 行选择
```typescript
const tableConfig: AntTableConfig = {
  rowSelection: {
    type: 'checkbox', // 或 'radio'
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('选中行:', selectedRows);
    },
  },
  // ... 其他配置
};
```

#### 自定义渲染
```typescript
{
  title: '自定义列',
  dataIndex: 'custom',
  key: 'custom',
  render: (value, record, index) => {
    return h('div', { class: 'custom-cell' }, `自定义内容: ${value}`);
  },
}
```

#### 格式化配置
```typescript
{
  title: '金额',
  dataIndex: 'amount',
  key: 'amount',
  format: {
    type: 'currency',
    formatter: (value) => `¥${value}`,
  },
}
```

## 类型定义

完整的类型定义请参考 `src/views/list-component/component/type/index.ts` 文件。

## 权限控制

项目集成了基于权限的显示控制，通过自定义指令 `v-permission` 实现。

### 1. 权限存储

用户权限存储在 `auth` store 中，登录后会自动加载权限列表。权限是一个字符串数组，例如 `['PER_VIEW_APP_MGMT', 'PER_EDIT_APP_MGMT']`。

### 2. 使用 v-permission 指令

在模板中，可以直接在元素上使用 `v-permission` 指令，传入权限字符串或数组。如果用户没有相应权限，该元素将被移除。

#### 单个权限
```vue
<template>
  <a-button type="primary" v-permission="'PER_VIEW_APP_MGMT'">查看应用管理</a-button>
</template>
```

#### 多个权限（任一）
```vue
<template>
  <div v-permission="['PER_EDIT_APP_MGMT', 'PER_DELETE_APP_MGMT']">
    拥有编辑或删除权限时显示
  </div>
</template>
```

#### 在表格操作列中使用
在表格配置的 `operation` 中，可以使用 `permission` 字段控制按钮的显示：
```typescript
{
  title: '编辑',
  type: 'primary',
  onClick: (record) => handleEdit(record),
  permission: 'PER_EDIT_APP_MGMT'
}
```

### 3. 程序化检查

在脚本中，可以使用 `useAuthStore().hasPermission(permission)` 进行权限检查：

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const canView = authStore.hasPermission('PER_VIEW_APP_MGMT')
</script>
```

### 4. 模拟权限

默认情况下，使用 `admin/123456` 登录的用户将拥有 `PER_VIEW_APP_MGMT` 和 `PER_EDIT_APP_MGMT` 权限。可以根据需要修改 `src/stores/auth.ts` 中的模拟数据。

## 注意事项

1. **数据源**: 确保 `dataSource` 是一个响应式数组
2. **分页**: 分页配置需要与后端接口配合使用
3. **事件处理**: 所有事件都会冒泡到父组件，便于统一处理
4. **性能**: 对于大数据量表格，建议使用虚拟滚动
5. **权限**: 权限指令仅在客户端进行显示控制，敏感操作仍需后端验证

## 常见问题

### Q: 表格不显示数据？
A: 检查 `dataSource` 是否正确赋值，确保数据格式正确。

### Q: 分页不生效？
A: 检查 `pagination` 配置是否正确，确保 `total` 属性有值。

### Q: 自定义插槽不显示？
A: 确保 `slotName` 与模板中的插槽名称一致。

### Q: TypeScript 类型错误？
A: 确保正确导入类型定义，并使用正确的类型注解。

### Q: v-permission 指令不生效？
A: 检查用户是否已登录并拥有相应权限，同时确保指令已正确注册（在 `main.ts` 中）。