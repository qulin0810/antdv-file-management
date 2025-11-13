<template>
  <div class="rich-text-editor-container">
    <a-card :title="title" class="editor-card">
      <template #extra>
        <a-space>
          <a-button @click="handleClear">清空</a-button>
          <a-button type="primary" @click="handleSave">保存</a-button>
        </a-space>
      </template>
      
      <div class="editor-wrapper">
        <!-- 工具栏 -->
        <div class="toolbar">
          <a-space :size="8" wrap>
            <a-button-group>
              <a-button @click="formatText('bold')" title="粗体">
                <template #icon><b-icon /></template>
              </a-button>
              <a-button @click="formatText('italic')" title="斜体">
                <template #icon><i-icon /></template>
              </a-button>
              <a-button @click="formatText('underline')" title="下划线">
                <template #icon><u-icon /></template>
              </a-button>
            </a-button-group>
            
            <a-button-group>
              <a-button @click="formatText('header', 1)" title="标题1">H1</a-button>
              <a-button @click="formatText('header', 2)" title="标题2">H2</a-button>
              <a-button @click="formatText('header', 3)" title="标题3">H3</a-button>
            </a-button-group>
            
            <a-button-group>
              <a-button @click="formatText('list', 'ordered')" title="有序列表">
                <template #icon><ordered-list-outlined /></template>
              </a-button>
              <a-button @click="formatText('list', 'bullet')" title="无序列表">
                <template #icon><unordered-list-outlined /></template>
              </a-button>
            </a-button-group>
            
            <a-button-group>
              <a-button @click="formatText('align', 'left')" title="左对齐">
                <template #icon><align-left-outlined /></template>
              </a-button>
              <a-button @click="formatText('align', 'center')" title="居中对齐">
                <template #icon><align-center-outlined /></template>
              </a-button>
              <a-button @click="formatText('align', 'right')" title="右对齐">
                <template #icon><align-right-outlined /></template>
              </a-button>
            </a-button-group>
            
            <a-upload
              :show-upload-list="false"
              :before-upload="beforeImageUpload"
              accept="image/*"
            >
              <a-button title="插入图片">
                <template #icon><picture-outlined /></template>
                插入图片
              </a-button>
            </a-upload>
            
            <a-button @click="insertLink" title="插入链接">
              <template #icon><link-outlined /></template>
              链接
            </a-button>
            
            <a-button @click="showImageSizeModal" title="调整图片大小" :disabled="!selectedImage">
              <template #icon><expand-outlined /></template>
              调整图片
            </a-button>
          </a-space>
        </div>
        
        <!-- 编辑器区域 -->
        <div
          ref="editorRef"
          class="editor-content"
          contenteditable="true"
          @input="handleInput"
          @paste="handlePaste"
          @keydown="handleKeydown"
          @click="handleEditorClick"
        ></div>
        
        <!-- 预览区域 -->
        <div class="preview-section" v-if="showPreview">
          <a-divider>预览</a-divider>
          <div class="preview-content" v-html="content"></div>
        </div>
      </div>
      
      <!-- 链接弹窗 -->
      <a-modal
        v-model:visible="linkModalVisible"
        title="插入链接"
        @ok="confirmLink"
        @cancel="cancelLink"
      >
        <a-form layout="vertical">
          <a-form-item label="链接地址">
            <a-input v-model:value="linkUrl" placeholder="请输入链接地址" />
          </a-form-item>
          <a-form-item label="链接文本">
            <a-input v-model:value="linkText" placeholder="请输入链接文本" />
          </a-form-item>
        </a-form>
      </a-modal>
      
      <!-- 图片大小调整弹窗 -->
      <a-modal
        v-model:visible="imageSizeModalVisible"
        title="调整图片大小"
        @ok="confirmImageSize"
        @cancel="cancelImageSize"
      >
        <a-form layout="vertical">
          <a-form-item label="图片预览">
            <div class="image-preview">
              <img :src="selectedImage?.src" :alt="selectedImage?.alt" class="preview-image" />
            </div>
          </a-form-item>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="宽度 (px)">
                <a-input-number
                  v-model:value="imageWidth"
                  :min="50"
                  :max="2000"
                  style="width: 100%"
                  placeholder="宽度"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="高度 (px)">
                <a-input-number
                  v-model:value="imageHeight"
                  :min="50"
                  :max="2000"
                  style="width: 100%"
                  placeholder="高度"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="保持宽高比">
            <a-switch v-model:checked="maintainAspectRatio" />
          </a-form-item>
          <a-space>
            <a-button @click="setImageSize(100, 100)">小 (100x100)</a-button>
            <a-button @click="setImageSize(300, 200)">中 (300x200)</a-button>
            <a-button @click="setImageSize(500, 300)">大 (500x300)</a-button>
            <a-button @click="resetImageSize">重置</a-button>
          </a-space>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { message } from 'ant-design-vue';
