<template>
  <div class="main">
    <!-- スタート画面 -->
     <!--hello-->
    <div v-if="!isStarted">
      <h1 class="title">English Application</h1>
      <h3 class="sub-title">チャレンジする問題数を入力してください</h3>
      <input class="start-input" type="number" value="0" min="0" v-model="totalQuizzesPersonal" />

      <button class="start-button" @click="() => {isStarted = true}">START</button>
    </div>


    <div v-else>
      <!-- 未実装:進捗がどれくらい進んでいるか確認するバー -->
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      

      <!-- クイズ -->
      <div v-if="currentIndex < totalQuizzesPersonal">

        <h1 class="sub-title2">画像に合う単語を選んでください。</h1>

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
        <div>{{ correctText }}</div>
        <div>{{ correctAnswer }}</div>
        <button class="main-button" @click="checkAnswer">
          {{ buttonTextPrint }}
        </button>
        <!-- 決定ボタン -->
        <!--  <button class="main-button" @click="checkAnswer">
          {{ buttonTextPrint }}
        </button>  -->

      </div>
      

      <!-- 全てのクイズを解き終わった場合の表示 -->
      <div v-if="currentIndex >= totalQuizzesPersonal">
        <h3 class="sub-title3">かかった時間は</h3>
        <div class="score">
          正解数: {{ correctCount }}
        </div>

        <!-- スコア表示 -->
        <div class="hello">
          <table class="ranking-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>NAME</th>
                <th>SCORE</th>
              </tr>
            </thead>
            <transition-group tag="tbody">
              <tr v-for="(post, index) in allScoreData" :key="post.id">
                <td :class="{newRecord: post.isNew}">{{index + 1}} 位</td>
                <td :class="{newRecord: post.isNew}">{{post.name}}</td>
                <td :class="{newRecord: post.isNew}">{{post.score}}</td>
              </tr>
            </transition-group>
          </table>
        </div>

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
const totalQuizzesPersonal = ref(null);  //問題数を入力してもらう用
const currentIndex = ref(0);  // 現在学習しているクイズの識別番号（現在完了しているクイズの数）
const selectedWordIndex = ref(null);  // 選択している単語
const buttonTextC = ref('Check');  // 確認ボタンのテキスト
const buttonTextN = ref('Next')
const correctText = ref(undefined)
const incorrectText = ref('False.')
const correctAnswer = ref(undefined)
const buttonTextPrint = 'Check'; //表示用ボタンのテキスト
const correctCount = ref(0)
//currentQuiz.correctIndex.value


// computed関数により 変数currentIndexが更新された場合currentQuizオブジェクトに現在扱うクイズのデータを代入
const currentQuiz = computed(() => quizzes.value[currentIndex.value]);

// computed関数によりバーの更新
const progressPercentage = computed(() => currentIndex.value >= totalQuizzesPersonal.value ? 100 : (currentIndex.value / totalQuizzesPersonal.value) * 100)

// ページ離脱時の警告ポップ
window.onbeforeunload = function(event) {
  var message = 'このページを離れますか？';
  event.returnValue = message; // 古いブラウザ用
  return message;
};

// 単語をクリックしたときに選択
function seletWord(index) {
  selectedWordIndex.value = index
  console.log(selectedWordIndex.value)
}

// 未実装:メインボタンを押したときの処理
function checkAnswer() {
  
  // 何も選択していない場合
  if (selectedWordIndex.value == null) {
    correctText.value = '選択してからボタンを押してください'
    return
  }
  
  if(selectedWordIndex.value==currentQuiz.value.correctIndex) {
    correctText.value='Excellent!!'
   correctCount.value++
  }
  else{
  correctText.value=incorrectText.value
  correctAnswer.value=currentQuiz.value.word[currentQuiz.value.correctIndex]
  buttonTextPrint.value=buttonTextN.value.word[buttonTextN.value.correctIndex]
  }
   
   correctText.value=undefined

  

  // 次の問題に移る
  currentIndex.value++
  buttonTextPrint.value=buttonTextC.value.word[buttonTextC.value.correctIndex]

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
  border-radius:20px;
}

/* 実際の進捗バー（長さが変わるところ） */
.progress {
  height: 100%;
  background-color: #4caf50;
  border-radius:20px;
}

/* 選択候補の単語をきれいに並べる */
.word-options {
  margin-left: 30%;
  margin-right: 30%;
  height: 125px;

  display: flex;
  justify-content: center;
  justify-content: space-between;
  position: fixed;
  bottom: 30%;
}

/* 単語のボタンのデザイン */
.word-options button {
  width: 150px;
  background-color: #efefef;
  color: #000000;
  font-size: 20px;

  border-radius: 100px;
  border: 2px solid #ffacac;
}

.word-options button:hover{
  background-color: #dddddd;
  color: black;
  border: dashed #ffacac;
}

.word-options button:focus{
  background-color: #ffcdcd;
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
  font-size: 30px;
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

.start-button{
  position: fixed;
  bottom: 50%;
  right: 0;
  left: 0;
  margin: 0 auto;

  background-color: #fd90ff;
  color: #000000;
  font-size: 30px;

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
.start-input{
  background-color: #f1f1f1;
  font-size: 50px;
  width: 150px;
  height: 70px;
}

/*スキップボタン*/

#skipButton {
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 10px 20px;
  background-color: #4CAF50; /* 緑色の例 */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

#skipButton:hover {
  background-color: #3e8e41; /* ホバー時の色 */
}

/* アニメーションのスタイル */
.quiz-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quiz-fade-slide-enter-active, .quiz-fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.quiz-fade-slide-enter {
  opacity: 0;
  transform: translateX(100px);
}

.quiz-fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}


/*タイトルの編集*/
.title{
   font-family: 'MyCustomFont',sans-serif;
   font-size: 3.5em;
   color: #007bff;
   margin-bottom: 20px;
   font-weight: bold;
}
/*サブタイトルの編集*/
.sub-title{
  font-family: 'MyCustomFont',sans-serif;
  font-size: 1.5em;
  color: #555;
  margin-bottom: 20px;
}
/*サブタイトル２の編集*/
.sub-title2{
  font-family: 'MyCustomFont',sans-serif;
  font-size: 2em;
  color: #555;
  margin-bottom: 20px;
}
/*サブタイトル３の編集*/
.sub-title3{
  font-family: 'MyCustomFont',sans-serif;
  font-size: 1em;
  color: #555;
  margin-bottom: 20px;
}
/*フォントの定義*/
@font-face{
  font-family:'MyCustomFont';
  src: url('../fonts/PixelMplus12-Regular.ttf')format('truetype');
  font-weight: normal;
  font-style: normal;
}

/*背景色の設定*/
:global(body) {
  background-image: url('../image/background.jpg');
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  }

</style>
