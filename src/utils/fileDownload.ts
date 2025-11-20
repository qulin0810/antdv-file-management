/**
 * 文件下载工具类
 * 支持多种文件类型下载
 */

interface DownloadOptions {
  filename?: string
  contentType?: string
  blob?: Blob
  data?: string | ArrayBuffer
}

/**
 * 下载文件
 * @param options 下载选项
 */
export const downloadFile = (options: DownloadOptions): void => {
  const {
    filename = 'download',
    contentType = 'application/octet-stream',
    blob,
    data
  } = options

  let downloadBlob: Blob

  if (blob) {
    downloadBlob = blob
  } else if (data) {
    if (typeof data === 'string') {
      downloadBlob = new Blob([data], { type: contentType })
    } else {
      downloadBlob = new Blob([data], { type: contentType })
    }
  } else {
    console.warn('没有提供可下载的数据')
    return
  }

  // 创建下载链接
  const link = document.createElement('a')
  const url = URL.createObjectURL(downloadBlob)

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
 * 根据文件类型和内容下载文件
 * @param content 文件内容
 * @param filename 文件名
 * @param fileType 文件类型
 */
export const downloadByType = (
  content: string | ArrayBuffer,
  filename: string,
  fileType: string
): void => {
  const typeMap: Record<string, string> = {
    'txt': 'text/plain',
    'csv': 'text/csv',
    'json': 'application/json',
    'xml': 'application/xml',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo'
  }

  // 获取文件扩展名
  const extension = filename.split('.').pop()?.toLowerCase() || ''
  const contentType = typeMap[extension] || 'application/octet-stream'

  downloadFile({
    filename,
    contentType,
    data: content
  })
}

/**
 * 下载文本文件
 * @param text 文本内容
 * @param filename 文件名
 */
export const downloadTextFile = (text: string, filename: string = 'text.txt'): void => {
  downloadFile({
    filename,
    contentType: 'text/plain',
    data: text
  })
}

/**
 * 下载JSON文件
 * @param data JSON数据
 * @param filename 文件名
 */
export const downloadJSONFile = (data: any, filename: string = 'data.json'): void => {
  const jsonString = JSON.stringify(data, null, 2)
  downloadFile({
    filename,
    contentType: 'application/json',
    data: jsonString
  })
}

/**
 * 下载CSV文件
 * @param data 数据数组
 * @param filename 文件名
 * @param headers 表头配置
 */
export const downloadCSVFile = <T extends Record<string, any>>(
  data: T[],
  filename: string = 'data.csv',
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
  
  downloadFile({
    filename,
    contentType: 'text/csv;charset=utf-8;',
    data: '\uFEFF' + csvContent // BOM for Excel compatibility
  })
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
 * 模拟文件下载（用于演示）
 * @param fileInfo 文件信息
 */
export const mockFileDownload = (fileInfo: {
  id: string
  name: string
  type: string
  content?: string
}): void => {
  const { name, type, content = '这是文件内容' } = fileInfo
  
  const typeMap: Record<string, string> = {
    'document': 'application/msword',
    'excel': 'application/vnd.ms-excel',
    'pdf': 'application/pdf',
    'image': 'image/jpeg',
    'text': 'text/plain'
  }

  const extensionMap: Record<string, string> = {
    'document': 'doc',
    'excel': 'xls',
    'pdf': 'pdf',
    'image': 'jpg',
    'text': 'txt'
  }

  const contentType = typeMap[type] || 'application/octet-stream'
  const extension = extensionMap[type] || 'bin'
  const filename = `${name}_${new Date().toISOString().split('T')[0]}.${extension}`

  downloadFile({
    filename,
    contentType,
    data: content
  })
}