<template>
  <div class="user-hierarchy-tree">
    <a-card :title="title" :bordered="false">
      <template #extra>
        <a-space>
          <a-button type="link" size="small" @click="expandAll">
            <template #icon><vertical-right-outlined /></template>
            展开全部
          </a-button>
          <a-button type="link" size="small" @click="collapseAll">
            <template #icon><vertical-left-outlined /></template>
            折叠全部
          </a-button>
        </a-space>
      </template>

      <a-tree
        v-if="treeData.length > 0"
        :tree-data="treeData"
        :field-names="fieldNames"
        :default-expand-all="defaultExpandAll"
        :show-line="showLine"
        :show-icon="showIcon"
        :block-node="true"
        @select="handleSelect"
      >
        <template #title="{ title, dataRef }">
          <div class="tree-node-title">
            <span class="username">{{ dataRef.username }}</span>
            <a-space class="node-info" size="small">
              <a-tag :color="getRoleColor(dataRef.role)" size="small">
                {{ getRoleLabel(dataRef.role) }}
              </a-tag>
              <a-tag :color="getStatusColor(dataRef.status)" size="small">
                {{ getStatusLabel(dataRef.status) }}
              </a-tag>
              <span v-if="dataRef.email" class="email">{{ dataRef.email }}</span>
            </a-space>
          </div>
        </template>
        
        <template #icon="{ dataRef }">
          <component :is="getIconForNode(dataRef)" :style="{ color: getIconColor(dataRef) }" />
        </template>
      </a-tree>
      
      <a-empty v-else description="暂无层级数据" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  CrownOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExpandOutlined,
  VerticalRightOutlined,
  VerticalLeftOutlined
} from '@ant-design/icons-vue'
import type { TreeNode } from '../types'

interface Props {
  treeData: TreeNode[]
  title?: string
  defaultExpandAll?: boolean
  showLine?: boolean
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '用户层级关系',
  defaultExpandAll: false,
  showLine: true,
  showIcon: true
})

const emit = defineEmits<{
  select: [node: TreeNode]
}>()

const fieldNames = {
  children: 'children',
  title: 'title',
  key: 'key'
}

const expandedKeys = ref<string[]>([])

// 获取角色颜色
const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    admin: 'red',
    useradmin: 'volcano',
    guestadmin: 'orange',
    user: 'blue',
    guest: 'green'
  }
  return colors[role] || 'default'
}

// 获取角色标签
const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    admin: '超级管理员',
    useradmin: '用户管理员',
    guestadmin: '访客管理员',
    user: '普通用户',
    guest: '访客'
  }
  return labels[role] || role
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'green',
    inactive: 'red',
    pending: 'orange'
  }
  return colors[status] || 'default'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: '活跃',
    inactive: '禁用',
    pending: '待审核'
  }
  return labels[status] || status
}

// 获取节点图标
const getIconForNode = (node: TreeNode) => {
  switch (node.role) {
    case 'admin':
      return CrownOutlined
    case 'useradmin':
    case 'guestadmin':
      return SafetyOutlined
    case 'user':
      return UserOutlined
    case 'guest':
      return TeamOutlined
    default:
      return UserOutlined
  }
}

// 获取图标颜色
const getIconColor = (node: TreeNode) => {
  switch (node.status) {
    case 'active':
      return '#52c41a'
    case 'inactive':
      return '#ff4d4f'
    case 'pending':
      return '#faad14'
    default:
      return '#d9d9d9'
  }
}

// 处理节点选择
const handleSelect = (selectedKeys: string[], { node, selected }: any) => {
  if (selected && node.dataRef) {
    emit('select', node.dataRef)
  }
}

// 展开全部节点
const expandAll = () => {
  const getAllKeys = (nodes: TreeNode[]): string[] => {
    let keys: string[] = []
    nodes.forEach(node => {
      keys.push(node.key)
      if (node.children && node.children.length > 0) {
        keys = keys.concat(getAllKeys(node.children))
      }
    })
    return keys
  }
  expandedKeys.value = getAllKeys(props.treeData)
}

// 折叠全部节点
const collapseAll = () => {
  expandedKeys.value = []
}

// 监听树数据变化，自动展开第一层
watch(() => props.treeData, (newData) => {
  if (newData.length > 0 && props.defaultExpandAll) {
    expandAll()
  }
}, { immediate: true })
</script>

<style scoped>
.user-hierarchy-tree {
  width: 100%;
}

.tree-node-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0;
}

.tree-node-title .username {
  font-weight: 500;
  font-size: 14px;
}

.tree-node-title .node-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.tree-node-title .email {
  font-size: 12px;
  color: #666;
  margin-left: 8px;
}

:deep(.ant-tree-treenode) {
  padding: 4px 0;
}

:deep(.ant-tree-node-content-wrapper) {
  padding: 2px 4px;
}
</style>