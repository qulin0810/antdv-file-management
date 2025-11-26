# Modal.confirm 中使用带参数的 i18n 翻译指南

## 概述

在 Ant Design Vue 的 `Modal.confirm` 中完全可以像在其他地方一样使用带参数的 i18n 翻译。这为创建国际化友好的确认对话框提供了完整的支持。

## 基本用法

### 1. 在翻译文件中定义带参数的翻译

```json
{
  "userManagement": {
    "confirmDeleteWithName": "确定要删除用户名是 {username} 这个用户吗？",
    "deleteWarning": "此操作不可恢复。",
    "deleteSuccess": "删除成功"
  },
  "common": {
    "confirm": "确认",
    "cancel": "取消"
  }
}
```

### 2. 在 Modal.confirm 中使用

```javascript
import { Modal } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const handleDelete = (record) => {
  Modal.confirm({
    title: t('userManagement.confirmDeleteWithName', { username: record.username }),
    content: t('userManagement.deleteWarning'),
    okText: t('common.confirm'),
    cancelText: t('common.cancel'),
    onOk() {
      // 执行删除操作
      message.success(t('userManagement.deleteSuccess'))
    },
  })
}
```

## 实际示例

### 删除确认对话框

```javascript
// 删除功能
const handleDelete = (record) => {
  Modal.confirm({
    title: t('userManagement.confirmDeleteWithName', { username: record.name }),
    content: t('userManagement.deleteWarning'),
    okText: t('common.confirm'),
    cancelText: t('common.cancel'),
    onOk() {
      // 在实际项目中这里应该是调用删除API
      const index = mockData.findIndex(item => item.id === record.id)
      if (index !== -1) {
        mockData.splice(index, 1)
        fetchData() // 重新加载数据
        message.success(t('userManagement.deleteSuccess'))
      }
    },
  })
}
```

### 启用/禁用确认对话框

```javascript
// 启用/禁用功能
const handleToggleStatus = (record) => {
  const newStatus = record.status === 1 ? 0 : 1
  const action = newStatus === 1 ? t('userManagement.enable') : t('userManagement.disable')
  
  Modal.confirm({
    title: t('common.confirmAction'),
    content: t('userManagement.confirmToggleStatus', { 
      action: action, 
      username: record.name 
    }),
    okText: t('common.confirm'),
    cancelText: t('common.cancel'),
    onOk() {
      // 执行状态切换操作
      const user = mockData.find(item => item.id === record.id)
      if (user) {
        user.status = newStatus
        fetchData()
        message.success(t('userManagement.toggleStatusSuccess', { action: action }))
      }
    },
  })
}
```

## 翻译文件配置示例

### 英文翻译 (en-US.json)
```json
{
  "common": {
    "confirm": "Confirm",
    "cancel": "Cancel",
    "confirmAction": "Confirm Action"
  },
  "userManagement": {
    "confirmDeleteWithName": "Are you sure to delete user {username}?",
    "deleteWarning": "This operation cannot be undone.",
    "deleteSuccess": "Delete successful",
    "enable": "Enable",
    "disable": "Disable",
    "confirmToggleStatus": "Are you sure to {action} user {username}?",
    "toggleStatusSuccess": "{action} successful"
  }
}
```

### 中文翻译 (zh-CN.json)
```json
{
  "common": {
    "confirm": "确认",
    "cancel": "取消",
    "confirmAction": "确认操作"
  },
  "userManagement": {
    "confirmDeleteWithName": "确定要删除用户名是 {username} 这个用户吗？",
    "deleteWarning": "此操作不可恢复。",
    "deleteSuccess": "删除成功",
    "enable": "启用",
    "disable": "禁用",
    "confirmToggleStatus": "确定要{action}用户{username}吗？",
    "toggleStatusSuccess": "{action}成功"
  }
}
```

## 高级用法

### 1. 多参数翻译

```javascript
Modal.confirm({
  title: t('userManagement.complexConfirm', {
    action: t('userManagement.delete'),
    object: t('userManagement.user'),
    name: record.name,
    count: selectedItems.length
  }),
  // ...
})
```

翻译文件：
```json
{
  "userManagement": {
    "complexConfirm": "确定要{action}{count}个{object}（包括{name}）吗？",
    "delete": "删除",
    "user": "用户"
  }
}
```

### 2. 条件翻译

```javascript
const getConfirmMessage = (action, record) => {
  if (action === 'delete') {
    return t('userManagement.confirmDeleteWithName', { username: record.name })
  } else if (action === 'disable') {
    return t('userManagement.confirmDisableWithName', { username: record.name })
  }
  return t('common.confirmAction')
}

Modal.confirm({
  title: getConfirmMessage('delete', record),
  // ...
})
```

## 最佳实践

1. **统一翻译键命名**: 使用一致的命名规范，如 `confirm[Action]With[Parameter]`
2. **参数验证**: 确保所有必需的参数都被提供
3. **错误处理**: 处理可能的翻译缺失情况
4. **性能优化**: 对于频繁使用的翻译，考虑缓存
5. **测试覆盖**: 确保所有语言版本的翻译都正确显示

## 优势

- **完整的国际化支持**: 所有文本都支持多语言
- **一致的用户体验**: 在整个应用中保持统一的翻译风格
- **易于维护**: 所有翻译文本集中在翻译文件中
- **灵活的参数化**: 支持动态内容插入
- **类型安全**: 配合 TypeScript 可以获得更好的开发体验

通过这种方式，你可以在 Modal.confirm 中创建完全国际化的确认对话框，提供更好的用户体验。