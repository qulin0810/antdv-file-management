<template>
  <div class="form-modal-demo">
    <a-card title="表单弹窗组件演示" class="demo-card">
      <!-- 返回按钮 -->
      <div class="back-nav">
        <a-button type="link" @click="$router.back()">
          <template #icon><arrow-left-outlined /></template>
          返回组件列表
        </a-button>
      </div>

      <!-- 演示区域 -->
      <div class="demo-content">
        <div class="demo-description">
          <h3>表单弹窗组件功能演示</h3>
          <p>点击下面的按钮打开不同类型的表单弹窗，体验表单验证、文件上传等功能。</p>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <a-space :size="16">
            <a-button type="primary" @click="showCreateModal">
              <template #icon><plus-outlined /></template>
              新建文件
            </a-button>
            <a-button type="default" @click="showEditModal">
              <template #icon><edit-outlined /></template>
              编辑文件
            </a-button>
            <a-button type="dashed" @click="showViewModal">
              <template #icon><eye-outlined /></template>
              查看文件
            </a-button>
          </a-space>
        </div>

        <!-- 演示结果 -->
        <div class="demo-result" v-if="submittedData">
          <h4>最近提交的数据：</h4>
          <a-descriptions bordered :column="2">
            <a-descriptions-item label="文件名称">{{ submittedData.name }}</a-descriptions-item>
            <a-descriptions-item label="文件类型">{{ submittedData.type }}</a-descriptions-item>
            <a-descriptions-item label="所属部门">{{ submittedData.department }}</a-descriptions-item>
            <a-descriptions-item label="文件描述">{{ submittedData.description }}</a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </a-card>

    <!-- 表单弹窗 -->
    <FileFormModal
      v-model:visible="modalVisible"
      :edit-data="editData"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { 
  ArrowLeftOutlined, 
  PlusOutlined, 
  EditOutlined, 
  EyeOutlined 
} from '@ant-design/icons-vue';
import FileFormModal from '@/components/FileFormModal.vue';

interface FormData {
  name: string;
  type: string;
  department: string;
  description: string;
  file?: File;
}

const modalVisible = ref(false);
const editData = ref<any>(null);
const submittedData = ref<FormData | null>(null);

const mockEditData = {
  name: '示例文件',
  type: 'document',
  department: 'tech',
  description: '这是一个示例文件的描述信息'
};

const showCreateModal = () => {
  editData.value = null;
  modalVisible.value = true;
};

const showEditModal = () => {
  editData.value = mockEditData;
  modalVisible.value = true;
};

const showViewModal = () => {
  message.info('查看模式功能开发中...');
};

const handleFormSubmit = (data: FormData) => {
  console.log('表单提交数据:', data);
  submittedData.value = data;
  
  message.success(editData.value ? '文件编辑成功！' : '文件创建成功！');
  
  // 在实际项目中，这里应该调用API保存数据
  setTimeout(() => {
    message.info('数据已保存到服务器');
  }, 1000);
};
</script>

<style scoped>
.form-modal-demo {
  padding: 24px;
}

.demo-card {
  min-height: 600px;
}

.back-nav {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.demo-content {
  padding: 24px;
}

.demo-description {
  margin-bottom: 32px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #52c41a;
}

.demo-description h3 {
  margin-bottom: 8px;
  color: #333;
}

.demo-description p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.action-buttons {
  margin-bottom: 32px;
  text-align: center;
}

.demo-result {
  margin-top: 32px;
  padding: 24px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}

.demo-result h4 {
  margin-bottom: 16px;
  color: #333;
}
</style>