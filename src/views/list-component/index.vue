<template>
  <div class="component-overview">
    <a-card title="组件列表管理" class="overview-card">
      <div class="overview-description">
        <p>欢迎来到组件列表管理页面。这里展示了系统中可用的各种组件示例。</p>
        <p>点击下面的卡片查看不同组件的详细演示，每个组件都提供了完整的示例代码和使用说明。</p>
      </div>

      <!-- 组件分类 -->
      <div class="component-categories">
        <h3>组件分类</h3>
        <a-tabs default-active-key="table" @change="handleCategoryChange">
          <a-tab-pane key="table" tab="表格组件">
            <div class="component-grid">
              <a-card
                class="component-card"
                hoverable
                @click="$router.push({ name: 'BasicTableDemo' })"
              >
                <template #cover>
                  <div class="card-cover table-bg">
                    <table-outlined class="card-icon" />
                  </div>
                </template>
                <a-card-meta title="基础表格组件">
                  <template #description>
                    <div class="card-description">
                      <p>支持多种列类型：输入框、下拉选择、日期选择、开关等</p>
                      <ul>
                        <li>自定义列渲染</li>
                        <li>行选择和排序</li>
                        <li>分页和搜索</li>
                      </ul>
                    </div>
                  </template>
                </a-card-meta>
                <template #actions>
                  <setting-outlined key="setting" @click="showComponentInfo('BasicTable')" />
                  <eye-outlined key="view" @click="$router.push({ name: 'BasicTableDemo' })" />
                </template>
              </a-card>

              <a-card
                class="component-card"
                hoverable
                @click="$router.push({ name: 'SwitchDemo' })"
              >
                <template #cover>
                  <div class="card-cover switch-bg">
                    <swap-outlined class="card-icon" />
                  </div>
                </template>
                <a-card-meta title="Switch 开关组件">
                  <template #description>
                    <div class="card-description">
                      <p>表格中集成 Switch 开关，支持实时状态切换</p>
                      <ul>
                        <li>实时状态反馈</li>
                        <li>禁用状态控制</li>
                        <li>事件监听处理</li>
                      </ul>
                    </div>
                  </template>
                </a-card-meta>
                <template #actions>
                  <setting-outlined key="setting" @click="showComponentInfo('SwitchDemo')" />
                  <eye-outlined key="view" @click="$router.push({ name: 'SwitchDemo' })" />
                </template>
              </a-card>
            </div>
          </a-tab-pane>

          <a-tab-pane key="form" tab="表单组件">
            <div class="component-grid">
              <a-card
                class="component-card"
                hoverable
                @click="$router.push({ name: 'FormModalDemo' })"
              >
                <template #cover>
                  <div class="card-cover form-bg">
                    <form-outlined class="card-icon" />
                  </div>
                </template>
                <a-card-meta title="表单弹窗组件">
                  <template #description>
                    <div class="card-description">
                      <p>模态框表单，支持完整的表单验证和文件上传</p>
                      <ul>
                        <li>表单验证规则</li>
                        <li>文件上传功能</li>
                        <li>编辑和查看模式</li>
                      </ul>
                    </div>
                  </template>
                </a-card-meta>
                <template #actions>
                  <setting-outlined key="setting" @click="showComponentInfo('FormModal')" />
                  <eye-outlined key="view" @click="$router.push({ name: 'FormModalDemo' })" />
                </template>
              </a-card>

              <a-card
                class="component-card"
                hoverable
                @click="showComingSoon"
              >
                <template #cover>
                  <div class="card-cover coming-soon-bg">
                    <search-outlined class="card-icon" />
                  </div>
                </template>
                <a-card-meta title="搜索表单组件">
                  <template #description>
                    <div class="card-description">
                      <p>高级搜索表单，支持多条件组合查询</p>
                      <ul>
                        <li>动态表单字段</li>
                        <li>条件组合查询</li>
                        <li>查询结果展示</li>
                      </ul>
                    </div>
                  </template>
                </a-card-meta>
                <template #actions>
                  <setting-outlined key="setting" @click="showComponentInfo('SearchForm')" />
                  <eye-outlined key="view" @click="showComingSoon" />
                </template>
              </a-card>
            </div>
          </a-tab-pane>

          <a-tab-pane key="other" tab="其他组件">
            <div class="component-grid">
              <a-card
                class="component-card"
                hoverable
                @click="$router.push({ name: 'RichTextEditorDemo' })"
              >
                <template #cover>
                  <div class="card-cover editor-bg">
                    <edit-outlined class="card-icon" />
                  </div>
                </template>
                <a-card-meta title="富文本编辑器">
                  <template #description>
                    <div class="card-description">
                      <p>功能强大的富文本编辑器，支持图片编辑和格式化</p>
                      <ul>
                        <li>文本格式化</li>
                        <li>图片上传和编辑</li>
                        <li>链接插入</li>
                        <li>内容预览</li>
                      </ul>
                    </div>
                  </template>
                </a-card-meta>
                <template #actions>
                  <setting-outlined key="setting" @click="showComponentInfo('RichTextEditor')" />
                  <eye-outlined key="view" @click="$router.push({ name: 'RichTextEditorDemo' })" />
                </template>
              </a-card>

              <a-card
                class="component-card"
                hoverable
                @click="showComingSoon"
              >
                <template #cover>
                  <div class="card-cover other-bg">
                    <upload-outlined class="card-icon" />
                  </div>
                </template>
                <a-card-meta title="文件上传组件">
                  <template #description>
                    <div class="card-description">
                      <p>多文件上传，支持拖拽和预览功能</p>
                      <ul>
                        <li>多文件选择</li>
                        <li>拖拽上传</li>
                        <li>文件预览</li>
                      </ul>
                    </div>
                  </template>
                </a-card-meta>
                <template #actions>
                  <setting-outlined key="setting" @click="showComponentInfo('Upload')" />
                  <eye-outlined key="view" @click="showComingSoon" />
                </template>
              </a-card>

              <a-card
                class="component-card"
                hoverable
                @click="showComingSoon"
              >
                <template #cover>
                  <div class="card-cover chart-bg">
                    <pie-chart-outlined class="card-icon" />
                  </div>
                </template>
                <a-card-meta title="图表组件">
                  <template #description>
                    <div class="card-description">
                      <p>数据可视化图表，支持多种图表类型</p>
                      <ul>
                        <li>折线图、柱状图</li>
                        <li>饼图、雷达图</li>
                        <li>实时数据更新</li>
                      </ul>
                    </div>
                  </template>
                </a-card-meta>
                <template #actions>
                  <setting-outlined key="setting" @click="showComponentInfo('Chart')" />
                  <eye-outlined key="view" @click="showComingSoon" />
                </template>
              </a-card>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- 快速导航区域 -->
      <div class="quick-nav">
        <h3>快速导航</h3>
        <a-space :size="16" wrap>
          <a-button type="primary" @click="$router.push({ name: 'BasicTableDemo' })">
            <template #icon><table-outlined /></template>
            基础表格
          </a-button>
          <a-button type="primary" @click="$router.push({ name: 'SwitchDemo' })">
            <template #icon><swap-outlined /></template>
            Switch 演示
          </a-button>
          <a-button type="primary" @click="$router.push({ name: 'FormModalDemo' })">
            <template #icon><form-outlined /></template>
            表单弹窗
          </a-button>
          <a-button type="primary" @click="$router.push({ name: 'RichTextEditorDemo' })">
            <template #icon><edit-outlined /></template>
            富文本编辑器
          </a-button>
          <a-button type="dashed" @click="showAllComponents">
            <template #icon><appstore-outlined /></template>
            查看所有组件
          </a-button>
        </a-space>
      </div>

      <!-- 统计信息 -->
      <div class="stats-section">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-statistic title="可用组件" :value="9" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="已完成" :value="4" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="开发中" :value="5" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="更新日期" :value="'2024-01-15'" />
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import {
  TableOutlined,
  SwapOutlined,
  FormOutlined,
  SettingOutlined,
  EyeOutlined,
  SearchOutlined,
  UploadOutlined,
  PieChartOutlined,
  AppstoreOutlined,
  EditOutlined
} from '@ant-design/icons-vue';

