<template>
  <a-dropdown :trigger="['click']" placement="bottomRight">
    <a-button type="text" class="language-switcher">
      <div class="flex items-center gap-2">
        <img 
          :src="currentFlag" 
          :alt="currentLanguageName"
          class="w-5 h-5 rounded-sm"
        />
        <span class="text-white">{{ currentLanguageName }}</span>
      </div>
    </a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item 
          v-for="language in languages" 
          :key="language.value"
          @click="switchLanguage(language.value)"
          :class="{ 'ant-menu-item-selected': currentLocale === language.value }"
        >
          <div class="flex items-center gap-2">
            <img 
              :src="language.flag" 
              :alt="language.name"
              class="w-5 h-5 rounded-sm"
            />
            <span>{{ language.name }}</span>
          </div>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'
import type { LocaleType } from '@/locales'

const { t } = useI18n()
const languageStore = useLanguageStore()

// 语言配置
const languages = [
  {
    value: 'zh-CN' as LocaleType,
    name: t('language.chinese'),
    flag: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHJlY3QgZmlsbD0iI2RlMjkxOSIgaGVpZ2h0PSIzMiIgd2lkdGg9IjMyIi8+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgZmlsbD0iI2ZmZiIgcj0iNiIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIGZpbGw9IiNkZTI5MTkiIHI9IjQiLz48L3N2Zz4='
  },
  {
    value: 'en-US' as LocaleType,
    name: t('language.english'),
    flag: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHJlY3QgZmlsbD0iIzAyMjE2OSIgaGVpZ2h0PSIzMiIgd2lkdGg9IjMyIi8+PHBhdGggZD0iTTAgMEgxNlYxNkgwWiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xNiAwSDMyVjE2SDE2WiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0wIDE2SDE2VjMySDBaIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTE2IDE2SDMyVjMySDE2WiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0wIDBIMzJWNEgwWiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0wIDhIMzJWMTJIMHoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMCAxNkgzMlYyMEgwWiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0wIDI0SDMyVjI4SDBaIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTQgMEg4VjMySDRaIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTEyIDBIMTZWMzJIMTJaIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTIwIDBIMjRWMzJIMjBaIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTI4IDBIMzJWMzJIMjhaIiBmaWxsPSIjZmZmIi8+PC9zdmc+'
  }
]

// 当前语言
const currentLocale = computed(() => languageStore.currentLocale)

// 当前语言对应的国旗和名称
const currentLanguage = computed(() => 
  languages.find(lang => lang.value === currentLocale.value) || languages[0]
)

const currentFlag = computed(() => currentLanguage.value.flag)
const currentLanguageName = computed(() => currentLanguage.value.name)

// 切换语言
const switchLanguage = (locale: LocaleType) => {
  languageStore.switchLanguage(locale)
}
</script>

<style scoped>
.language-switcher {
  color: white;
  border: none;
  padding: 4px 8px;
}

.language-switcher:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.ant-dropdown-menu-item-selected) {
  background-color: #f0f2f5;
}
</style>