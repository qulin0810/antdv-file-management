# Ant Vue Management - 文件管理系统

一个基于 Vue 3 + Ant Design Vue + TypeScript + Vite + UnoCSS 的文件管理系统。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Ant Design Vue** - 企业级 UI 设计语言和组件库
- **TypeScript** - JavaScript 的超集
- **Vite** - 下一代前端构建工具
- **UnoCSS** - 即时按需原子 CSS 引擎
- **Vue Router** - 官方路由管理器
- **Pinia** - Vue 状态管理库

## 功能特性

### 核心功能
- ✅ 左侧树形菜单导航
- ✅ 面包屑导航
- ✅ 文件管理系统
- ✅ 用户管理系统
- ✅ 响应式设计

### 文件管理
- ✅ 文件列表展示
- ✅ 文件搜索（文件名、作者）
- ✅ 文件上传
- ✅ 文件下载
- ✅ 文件删除
- ✅ 文件编辑
- ✅ 分页功能

### 用户管理
- ✅ 用户列表展示
- ✅ 用户搜索（用户名、邮箱）
- ✅ 用户新增/编辑
- ✅ 用户状态管理
- ✅ 角色管理

## 项目结构

```
ant-vue-management/
├── src/
│   ├── layout/           # 布局组件
│   │   └── index.vue     # 主布局
│   ├── router/           # 路由配置
│   │   └── index.ts      # 路由定义
│   ├── views/            # 页面组件
│   │   ├── dashboard/    # 仪表板
│   │   ├── file-management/ # 文件管理
│   │   ├── user-management/ # 用户管理
│   │   └── login/        # 登录页面
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── package.json          # 项目配置
├── vite.config.ts        # Vite 配置
├── unocss.config.ts      # UnoCSS 配置
└── tsconfig.json         # TypeScript 配置
```

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发环境

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

### 预览构建结果

```bash
npm run preview
# 或
yarn preview
# 或
pnpm preview
```

## 默认账号

- **用户名**: admin
- **密码**: 123456

## 开发说明

### 组件规范
- 使用 Composition API + `<script setup>`
- 使用 TypeScript 进行类型检查
- 遵循 Ant Design Vue 的设计规范

### 样式规范
- 使用 UnoCSS 进行样式编写
- 遵循原子化 CSS 原则
- 支持响应式设计

### 代码规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 Vue 3 最佳实践

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

MIT License