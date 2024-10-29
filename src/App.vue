<template>
  <div class="main">
    <!-- スタート画面 -->g
    <div v-if="!isStarted">
      <h1>Enlish Application</h1>
      <button @click="() => {isStarted = true}">START</button>
    </div>


    <div v-else>
      <!-- 未実装:進捗がどれくらい進んでいるか確認するバー -->
      <div class="progress-bar">
        <div class="progress"></div>
      </div>


      <!-- クイズ -->
      <div v-if="currentIndex < totalQuizzes">
        <img alt="quiz image"/>

        <!-- for文のように 現在扱っているクイズの単語配列を表示している -->
        <div class="word-options">
          <button 
            v-for="(word, index) in currentQuiz.words" 
            :key="index" 
            @click="seletWord()"
          >
            {{ word }}
          </button>
        </div>

        <!-- 答え合わせの時に出てくるメッセージ -->
        <div>{{ undefined }}</div>

        <!-- 決定ボタン -->
        <button class="main-button" @click="checkAnswer">
          {{ buttonTextC }}
        </button>

      </div>

      <!-- 全てのクイズを解き終わった場合の表示 -->
      <div v-else>
        <button class="main-button" @click="checkAnswer">
          {{ buttonTextN }}
        </button>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted, computed } from 'vue';

// クイズデータの集合オブジェクト（構造体）
/*
  quiz {
    image: "画像ファイルのパス",
    words: ["cat", "dog", "fish", "bird"],
    correctIndex: 正解である単語が配列の何番目であるか
  }
  quizzesはquizオブジェクトの集合体（配列）
*/
const quizzes = ref([]);

// 変数
const isStarted = ref(false)  // クイズが始まっているかどうかのフラグ変数
const totalQuizzes = ref(0);  // 今回学習するクイズの問題数
const currentIndex = ref(0);  // 現在学習しているクイズの識別番号（現在完了しているクイズの数）
const selectedWordIndex = ref(null);  // 選択している単語
const buttonTextC = ref('Check');  // 確認ボタンのテキスト
const buttonTextN = ref('Next')  //次の問題へのボタンのテキスト

// computed関数により 変数currentIndexが更新された場合currentQuizオブジェクトに現在扱うクイズのデータを代入
const currentQuiz = computed(() => quizzes.value[currentIndex.value]);


// 未実装:単語をクリックしたときに選択
function seletWord() {
  // selectedWordIndexを更新 以下の処理はテスト用なので消していい
  console.log(selectedWordIndex.value)
}

// 未実装:メインボタンを押したときの処理
function checkAnswer() {
  
}


// クイズのデータであるJSONファイルを読み込む非同期処理
const loadQuizzes = async () => {
  const response = await fetch('/json/easy-lesson.json'); // jsonファイルへのパス
  const data = await response.json();
  quizzes.value = data.quizzes;
  totalQuizzes.value = quizzes.value.length;
};

// Vue.jsにとって重要なデータの読み込みが終了したときにJSONを読み込む
onMounted(() => {
  loadQuizzes();
});
</script>




<style scoped>

/* メインコンテンツであるクイズのデザイン */
.main {
  text-align: center;
}

/* 空っぽの進捗バー（全体） */
.progress-bar {
  height: 20px;
  background-color: #ddd;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

/* 実際の進捗バー（長さが変わるところ） */
.progress {
  height: 100%;
  background-color: #4caf50;
}

/* 選択候補の単語をきれいに並べる */
.word-options {
  display: flex;
  justify-content: center;
}

/* 単語のボタンのデザイン */
.word-options button {
  
}

/* 選択した場合のボタンのデザイン */
.word-options button.selected {

}

/* メインボタン */
.main-button {
  background-color: #007bff;
  color: white;
}
</style>
