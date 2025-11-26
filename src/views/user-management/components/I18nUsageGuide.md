# i18n 翻译使用指南

## 1. 带参数的翻译

### 基本语法
```javascript
const { t } = useI18n()

// 简单参数
t('key', { param1: value1, param2: value2 })

// 示例
t('userManagement.welcomeMessage', { 
  name: '张三', 
  date: '2024-01-01' 
})
```

### 翻译文件配置
```json
{
  "userManagement": {
    "welcomeMessage": "欢迎 {name}，今天是 {date}",
    "searchResults": "找到 {count} 个关于 '{keyword}' 的结果"
  }
}
```

## 2. 翻译拼接带空格

### 方法一：直接拼接（推荐用于简单场景）
```javascript
// 直接字符串拼接
const message = t('part1') + ' ' + t('part2')

// 模板字符串
const message = `${t('part1')} ${t('part2')}`
```

### 方法二：参数化拼接（推荐用于复杂场景）
```javascript
// 在翻译文件中定义完整格式
t('combinedMessage', {
  part1: t('part1'),
  part2: t('part2')
})
```

翻译文件：
```json
{
  "userManagement": {
    "part1": "你好",
    "part2": "世界", 
    "combinedMessage": "{part1} {part2}"
  }
}
```

### 方法三：在翻译文件中直接包含空格
```json
{
  "userManagement": {
    "fullName": "{firstName} {lastName}"
  }
}
```

## 3. 最佳实践

### 3.1 参数命名规范
- 使用有意义的参数名
- 保持参数名的一致性
- 避免使用特殊字符

### 3.2 空格处理
- 在翻译文本中直接包含必要的空格
- 使用参数化方式处理动态空格
- 避免在代码中硬编码空格

### 3.3 复杂场景处理
```javascript
// 动态构建复杂消息
const buildComplexMessage = (user, status) => {
  return t('userManagement.userStatus', {
    username: user.username,
    role: t(`userManagement.${user.role}`),
    status: t(`userManagement.${status}`)
  })
}
```

## 4. 常见问题解决

### 4.1 参数未替换
确保参数名与翻译文件中的占位符完全匹配：
```javascript
// ✅ 正确
t('message', { name: 'John' })

// ❌ 错误 - 参数名不匹配
t('message', { userName: 'John' })
```

### 4.2 空格丢失
在翻译文件中保留必要的空格：
```json
{
  // ✅ 正确 - 包含空格
  "fullName": "{firstName} {lastName}",
  
  // ❌ 错误 - 缺少空格
  "fullName": "{firstName}{lastName}"
}
```

### 4.3 动态内容处理
对于高度动态的内容，使用组合方式：
```javascript
const dynamicMessage = computed(() => {
  const base = t('baseMessage')
  const dynamic = someCondition ? t('option1') : t('option2')
  return `${base} ${dynamic}`
})
```

## 5. 实际应用示例

### 5.1 表单验证消息
```javascript
// 翻译文件
{
  "validation": {
    "required": "{field} 是必填的",
    "email": "{field} 必须是有效的邮箱格式"
  }
}

// 使用
t('validation.required', { field: t('userManagement.username') })
t('validation.email', { field: t('userManagement.email') })
```

### 5.2 分页信息
```javascript
// 翻译文件  
{
  "pagination": {
    "info": "显示第 {start} 到 {end} 条，共 {total} 条"
  }
}

// 使用
t('pagination.info', {
  start: (currentPage - 1) * pageSize + 1,
  end: Math.min(currentPage * pageSize, total),
  total: total
})
```

### 5.3 搜索结果显示
```javascript
// 翻译文件
{
  "search": {
    "results": "找到 {count} 个关于 '{keyword}' 的结果",
    "noResults": "没有找到关于 '{keyword}' 的结果"
  }
}

// 使用
const searchMessage = count > 0 
  ? t('search.results', { count, keyword })
  : t('search.noResults', { keyword })
```

## 6. 注意事项

1. **保持翻译文件简洁**：避免过度复杂的嵌套结构
2. **参数验证**：确保所有必需的参数都被提供
3. **性能考虑**：对于频繁变化的动态内容，考虑使用计算属性
4. **测试覆盖**：确保所有语言版本的翻译都正确显示
5. **占位符一致性**：在所有语言文件中使用相同的占位符格式

通过遵循这些指南，你可以有效地处理 i18n 翻译中的参数传递和空格拼接问题。