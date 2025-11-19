// 状态枚举定义
export enum SubmitStatus {
  SUCCESS = 1,     // 成功
  FAILED = 2,      // 失败
  PROCESSING = 3,  // 进行中
  REUPLOAD = 4     // 重新上传
}

export interface User {
  key: string
  username: string
  email: string
  role: string
  status: string
  submitStatus?: SubmitStatus  // 提交状态
  job?: number
  pet?: string                 // 喜欢的宠物
  createTime: string
  department?: string
  position?: string
  phone?: string
  address?: string
  remark?: string
  richTextContent?: string     // 富文本内容
  hobbies?: string[]           // 爱好数组
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
  submitStatus?: SubmitStatus
  job?: number
  pet?: string                 // 喜欢的宠物
  key?: string
  richTextContent?: string
  hobbies?: string[]           // 爱好数组
}

export const createEmptyUserFormData = (): UserFormData => ({
  username: '',
  email: '',
  role: '',
  status: '',
  job: undefined,
  pet: undefined,
  richTextContent: '',
  hobbies: []                  // 初始化空数组
})