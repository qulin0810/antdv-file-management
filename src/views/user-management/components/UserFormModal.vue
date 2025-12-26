<template>
  <a-modal
    :open="visible"
    :title="isEdit ? t('userManagement.editUser') : t('userManagement.addUser')"
    width="800px"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="localFormData"
      :rules="rules"
      layout="vertical"
    >
      <a-form-item :label="t('userManagement.username')" name="username">
        <a-input v-model:value="localFormData.username" :placeholder="t('userManagement.enterUsername')" />
      </a-form-item>
      <a-form-item :label="t('userManagement.email')" name="email">
        <a-input v-model:value="localFormData.email" :placeholder="t('userManagement.enterEmail')" />
      </a-form-item>
      <a-form-item :label="t('userManagement.role')" name="role">
        <a-select v-model:value="localFormData.role" :placeholder="t('userManagement.selectRole')">
          <a-select-option value="admin">{{ t('userManagement.admin') }}</a-select-option>
          <a-select-option value="user">{{ t('userManagement.user') }}</a-select-option>
          <a-select-option value="guest">{{ t('userManagement.guest') }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('userManagement.job')" name="job">
        <a-select v-model:value="localFormData.job" :placeholder="t('userManagement.selectJob')" :options="props.jobOptions" />
      </a-form-item>
      <a-form-item :label="t('userManagement.pet')" name="pet">
        <a-select v-model:value="localFormData.pet" :placeholder="t('userManagement.selectPet')">
          <a-select-option value="小猫">{{ t('userManagement.cat') }}</a-select-option>
          <a-select-option value="小狗">{{ t('userManagement.dog') }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('userManagement.status')" name="status">
        <a-radio-group v-model:value="localFormData.status">
          <a-radio value="active">{{ t('userManagement.active') }}</a-radio>
          <a-radio value="inactive">{{ t('userManagement.inactive') }}</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 修改时间 -->
      <a-form-item :label="t('userManagement.modificationTime')" name="modificationTime">
        <a-date-picker
          v-model:value="modificationTimeDate"
          :placeholder="t('userManagement.selectModificationTime')"
          style="width: 100%"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </a-form-item>
      
      <!-- 爱好输入区域 -->
      <a-form-item :label="t('userManagement.hobbies')">
        <div class="hobbies-container">
          <div
            v-for="(hobby, index) in hobbies"
            :key="index"
            class="hobby-item"
          >
            <a-input
              v-model:value="hobbies[index]"
              :placeholder="t('userManagement.hobbyPlaceholder', { index: index + 1 })"
              class="hobby-input"
            />
            <a-button
              type="link"
              danger
              @click="removeHobby(index)"
              class="remove-btn"
            >
              {{ t('userManagement.remove') }}
            </a-button>
          </div>
          <a-button
            type="dashed"
            @click="addHobby"
            class="add-hobby-btn"
          >
            <template #icon>
              <PlusOutlined />
            </template>
            {{ t('userManagement.addHobby') }}
          </a-button>
        </div>
      </a-form-item>

      <!-- 书籍输入区域（必填项） -->
      <a-form-item
        :label="t('userManagement.books')"
        required
      >
        <div class="books-container">
          <div
            v-for="(book, index) in books"
            :key="book.id"
            class="book-item"
          >
            <a-select
              v-model:value="book.bookName"
              :placeholder="t('userManagement.selectBook')"
              class="book-select"
              :options="bookOptions"
              show-search
              :filter-option="filterBookOption"
              @change="(value: number) => handleBookSelectChange(value, index)"
            />
            <a-input
              v-model:value="book.bookDisplayName"
              :placeholder="t('userManagement.enterBookName')"
              class="book-input"
            />
            <a-button
              type="link"
              danger
              @click="removeBook(index)"
              class="remove-btn"
            >
              {{ t('userManagement.remove') }}
            </a-button>
          </div>
          <a-button
            type="dashed"
            @click="addBook"
            class="add-book-btn"
          >
            <template #icon>
              <PlusOutlined />
            </template>
            {{ t('userManagement.addBook') }}
          </a-button>
        </div>
      </a-form-item>

      <!-- 富文本编辑器 -->
      <a-form-item :label="t('userManagement.userDescription')" name="richTextContent">
        <RichTextEditor
          v-model:modelValue="localFormData.richTextContent"
          :title="t('userManagement.userDescription')"
          height="300px"
          @save="handleRichTextSave"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PlusOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import type { UserFormData, HobbyItem, BookItem } from '../types'
import { createEmptyUserFormData } from '../types'
import RichTextEditor from '@/views/list-component/component/RichTextEditor.vue'

const { t } = useI18n()

defineOptions({
  name: 'UserFormModal'
})

const props = withDefaults(defineProps<{
  visible: boolean
  isEdit: boolean
  formData: UserFormData
  jobOptions?: Array<{ label: string; value: number }>
}>(), {
  visible: false,
  isEdit: false,
  formData: () => createEmptyUserFormData(),
  jobOptions: () => []
})

const emit = defineEmits<{
  ok: [formData: UserFormData, isEdit: boolean]
  cancel: []
  'update:visible': [visible: boolean]
}>()

const formRef = ref()
const localFormData = reactive<UserFormData>({
  ...createEmptyUserFormData(),
  hobbies: [], // 确保hobbies数组被初始化
  books: []    // 确保books数组被初始化
})

// 计算属性确保hobbies数组始终存在
const hobbies = computed({
  get: () => localFormData.hobbies || [],
  set: (value) => {
    localFormData.hobbies = value
  }
})

// 计算属性确保books数组始终存在
const books = computed({
  get: () => localFormData.books || [],
  set: (value) => {
    localFormData.books = value
  }
})

// 书籍选项
const bookOptions = [
  { label: 'JavaScript高级程序设计', value: 1 },
  { label: 'Vue.js设计与实现', value: 2 },
  { label: 'React进阶之路', value: 3 },
  { label: 'TypeScript编程', value: 4 },
  { label: '算法导论', value: 5 },
  { label: '设计模式', value: 6 },
  { label: '其他', value: 7 }
]

// 书籍搜索过滤函数
const filterBookOption = (input: string, option: any) => {
  return option.label.toLowerCase().includes(input.toLowerCase())
}

// 修改时间的日期对象（用于DatePicker）
const modificationTimeDate = ref<string | null>(null)

// 监听修改时间的变化，转换为时间戳
watch(modificationTimeDate, (newDate) => {
  if (newDate) {
    localFormData.modificationTime = dayjs(newDate).valueOf()
  } else {
    localFormData.modificationTime = undefined
  }
})

// 监听localFormData.modificationTime的变化，转换为日期字符串用于回显
watch(() => localFormData.modificationTime, (newTimestamp) => {
  if (newTimestamp) {
    modificationTimeDate.value = dayjs(newTimestamp).format('YYYY-MM-DD')
  } else {
    modificationTimeDate.value = null
  }
})

const rules = {
  username: [
    { required: true, message: t('userManagement.enterUsername'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('userManagement.enterEmail'), trigger: 'blur' },
    { type: 'email', message: t('userManagement.enterCorrectEmail'), trigger: 'blur' }
  ],
  role: [
    { required: true, message: t('userManagement.selectRole'), trigger: 'change' }
  ],
  job: [
    { required: true, message: t('userManagement.selectJob'), trigger: 'change' }
  ],
  pet: [
    { required: false, message: t('userManagement.selectPet'), trigger: 'change' }
  ],
  status: [
    { required: true, message: t('userManagement.selectStatus'), trigger: 'change' }
  ],
  modificationTime: [
    { required: false, message: t('userManagement.selectModificationTime'), trigger: 'change' }
  ]
}

// 书籍验证函数
const validateBooks = (): boolean => {
  const bookList = books.value
  const errors: string[] = []

  // 0. 至少需要一本书（必填项）
  if (bookList.length === 0) {
    errors.push(t('userManagement.booksRequired'))
  }

  // 检查每个书籍项
  bookList.forEach((book, index) => {
    // 1. bookName必填
    if (!book.bookName?.trim()) {
      errors.push(t('userManagement.bookNameRequired', { index: index + 1 }))
    }

    // 2. bookDisplayName必填（如果需要）
    if (!book.bookDisplayName?.trim()) {
      errors.push(t('userManagement.bookDisplayNameRequired', { index: index + 1 }))
    }
  })

  // 3. bookName不能重复
  const bookNameSet = new Set<string>()
  bookList.forEach((book, index) => {
    if (book.bookName?.trim()) {
      if (bookNameSet.has(book.bookName.trim())) {
        errors.push(t('userManagement.bookNameDuplicate', { bookName: book.bookName }))
      } else {
        bookNameSet.add(book.bookName.trim())
      }
    }
  })

  // 4. bookDisplayName不能重复
  const bookDisplayNameSet = new Set<string>()
  bookList.forEach((book, index) => {
    if (book.bookDisplayName?.trim()) {
      if (bookDisplayNameSet.has(book.bookDisplayName.trim())) {
        errors.push(t('userManagement.bookDisplayNameDuplicate', { displayName: book.bookDisplayName }))
      } else {
        bookDisplayNameSet.add(book.bookDisplayName.trim())
      }
    }
  })

  if (errors.length > 0) {
    // 显示错误消息
    const errorMessage = t('userManagement.bookValidationErrors') + '\n' + errors.join('\n')
    message.error(errorMessage, 5)
    return false
  }
  return true
}

// 将爱好显示格式转换为提交格式
const convertHobbiesDisplayToSubmit = (hobbiesDisplay: HobbyItem[]): string[] => {
  if (!hobbiesDisplay || !Array.isArray(hobbiesDisplay)) return []
  return hobbiesDisplay.map(item => item.hobby).filter(Boolean)
}

// 将爱好提交格式转换为显示格式
const convertHobbiesSubmitToDisplay = (hobbies: string[]): HobbyItem[] => {
  if (!hobbies || !Array.isArray(hobbies)) return []
  return hobbies.filter(Boolean).map((hobby, index) => ({
    id: index + 1,
    hobby: hobby
  }))
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      // 当模态框打开时，根据是否是编辑模式来设置表单数据
      if (props.isEdit) {
        Object.assign(localFormData, props.formData)
        // 确保爱好数据正确设置
        if (props.formData.hobbiesDisplay && props.formData.hobbiesDisplay.length > 0) {
          localFormData.hobbies = props.formData.hobbiesDisplay.map(item => item.hobby)
        }
        // 确保书籍数据正确设置
        const normalizeBooks = (books: BookItem[]): BookItem[] => {
          return books.map(book => ({
            ...book,
            bookDisplayName: book.bookDisplayName || book.bookName
          }))
        }
        if (props.formData.booksDisplay && props.formData.booksDisplay.length > 0) {
          localFormData.books = normalizeBooks([...props.formData.booksDisplay])
        } else if (props.formData.books && props.formData.books.length > 0) {
          localFormData.books = normalizeBooks([...props.formData.books])
        }
        // 设置修改时间的日期显示
        if (props.formData.modificationTime) {
          modificationTimeDate.value = dayjs(props.formData.modificationTime).format('YYYY-MM-DD')
        } else {
          modificationTimeDate.value = null
        }
      } else {
        // 新增模式时重置表单数据
        resetLocalFormData()
        modificationTimeDate.value = null
      }
    }
  },
  { immediate: true }
)

// 书籍相关方法
const addBook = () => {
  const newId = books.value.length > 0 ? Math.max(...books.value.map(b => b.id)) + 1 : 1
  books.value.push({
    id: newId,
    bookName: '',
    bookDisplayName: '',
    author: '' // 保留字段但不再使用
  })
}

const removeBook = (index: number) => {
  books.value.splice(index, 1)
}

const handleBookSelectChange = (value: number, index: number) => {
  // 当选择书籍时，更新bookDisplayName为对应的标签
  const book = books.value[index]
  if (book) {
    const selectedOption = bookOptions.find(opt => opt.value === value)
    book.bookDisplayName = selectedOption?.label || String(value)
  }
  console.log(`选择了书籍: ${value}，索引: ${index}`)
}

const handleOk = async () => {
  try {
    await formRef.value.validate()
    
    // 验证书籍数组
    if (!validateBooks()) {
      return
    }
    
    // 准备提交的数据
    const submitData = { ...localFormData }
    
    // 确保提交时hobbiesDisplay格式正确
    if (submitData.hobbies && submitData.hobbies.length > 0) {
      submitData.hobbiesDisplay = convertHobbiesSubmitToDisplay(submitData.hobbies)
    } else {
      submitData.hobbiesDisplay = []
    }
    
    // 确保提交时booksDisplay格式正确
    if (submitData.books && submitData.books.length > 0) {
      submitData.booksDisplay = [...submitData.books]
    } else {
      submitData.booksDisplay = []
    }
    
    emit('ok', submitData, props.isEdit)
    emit('update:visible', false)
  } catch (error) {
    console.log('表单验证失败:', error)
  }
}

const handleRichTextSave = (content: string) => {
  localFormData.richTextContent = content
  console.log('富文本内容已保存:', content)
}

const handleCancel = () => {
  emit('update:visible', false)
  emit('cancel')
  // 使用表单组件的内置重置方法
  resetForm()
}

const addHobby = () => {
  hobbies.value.push('')
}

const removeHobby = (index: number) => {
  hobbies.value.splice(index, 1)
}

const resetLocalFormData = () => {
  // 使用 Object.assign 和工厂函数重置表单数据
  const emptyForm = createEmptyUserFormData()
  Object.assign(localFormData, emptyForm)
  // 确保hobbies数组被正确重置
  localFormData.hobbies = []
  // 确保books数组被正确重置
  localFormData.books = []
}

const resetForm = () => {
  // 使用表单组件的内置重置方法
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // 同时重置本地数据以确保一致性
  resetLocalFormData()
}
</script>

<style scoped>
.hobbies-container {
  width: 100%;
}

.hobby-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.hobby-input {
  flex: 1;
}

.books-container {
  width: 100%;
}

.book-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.book-select {
  width: 200px;
  flex-shrink: 0;
}

.book-input {
  flex: 1;
}

.remove-btn {
  flex-shrink: 0;
  padding: 4px 8px;
}

.add-hobby-btn,
.add-book-btn {
  width: 100%;
  margin-top: 8px;
}
</style>