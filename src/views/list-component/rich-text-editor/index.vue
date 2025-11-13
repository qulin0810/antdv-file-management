<template>
  <div class="rich-text-editor-management">
    <a-page-header
      title="富文本编辑器管理"
      sub-title="创建和管理富文本内容"
      @back="handleBack"
    >
      <template #extra>
        <a-space>
          <a-button @click="handleExport">导出HTML</a-button>
          <a-button type="primary" @click="handleNew">新建内容</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-row :gutter="24" class="management-content">
      <!-- 内容列表 -->
      <a-col :span="8">
        <a-card title="内容列表" class="content-list-card">
          <template #extra>
            <a-input-search
              v-model:value="searchText"
              placeholder="搜索内容标题"
              style="width: 200px"
              @search="handleSearch"
            />
          </template>

          <a-list
            :data-source="filteredContents"
            :loading="loading"
            class="content-list"
          >
            <template #renderItem="{ item }">
              <a-list-item
                :class="{ 'active': selectedContent?.id === item.id }"
                @click="handleSelectContent(item)"
              >
                <a-list-item-meta
                  :title="item.title"
                  :description="formatDate(item.updatedAt)"
                >
                  <template #avatar>
                    <file-text-outlined style="color: #1890ff; font-size: 20px;" />
                  </template>
                </a-list-item-meta>
                
                <template #actions>
                  <a-tooltip title="编辑">
                    <edit-outlined @click.stop="handleEdit(item)" />
                  </a-tooltip>
                  <a-tooltip title="删除">
                    <delete-outlined @click.stop="handleDelete(item)" />
                  </a-tooltip>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <!-- 编辑器区域 -->
      <a-col :span="16">
        <a-card :title="editorTitle" class="editor-card">
          <template #extra>
            <a-space>
              <a-button @click="handlePreview" :disabled="!selectedContent">
                预览
              </a-button>
              <a-button type="primary" @click="handleSave" :loading="saving">
                保存
              </a-button>
            </a-space>
          </template>

          <!-- 内容表单 -->
          <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            layout="vertical"
            v-if="selectedContent"
          >
            <a-form-item label="标题" name="title">
              <a-input
                v-model:value="formState.title"
                placeholder="请输入内容标题"
              />
            </a-form-item>

            <a-form-item label="描述" name="description">
              <a-textarea
                v-model:value="formState.description"
                placeholder="请输入内容描述"
                :rows="2"
              />
            </a-form-item>

            <a-form-item label="内容" name="content">
              <RichTextEditor
                v-model:modelValue="formState.content"
                title=""
                height="400px"
                :show-preview="false"
                @save="handleSave"
              />
            </a-form-item>

            <a-form-item label="标签">
              <a-select
                v-model:value="formState.tags"
                mode="tags"
                style="width: 100%"
                placeholder="添加标签"
                :options="tagOptions"
              />
            </a-form-item>
          </a-form>

          <!-- 空状态 -->
          <a-empty
            v-else
            description="请选择或创建内容进行编辑"
            class="empty-state"
          >
            <template #image>
              <file-text-outlined style="font-size: 48px; color: #ccc;" />
            </template>
            <a-button type="primary" @click="handleNew">新建内容</a-button>
          </a-empty>
        </a-card>
      </a-col>
    </a-row>

    <!-- 预览弹窗 -->
    <a-modal
      v-model:visible="previewVisible"
      title="内容预览"
      width="80%"
      :footer="null"
    >
      <div class="preview-modal-content">
        <h2>{{ formState.title }}</h2>
        <p v-if="formState.description" class="preview-description">
          {{ formState.description }}
        </p>
        <div class="preview-content" v-html="formState.content"></div>
        
        <div class="preview-tags" v-if="formState.tags && formState.tags.length">
          <a-tag
            v-for="tag in formState.tags"
            :key="tag"
            color="blue"
          >
            {{ tag }}
          </a-tag>
        </div>
      </div>
    </a-modal>

    <!-- 删除确认弹窗 -->
    <a-modal
      v-model:visible="deleteModalVisible"
      title="确认删除"
      @ok="confirmDelete"
      @cancel="cancelDelete"
    >
      <p>确定要删除 "{{ deleteContent?.title }}" 吗？此操作不可恢复。</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import {
  FileTextOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue';
import RichTextEditor from '../component/RichTextEditor.vue';

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const router = useRouter();

// 响应式数据
const loading = ref(false);
const saving = ref(false);
const previewVisible = ref(false);
const deleteModalVisible = ref(false);
const searchText = ref('');
const selectedContent = ref<ContentItem | null>(null);
const deleteContent = ref<ContentItem | null>(null);
const formRef = ref<FormInstance>();

// 表单状态
const formState = reactive({
  title: '',
  description: '',
  content: '',
  tags: [] as string[],
});

// 验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 1, max: 50, message: '标题长度在1-50个字符之间', trigger: 'blur' },
  ],
  description: [
    { max: 200, message: '描述长度不能超过200个字符', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
  ],
};

