<template>
  <div class="file-management">
    <a-card>
      <!-- 搜索区域 -->
      <div class="search-area mb-6">
        <a-form
          ref="searchFormRef"
          :model="searchForm"
          layout="inline"
          @finish="handleSearch"
        >
          <a-form-item label="文件名" name="fileName">
            <a-input
              v-model:value="searchForm.fileName"
              placeholder="请输入文件名"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="作者" name="author">
            <a-input
              v-model:value="searchForm.author"
              placeholder="请输入作者"
              allow-clear
            />
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" html-type="submit">
                <template #icon><search-outlined /></template>
                搜索
              </a-button>
              <a-button @click="handleReset">
                <template #icon><reload-outlined /></template>
                重置
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>

      <!-- 操作按钮 -->
      <div class="action-area mb-4">
        <a-space>
          <a-button type="primary" @click="handleUpload">
            <template #icon><upload-outlined /></template>
            上传文件
          </a-button>
          <a-button @click="handleCreateFolder">
            <template #icon><folder-add-outlined /></template>
            新建文件夹
          </a-button>
        </a-space>
      </div>

      <!-- 文件列表 -->
      <a-table
        :columns="columns"
        :data-source="fileList"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'name'">
            <file-text-outlined class="mr-1" />
            {{ column.title }}
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="flex items-center">
              <file-outlined v-if="record.type === 'file'" class="mr-2 text-blue-500" />
              <folder-outlined v-else class="mr-2 text-orange-500" />
              {{ record.name }}
            </div>
          </template>
          <template v-else-if="column.key === 'size'">
            {{ record.size }}
          </template>
          <template v-else-if="column.key === 'author'">
            {{ record.author }}
          </template>
          <template v-else-if="column.key === 'updateTime'">
            {{ record.updateTime }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">
                编辑
              </a-button>
              <a-button type="link" size="small" @click="handleDownload(record)">
                下载
              </a-button>
              <a-popconfirm
                title="确定要删除这个文件吗？"
                @confirm="handleDelete(record)"
              >
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 文件上传模态框 -->
    <a-modal
      v-model:open="uploadVisible"
      title="上传文件"
      @ok="handleUploadOk"
      @cancel="handleUploadCancel"
    >
      <a-upload-dragger
        v-model:file-list="uploadFileList"
        name="file"
        :multiple="true"
        :before-upload="beforeUpload"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined />
        </p>
        <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p class="ant-upload-hint">支持单个或批量上传</p>
      </a-upload-dragger>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { TableProps, UploadFile } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  UploadOutlined,
  FolderAddOutlined,
  FileTextOutlined,
  FileOutlined,
  FolderOutlined,
  InboxOutlined
} from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'

interface FileItem {
  key: string
  name: string
  type: 'file' | 'folder'
  size: string
  author: string
  updateTime: string
}

const searchFormRef = ref()
const loading = ref(false)
const uploadVisible = ref(false)
const uploadFileList = ref<UploadFile[]>([])

const searchForm = reactive({
  fileName: '',
  author: ''
})

const pagination = reactive({
  current: 1,
  pageSize: 2,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`
})

const columns = [
  {
    title: '文件名',
    dataIndex: 'name',
    key: 'name',
    width: '40%'
  },
  {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
    width: '15%'
  },
  {
    title: '作者',
    dataIndex: 'author',
    key: 'author',
    width: '15%'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: '20%'
  },
  {
    title: '操作',
    key: 'action',
    width: '10%'
  }
]

const fileList = ref<FileItem[]>([
  {
    key: '1',
    name: '项目文档.pdf',
    type: 'file',
    size: '2.3 MB',
    author: '张三',
    updateTime: '2024-01-20 10:30'
  },
  {
    key: '2',
    name: '设计稿',
    type: 'folder',
    size: '15.6 MB',
    author: '李四',
    updateTime: '2024-01-20 09:15'
  },
  {
    key: '3',
    name: '会议记录.docx',
    type: 'file',
    size: '1.2 MB',
    author: '王五',
    updateTime: '2024-01-19 16:45'
  },
  {
    key: '4',
    name: '数据报表.xlsx',
    type: 'file',
    size: '3.8 MB',
    author: '赵六',
    updateTime: '2024-01-19 14:20'
  }
])

const handleSearch = () => {
  loading.value = true
  // 模拟搜索延迟
  setTimeout(() => {
    loading.value = false
    pagination.total = fileList.value.length
  }, 500)
}

const handleReset = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

const handleUpload = () => {
  uploadVisible.value = true
}

const handleCreateFolder = () => {
  // 创建文件夹逻辑
  console.log('创建文件夹')
}

const handleEdit = (record: FileItem) => {
  console.log('编辑文件:', record)
}

const handleDownload = (record: FileItem) => {
  console.log('下载文件:', record)
}

const handleDelete = (record: FileItem) => {
  console.log('删除文件:', record)
}

const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  pagination.current = pag?.current || 1
  pagination.pageSize = pag?.pageSize || 10
  handleSearch()
}

const handleUploadOk = () => {
  uploadVisible.value = false
}

const handleUploadCancel = () => {
  uploadVisible.value = false
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  console.log('上传文件:', file)
  return false // 阻止自动上传
}

// 初始化加载数据
handleSearch()
</script>

<style scoped>
.file-management {
  min-height: 100%;
}
</style>