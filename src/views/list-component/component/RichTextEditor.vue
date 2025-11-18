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
        <!-- Quill 编辑器 -->
        <div ref="editorRef" class="quill-editor"></div>
        
        <!-- 预览区域 -->
        <div class="preview-section" v-if="showPreview">
          <a-divider>预览</a-divider>
          <div class="preview-content" v-html="content"></div>
        </div>
      </div>

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
            <!-- <a-button @click="setImageSize(100, 100)">小 (100x100)</a-button>
            <a-button @click="setImageSize(300, 200)">中 (300x200)</a-button>
            <a-button @click="setImageSize(500, 300)">大 (500x300)</a-button> -->
            <a-button @click="resetImageSize">重置</a-button>
          </a-space>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { message } from 'ant-design-vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// 清理所有删除按钮
function cleanupDeleteButtons() {
  if (quill) {
    const editor = quill.root;
    const deleteButtons = editor.querySelectorAll('button');
    deleteButtons.forEach(btn => {
      if (btn.innerHTML === '×') {
        btn.remove();
      }
    });
  }
}

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
let quill: Quill | null = null;

// 图片大小调整相关变量
const imageSizeModalVisible = ref(false);
const selectedImage = ref<HTMLImageElement | null>(null);
const imageWidth = ref<number | null>(null);
const imageHeight = ref<number | null>(null);
const maintainAspectRatio = ref(true);
const originalAspectRatio = ref(1);

// Quill 配置
const quillOptions = {
  modules: {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        'image': imageHandler
      }
    }
  },
  theme: 'snow',
  placeholder: '请输入内容...'
};

// 图片处理函数
function imageHandler() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();
  
  input.onchange = async () => {
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const range = quill?.getSelection();
        if (range) {
          const imageUrl = e.target?.result as string;
          quill?.insertEmbed(range.index, 'image', imageUrl);
          
          // 添加图片点击事件监听
          setTimeout(() => {
            addImageClickListeners();
          }, 100);
        }
      };
      reader.readAsDataURL(file);
    }
  };
}

// 添加图片点击事件监听
function addImageClickListeners() {
  if (!quill) return;
  debugger

  const editor = quill.root;
  const images = editor.querySelectorAll('img');
  
  images.forEach(img => {
    // 移除现有的事件监听器
    img.removeEventListener('click', handleImageClick);
    // 添加新的事件监听器
    img.addEventListener('click', handleImageClick);
    
    // 添加可调整大小的样式
    img.style.cursor = 'pointer';
    img.style.border = '2px dashed transparent';
    img.style.transition = 'border-color 0.3s';
  });
}

// 处理图片点击
function handleImageClick(event: Event) {
  const img = event.target as HTMLImageElement;
  selectedImage.value = img;
  
  // 添加选中样式
  img.style.borderColor = '#1890ff';
  
  // 添加删除按钮
  addDeleteButton(img);
  
  // 移除其他图片的选中样式和删除按钮
  if (quill) {
    const editor = quill.root;
    const allImages = editor.querySelectorAll('img');
    allImages.forEach(otherImg => {
      if (otherImg !== img) {
        otherImg.style.borderColor = 'transparent';
        removeDeleteButton(otherImg);
      }
    });
  }
}

// 显示图片大小调整弹窗
const showImageSizeModal = () => {
  if (!selectedImage.value) {
    message.warning('请先选择一张图片');
    return;
  }
  
  imageWidth.value = selectedImage.value.width || selectedImage.value.naturalWidth;
  imageHeight.value = selectedImage.value.height || selectedImage.value.naturalHeight;
  originalAspectRatio.value = selectedImage.value.naturalWidth / selectedImage.value.naturalHeight;
  imageSizeModalVisible.value = true;
};

