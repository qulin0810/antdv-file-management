import type { Directive, DirectiveBinding } from 'vue'
import { useAuthStore } from '@/stores/auth'

/**
 * 权限指令 v-permission
 * 用法：
 *   <button v-permission="'PER_VIEW_APP_MGMT'">查看应用管理</button>
 *   <div v-permission="['PER_EDIT_APP_MGMT', 'PER_DELETE_APP_MGMT']">...</div>
 */
export const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const authStore = useAuthStore()
    const checkPermission = (permission: string): boolean => {
      return authStore.hasPermission(permission)
    }

    let hasPermission = false
    if (Array.isArray(binding.value)) {
      // 数组：需要拥有所有权限（或任一？这里采用任一即可，可根据需求调整）
      hasPermission = binding.value.some(checkPermission)
    } else {
      hasPermission = checkPermission(binding.value)
    }

    if (!hasPermission) {
      // 移除元素
      el.parentNode?.removeChild(el)
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    // 权限可能变化，重新评估
    const authStore = useAuthStore()
    const checkPermission = (permission: string): boolean => {
      return authStore.hasPermission(permission)
    }

    let hasPermission = false
    if (Array.isArray(binding.value)) {
      hasPermission = binding.value.some(checkPermission)
    } else {
      hasPermission = checkPermission(binding.value)
    }

    if (!hasPermission) {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    } else {
      // 如果元素已被移除，需要重新插入？这里简单处理，通常不会发生
      // 可以忽略，因为元素已不存在
    }
  }
}