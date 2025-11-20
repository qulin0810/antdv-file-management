/**
 * Excel导出工具类
 * 使用CSV格式导出，兼容Excel打开
 */

/**
 * 导出数据到Excel文件
 * @param data 要导出的数据数组
 * @param filename 文件名（不包含扩展名）
 * @param headers 表头配置，如果不提供则使用数据对象的键作为表头
 */
export const exportToExcel = <T extends Record<string, any>>(
  data: T[],
  filename: string = 'data',
  headers?: Array<{ key: keyof T; title: string }>
): void => {
  if (!data || data.length === 0) {
    console.warn('没有数据可导出')
    return
  }

  // 如果没有提供headers，则使用数据对象的键作为表头
  const headerConfig = headers || Object.keys(data[0]).map(key => ({
    key: key as keyof T,
    title: key
  }))

  // 构建CSV内容
  const csvContent = buildCSVContent(data, headerConfig)
  
  // 创建下载链接
  downloadCSV(csvContent, `${filename}.csv`)
}

/**
 * 构建CSV内容
 */
const buildCSVContent = <T extends Record<string, any>>(
  data: T[],
  headers: Array<{ key: keyof T; title: string }>
): string => {
  // 构建表头行
  const headerRow = headers.map(header => escapeCSVField(header.title)).join(',')
  
  // 构建数据行
  const dataRows = data.map(item => {
    return headers.map(header => {
      const value = item[header.key]
      return escapeCSVField(formatValue(value))
    }).join(',')
  })
  
  // 合并所有行
  return [headerRow, ...dataRows].join('\n')
}

/**
 * 格式化值
 */
const formatValue = (value: any): string => {
  if (value === null || value === undefined) {
    return ''
  }
  
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'object' && item !== null) {
        return item.hobby || item.name || JSON.stringify(item)
      }
      return String(item)
    }).join('、')
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  
  return String(value)
}

/**
 * 转义CSV字段
 */
const escapeCSVField = (field: string): string => {
  // 如果字段包含逗号、换行符或双引号，需要用双引号包围并转义内部的双引号
  if (field.includes(',') || field.includes('\n') || field.includes('"') || field.includes('\r')) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

/**
 * 下载CSV文件
 */
const downloadCSV = (content: string, filename: string): void => {
  // 创建Blob对象
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' })
  
  // 创建下载链接
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // 释放URL对象
  URL.revokeObjectURL(url)
}

/**
 * 用户数据导出专用函数
 */
export const exportUsersToExcel = (users: any[], filename: string = '用户列表'): void => {
  const headers = [
    { key: 'username', title: '用户名' },
    { key: 'email', title: '邮箱' },
    { key: 'role', title: '角色' },
    { key: 'status', title: '状态' },
    { key: 'submitStatus', title: '提交状态' },
    { key: 'job', title: '职业' },
    { key: 'pet', title: '喜欢的宠物' },
    { key: 'hobbiesDisplay', title: '爱好' },
    { key: 'createTime', title: '创建时间' },
    { key: 'department', title: '部门' },
    { key: 'position', title: '职位' },
    { key: 'phone', title: '电话' },
    { key: 'address', title: '地址' },
    { key: 'remark', title: '备注' }
  ]

  exportToExcel(users, filename, headers)
}