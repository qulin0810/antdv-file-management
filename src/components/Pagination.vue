<template>
  <div class="pagination-container">
    <a-pagination
      v-model:current="internalCurrent"
      v-model:page-size="internalPageSize"
      :total="total"
      show-size-changer
      show-quick-jumper
      :show-total="showTotal"
      :page-size-options="pageSizeOptions"
      @change="handleChange"
      @showSizeChange="handleShowSizeChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  current: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 0
  },
  pageSizeOptions: {
    type: Array,
    default: () => ['10', '20', '50', '100']
  }
});

const emit = defineEmits(['update:current', 'update:pageSize', 'change']);

// 内部状态
const internalCurrent = ref(props.current);
const internalPageSize = ref(props.pageSize);

// 监听props变化同步内部状态
watch(() => props.current, (newVal) => {
  internalCurrent.value = newVal;
});

watch(() => props.pageSize, (newVal) => {
  internalPageSize.value = newVal;
});

// 页码变化
const handleChange = (page, pageSize) => {
  internalCurrent.value = page;
  internalPageSize.value = pageSize;
  emit('update:current', page);
  emit('update:pageSize', pageSize);
  emit('change', { current: page, pageSize });
};

// 页面大小变化
const handleShowSizeChange = (current, size) => {
  internalCurrent.value = 1; // 切换页面大小时回到第一页
  internalPageSize.value = size;
  emit('update:current', 1);
  emit('update:pageSize', size);
  emit('change', { current: 1, pageSize: size });
};

// 显示总数
const showTotal = (total) => {
  return `共 ${total} 条记录`;
};
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>