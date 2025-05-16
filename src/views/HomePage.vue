<template>
  <!-- タイトルロゴ -->
  <img class="title" src="/image/title.png" alt="English Application">
  
  <h1 class="sub-title">チャレンジする問題数を入力してください</h1>
  <input id="start-input" type="number" value="0" min="0" v-model="quizNumber" />

  <!-- スタートボタン -->
  <button class="start-button" @click="startQuiz">START</button>
</template>


<!--////////
JavaScript
////////-->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const quizNumber = ref('')

function startQuiz() {
  router.push({
    name: 'game',
    params: { number: quizNumber.value }
  })
}
</script>