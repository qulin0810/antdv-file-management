import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import Layout from "@/layout/index.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: Layout,
        redirect: "/dashboard",
        children: [
            {
                path: "dashboard",
                name: "Dashboard",
                component: () => import("@/views/dashboard/index.vue"),
                meta: {
                    title: "仪表板",
                    icon: "dashboard",
                },
            },
            {
                path: "file-management",
                name: "FileManagement",
                component: () => import("@/views/file-management/index.vue"),
                meta: {
                    title: "文件管理",
                    icon: "folder",
                },
            },
            {
                path: "user-management",
                name: "UserManagement",
                component: () => import("@/views/user-management/index.vue"),
                meta: {
                    title: "用户管理",
                    icon: "user",
                },
            },
            {
                path: "test-management",
                name: "TestManagement",
                component: () => import("@/views/test-management/index.vue"),
                meta: {
                    title: "测试管理",
                    icon: "user",
                },
            },
            {
                path: "file-component",
                name: "FileComponent",
                component: () => import("@/views/list-component/index.vue"),
                meta: {
                    title: "组件list管理",
                    icon: "user",
                },
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

export default router;
