<template>
  <div class="result-detail-container">
    <h1 class="page-title">間違えた問題</h1>
    
    <div class="mistake-list">
      <div v-for="(mistake, index) in mistakes" :key="index" class="mistake-item">
        <div class="mistake-image-wrapper">
          <img :src="mistake.image" alt="mistake illustration" class="mistake-image">
        </div>
        <div class="mistake-info">
          <p class="mistake-words">
            <span class="incorrect-word">× {{ mistake.incorrectWord }}</span>
            <span class="arrow">→</span>
            <span class="correct-word">○ {{ mistake.correctWord }}</span>
          </p>
        </div>
      </div>
    </div>

    <button @click="goToHome" class="home-button">HOME</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useJsonDataStore, useResultDataStore } from '@/stores/dataStore';
import { ref, computed } from 'vue';

const router = useRouter();
const resultStore = useResultDataStore();
const jsonStore = useJsonDataStore();

// データストアから間違えた問題のインデックスリストを取得
const mistakeIndexs = resultStore.mistakeIndexs || [];

// 間違えた問題のデータを整形
const mistakes = computed(() => {
  if (!jsonStore.jsonData || mistakeIndexs.length === 0) {
    return [];
  }
  return mistakeIndexs.map((index, i) => {
    const quiz = jsonStore.jsonData.quizzes[index];
    const correctWord = quiz.words[quiz.correctIndex];
    const incorrectWord = resultStore.incorrectWords[i];

    return {
      image: quiz.image,
      correctWord: correctWord,
      incorrectWord: incorrectWord, // 仮の単語
    };
  });
});

const goToHome = () => {
  // ホーム画面へのパスを指定
  router.push('/');
};

</script>

<style scoped>
.result-detail-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100dvh;
  width: 100vw;
  /* 背景を透過させるためのスタイルは親コンポーネントかグローバルで定義 */
}

.page-title {
  font-size: 3em;
  color: white;
  margin-bottom: 20px;
}

.mistake-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 90%;
  max-width: 600px;
  /* スクロール可能にするための設定 */
  overflow-y: auto;
  max-height: 70dvh;
  background-color: white; 
  padding: 20px; /* 見栄えのためにパディングを追加 */
  border-radius: 10px; /* 角を丸くする */
}

.mistake-item {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 10px;
}

.mistake-image-wrapper {
  flex: 0 0 100px;
  margin-right: 20px;
}

.mistake-image {
  width: 100%;
  height: auto;
}

.mistake-info {
  flex: 1;
}

.mistake-words {
  font-size: 1.5em;
  color: white;
}

.incorrect-word {
  color: #ff6347; /* 赤色 */
}

.correct-word {
  color: #3cb371; /* 緑色 */
}

.arrow {
  margin: 0 10px;
}

.home-button {
  margin-top: 30px;
  padding: 15px 40px;
  font-size: 2em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
</style>