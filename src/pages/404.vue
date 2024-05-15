<template>
  <div class="error-container">
    <van-empty image="error" description="404 页面不存在" />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;
}
</style>
