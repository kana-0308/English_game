import { createRouter, createWebHistory } from 'vue-router'
import WordQuiz from './views/WordQuizPage.vue'
import HomePage from './views/HomePage.vue'
import WordManager from './views/WordManagerPage.vue'
import LoginPage from './views/LoginPage.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

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
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// グローバルなナビゲーションガード
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const auth = getAuth();

  // Firebase の認証状態が変更されたときに実行
  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      // 認証が必要で、ユーザーがログインしていない場合
      next({
        name: 'login',
        query: { redirect: to.fullPath }, // ログイン後に元のページに戻るためのクエリパラメータ
      })
    } else {
      next() // 認証済み、または認証不要なページの場合はそのまま進む
    }
  })
})

export default router
