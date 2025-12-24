import type { User } from './types'
import { SubmitStatus, UserRole } from './types'

export const hierarchicalUserData: User[] = [
  // 顶级管理员
  {
    key: 'admin1',
    username: 'admin1',
    email: 'admin1@example.com',
    role: UserRole.ADMIN,
    job: 2, // IT
    pet: '小猫',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-15 10:30',
    modificationTime: 1705311000000,
    department: '技术部',
    position: '系统管理员',
    phone: '13800138001',
    address: '北京市朝阳区建国门外大街1号',
    remark: '系统管理员，负责系统维护',
    richTextContent: '<p>系统管理员账户，拥有最高权限。</p><p>负责系统维护和用户管理。</p>',
    hobbies: ['打球', '游泳'],
    hobbiesDisplay: [
      { id: 1, hobby: '打球' },
      { id: 2, hobby: '游泳' }
    ],
    books: [
      { id: 1, bookName: 'JavaScript高级程序设计', author: 'Nicholas C. Zakas' },
      { id: 2, bookName: 'Vue.js设计与实现', author: '霍春阳' }
    ],
    booksDisplay: [
      { id: 1, bookName: 'JavaScript高级程序设计', author: 'Nicholas C. Zakas' },
      { id: 2, bookName: 'Vue.js设计与实现', author: '霍春阳' }
    ]
  },
  {
    key: 'admin2',
    username: 'admin2',
    email: 'admin2@example.com',
    role: UserRole.ADMIN,
    job: 2, // IT
    pet: '小狗',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-16 10:30',
    modificationTime: 1705397400000,
    department: '管理部',
    position: '系统管理员',
    phone: '13800138002',
    address: '上海市浦东新区陆家嘴金融中心',
    remark: '系统管理员，负责用户管理',
    richTextContent: '<p>系统管理员账户，负责用户管理。</p>',
    hobbies: ['阅读', '写作'],
    hobbiesDisplay: [
      { id: 1, hobby: '阅读' },
      { id: 2, hobby: '写作' }
    ]
  },
  {
    key: 'admin3',
    username: 'admin3',
    email: 'admin3@example.com',
    role: UserRole.ADMIN,
    job: 2, // IT
    pet: '小猫',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-17 10:30',
    modificationTime: 1705483800000,
    department: '运营部',
    position: '系统管理员',
    phone: '13800138003',
    address: '广州市天河区珠江新城',
    remark: '系统管理员，负责运营管理',
    richTextContent: '<p>系统管理员账户，负责运营管理。</p>',
    hobbies: ['跑步', '健身'],
    hobbiesDisplay: [
      { id: 1, hobby: '跑步' },
      { id: 2, hobby: '健身' }
    ]
  },
  
  // admin1 的用户管理员
  {
    key: 'useradmin1',
    username: 'useradmin1',
    email: 'useradmin1@example.com',
    role: UserRole.USER_ADMIN,
    adminType: 'useradmin',
    parentAdmin: 'admin1',
    job: 1, // 老师
    pet: '小狗',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-18 10:30',
    modificationTime: 1705570200000,
    department: '教学部',
    position: '用户管理员',
    phone: '13800138004',
    address: '深圳市南山区科技园',
    remark: '用户管理员，负责用户管理',
    richTextContent: '<p>用户管理员，负责管理普通用户。</p>',
    hobbies: ['编程', '游戏'],
    hobbiesDisplay: [
      { id: 1, hobby: '编程' },
      { id: 2, hobby: '游戏' }
    ]
  },
  {
    key: 'useradmin2',
    username: 'useradmin2',
    email: 'useradmin2@example.com',
    role: UserRole.USER_ADMIN,
    adminType: 'useradmin',
    parentAdmin: 'admin1',
    job: 1, // 老师
    pet: '小猫',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-19 10:30',
    modificationTime: 1705656600000,
    department: '教学部',
    position: '用户管理员',
    phone: '13800138005',
    address: '杭州市西湖区文三路',
    remark: '用户管理员，负责用户管理',
    richTextContent: '<p>用户管理员，负责管理普通用户。</p>',
    hobbies: ['绘画', '摄影'],
    hobbiesDisplay: [
      { id: 1, hobby: '绘画' },
      { id: 2, hobby: '摄影' }
    ]
  },
  {
    key: 'useradmin3',
    username: 'useradmin3',
    email: 'useradmin3@example.com',
    role: UserRole.USER_ADMIN,
    adminType: 'useradmin',
    parentAdmin: 'admin1',
    job: 1, // 老师
    pet: '小狗',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-20 10:30',
    modificationTime: 1705743000000,
    department: '教学部',
    position: '用户管理员',
    phone: '13800138006',
    address: '成都市武侯区天府软件园',
    remark: '用户管理员，负责用户管理',
    richTextContent: '<p>用户管理员，负责管理普通用户。</p>',
    hobbies: ['登山', '旅行'],
    hobbiesDisplay: [
      { id: 1, hobby: '登山' },
      { id: 2, hobby: '旅行' }
    ]
  },
  
  // admin1 的访客管理员
  {
    key: 'guestadmin1',
    username: 'guestadmin1',
    email: 'guestadmin1@example.com',
    role: UserRole.GUEST_ADMIN,
    adminType: 'guestadmin',
    parentAdmin: 'admin1',
    job: 4, // 工程师
    pet: '小猫',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-21 10:30',
    modificationTime: 1705829400000,
    department: '访客部',
    position: '访客管理员',
    phone: '13800138007',
    address: '南京市鼓楼区新街口',
    remark: '访客管理员，负责访客管理',
    richTextContent: '<p>访客管理员，负责管理访客用户。</p>',
    hobbies: ['音乐', '电影'],
    hobbiesDisplay: [
      { id: 1, hobby: '音乐' },
      { id: 2, hobby: '电影' }
    ]
  },
  {
    key: 'guestadmin2',
    username: 'guestadmin2',
    email: 'guestadmin2@example.com',
    role: UserRole.GUEST_ADMIN,
    adminType: 'guestadmin',
    parentAdmin: 'admin1',
    job: 4, // 工程师
    pet: '小狗',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-22 10:30',
    modificationTime: 1705915800000,
    department: '访客部',
    position: '访客管理员',
    phone: '13800138008',
    address: '武汉市武昌区光谷',
    remark: '访客管理员，负责访客管理',
    richTextContent: '<p>访客管理员，负责管理访客用户。</p>',
    hobbies: ['瑜伽', '冥想'],
    hobbiesDisplay: [
      { id: 1, hobby: '瑜伽' },
      { id: 2, hobby: '冥想' }
    ]
  },
  {
    key: 'guestadmin3',
    username: 'guestadmin3',
    email: 'guestadmin3@example.com',
    role: UserRole.GUEST_ADMIN,
    adminType: 'guestadmin',
    parentAdmin: 'admin1',
    job: 4, // 工程师
    pet: '小猫',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-23 10:30',
    modificationTime: 1706002200000,
    department: '访客部',
    position: '访客管理员',
    phone: '13800138009',
    address: '西安市雁塔区高新区',
    remark: '访客管理员，负责访客管理',
    richTextContent: '<p>访客管理员，负责管理访客用户。</p>',
    hobbies: ['阅读', '下棋'],
    hobbiesDisplay: [
      { id: 1, hobby: '阅读' },
      { id: 2, hobby: '下棋' }
    ]
  },
  
  // useradmin1 管理的用户
  {
    key: 'user1',
    username: 'user1',
    email: 'user1@example.com',
    role: UserRole.USER,
    parentAdmin: 'useradmin1',
    job: 1, // 老师
    pet: '小狗',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-24 10:30',
    modificationTime: 1706088600000,
    department: '教学部',
    position: '初级讲师',
    phone: '13800138010',
    address: '重庆市渝北区光电园',
    remark: '初级讲师，负责基础课程教学',
    richTextContent: '<p>初级讲师，负责基础课程教学。</p>',
    hobbies: ['设计', '手工'],
    hobbiesDisplay: [
      { id: 1, hobby: '设计' },
      { id: 2, hobby: '手工' }
    ]
  },
  {
    key: 'user2',
    username: 'user2',
    email: 'user2@example.com',
    role: UserRole.USER,
    parentAdmin: 'useradmin1',
    job: 1, // 老师
    pet: '小猫',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-25 10:30',
    modificationTime: 1706175000000,
    department: '教学部',
    position: '中级讲师',
    phone: '13800138011',
    address: '天津市和平区滨江道',
    remark: '中级讲师，负责进阶课程教学',
    richTextContent: '<p>中级讲师，负责进阶课程教学。</p>',
    hobbies: ['书法', '绘画'],
    hobbiesDisplay: [
      { id: 1, hobby: '书法' },
      { id: 2, hobby: '绘画' }
    ]
  },
  {
    key: 'user3',
    username: 'user3',
    email: 'user3@example.com',
    role: UserRole.USER,
    parentAdmin: 'useradmin1',
    job: 1, // 老师
    pet: '小狗',
    status: 'inactive',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-26 10:30',
    modificationTime: 1706261400000,
    department: '教学部',
    position: '高级讲师',
    phone: '13800138012',
    address: '沈阳市沈河区中街',
    remark: '高级讲师，负责高级课程教学',
    richTextContent: '<p>高级讲师，负责高级课程教学。</p>',
    hobbies: ['摄影', '旅行'],
    hobbiesDisplay: [
      { id: 1, hobby: '摄影' },
      { id: 2, hobby: '旅行' }
    ]
  },
  
  // useradmin2 管理的用户
  {
    key: 'user4',
    username: 'user4',
    email: 'user4@example.com',
    role: UserRole.USER,
    parentAdmin: 'useradmin2',
    job: 3, // 医生
    pet: '小猫',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-27 10:30',
    modificationTime: 1706347800000,
    department: '医疗部',
    position: '住院医师',
    phone: '13800138013',
    address: '哈尔滨市道里区中央大街',
    remark: '住院医师，负责病房管理',
    richTextContent: '<p>住院医师，负责病房管理。</p>',
    hobbies: ['跑步', '健身'],
    hobbiesDisplay: [
      { id: 1, hobby: '跑步' },
      { id: 2, hobby: '健身' }
    ]
  },
  {
    key: 'user5',
    username: 'user5',
    email: 'user5@example.com',
    role: UserRole.USER,
    parentAdmin: 'useradmin2',
    job: 3, // 医生
    pet: '小狗',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-28 10:30',
    modificationTime: 1706434200000,
    department: '医疗部',
    position: '主治医师',
    phone: '13800138014',
    address: '长春市朝阳区重庆路',
    remark: '主治医师，负责门诊诊疗',
    richTextContent: '<p>主治医师，负责门诊诊疗。</p>',
    hobbies: ['阅读', '写作'],
    hobbiesDisplay: [
      { id: 1, hobby: '阅读' },
      { id: 2, hobby: '写作' }
    ]
  },
  
  // guestadmin1 管理的访客
  {
    key: 'guest1',
    username: 'guest1',
    email: 'guest1@example.com',
    role: UserRole.GUEST,
    parentAdmin: 'guestadmin1',
    job: 5, // 设计师
    pet: '小猫',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-29 10:30',
    modificationTime: 1706520600000,
    department: '设计部',
    position: 'UI设计师',
    phone: '13800138015',
    address: '大连市中山区青泥洼桥',
    remark: 'UI设计师，负责界面设计',
    richTextContent: '<p>UI设计师，负责界面设计。</p>',
    hobbies: ['绘画', '设计'],
    hobbiesDisplay: [
      { id: 1, hobby: '绘画' },
      { id: 2, hobby: '设计' }
    ]
  },
  {
    key: 'guest2',
    username: 'guest2',
    email: 'guest2@example.com',
    role: UserRole.GUEST,
    parentAdmin: 'guestadmin1',
    job: 5, // 设计师
    pet: '小狗',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-30 10:30',
    modificationTime: 1706607000000,
    department: '设计部',
    position: 'UX设计师',
    phone: '13800138016',
    address: '青岛市市南区中山路',
    remark: 'UX设计师，负责用户体验设计',
    richTextContent: '<p>UX设计师，负责用户体验设计。</p>',
    hobbies: ['摄影', '旅行'],
    hobbiesDisplay: [
      { id: 1, hobby: '摄影' },
      { id: 2, hobby: '旅行' }
    ]
  },
  
  // guestadmin2 管理的访客
  {
    key: 'guest3',
    username: 'guest3',
    email: 'guest3@example.com',
    role: UserRole.GUEST,
    parentAdmin: 'guestadmin2',
    job: 4, // 工程师
    pet: '小猫',
    status: 'active',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-01-31 10:30',
    modificationTime: 1706693400000,
    department: '研发部',
    position: '前端工程师',
    phone: '13800138017',
    address: '济南市历下区泉城路',
    remark: '前端工程师，负责前端开发',
    richTextContent: '<p>前端工程师，负责前端开发。</p>',
    hobbies: ['编程', '游戏'],
    hobbiesDisplay: [
      { id: 1, hobby: '编程' },
      { id: 2, hobby: '游戏' }
    ]
  },
  {
    key: 'guest4',
    username: 'guest4',
    email: 'guest4@example.com',
    role: UserRole.GUEST,
    parentAdmin: 'guestadmin2',
    job: 4, // 工程师
    pet: '小狗',
    status: 'inactive',
    submitStatus: SubmitStatus.SUCCESS,
    createTime: '2024-02-01 10:30',
    modificationTime: 1706779800000,
    department: '研发部',
    position: '后端工程师',
    phone: '13800138018',
    address: '郑州市金水区花园路',
    remark: '后端工程师，负责后端开发',
    richTextContent: '<p>后端工程师，负责后端开发。</p>',
    hobbies: ['编程', '阅读'],
    hobbiesDisplay: [
      { id: 1, hobby: '编程' },
      { id: 2, hobby: '阅读' }
    ]
  }
]