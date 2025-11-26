<template>
  <div class="i18n-demo">
    <a-card title="i18n 翻译功能演示" class="demo-card">
      <a-space direction="vertical" size="large" style="width: 100%">
        
        <!-- 1. 带参数的翻译 -->
        <a-card title="1. 带参数的翻译" size="small">
          <a-space direction="vertical">
            <div><strong>欢迎消息:</strong> {{ welcomeMessage }}</div>
            <div><strong>用户信息:</strong> {{ userInfo }}</div>
            <div><strong>搜索结果:</strong> {{ searchResults }}</div>
            <div><strong>分页信息:</strong> {{ paginationInfo }}</div>
          </a-space>
        </a-card>

        <!-- 2. 翻译拼接带空格 -->
        <a-card title="2. 翻译拼接带空格" size="small">
          <a-space direction="vertical">
            <div><strong>方法1 - 直接拼接:</strong> {{ directConcatenation }}</div>
            <div><strong>方法2 - 模板字符串:</strong> {{ templateConcatenation }}</div>
            <div><strong>方法3 - 参数化拼接:</strong> {{ parameterizedConcatenation }}</div>
            <div><strong>方法4 - 翻译文件中拼接:</strong> {{ fullName }}</div>
          </a-space>
        </a-card>

        <!-- 3. 动态参数演示 -->
        <a-card title="3. 动态参数演示" size="small">
          <a-space direction="vertical">
            <a-input v-model:value="dynamicName" placeholder="输入姓名" style="width: 200px" />
            <a-input v-model:value="dynamicKeyword" placeholder="输入搜索关键词" style="width: 200px" />
            <a-input-number v-model:value="dynamicCount" :min="0" placeholder="输入数量" style="width: 200px" />
            <div><strong>动态欢迎消息:</strong> {{ dynamicWelcomeMessage }}</div>
            <div><strong>动态搜索结果:</strong> {{ dynamicSearchResults }}</div>
          </a-space>
        </a-card>

        <!-- 4. 复杂场景示例 -->
        <a-card title="4. 复杂场景示例" size="small">
          <a-space direction="vertical">
            <div><strong>表单验证消息:</strong> {{ validationMessage }}</div>
            <div><strong>操作确认消息:</strong> {{ confirmMessage }}</div>
            <div><strong>状态消息:</strong> {{ statusMessage }}</div>
          </a-space>
        </a-card>

      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 1. 带参数的翻译示例
const welcomeMessage = computed(() => 
  t('userManagement.welcomeMessage', { 
    name: '张三', 
    date: '2024-01-01' 
  })
)

const userInfo = computed(() => 
  t('userManagement.userInfo', {
    username: 'zhangsan',
    role: t('userManagement.admin'),
    status: t('userManagement.active')
  })
)

const searchResults = computed(() => 
  t('userManagement.searchResults', {
    count: 25,
    keyword: 'Vue'
  })
)

const paginationInfo = computed(() => 
  t('userManagement.paginationInfo', {
    start: 1,
    end: 10,
    total: 100
  })
)

// 2. 翻译拼接带空格示例
const directConcatenation = computed(() => 
  t('userManagement.firstName') + ' ' + t('userManagement.lastName')
)

const templateConcatenation = computed(() => 
  `${t('userManagement.part1')} ${t('userManagement.part2')}`
)

const parameterizedConcatenation = computed(() => 
  t('userManagement.combinedMessage', {
    part1: t('userManagement.part1'),
    part2: t('userManagement.part2')
  })
)

const fullName = computed(() => 
  t('userManagement.fullName', {
    firstName: t('userManagement.firstName'),
    lastName: t('userManagement.lastName')
  })
)

// 3. 动态参数演示
const dynamicName = ref('李四')
const dynamicKeyword = ref('React')
const dynamicCount = ref(15)

const dynamicWelcomeMessage = computed(() => 
  t('userManagement.welcomeMessage', {
    name: dynamicName.value,
    date: new Date().toLocaleDateString()
  })
)

const dynamicSearchResults = computed(() => 
  t('userManagement.searchResults', {
    count: dynamicCount.value,
    keyword: dynamicKeyword.value
  })
)

// 4. 复杂场景示例
const validationMessage = computed(() => 
  t('userManagement.enterCorrectEmail')
)

const confirmMessage = computed(() =>
  t('userManagement.confirmDeleteWithName', { username: '示例用户' })
)

const statusMessage = computed(() => 
  `${t('userManagement.user')}: ${t('userManagement.active')} | ${t('userManagement.job')}: ${t('userManagement.engineer')}`
)
</script>

<style scoped>
.i18n-demo {
  padding: 20px;
}

.demo-card {
  max-width: 800px;
  margin: 0 auto;
}

:deep(.ant-card-head-title) {
  font-weight: 600;
}
</style>