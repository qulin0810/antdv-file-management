<template>
  <div class="ant-table-column">
    <!-- 输入框列 -->
    <a-input
      v-if="column.type === 'input'"
      :value="getCellValue()"
      :disabled="isDisabled"
      @change="handleInputChange"
      @blur="handleInputBlur"
      @focus="handleInputFocus"
    />

    <!-- 下拉选择列 -->
    <a-select
      v-else-if="column.type === 'select'"
      :value="getCellValue()"
      :options="column.options"
      :disabled="isDisabled"
      @change="handleSelectChange"
      @focus="handleSelectFocus"
      style="width: 100%"
    />

    <!-- 日期选择列 -->
    <a-date-picker
      v-else-if="column.type === 'date'"
      :value="getCellValue() ? dayjs(getCellValue()) : null"
      :disabled="isDisabled"
      @change="handleDateChange"
      style="width: 100%"
    />

    <!-- 链接列 -->
    <a-link
      v-else-if="column.type === 'link'"
      :disabled="isDisabled"
      @click="handleLinkClick"
    >
      {{ getCellValue() }}
    </a-link>

    <!-- Switch开关列 -->
    <a-switch
      v-else-if="column.type === 'switch'"
      :checked="getCellValue()"
      :disabled="isDisabled"
      @change="handleSwitchChange"
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
    <slot
      v-else-if="column.slotName"
      :value="getCellValue()"
      :record="record"
      :index="index"
    />

    <!-- 自定义渲染 -->
    <template v-else-if="column.render">
      {{ column.render(getCellValue(), record, index) }}
    </template>

    <!-- 默认文本渲染 -->
    <span v-else>{{ formatValue(getCellValue(), record) }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import type { AntTableColumn } from './type';

interface Props {
  column: AntTableColumn;
  record: any;
  index: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  cellEvent: [type: string, value: any, record: any, dataIndex: string];
}>();

defineExpose({});

const getCellValue = () => {
  return props.record[props.column.dataIndex];
};

const isDisabled = computed(() => {
  if (typeof props.column.disabled === 'function') {
    return props.column.disabled(props.record);
  }
  return props.column.disabled ?? false;
});

const formatValue = (value: any, record: any) => {
  if (props.column.format) {
    const { type, formatter } = props.column.format;
    if (type === 'custom' && formatter) {
      return formatter(value, record);
    }
  }
  return value;
};

const handleInputChange = (e: any) => {
  const value = e.target?.value ?? e;
  emit('cellEvent', 'inputChange', value, props.record, props.column.dataIndex);
};

const handleInputBlur = (e: any) => {
  emit('cellEvent', 'inputBlur', e.target.value, props.record, props.column.dataIndex);
};

const handleInputFocus = (e: any) => {
  emit('cellEvent', 'inputFocus', e.target.value, props.record, props.column.dataIndex);
};

const handleSelectChange = (value: any) => {
  emit('cellEvent', 'selectChange', value, props.record, props.column.dataIndex);
};

const handleSelectFocus = () => {
  emit('cellEvent', 'selectFocus', getCellValue(), props.record, props.column.dataIndex);
};

const handleDateChange = (date: any) => {
  const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
  emit('cellEvent', 'dateChange', formattedDate, props.record, props.column.dataIndex);
};

const handleLinkClick = () => {
  emit('cellEvent', 'linkClick', getCellValue(), props.record, props.column.dataIndex);
};

const handleSwitchChange = (checked: boolean) => {
  emit('cellEvent', 'switchChange', checked, props.record, props.column.dataIndex);
};
</script>

<style scoped>
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