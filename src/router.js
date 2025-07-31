import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('./views/GamePage.vue'),
  },
  {
    path: '/result',
    name: 'result',
    component: () => import('./views/ResultPage.vue'),
  },
  {
    path: '/result-detail',
    name: 'result-detail',
    component: () => import('./views/ResultDetail.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from) => {
  // URL直接入力の場合はTOPへ
  if (to.path != '/' && from.name == undefined) {
    return '/'
  }
})

export default router
