<template>
  <div>
    <h1>{{ userStore.age }}</h1>
    <button @click="cl">xxxxx</button>
    <div @click="jump">点击跳转至index</div>
    <!-- <div>{{ userStore.list }}</div> -->
    <ul>
      <li v-for="post in userStore.list" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
//ssr不支持onMounted和onUpdated等
//ssr在vue中是没有响应性的111.
// 因为没有任何动态更新，所以像 onMounted 或者 onUpdated 这样的生命周期钩子不会在 SSR 期间被调用，而只会在客户端运行。
// 你应该避免在 setup() 或者 <script setup> 的根作用域中使用会产生副作用且需要被清理的代码。
// 这类副作用的常见例子是使用 setInterval 设置定时器。
// 我们可能会在客户端特有的代码中设置定时器，然后在 onBeforeUnmount 或 onUnmounted 中清除。
// 然而，由于 unmount 钩子不会在 SSR 期间被调用，所以定时器会永远存在。为了避免这种情况，请将含有副作用的代码放到 onMounted 中
import useUserStore from '@store/user';
const router = useRouter();
const jump = () => {
  console.log(router);
  router.push({ name: 'posts' });
};

// import axios from 'axios';
const userStore = useUserStore();
const cl = () => {
  userStore.updateAge(++userStore.age);
};
const asyncFn = (): Promise<any[]> => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const lists: Object[] = new Array(30000).fill({ id: '1', title: '1111' });
      resolve(lists);
    }, 1000);
  });
};
// console.log(import.meta.env.SSR, 'ssr');
const getPosts = async () => {
  const data = await asyncFn();
  // const { data } = await axios({
  //   method: 'GET',
  //   url: 'https://cnodejs.org/api/v1/topics'
  // });
  userStore.updateList(data);
  console.log('请求执行完毕');
};
onServerPrefetch(async () => {
  console.log('nnnn');
  await getPosts();
});
onMounted(async () => {
  console.log('csr事件初始化，已执行ssr');
  if (!userStore.list.length) {
    console.log('csr事件初始化，未执行ssr');
    await getPosts();
  }
  console.log(userStore, 'list');
});
</script>

<style></style>
