<template>
  <div class="dashboard">
    <a-row :gutter="16" class="mb-6">
      <a-col :span="6">
        <a-card>
          <div class="flex items-center">
            <div class="bg-blue-500 p-3 rounded-lg mr-4">
              <file-text-outlined class="text-white text-2xl" />
            </div>
            <div>
              <p class="text-gray-500 mb-1">文件总数</p>
              <h3 class="text-2xl font-bold">1,234</h3>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <div class="flex items-center">
            <div class="bg-green-500 p-3 rounded-lg mr-4">
              <user-outlined class="text-white text-2xl" />
            </div>
            <div>
              <p class="text-gray-500 mb-1">用户总数</p>
              <h3 class="text-2xl font-bold">56</h3>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <div class="flex items-center">
            <div class="bg-orange-500 p-3 rounded-lg mr-4">
              <folder-open-outlined class="text-white text-2xl" />
            </div>
            <div>
              <p class="text-gray-500 mb-1">文件夹数</p>
              <h3 class="text-2xl font-bold">89</h3>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <div class="flex items-center">
            <div class="bg-purple-500 p-3 rounded-lg mr-4">
              <cloud-upload-outlined class="text-white text-2xl" />
            </div>
            <div>
              <p class="text-gray-500 mb-1">今日上传</p>
              <h3 class="text-2xl font-bold">23</h3>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :span="16">
        <a-card title="最近文件" class="h-80">
          <a-table
            :columns="fileColumns"
            :data-source="recentFiles"
            :pagination="false"
            size="small"
          >
            <template #action="{ record }">
              <a-space>
                <a-button type="link" size="small">查看</a-button>
                <a-button type="link" size="small">下载</a-button>
              </a-space>
            </template>
          </a-table>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="系统信息" class="h-80">
          <div class="space-y-4">
            <div>
              <p class="text-gray-500">系统版本</p>
              <p class="font-medium">v1.0.0</p>
            </div>
            <div>
              <p class="text-gray-500">最后更新</p>
              <p class="font-medium">2024-01-20 10:30</p>
            </div>
            <div>
              <p class="text-gray-500">存储使用</p>
              <a-progress :percent="65" />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  FileTextOutlined,
  UserOutlined,
  FolderOpenOutlined,
  CloudUploadOutlined
} from '@ant-design/icons-vue'

const fileColumns = [
  {
    title: '文件名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '大小',
    dataIndex: 'size',
    key: 'size'
  },
  {
    title: '上传时间',
    dataIndex: 'uploadTime',
    key: 'uploadTime'
  },
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' }
  }
]

const recentFiles = ref([
  {
    key: '1',
    name: '项目文档.pdf',
    size: '2.3 MB',
    uploadTime: '2024-01-20 10:30'
  },
  {
    key: '2',
    name: '设计稿.zip',
    size: '15.6 MB',
    uploadTime: '2024-01-20 09:15'
  },
  {
    key: '3',
    name: '会议记录.docx',
    size: '1.2 MB',
    uploadTime: '2024-01-19 16:45'
  },
  {
    key: '4',
    name: '数据报表.xlsx',
    size: '3.8 MB',
    uploadTime: '2024-01-19 14:20'
  }
])
</script>

<style scoped>
.dashboard {
  min-height: 100%;
}
</style>