import type { UploadProps } from 'ant-design-vue';
import {
  BoldOutlined as BIcon,
  ItalicOutlined as IIcon,
  UnderlineOutlined as UIcon,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  PictureOutlined,
  LinkOutlined,
  ExpandOutlined,
} from '@ant-design/icons-vue';

interface Props {
  modelValue?: string;
  title?: string;
  height?: string;
  showPreview?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  title: '富文本编辑器',
  height: '400px',
  showPreview: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'save': [content: string];
  'change': [content: string];
}>();

const editorRef = ref<HTMLElement>();
const content = ref(props.modelValue);
const linkModalVisible = ref(false);
const linkUrl = ref('');
const linkText = ref('');

// 图片大小调整相关变量
const imageSizeModalVisible = ref(false);
const selectedImage = ref<HTMLImageElement | null>(null);
const imageWidth = ref<number | null>(null);
const imageHeight = ref<number | null>(null);
const maintainAspectRatio = ref(true);
const originalAspectRatio = ref(1);

// 初始化编辑器
onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = content.value;
  }
});

// 监听内容变化
watch(content, (newValue) => {
  emit('update:modelValue', newValue);
  emit('change', newValue);
});

// 处理输入
const handleInput = (event: Event) => {
  const target = event.target as HTMLElement;
  content.value = target.innerHTML;
};

// 格式化文本
const formatText = (command: string, value?: any) => {
  if (!editorRef.value) return;
  
  document.execCommand(command, false, value);
  editorRef.value.focus();
  content.value = editorRef.value.innerHTML;
};

// 处理粘贴事件（处理图片粘贴）
const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items;
  if (!items) return;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.indexOf('image') !== -1) {
      event.preventDefault();
      const file = item.getAsFile();
      if (file) {
        handleImageUpload(file);
      }
      break;
    }
  }
};

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  // 处理 Ctrl+B, Ctrl+I, Ctrl+U 等快捷键
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'b':
        event.preventDefault();
        formatText('bold');
        break;
      case 'i':
        event.preventDefault();
        formatText('italic');
        break;
      case 'u':
        event.preventDefault();
        formatText('underline');
        break;
    }
  }
};

// 图片上传前处理
const beforeImageUpload: UploadProps['beforeUpload'] = (file) => {
  handleImageUpload(file);
  return false; // 阻止默认上传行为
};

// 处理图片上传
const handleImageUpload = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageUrl = e.target?.result as string;
    if (editorRef.value) {
      document.execCommand('insertImage', false, imageUrl);
      editorRef.value.focus();
      content.value = editorRef.value.innerHTML;
    }
  };
  reader.readAsDataURL(file);
};

// 插入链接
const insertLink = () => {
  linkModalVisible.value = true;
  linkUrl.value = '';
  linkText.value = '';
};

// 确认插入链接
const confirmLink = () => {
  if (!linkUrl.value) {
    message.warning('请输入链接地址');
    return;
  }
  
  if (editorRef.value) {
    const linkHtml = linkText.value 
      ? `<a href="${linkUrl.value}" target="_blank">${linkText.value}</a>`
      : `<a href="${linkUrl.value}" target="_blank">${linkUrl.value}</a>`;
    
    document.execCommand('insertHTML', false, linkHtml);
    editorRef.value.focus();
    content.value = editorRef.value.innerHTML;
  }
  
  linkModalVisible.value = false;
};

// 取消插入链接
const cancelLink = () => {
  linkModalVisible.value = false;
};

