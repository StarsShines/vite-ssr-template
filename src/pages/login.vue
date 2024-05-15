<template>
  <h2>这里是登录页面</h2>
  <br />
  <div @click="jump('index')">点击跳转至index</div>
  <br />
  <div @click="jump('user')" class="size24">点击跳转至user页面</div>
  <br />
</template>
<script lang="ts" setup>
const router = useRouter();
const jump = (name: string) => {
  router.push({ name });
};
</script>
