export interface User {
  key: string
  username: string
  email: string
  role: string
  status: string
  createTime: string
}

export interface Pagination {
  current: number
  pageSize: number
  total: number
  showSizeChanger: boolean
  showQuickJumper: boolean
  showTotal: (total: number) => string
}

export interface UserFormData {
  username: string
  email: string
  role: string
  status: string
  key?: string
}