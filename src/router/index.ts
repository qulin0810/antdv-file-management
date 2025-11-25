import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import Layout from "@/layout/index.vue";
import { useAuthStore } from "@/stores/auth";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: Layout,
        redirect: "/dashboard",
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                path: "dashboard",
                name: "Dashboard",
                component: () => import("@/views/dashboard/index.vue"),
                meta: {
                    title: "仪表板",
                    icon: "dashboard",
                    requiresAuth: true,
                },
            },
            {
                path: "file-management",
                name: "FileManagement",
                component: () => import("@/views/file-management/index.vue"),
                meta: {
                    title: "文件管理",
                    icon: "folder",
                    requiresAuth: true,
                },
            },
            {
                path: "user-management",
                name: "UserManagement",
                component: () => import("@/views/user-management/index.vue"),
                meta: {
                    title: "用户管理",
                    icon: "user",
                    requiresAuth: true,
                },
            },
            {
                path: "test-management",
                name: "TestManagement",
                component: () => import("@/views/test-management/index.vue"),
                meta: {
                    title: "测试管理",
                    icon: "user",
                    requiresAuth: true,
                },
            },
            {
                path: "user-upload",
                name: "UserUpload",
                component: () => import("@/views/user-upload/index.vue"),
                meta: {
                    title: "用户文件上传",
                    icon: "upload",
                    requiresAuth: true,
                },
            },
            {
                path: "excel-upload",
                name: "ExcelUpload",
                component: () => import("@/views/excel-upload/index.vue"),
                meta: {
                    title: "Excel文件上传",
                    icon: "file-excel",
                    requiresAuth: true,
                },
            },
            {
                path: "file-component",
                name: "FileComponent",
                meta: {
                    title: "组件list管理",
                    icon: "user",
                    requiresAuth: true,
                },
                redirect: "/file-component/overview",
                children: [
                    {
                        path: "overview",
                        name: "ComponentOverview",
                        component: () => import("@/views/list-component/index.vue"),
                        meta: {
                            title: "组件列表",
                            requiresAuth: true,
                        },
                    },
                    {
                        path: "basic-table",
                        name: "BasicTableDemo",
                        component: () => import("@/views/list-component/basic-table/index.vue"),
                        meta: {
                            title: "基础表格演示",
                            requiresAuth: true,
                        },
                    },
                    {
                        path: "switch-demo",
                        name: "SwitchDemo",
                        component: () => import("@/views/list-component/switch-demo/index.vue"),
                        meta: {
                            title: "Switch演示",
                            requiresAuth: true,
                        },
                    },
                    {
                        path: "form-modal",
                        name: "FormModalDemo",
                        component: () => import("@/views/list-component/form-modal/index.vue"),
                        meta: {
                            title: "表单弹窗演示",
                            requiresAuth: true,
                        },
                    },
                    {
                        path: "rich-text-editor",
                        name: "RichTextEditorDemo",
                        component: () => import("@/views/list-component/rich-text-editor/index.vue"),
                        meta: {
                            title: "富文本编辑器演示",
                            requiresAuth: true,
                        },
                    },
                ],
            },
        ],
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/login/index.vue"),
        meta: {
            title: "登录",
        },
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 如果目标路由需要认证且用户未登录，重定向到登录页
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  }
  // 如果用户已登录但访问登录页，重定向到首页
  else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  }
  else {
    next()
  }
})

export default router;
