<template>
  <h2>这里是用户中心页面</h2>
  <br />
  <div @click="jump('index')">点击跳转至index</div>
  <br />
  <br />
  <div @click="jump('login')" class="size24">点击跳转至login</div>
</template>
<script lang="ts" setup>
const router = useRouter();
const jump = (name: string) => {
  router.push({ name });
};
</script>
