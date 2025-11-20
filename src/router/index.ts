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
                path: "user-upload",
                name: "UserUpload",
                component: () => import("@/views/user-upload/index.vue"),
                meta: {
                    title: "用户文件上传",
                    icon: "upload",
                },
            },
            {
                path: "file-component",
                name: "FileComponent",
                meta: {
                    title: "组件list管理",
                    icon: "user",
                },
                redirect: "/file-component/overview",
                children: [
                    {
                        path: "overview",
                        name: "ComponentOverview",
                        component: () => import("@/views/list-component/index.vue"),
                        meta: {
                            title: "组件列表",
                        },
                    },
                    {
                        path: "basic-table",
                        name: "BasicTableDemo",
                        component: () => import("@/views/list-component/basic-table/index.vue"),
                        meta: {
                            title: "基础表格演示",
                        },
                    },
                    {
                        path: "switch-demo",
                        name: "SwitchDemo",
                        component: () => import("@/views/list-component/switch-demo/index.vue"),
                        meta: {
                            title: "Switch演示",
                        },
                    },
                    {
                        path: "form-modal",
                        name: "FormModalDemo",
                        component: () => import("@/views/list-component/form-modal/index.vue"),
                        meta: {
                            title: "表单弹窗演示",
                        },
                    },
                    {
                        path: "rich-text-editor",
                        name: "RichTextEditorDemo",
                        component: () => import("@/views/list-component/rich-text-editor/index.vue"),
                        meta: {
                            title: "富文本编辑器演示",
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

export default router;
