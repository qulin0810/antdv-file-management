<template>
  <a-config-provider :locale="antdLocale" :theme="theme">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useLanguageStore } from '@/stores/language'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'

const languageStore = useLanguageStore()

// 动态 Ant Design locale
const antdLocale = computed(() => {
  const locale = languageStore.getAntdLocaleConfig()
  return locale === 'zh_CN' ? zhCN : enUS
})

// 动态 Day.js locale
watch(
  () => languageStore.currentLocale,
  (newLocale) => {
    const dayjsLocale = newLocale === 'zh-CN' ? 'zh-cn' : 'en'
    dayjs.locale(dayjsLocale)
  },
  { immediate: true }
)

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#6eceb6',
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>