const handleCategoryChange = (key: string) => {
  console.log('切换分类:', key);
};

const showComponentInfo = (componentName: string) => {
  message.info(`查看 ${componentName} 组件信息`);
};

const showComingSoon = () => {
  message.warning('该功能正在开发中，敬请期待！');
};

const showAllComponents = () => {
  message.info('正在加载所有组件列表...');
};
</script>

<style scoped>
.component-overview {
  padding: 24px;
}

.overview-card {
  min-height: 600px;
}

.overview-description {
  margin-bottom: 32px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #1890ff;
}

.overview-description p {
  margin: 8px 0;
  color: #666;
  line-height: 1.6;
}

.component-categories {
  margin-bottom: 32px;
}

.component-categories h3 {
  margin-bottom: 16px;
  color: #333;
  font-size: 18px;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.component-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.component-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #1890ff;
}

.card-cover {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.switch-bg {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.form-bg {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.coming-soon-bg {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.editor-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.other-bg {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.chart-bg {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
}

.card-icon {
  font-size: 48px;
  color: white;
}

.card-description {
  font-size: 14px;
  color: #666;
}

.card-description p {
  margin-bottom: 8px;
  line-height: 1.5;
}

.card-description ul {
  margin: 8px 0;
  padding-left: 16px;
}

.card-description li {
  margin-bottom: 4px;
  line-height: 1.4;
}

.quick-nav {
  padding: 24px;
  background: #fafafa;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 32px;
}

.quick-nav h3 {
  margin-bottom: 16px;
  color: #333;
}

.stats-section {
  padding: 24px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}
</style>