// 状态枚举定义
export enum SubmitStatus {
  SUCCESS = 1,     // 成功
  FAILED = 2,      // 失败
  PROCESSING = 3,  // 进行中
  REUPLOAD = 4     // 重新上传
}

// 角色枚举定义
export enum UserRole {
  ADMIN = 'admin',
  USER_ADMIN = 'useradmin',
  GUEST_ADMIN = 'guestadmin',
  USER = 'user',
  GUEST = 'guest'
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
  modificationTime?: number    // 修改时间（时间戳）
  department?: string
  position?: string
  phone?: string
  address?: string
  remark?: string
  richTextContent?: string     // 富文本内容
  hobbies?: string[]           // 爱好数组（创建/提交格式）
  hobbiesDisplay?: HobbyItem[] // 爱好显示格式（回显格式）
  books?: BookItem[]           // 书籍数组（创建/提交格式）
  booksDisplay?: BookDisplayItem[] // 书籍显示格式（回显格式）
  parentAdmin?: string         // 所属管理员（useradmin 或 guestadmin 的 username）
  adminType?: 'useradmin' | 'guestadmin' // 管理员类型（如果用户是管理员）
}

// 爱好显示项接口
export interface HobbyItem {
  id: number
  hobby: string
}

// 书籍项接口（用于表单输入）
export interface BookItem {
  id: number
  bookName: string
  bookDisplayName?: string
  author: string
}

// 书籍显示项接口（用于显示）
export interface BookDisplayItem {
  id: number
  bookName: string
  author: string
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
  hobbies?: string[]           // 爱好数组（创建/提交格式）
  hobbiesDisplay?: HobbyItem[] // 爱好显示格式（回显格式）
  books?: BookItem[]           // 书籍数组（创建/提交格式）
  booksDisplay?: BookDisplayItem[] // 书籍显示格式（回显格式）
  modificationTime?: number    // 修改时间（时间戳）
  parentAdmin?: string         // 所属管理员
  adminType?: 'useradmin' | 'guestadmin' // 管理员类型
}

// 树节点接口，用于显示层级关系
export interface TreeNode {
  key: string
  title: string
  username: string
  role: string
  status: string
  email?: string
  icon?: string
  children?: TreeNode[]
  isLeaf?: boolean
  parentKey?: string
}

// 层级关系数据接口
export interface HierarchyData {
  admin: TreeNode
  userAdmins: TreeNode[]
  guestAdmins: TreeNode[]
  users: TreeNode[]
  guests: TreeNode[]
}

export const createEmptyUserFormData = (): UserFormData => ({
  username: '',
  email: '',
  role: '',
  status: '',
  job: undefined,
  pet: undefined,
  richTextContent: '',
  hobbies: [],                 // 初始化空数组
  books: [],                   // 初始化书籍空数组
  modificationTime: undefined, // 初始化修改时间
  parentAdmin: undefined,
  adminType: undefined
})