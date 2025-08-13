<template>
  <div class="result-page-container">
    <div v-if="showSummary" class="summary-container center">
      <div class="summary-content">
        <p class="summary-item">CLEAR</p>
        <p class="summary-item">SCORE</p>
        <p class="summary-item">GOOD</p>
        <p class="summary-item">MISS</p>
        <p class="summary-item">TIME</p>
      </div>
    </div>

    <div v-else class="detail-container">
      <h1 class="clear-title">CLEAR!!</h1>

      <div class="score-details">
        <div class="detail-item">
          <p class="label">GOOD:</p>
          <p class="value">{{ resultStore.correctCount }}</p>
        </div>
        <div class="detail-item">
          <p class="label">MISS:</p>
          <p class="value">{{ resultStore.mistakeCount }}</p>
        </div>
        <div class="detail-item">
          <p class="label">TIME:</p>
          <p class="value">{{ formattedTime }}</p>
        </div>
      </div>

      <button @click="goToNext" class="next-button">NEXT</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useResultDataStore } from '@/stores/dataStore';

const router = useRouter();
const resultStore = useResultDataStore();

// 表示フェーズを切り替えるための状態
const showSummary = ref(true);

// プレイ時間を分:秒形式にフォーマット
const formattedTime = computed(() => {
  const minutes = Math.floor(resultStore.takenTime / 60);
  const seconds = resultStore.takenTime % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

onMounted(() => {
  // 概要表示から詳細表示への自動切り替え（例: 2秒後に切り替え）
  setTimeout(() => {
    showSummary.value = false;
  }, 1000); // 2秒から1秒に変更（北御門 2025.8.12）
});

// ... その他のコード ...

const goToNext = () => {
  // 問題選択画面へ遷移する場合の例
  router.push('/result-detail'); // ここに遷移したいパスを指定
};
</script>

<style>
/* グローバルスタイルとフォントの指定 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');

body {
  font-family: 'Noto Sans JP', sans-serif; /* 教科書体の代替としてNoto Sans JP */
  margin: 0;
  padding: 0;
  color: white; /* テキストの色 */
}

.result-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100dvh;
  width: 100vw;
  overflow: hidden; /* スクロールバーが表示されないように */
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 概要表示 (フェーズ1) */
.summary-container {
  width: 100vw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.summary-content {
  text-align: center;
  font-size: 2.5em; /* 大きめのフォント */
  line-height: 1.8; /* 行間 */
}

.summary-item {
  margin: 0;
  padding: 0;
}

/* 詳細表示 (フェーズ2) */
.detail-container {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.clear-title {
  font-size: 4em;
  color: gold;
  margin-bottom: 30px;
  letter-spacing: 5px; /* CLEAR!! の文字間隔を調整 */
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 各項目間のスペース */
  margin-bottom: 50px;
  font-size: 2em;
  width: 80%; /* 幅を調整 */
  max-width: 500px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2); /* 区切り線 */
}

.detail-item:last-child {
  border-bottom: none; /* 最後の項目は区切り線なし */
}

.label {
  font-weight: bold;
  margin: 0;
}

.value {
  margin: 0;
}

.next-button {
  background-color: #4CAF50; /* ボタンの背景色 */
  color: white;
  padding: 15px 40px;
  font-size: 2.5em;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.next-button:hover {
  background-color: #45a049;
}
</style>