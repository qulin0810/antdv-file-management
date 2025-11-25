import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { setLocale, getCurrentLocale, getAntdLocale, getDayjsLocale, type LocaleType } from '@/locales'
import dayjs from 'dayjs'

export const useLanguageStore = defineStore('language', () => {
  const currentLocale = ref<LocaleType>(getCurrentLocale())

  // 切换语言
  const switchLanguage = (locale: LocaleType) => {
    setLocale(locale)
    currentLocale.value = locale
    
    // 更新 Day.js 语言设置
    const dayjsLocale = getDayjsLocale()
    dayjs.locale(dayjsLocale)
  }

  // 获取当前语言
  const getLocale = () => currentLocale.value

  // 获取 Ant Design locale
  const getAntdLocaleConfig = () => getAntdLocale()

  // 监听语言变化
  watch(currentLocale, (newLocale) => {
    // 可以在这里添加语言变化时的其他逻辑
    console.log(`Language changed to: ${newLocale}`)
  })

  return {
    currentLocale,
    switchLanguage,
    getLocale,
    getAntdLocaleConfig
  }
})