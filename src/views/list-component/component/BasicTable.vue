<template>
  <div class="ant-basic-table">
    <Table
      ref="tableRef"
      :columns="processedColumns"
      :data-source="dataSource"
      :pagination="paginationConfig"
      :row-selection="rowSelectionConfig"
      :loading="config.loading"
      :bordered="config.bordered ?? true"
      :size="config.size ?? 'middle'"
      :scroll="config.scroll"
      @change="handleTableChange"
      @row-click="handleRowClick"
      :row-key="config.rowKey || 'id'"
    >
      <!-- 自定义单元格渲染 -->
      <template #bodyCell="{ column, record, index }">
        <AntTableColumn
          :column="getProcessedColumn(column)"
          :record="record"
          :index="index"
          @cell-event="handleCellEvent"
        >
          <!-- 插槽透传 -->
          <template v-if="getColumnSlotName(column)" #[getColumnSlotName(column)]="{ value, record, index }">
            <slot :name="getColumnSlotName(column)" :value="value" :record="record" :index="index" />
          </template>
        </AntTableColumn>
      </template>

      <!-- 空状态 -->
      <template #emptyText>
        <Empty :description="emptyText" />
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import { Table, Empty } from 'ant-design-vue';
import type { TableProps } from 'ant-design-vue';
import AntTableColumn from './TableColumn.vue';
import type { AntTableConfig, RowSelectionConfig, PaginationConfig } from './type';

interface Props {
  config: AntTableConfig;
  dataSource: any[];
  pagination?: PaginationConfig;
  emptyText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  emptyText: '暂无数据',
  dataSource: () => [],
});

const emit = defineEmits<{
  change: [pagination: any, filters: any, sorter: any, extra: any];
  rowClick: [record: any, index: number];
  selectionChange: [selectedRowKeys: any[], selectedRows: any[]];
  cellEvent: [type: string, value: any, record: any, dataIndex: string];
}>();

const tableRef = ref();

const paginationConfig = computed(() => {
  if (props.config.pagination === false) return false;
  
  const defaultPagination: TableProps['pagination'] = {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
  };

  const mergedPagination = typeof props.config.pagination === 'object'
    ? { ...defaultPagination, ...props.config.pagination }
    : defaultPagination;

  // Remove position property to avoid TypeScript error
  const { position, ...cleanPagination } = mergedPagination as any;
  return cleanPagination;
});

const rowSelectionConfig = computed(() => {
  if (!props.config.rowSelection) return undefined;

  return {
    selectedRowKeys: [],
    onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
      emit('selectionChange', selectedRowKeys, selectedRows);
    },
    ...props.config.rowSelection,
  } as RowSelectionConfig;
});

const processedColumns = computed(() => {
  const columns = [...props.config.columns] as any[];
  
  if (props.config.showIndex) {
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
    // Ensure title is always a string for Ant Design Table compatibility
    title: col.title || '',
  }));
});

const handleTableChange = (pagination: any, filters: any, sorter: any, extra: any) => {
  emit('change', pagination, filters, sorter, extra);
};

const handleRowClick = (record: any, index: number) => {
  emit('rowClick', record, index);
};

const handleCellEvent = (type: string, value: any, record: any, dataIndex: string) => {
  emit('cellEvent', type, value, record, dataIndex);
};

// Helper function to get slot name from column
const getColumnSlotName = (column: any): string | undefined => {
  return column.slotName;
};

// Helper function to convert Ant Design column to our column type
const getProcessedColumn = (column: any) => {
  return {
    ...column,
    title: column.title || '',
    dataIndex: column.dataIndex || column.key,
  };
};

defineExpose({
  getTableRef: () => tableRef.value,
  clearSelection: () => {
    if (tableRef.value) {
      tableRef.value.clearSelection?.();
    }
  },
});
</script>

<style scoped>
.ant-basic-table {
  width: 100%;
}
</style>