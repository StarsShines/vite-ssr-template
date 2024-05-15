<template>
  <img alt="Vue logo" :src="log" />
  <UsePinia />
  <br />
  <div @click="jump('login')" class="size24">点击跳转至login</div>
  <br />
  <div @click="jump('index')" class="size24">点击跳转至post</div>
  <br />
  <div @click="jump('user')" class="size24">点击跳转至user页面</div>
  <br />
  <div @click="jump('vueuse')" class="size24">点击跳转至vueuse页面</div>
  <br />
  <br />
  <van-button type="primary">主要按钮</van-button>
  <van-button type="success">成功按钮</van-button>
  <van-button type="default">默认按钮</van-button>
  <van-button type="warning">警告按钮</van-button>
  <van-button type="danger">危险按钮</van-button>
</template>

<script lang="ts" setup>
import log from '@assets/images/logo.png';
const router = useRouter();
const jump = (name: string) => {
  router.push({ name });
};
</script>

<style lang="less">
.size24 {
  font-size: 24px;
}
</style>