// 模拟数据
const contents = ref<ContentItem[]>([
  {
    id: '1',
    title: '欢迎使用富文本编辑器',
    description: '这是一个示例内容，展示了富文本编辑器的功能',
    content: '<h1>欢迎使用富文本编辑器</h1><p>这是一个功能强大的富文本编辑器，支持：</p><ul><li><strong>文本格式化</strong> - 粗体、斜体、下划线</li><li><strong>标题样式</strong> - H1, H2, H3</li><li><strong>列表</strong> - 有序列表和无序列表</li><li><strong>图片插入</strong> - 支持上传和粘贴图片</li><li><strong>链接插入</strong> - 添加超链接</li><li><strong>对齐方式</strong> - 左对齐、居中、右对齐</li></ul><p>开始创建您的内容吧！</p>',
    tags: ['示例', '欢迎'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: '产品功能介绍',
    description: '详细介绍产品的各项功能特性',
    content: '<h2>产品核心功能</h2><p>我们的产品提供以下核心功能：</p><ol><li>用户友好的界面设计</li><li>强大的数据处理能力</li><li>灵活的配置选项</li><li>完善的权限管理</li></ol><p><img src="https://via.placeholder.com/400x200" alt="产品截图" style="max-width: 100%;"></p>',
    tags: ['产品', '功能'],
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z',
  },
]);

// 标签选项
const tagOptions = ref([
  { value: '新闻', label: '新闻' },
  { value: '产品', label: '产品' },
  { value: '教程', label: '教程' },
  { value: '公告', label: '公告' },
  { value: '示例', label: '示例' },
]);

// 计算属性
const filteredContents = computed(() => {
  if (!searchText.value) return contents.value;
  return contents.value.filter(item =>
    item.title.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const editorTitle = computed(() => {
  return selectedContent.value ? `编辑: ${selectedContent.value.title}` : '富文本编辑器';
});

// 方法
const handleBack = () => {
  router.push({ name: 'ComponentOverview' });
};

const handleSearch = () => {
  // 搜索逻辑已在计算属性中实现
};

const handleSelectContent = (content: ContentItem) => {
  selectedContent.value = content;
  Object.assign(formState, {
    title: content.title,
    description: content.description || '',
    content: content.content,
    tags: [...content.tags],
  });
};

const handleNew = () => {
  selectedContent.value = {
    id: Date.now().toString(),
    title: '',
    description: '',
    content: '',
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  Object.assign(formState, {
    title: '',
    description: '',
    content: '',
    tags: [],
  });
};

const handleEdit = (content: ContentItem) => {
  handleSelectContent(content);
};

const handleDelete = (content: ContentItem) => {
  deleteContent.value = content;
  deleteModalVisible.value = true;
};

const confirmDelete = () => {
  if (deleteContent.value) {
    const index = contents.value.findIndex(item => item.id === deleteContent.value!.id);
    if (index !== -1) {
      contents.value.splice(index, 1);
      message.success('内容删除成功');
      
      if (selectedContent.value?.id === deleteContent.value.id) {
        selectedContent.value = null;
      }
    }
  }
  deleteModalVisible.value = false;
  deleteContent.value = null;
};

const cancelDelete = () => {
  deleteModalVisible.value = false;
  deleteContent.value = null;
};

const handleSave = async () => {
  if (!selectedContent.value) {
    message.warning('请先选择或创建内容');
    return;
  }

  try {
    await formRef.value?.validate();
    
    saving.value = true;
    
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const contentIndex = contents.value.findIndex(item => item.id === selectedContent.value!.id);
    const updatedContent: ContentItem = {
      ...selectedContent.value,
      title: formState.title,
      description: formState.description,
      content: formState.content,
      tags: formState.tags,
      updatedAt: new Date().toISOString(),
    };
    
    if (contentIndex === -1) {
      // 新增内容
      contents.value.unshift(updatedContent);
      message.success('内容创建成功');
    } else {
      // 更新内容
      contents.value[contentIndex] = updatedContent;
      message.success('内容保存成功');
    }
    
    selectedContent.value = updatedContent;
    
  } catch (error) {
    console.error('保存失败:', error);
  } finally {
    saving.value = false;
  }
};

const handlePreview = () => {
  if (!formState.content) {
    message.warning('请先输入内容');
    return;
  }
  previewVisible.value = true;
};

const handleExport = () => {
  if (!selectedContent.value) {
    message.warning('请先选择要导出的内容');
    return;
  }
  
  const blob = new Blob([formState.content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${formState.title || 'content'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  message.success('内容已导出为HTML文件');
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN');
};

// 生命周期
onMounted(() => {
  // 可以在这里加载远程数据
});
</script>

<style scoped>
.rich-text-editor-management {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.management-content {
  margin-top: 24px;
}

.content-list-card {
  height: 600px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.content-list {
  flex: 1;
  overflow-y: auto;
}

.content-list :deep(.ant-list-item) {
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 6px;
  margin-bottom: 8px;
  padding: 12px;
  transition: all 0.3s;
}

.content-list :deep(.ant-list-item:hover) {
  border-color: #d9d9d9;
  background: #fafafa;
}

.content-list :deep(.ant-list-item.active) {
  border-color: #1890ff;
  background: #e6f7ff;
}

.editor-card {
  min-height: 600px;
}

.empty-state {
  padding: 60px 0;
}

.preview-modal-content {
  max-height: 70vh;
  overflow-y: auto;
}

.preview-modal-content h2 {
  margin-bottom: 16px;
  color: #333;
}

.preview-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.preview-content {
  line-height: 1.8;
  margin-bottom: 24px;
}

.preview-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.preview-tags {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>