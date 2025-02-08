import { createRouter, createWebHashHistory /*createWebHistory*/ } from 'vue-router'
import RoutingTestView from '@/views/RoutingTestView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  // Github Pagesにデプロイするのでハッシュルーターにする
  //history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/test/:text',
      component: RoutingTestView,
    },
  ],
})

export default router
