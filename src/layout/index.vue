<template>
  <a-layout class="h-full">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="sider"
    >
      <div class="logo">
        <h2 v-if="!collapsed" class="text-white text-center">文件管理系统</h2>
        <h2 v-else class="text-white text-center">管理</h2>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </a-layout-sider>

    <!-- 主内容区域 -->
    <a-layout>
      <!-- 头部 -->
      <a-layout-header
        class="header bg-white px-4 flex items-center justify-between"
        :style="{ marginLeft: `${contentMarginLeft}px` }"
      >
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

      <!-- 内容区域 -->
      <a-layout-content
        class="content p-4 overflow-auto"
        :style="{ marginLeft: `${contentMarginLeft}px` }"
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

const menuItems = [
  {
    key: 'Dashboard',
    icon: () => h(DashboardOutlined),
    label: '仪表板'
  },
  {
    key: 'FileManagement',
    icon: () => h(FolderOutlined),
    label: '文件管理'
  },
  {
    key: 'UserManagement',
    icon: () => h(UserOutlined),
    label: '用户管理'
  },
  {
    key: 'TestManagement',
    icon: () => h(UserOutlined),
    label: '测试列表'
  },
  {
    key: 'FileComponent',
    icon: () => h(UserOutlined),
    label: '组件列表',
    children: [
      {
        key: 'ComponentOverview',
        label: '组件概览'
      },
      {
        key: 'BasicTableDemo',
        label: '基础表格'
      },
      {
        key: 'SwitchDemo',
        label: 'Switch演示'
      },
      {
        key: 'FormModalDemo',
        label: '表单弹窗'
      }
    ]
  }
]

const currentRouteTitle = computed(() => {
  const currentRoute = menuItems.find(item => item.key === route.name)
  return currentRoute?.label || '未知页面'
})

const contentMarginLeft = computed(() => {
  return collapsed.value ? 80 : 200
})

const handleMenuClick = ({ key }: { key: string }) => {
  router.push({ name: key })
}
</script>

<style scoped>
.sider {
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  margin: 16px;
  border-radius: 6px;
}

.header {
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 99;
  transition: margin-left 0.2s;
}

.content {
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
  transition: margin-left 0.2s;
}
</style>