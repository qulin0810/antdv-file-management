<template>
  <div class="user-hierarchy-tree">
    <!-- 模态框组件 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      width="800px"
      :footer="null"
      :destroy-on-close="true"
    >
      <div class="modal-tree-container">
        <div class="modal-toolbar">
          <a-space>
            <a-button type="link" size="small" @click="expandModalAll">
              <template #icon><vertical-right-outlined /></template>
              展开全部
            </a-button>
            <a-button type="link" size="small" @click="collapseModalAll">
              <template #icon><vertical-left-outlined /></template>
              折叠全部
            </a-button>
          </a-space>
        </div>
        
        <a-tree
          v-if="modalTreeData.length > 0"
          :tree-data="modalTreeData"
          :field-names="fieldNames"
          :show-line="true"
          :show-icon="true"
          :block-node="true"
          :expanded-keys="modalExpandedKeys"
          :auto-expand-parent="true"
          @expand="handleModalExpand"
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
      </div>
    </a-modal>
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
  treeData?: TreeNode[]
  title?: string
  defaultExpandAll?: boolean
  showLine?: boolean
  showIcon?: boolean
  modalTitle?: string
  modalTreeData?: TreeNode[]
}

const props = withDefaults(defineProps<Props>(), {
  treeData: () => [],
  title: '用户层级关系',
  defaultExpandAll: false,
  showLine: true,
  showIcon: true,
  modalTitle: '用户层级关系',
  modalTreeData: () => []
})

const emit = defineEmits<{
  select: [node: TreeNode]
}>()

const fieldNames = {
  children: 'children',
  title: 'title',
  key: 'key'
}

const modalVisible = ref(false)
const modalExpandedKeys = ref<string[]>([])

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

// 处理模态框树节点展开/折叠
const handleModalExpand = (keys: string[]) => {
  modalExpandedKeys.value = keys
}

// 展开模态框全部节点
const expandModalAll = () => {
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
  modalExpandedKeys.value = getAllKeys(props.modalTreeData)
}

// 折叠模态框全部节点
const collapseModalAll = () => {
  modalExpandedKeys.value = []
}

// 打开模态框
const openModal = () => {
  modalVisible.value = true
  // 默认展开所有节点
  expandModalAll()
}

// 关闭模态框
const closeModal = () => {
  modalVisible.value = false
}

// 暴露方法给父组件
defineExpose({
  openModal,
  closeModal
})
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