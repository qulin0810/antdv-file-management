<template>
  <a-layout class="h-full">
    <!-- 头部 - 固定不变 -->
    <a-layout-header class="header px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50" style="background-color: #00857c;">
      <div class="flex items-center">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger mr-4"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger mr-4"
          @click="() => (collapsed = !collapsed)"
        />
        <a-breadcrumb>
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item>{{ currentRouteTitle }}</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="flex items-center gap-4">
        <a-dropdown>
          <a class="ant-dropdown-link" @click.prevent>
            <user-outlined class="mr-1" />
            管理员
            <down-outlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <user-outlined />
                个人中心
              </a-menu-item>
              <a-menu-item>
                <setting-outlined />
                设置
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item>
                <logout-outlined />
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>

    <!-- 主体内容区域 -->
    <a-layout class="mt-16">
      <!-- 侧边栏 -->
      <a-layout-sider
        v-model:collapsed="collapsed"
        :trigger="null"
        collapsible
        class="sider"
        style="background-color: #ffffff;"
      >
        <div class="logo" style="background-color: #00857c;">
          <h2 v-if="!collapsed" class="text-white text-center">文件管理系统</h2>
          <h2 v-else class="text-white text-center">管理</h2>
        </div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="light"
          mode="inline"
          :items="menuItems"
          @click="handleMenuClick"
        />
      </a-layout-sider>

      <!-- 内容区域 -->
      <a-layout-content
        class="content p-4 overflow-auto"
        :style="{ marginLeft: collapsed ? '80px' : '200px' }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, h, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  FolderOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const selectedKeys = ref<string[]>([route.name as string])

// 监听路由变化更新选中菜单
watch(() => route.name, (newName) => {
  if (newName) {
    selectedKeys.value = [newName as string]
  }
})

// 图标映射
const iconMap: Record<string, any> = {
  dashboard: DashboardOutlined,
  folder: FolderOutlined,
  user: UserOutlined
}

// 从路由生成菜单项
const menuItems = computed(() => {
  const layoutRoute = router.getRoutes().find(route =>
    route.path === '/' && route.children && route.children.length > 0
  )
  
  if (!layoutRoute?.children) return []

  return layoutRoute.children
    .filter(child => child.meta && child.meta.title)
    .map(child => {
      const iconName = child.meta?.icon as string
      const iconComponent = iconMap[iconName] || UserOutlined
      
      const menuItem: any = {
        key: child.name as string,
        icon: () => h(iconComponent),
        label: child.meta?.title as string
      }

      // 处理子路由
      if (child.children && child.children.length > 0) {
        menuItem.children = child.children
          .filter(subChild => subChild.meta?.title)
          .map(subChild => ({
            key: subChild.name as string,
            label: subChild.meta?.title as string
          }))
      }

      return menuItem
    })
})

const currentRouteTitle = computed(() => {
  // 查找当前路由对应的菜单项
  const findMenuItem = (items: any[], targetName: string): any => {
    for (const item of items) {
      if (item.key === targetName) {
        return item
      }
      if (item.children) {
        const found = findMenuItem(item.children, targetName)
        if (found) return found
      }
    }
    return null
  }
  
  const currentMenuItem = findMenuItem(menuItems.value, route.name as string)
  return currentMenuItem?.label || '未知页面'
})

const handleMenuClick = ({ key }: { key: string }) => {
  router.push({ name: key })
}
</script>

<style scoped>
.sider {
  overflow: auto;
  height: calc(100vh - 64px);
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  z-index: 100;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px;
  border-radius: 6px;
}

.header {
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  height: 64px;
  line-height: 64px;
}

.content {
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
  transition: margin-left 0.2s;
}

/* 左侧菜单悬停样式 */
:deep(.ant-menu-light .ant-menu-item:hover) {
  background-color: #6eceb2 !important;
  color: #000000 !important;
}

:deep(.ant-menu-light .ant-menu-item-selected) {
  background-color: #6eceb2 !important;
  color: #000000 !important;
}

:deep(.ant-menu-light .ant-menu-submenu-title:hover) {
  background-color: #6eceb2 !important;
  color: #000000 !important;
}
</style>