// 清空内容
const handleClear = () => {
  if (editorRef.value) {
    editorRef.value.innerHTML = '';
    content.value = '';
  }
  message.success('内容已清空');
};

// 保存内容
const handleSave = () => {
  emit('save', content.value);
  debugger
  message.success('内容已保存');
};

// 处理编辑器点击事件（选择图片）
const handleEditorClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.tagName === 'IMG') {
    const imgElement = target as HTMLImageElement;
    selectedImage.value = imgElement;
    // 存储原始宽高比
    originalAspectRatio.value = imgElement.naturalWidth / imgElement.naturalHeight;
  } else {
    selectedImage.value = null;
  }
};

// 显示图片大小调整弹窗
const showImageSizeModal = () => {
  if (!selectedImage.value) {
    message.warning('请先选择一张图片');
    return;
  }
  
  imageWidth.value = selectedImage.value.width;
  imageHeight.value = selectedImage.value.height;
  imageSizeModalVisible.value = true;
};

// 确认图片大小调整
const confirmImageSize = () => {
  if (!selectedImage.value || !imageWidth.value || !imageHeight.value) {
    message.warning('请设置有效的图片尺寸');
    return;
  }
  
  selectedImage.value.width = imageWidth.value;
  selectedImage.value.height = imageHeight.value;
  selectedImage.value.style.width = `${imageWidth.value}px`;
  selectedImage.value.style.height = `${imageHeight.value}px`;
  
  // 更新编辑器内容
  if (editorRef.value) {
    content.value = editorRef.value.innerHTML;
  }
  
  imageSizeModalVisible.value = false;
  message.success('图片大小已调整');
};

// 取消图片大小调整
const cancelImageSize = () => {
  imageSizeModalVisible.value = false;
  selectedImage.value = null;
};

// 设置预设图片大小
const setImageSize = (width: number, height: number) => {
  imageWidth.value = width;
  imageHeight.value = height;
};

// 重置图片大小
const resetImageSize = () => {
  if (selectedImage.value) {
    imageWidth.value = selectedImage.value.naturalWidth;
    imageHeight.value = selectedImage.value.naturalHeight;
  }
};

// 监听宽度变化，自动调整高度（如果保持宽高比）
watch(imageWidth, (newWidth) => {
  if (maintainAspectRatio.value && newWidth && originalAspectRatio.value) {
    imageHeight.value = Math.round(newWidth / originalAspectRatio.value);
  }
});

// 监听高度变化，自动调整宽度（如果保持宽高比）
watch(imageHeight, (newHeight) => {
  if (maintainAspectRatio.value && newHeight && originalAspectRatio.value) {
    imageWidth.value = Math.round(newHeight * originalAspectRatio.value);
  }
});
</script>

<style scoped>
.rich-text-editor-container {
  width: 100%;
}

.editor-card {
  min-height: 500px;
}

.editor-wrapper {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.toolbar {
  padding: 12px;
  background: #fafafa;
  border-bottom: 1px solid #d9d9d9;
}

.editor-content {
  min-height: v-bind(height);
  padding: 16px;
  outline: none;
  line-height: 1.6;
  overflow-y: auto;
}

.editor-content:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.preview-section {
  margin-top: 16px;
}

.preview-content {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background: #fafafa;
  min-height: 100px;
  line-height: 1.6;
}

:deep(.editor-content img) {
  max-width: 100%;
  height: auto;
}

:deep(.editor-content a) {
  color: #1890ff;
  text-decoration: none;
}

:deep(.editor-content a:hover) {
  text-decoration: underline;
}

:deep(.editor-content h1) {
  font-size: 2em;
  margin: 0.67em 0;
}

:deep(.editor-content h2) {
  font-size: 1.5em;
  margin: 0.75em 0;
}

:deep(.editor-content h3) {
  font-size: 1.17em;
  margin: 0.83em 0;
}

:deep(.editor-content ul),
:deep(.editor-content ol) {
  padding-left: 2em;
  margin: 1em 0;
}

:deep(.editor-content blockquote) {
  border-left: 4px solid #ddd;
  margin: 1em 0;
  padding-left: 1em;
  color: #666;
}

.image-preview {
  text-align: center;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background: #fafafa;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}
</style>