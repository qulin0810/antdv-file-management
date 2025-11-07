<template>
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
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'

defineOptions({
  name: 'UserSearch'
})

const emit = defineEmits<{
  search: [form: { username: string; email: string }]
  reset: []
}>()

const searchFormRef = ref()
const searchForm = reactive({
  username: '',
  email: ''
})

const handleSearch = () => {
  emit('search', { ...searchForm })
}

const handleReset = () => {
  if (searchFormRef.value) {
    searchFormRef.value.resetFields()
  }
  emit('reset')
}
</script>

<style scoped>
.search-area {
  width: 100%;
}
</style>