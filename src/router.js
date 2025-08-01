import { createRouter, createWebHistory } from 'vue-router'
import WordQuiz from './views/WordQuizPage.vue'
import HomePage from './views/HomePage.vue'
import WordManager from './views/WordManagerPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/',
    component: WordQuiz,
    children: [
      {
        path: 'home',
        name: 'home',
        component: HomePage
      },
      {
        path: 'game',
        name: 'game',
        component: () => import('./views/GamePage.vue'),
      },
      {
        path: 'result',
        name: 'result',
        component: () => import('./views/ResultPage.vue'),
      },
      {
        path: 'result-detail',
        name: 'result-detail',
        component: () => import('./views/ResultDetail.vue'),
      },
    ]
  },
  {
    path: '/word-manager',
    name: 'word-manager',
    component: WordManager,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from) => {
  // URL直接入力の場合はTOPへ
  if (!(to.path === '/' || to.path === '/home') && from.name == undefined) {
    return '/'
  }
})

export default router
