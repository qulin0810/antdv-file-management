<template>
  <div class="excel-upload-page">
    <a-card title="Excel文件上传演示" class="page-card">
      <div class="demo-section">
        <h3>基本用法</h3>
        <ExcelUpload 
          title="上传Excel文件"
          :max-file-size="20"
          @upload="handleUploadEvent"
        />
      </div>

      <div class="demo-section">
        <h3>自定义上传处理</h3>
        <ExcelUpload 
          title="自定义上传处理"
          :max-file-size="5"
          :on-upload="customUploadHandler"
          @upload="handleUploadEvent"
        />
      </div>

      <!-- 上传记录 -->
      <div class="upload-history">
        <h3>上传记录</h3>
        <a-table
          :columns="columns"
          :data-source="uploadHistory"
          :pagination="{ pageSize: 5 }"
          size="small"
        >
          <template #status="{ text }">
            <a-tag :color="text === 'success' ? 'green' : 'red'">
              {{ text === 'success' ? '成功' : '失败' }}
            </a-tag>
          </template>
          <template #action="{ record }">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">
                查看
              </a-button>
              <a-button type="link" size="small" danger @click="handleDelete(record)">
                删除
              </a-button>
            </a-space>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import ExcelUpload from '@/components/ExcelUpload.vue'
import type { UploadHistory } from './types'

const uploadHistory = ref<UploadHistory[]>([])

const columns = [
  {
    title: '文件名',
    dataIndex: 'fileName',
    key: 'fileName',
    width: 200,
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
    key: 'fileSize',
    width: 100,
    render: (size: number) => `${(size / 1024 / 1024).toFixed(2)} MB`
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: '上传时间',
    dataIndex: 'uploadTime',
    key: 'uploadTime',
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    slots: { customRender: 'status' }
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    slots: { customRender: 'action' }
  }
]

// 处理上传事件
const handleUploadEvent = (file: File, description: string) => {
  console.log('文件上传事件:', {
    fileName: file.name,
    fileSize: file.size,
    description
  })

  // 添加到上传记录
  const historyItem: UploadHistory = {
    id: Date.now().toString(),
    fileName: file.name,
    fileSize: file.size,
    description,
    uploadTime: new Date().toLocaleString('zh-CN'),
    status: 'success'
  }

  uploadHistory.value.unshift(historyItem)
  message.success(`文件 "${file.name}" 上传成功！`)
}

// 自定义上传处理函数
const customUploadHandler = async (file: File, description: string): Promise<boolean> => {
  console.log('自定义上传处理:', {
    fileName: file.name,
    fileSize: file.size,
    description
  })

  // 模拟一些业务逻辑处理
  try {
    // 这里可以添加实际的业务逻辑，比如：
    // 1. 验证Excel文件内容
    // 2. 解析Excel数据
    // 3. 调用后端API上传
    // 4. 处理上传结果

    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 模拟处理结果（这里可以根据实际业务逻辑返回成功或失败）
    const success = Math.random() > 0.1 // 90% 成功率

    if (success) {
      // 添加到上传记录
      const historyItem: UploadHistory = {
        id: Date.now().toString(),
        fileName: file.name,
        fileSize: file.size,
        description,
        uploadTime: new Date().toLocaleString('zh-CN'),
        status: 'success'
      }
      uploadHistory.value.unshift(historyItem)
    } else {
      // 添加失败记录
      const historyItem: UploadHistory = {
        id: Date.now().toString(),
        fileName: file.name,
        fileSize: file.size,
        description,
        uploadTime: new Date().toLocaleString('zh-CN'),
        status: 'failed'
      }
      uploadHistory.value.unshift(historyItem)
    }

    return success
  } catch (error) {
    console.error('自定义上传处理失败:', error)
    return false
  }
}

// 查看记录
const handleView = (record: UploadHistory) => {
  message.info(`查看文件: ${record.fileName}`)
  // 这里可以实现查看文件详情的逻辑
}

// 删除记录
const handleDelete = (record: UploadHistory) => {
  const index = uploadHistory.value.findIndex((item: UploadHistory) => item.id === record.id)
  if (index !== -1) {
    uploadHistory.value.splice(index, 1)
    message.success('删除成功！')
  }
}
</script>

<style scoped>
.excel-upload-page {
  padding: 24px;
}

.page-card {
  min-height: 600px;
}

.demo-section {
  margin-bottom: 32px;
  padding: 24px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.demo-section h3 {
  margin-bottom: 16px;
  color: #1890ff;
  font-size: 16px;
  font-weight: 600;
}

.upload-history {
  margin-top: 32px;
  padding: 24px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.upload-history h3 {
  margin-bottom: 16px;
  color: #1890ff;
  font-size: 16px;
  font-weight: 600;
}
</style>