<template>
  <div class="main">
    <!-- スタート画面 -->
     <!--hello-->
    <div v-if="!isStarted">
      <h1>Enlish Application</h1>
      <h3>チャレンジする問題数を入力してください</h3>
      <input class="start-input" type="number" value="0" v-model="totalQuizzes" />

      <button class="start-button" @click="() => {isStarted = true}">START</button>
    </div>


    <div v-else>
      <!-- 未実装:進捗がどれくらい進んでいるか確認するバー -->
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      


      <!-- クイズ -->
      <div v-if="currentIndex < totalQuizzes">

        <h1>画像に合う単語を選んでください。</h1>
        <img :src="currentQuiz.image" :width="currentQuiz.width" :height="currentQuiz.height" alt="quiz image">

        <!-- for文のように 現在扱っているクイズの単語配列を表示している -->
        <div class="word-options">
          <button 
            v-for="(word, index) in currentQuiz.words" 
            :key="index" 
            @click="seletWord(index)"
            v-bind:class="{ selected: selectedWordIndex === index }"
          >
            {{ word }}
          </button>
        </div>

        <!-- 答え合わせの時に出てくるメッセージ -->
        <!--<div>{{ collectText }}</div> ←クソデカExcellent-->

        <!-- 決定ボタン -->
        <button class="main-button" @click="checkAnswer">
          {{ buttonTextC }}
        </button>

      </div>

      <!-- 全てのクイズを解き終わった場合の表示 -->
      <div v-else>
        <h3>かかった時間は</h3>
        <!-- <button class="main-button" @click="checkAnswer">
          {{ buttonTextN }}
        </button> -->
      </div>
    </div>
  </div>
</template>



<script setup>//Javascript
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
const buttonText = ref('Check');  // 確認ボタンのテキスト
const buttonTextN = ref('Next')
const collectText = ref('Excellent!!') // 正解時に出る文字


// computed関数により 変数currentIndexが更新された場合currentQuizオブジェクトに現在扱うクイズのデータを代入
const currentQuiz = computed(() => quizzes.value[currentIndex.value]);

// computed関数によりバーの更新
const progressPercentage = computed(() => (currentIndex.value / totalQuizzes.value) * 100)

// ページ離脱時の警告ポップ
window.onbeforeunload = function(event) {
  var message = 'このページを離れますか？';
  event.returnValue = message; // 古いブラウザ用
  return message;
};

// 未実装:単語をクリックしたときに選択
function seletWord(index) {
  selectedWordIndex.value = index
  console.log(selectedWordIndex.value)
}

// 未実装:メインボタンを押したときの処理
function checkAnswer() {

  // 次の問題に移る
  currentIndex.value++

  // 単語の選択をリセット
  selectedWordIndex.value = null
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




<style scoped>/*CSS */

/* メインコンテンツであるクイズのデザイン */
.main {
  text-align: center;
}

/* 空っぽの進捗バー（全体） */
.progress-bar {
  height: 30px;
  background-color: #ddd;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  border-radius:10px;
}

/* 実際の進捗バー（長さが変わるところ） */
.progress {
  height: 100%;
  background-color: #4caf50;
  border-radius:10px;
}

/* 選択候補の単語をきれいに並べる */
.word-options {
  margin-left: 30%;
  margin-right: 30%;
  height: 125px;

  display: flex;
  justify-content: center;
  justify-content: space-between;
}

/* 単語のボタンのデザイン */
.word-options button {
  width: 150px;
  background-color: #efefef;
  color: #000000;

  border-radius: 100px;
  border: 2px solid #ffacac;
}

.word-options button:hover{
  background-color: #dddddd;
  color: black;
  border: dashed #ffacac;
}

.word-options button:focus{
  background-color: #ffacac;
  color: black;
  border: 0;
}

/* 選択した場合のボタンのデザイン */
.word-options button.selected {
  background-color: #ffa7a7;
  color: black;
}

/* メインボタン */
.main-button {
  position: fixed;
  bottom: 75px;
  right: 100px;

  background-color: #007bff;
  color: white;
  width: 250px;
  height: 100px;

  border: 5px solid #cccc00;
}

.main-button:hover{
  border: 10px ridge #ffff80;
}

.main-button:focus{
  border: 10px ridge #ffff00;
}

.start-input{
  background-color: #f1f1f1;
  width: 250px;
  height: 100px;
}

.start-button{
  background-color: #fd90ff;
  color: #000000;

  border-radius: 50px;
  width: 250px;
  height: 100px;

  border: 5px solid #cccc00;
}
.start-button:hover{
  background-color: #feadff;
  border: 5px solid #fbfb33;
}
.start-button:focus{
  background-color: #feadff;
  border: 5px solid #fbfb33;
}
</style>
