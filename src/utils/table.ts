/**
 * 表格工具函数
 */

import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 计算表格的滚动宽度
 * @param minWidth 最小宽度，默认1200px
 * @param sidebarWidth 侧边栏宽度，默认200px
 * @param padding 内容区域内边距，默认32px
 * @param margin 表格容器边距，默认16px
 * @returns 响应式的表格滚动宽度
 */
export function useTableScrollWidth(
  minWidth = 1200,
  sidebarWidth = 200,
  padding = 32,
  margin = 16
) {
  const tableScrollX = ref(minWidth)

  // 计算表格可用宽度
  const calculateTableWidth = () => {
    const windowWidth = window.innerWidth
    
    // 计算可用宽度 = 窗口宽度 - 侧边栏宽度 - 内边距 - 边距
    const availableWidth = windowWidth - sidebarWidth - padding - margin
    
    // 设置表格滚动宽度，最小为minWidth
    tableScrollX.value = Math.max(availableWidth, minWidth)
  }

  // 监听窗口大小变化
  const handleResize = () => {
    calculateTableWidth()
  }

  onMounted(() => {
    calculateTableWidth()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    tableScrollX
  }
}

/**
 * 获取表格列配置的默认宽度
 * @param columns 列配置数组
 * @returns 所有列宽度的总和
 */
export function getColumnsTotalWidth(columns: any[]): number {
  return columns.reduce((total, column) => {
    return total + (column.width || 0)
  }, 0)
}

/**
 * 动态计算表格滚动宽度（基于列宽总和）
 * @param columns 列配置数组
 * @param minWidth 最小宽度，默认1200px
 * @param sidebarWidth 侧边栏宽度，默认200px
 * @param padding 内容区域内边距，默认32px
 * @param margin 表格容器边距，默认16px
 * @returns 响应式的表格滚动宽度
 */
export function useDynamicTableScrollWidth(
  columns: any[],
  minWidth = 1200,
  sidebarWidth = 200,
  padding = 32,
  margin = 16
) {
  const tableScrollX = ref(minWidth)

  // 计算表格可用宽度
  const calculateTableWidth = () => {
    const windowWidth = window.innerWidth
    
    // 计算可用宽度 = 窗口宽度 - 侧边栏宽度 - 内边距 - 边距
    const availableWidth = windowWidth - sidebarWidth - padding - margin
    
    // 计算列宽总和
    const columnsWidth = getColumnsTotalWidth(columns)
    
    // 设置表格滚动宽度，取可用宽度和列宽总和的较大值，但最小为minWidth
    tableScrollX.value = Math.max(Math.max(availableWidth, columnsWidth), minWidth)
  }

  // 监听窗口大小变化
  const handleResize = () => {
    calculateTableWidth()
  }

  onMounted(() => {
    calculateTableWidth()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    tableScrollX
  }
}