// 添加删除按钮
function addDeleteButton(img: HTMLImageElement) {
  // 如果已经有删除按钮，先移除
  removeDeleteButton(img);
  
  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '×';
  deleteBtn.style.cssText = `
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    background: #ff4d4f;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;
  
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    deleteImage(img);
  };
  
  // 确保图片有相对定位的父容器
  if (img.parentElement && img.parentElement.style.position !== 'relative') {
    img.parentElement.style.position = 'relative';
  }
  
  img.parentElement?.appendChild(deleteBtn);
}

// 移除删除按钮
function removeDeleteButton(img: HTMLImageElement) {
  const deleteBtn = img.parentElement?.querySelector('button');
  if (deleteBtn) {
    deleteBtn.remove();
  }
}

// 删除图片
function deleteImage(img: HTMLImageElement) {
  if (quill) {
    const editor = quill.root;
    const imgContainer = img.parentElement;
    
    if (imgContainer) {
      imgContainer.remove();
      
      // 更新内容
      content.value = editor.innerHTML;
      emit('update:modelValue', content.value);
      
      message.success('图片已删除');
    }
  }
  
  selectedImage.value = null;
}


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
  if (quill) {
    content.value = quill.root.innerHTML;
    emit('update:modelValue', content.value);
  }
  
  imageSizeModalVisible.value = false;
  message.success('图片大小已调整');
};

// 取消图片大小调整
const cancelImageSize = () => {
  imageSizeModalVisible.value = false;
  // 不清除选中状态，保持图片选中
};

// 设置预设图片大小
// const setImageSize = (width: number, height: number) => {
//   imageWidth.value = width;
//   imageHeight.value = height;
// };

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

// 初始化 Quill 编辑器
onMounted(() => {
  if (editorRef.value) {
    quill = new Quill(editorRef.value, quillOptions);
    
    // 设置初始内容
    if (props.modelValue) {
      quill.root.innerHTML = props.modelValue;
      // 为现有图片添加点击事件
      setTimeout(() => {
        addImageClickListeners();
      }, 100);
    }
    
    // 监听内容变化
    quill.on('text-change', () => {
      const html = quill?.root.innerHTML || '';
      content.value = html;
      emit('update:modelValue', html);
      emit('change', html);
      // 清理删除按钮
      cleanupDeleteButtons();
      
      // 为新增的图片添加点击事件
      setTimeout(() => {
        addImageClickListeners();
      }, 100);
    });
    
    // 监听编辑器点击事件，用于取消图片选中
    quill.root.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLImageElement)) {
        // 点击非图片区域，取消选中
        if (selectedImage.value) {
          selectedImage.value.style.borderColor = 'transparent';
          removeDeleteButton(selectedImage.value);
          selectedImage.value = null;
        }
      }
    });
    
    // 添加自定义图片大小调整按钮到工具栏
    setTimeout(() => {
      addImageSizeButtonToToolbar();
    }, 100);
  }
});

// 添加图片大小调整按钮到工具栏
function addImageSizeButtonToToolbar() {
  if (!quill) return;
  
  // 直接通过DOM查找工具栏元素
  const toolbarElement = document.querySelector('.ql-toolbar');
  if (!toolbarElement) return;
  
  // 创建图片大小调整按钮
  const imageSizeButton = document.createElement('button');
  imageSizeButton.innerHTML = '<button>修改图片</button>';
  imageSizeButton.title = '修改图片大小';
  imageSizeButton.style.cssText = `
    width: 100px;
    height: 28px;
    border: 1px solid #ccc;
    background: white;
    border-radius: 3px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #444;
    transition: all 0.2s;
    margin-left: 8px;
  `;
  
  // 初始状态
  updateImageSizeButtonState(false);
  
  imageSizeButton.addEventListener('click', () => {
    if (!selectedImage.value) {
      message.warning('请先选择一张图片');
      return;
    }
    showImageSizeModal();
  });
  
  // 将按钮添加到工具栏
  toolbarElement.appendChild(imageSizeButton);
  
  // 监听选中图片变化，更新按钮状态
  watch(selectedImage, (newImage) => {
    updateImageSizeButtonState(!!newImage);
  });
  
  // 更新按钮状态
  function updateImageSizeButtonState(enabled: boolean) {
    if (enabled) {
      imageSizeButton.disabled = false;
      imageSizeButton.style.backgroundColor = '#1890ff';
      imageSizeButton.style.color = 'white';
      imageSizeButton.style.borderColor = '#1890ff';
      imageSizeButton.style.cursor = 'pointer';
    } else {
      imageSizeButton.disabled = true;
      imageSizeButton.style.backgroundColor = '#f5f5f5';
      imageSizeButton.style.color = '#bfbfbf';
      imageSizeButton.style.borderColor = '#d9d9d9';
      imageSizeButton.style.cursor = 'not-allowed';
    }
  }
}

// 监听外部内容变化
watch(() => props.modelValue, (newValue) => {
  if (quill && newValue !== quill.root.innerHTML) {
    quill.root.innerHTML = newValue;
    // 清理删除按钮
    cleanupDeleteButtons();
    // 为图片添加点击事件
    setTimeout(() => {
      addImageClickListeners();
    }, 100);
  }
});

// 清空内容
const handleClear = () => {
  if (quill) {
    quill.setText('');
    // 清理删除按钮
    cleanupDeleteButtons();
    message.success('内容已清空');
  }
};

// 保存内容
const handleSave = () => {
  emit('save', content.value);
  message.success('内容已保存');
};

// 组件销毁时清理
onUnmounted(() => {
  cleanupDeleteButtons();
  if (quill) {
    quill = null;
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

.quill-editor {
  min-height: v-bind(height);
}

:deep(.ql-editor) {
  min-height: v-bind(height);
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

:deep(.ql-toolbar) {
  border-bottom: 1px solid #d9d9d9;
  background: #fafafa;
}

:deep(.ql-container) {
  border: none;
  font-size: 14px;
}

:deep(.ql-editor h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

:deep(.ql-editor h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.75em 0;
}

:deep(.ql-editor h3) {
  font-size: 1.17em;
  font-weight: bold;
  margin: 0.83em 0;
}

:deep(.ql-editor h4) {
  font-size: 1em;
  font-weight: bold;
  margin: 1.12em 0;
}

:deep(.ql-editor h5) {
  font-size: 0.83em;
  font-weight: bold;
  margin: 1.5em 0;
}

:deep(.ql-editor h6) {
  font-size: 0.67em;
  font-weight: bold;
  margin: 2.33em 0;
}

:deep(.ql-editor p) {
  margin: 0 0 1em 0;
}

:deep(.ql-editor ul),
:deep(.ql-editor ol) {
  padding-left: 1.5em;
  margin: 1em 0;
}

:deep(.ql-editor blockquote) {
  border-left: 4px solid #ccc;
  margin: 1em 0;
  padding-left: 16px;
  color: #666;
  font-style: italic;
}

:deep(.ql-editor img) {
  max-width: 100%;
  height: auto;
  transition: border-color 0.3s;
}

:deep(.ql-editor img:hover) {
  border-color: #1890ff !important;
}

:deep(.ql-editor a) {
  color: #1890ff;
  text-decoration: none;
}

:deep(.ql-editor a:hover) {
  text-decoration: underline;
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

.preview-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.preview-content :deep(a) {
  color: #1890ff;
  text-decoration: none;
}

.preview-content :deep(a:hover) {
  text-decoration: underline;
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