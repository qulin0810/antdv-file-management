import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'
import enUS from './en-US.json'

// 定义支持的语言类型
export type LocaleType = 'zh-CN' | 'en-US'

// 语言配置
export const locales = {
  'zh-CN': {
    name: '中文',
    antdLocale: 'zh_CN',
    dayjsLocale: 'zh-cn',
    messages: zhCN
  },
  'en-US': {
    name: 'English',
    antdLocale: 'en_US',
    dayjsLocale: 'en',
    messages: enUS
  }
} as const

// 默认语言
const defaultLocale: LocaleType = 'zh-CN'

// 从本地存储获取语言设置
const getSavedLocale = (): LocaleType => {
  const saved = localStorage.getItem('locale') as LocaleType
  return saved && locales[saved] ? saved : defaultLocale
}

// 创建 i18n 实例
export const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getSavedLocale(),
  fallbackLocale: defaultLocale,
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

// 切换语言函数
export const setLocale = (locale: LocaleType) => {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
}

// 获取当前语言
export const getCurrentLocale = (): LocaleType => {
  return i18n.global.locale.value as LocaleType
}

// 获取 Ant Design 对应的 locale
export const getAntdLocale = () => {
  const currentLocale = getCurrentLocale()
  return locales[currentLocale].antdLocale
}

// 获取 Day.js 对应的 locale
export const getDayjsLocale = () => {
  const currentLocale = getCurrentLocale()
  return locales[currentLocale].dayjsLocale
}

export default i18n