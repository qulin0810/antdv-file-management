<template>
  <div class="search-area mb-6">
    <a-form
      ref="searchFormRef"
      :model="searchForm"
      layout="inline"
      @finish="$emit('search', searchForm)"
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
import { ref, reactive } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'

export interface SearchForm {
  username: string
  email: string
}

interface Emits {
  (e: 'search', form: SearchForm): void
  (e: 'reset'): void
}

const emit = defineEmits<Emits>()

const searchFormRef = ref<FormInstance>()
const searchForm = reactive<SearchForm>({
  username: '',
  email: ''
})

const handleReset = () => {
  searchFormRef.value?.resetFields()
  emit('reset')
}
</script>

<script lang="ts">
export default {
  name: 'UserSearch'
}
</script>

<style scoped>
.search-area {
  width: 100%;
}
</style>