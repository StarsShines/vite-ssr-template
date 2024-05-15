<template>
  <h1>测试 vueUse 的鼠标坐标</h1>
  <h3>Mouse: {{ x }} x {{ y }}</h3>
  <br />
  <br />
  <div @click="jump('index')">点击跳转至index</div>
</template>

<script lang="ts" setup>
import { useMouse } from '@vueuse/core';
const router = useRouter();
const jump = (name: string) => {
  router.push({ name });
};
const { x, y } = useMouse();
</script>
