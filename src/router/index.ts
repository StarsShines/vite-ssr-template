import { Router, createMemoryHistory, createRouter as createVueRouter, createWebHistory } from 'vue-router';

const defaultRouter = process.env.NODE_ENV === 'development' ? '' : '/test';
export const createRouter = (type: 'client' | 'server'): Router =>
  createVueRouter({
    history: type === 'client' ? createWebHistory() : createMemoryHistory(),
    routes: [
      {
        path: defaultRouter + '/',
        name: 'index',
        component: () => import('@/pages/postsv.vue')
      },
      {
        path: defaultRouter + '/login',
        name: 'login',
        component: () => import('@/pages/login.vue')
      },
      {
        path: defaultRouter + '/user',
        name: 'user',
        component: () => import('@/pages/user.vue')
      },
      {
        path: defaultRouter + '/index',
        name: 'posts',
        component: () => import('@/pages/index.vue')
      },
      {
        path: defaultRouter + '/vueuse',
        name: 'vueuse',
        component: () => import('@/pages/vueUse.vue')
      },
      {
        path: '/:pathMatch(.*)',
        name: 'error404',
        component: () => import('@/pages/404.vue')
      }
    ]
  });
