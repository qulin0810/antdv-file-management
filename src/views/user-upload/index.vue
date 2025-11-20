<template>
  <div class="user-upload-page">
    <a-page-header
      title="用户文件上传"
      sub-title="选择用户后上传文件"
      class="page-header"
    />
    
    <div class="content-wrapper">
      <UserUpload />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserUpload from '@/components/UserUpload.vue'
</script>

<style scoped>
.user-upload-page {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: #fff;
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-wrapper {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}
</style>