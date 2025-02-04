<template>
  <div class="main">
    <!-- スタート画面 -->
     <!--hello-->
    <div v-if="!isStarted" class="start-contener">
      <h1 class="title">English Application</h1>
      <h3 class="sub-title">チャレンジする問題数を入力してください</h3>
      <input class="start-input" type="number" value="0" min="0" v-model="totalQuizzesPersonal" />

      <button class="start-button" @click="startQuiz">START</button>
    </div>


    <div v-else>
      <!-- 進捗がどれくらい進んでいるか確認するバー -->
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      

      <!-- クイズ -->
      <div v-if="currentIndex < totalQuizzesPersonal">

        <div class="main-contener">
          <h1 class="sub-title2">画像に合う単語を選んでください。</h1>

          <img class="image" :src="currentQuiz.image" alt="quiz image">

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
        </div>

        <!-- 答え合わせの時に出てくるメッセージ -->
        <div class="text-contener">
          <div class="main-text">
            {{ correctText }}
          </div>
        </div>
        

        <div class="io-contener">
          <!-- 正解、間違いの演出 -->
          <div class="bar" v-bind:class="[{ 'correct-bar': isCorrect, 'incorrect-bar': isCorrect == false}, undefined]"></div>
          <img :src="markImagePointer" class="mark-image">

          <!-- ボタン -->
          <button class="main-button" v-bind:class="[{ 'main-button-incorrect': isCorrect == false }, 'main-button-correct']" @click="checkAnswer">
            {{ buttonTextPrint }}
          </button>
        </div>
        
      </div>
      

      <!-- 全てのクイズを解き終わった場合の表示 -->
      <div v-if="currentIndex >= totalQuizzesPersonal">
        <!-- スコア表示 -->
        <div class="result-background">
          <div class="result-contener">
            <div class="score-contener">
              <div>SCORE:&nbsp;</div>
              <div class="score-text">{{ score }}</div>
            </div>
            <div>GOOD: {{ correctCount }}</div>
            <div>MISS: {{ mistakeCount }}</div>
            <div>TIME: {{ takenTime }} 秒</div>
          </div>
        </div>

        <!-- スコア表示
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
        -->

      </div>
    </div>
  </div>
</template>



<script setup>//Javascript
import { ref, onMounted, computed } from 'vue';

const quizzes = ref([]);

// 変数
const isStarted = ref(false)  // クイズが始まっているかどうかのフラグ変数
const totalQuizzes = ref(0);  // 今回学習するクイズの問題数
const totalQuizzesPersonal = ref(null);  //問題数を入力してもらう用
const currentIndex = ref(0);  // 現在学習しているクイズの識別番号（現在完了しているクイズの数）
const selectedWordIndex = ref(null);  // 選択している単語
//const buttonTextC = ref('Check');  // 確認ボタンのテキスト
//const buttonTextN = ref('Next')
const correctText = ref(undefined)
//const incorrectText = ref('False.')
//const correctAnswer = ref(undefined)
const buttonTextPrint = ref('Check') //表示用ボタンのテキスト
const correctCount = ref(0)
const markImagePointer = ref(undefined);
const isCorrect = ref(undefined)  // 問題に正解しているか、不正解であるか

const startTime = ref(0)
const mistakeCount = ref(0)


// computed関数により 変数currentIndexが更新された場合currentQuizオブジェクトに現在扱うクイズのデータを代入
const currentQuiz = computed(() => quizzes.value[currentIndex.value]);

// クイズの終了
const isEnd = computed(() => currentIndex.value >= totalQuizzesPersonal.value ? true : false)

// computed関数によりバーの更新
const progressPercentage = computed(() => isEnd.value ? 100 : (currentIndex.value / totalQuizzesPersonal.value) * 100)

// 時間の更新
const takenTime = computed(() => isEnd.value ? Math.floor((Date.now() - startTime.value)/1000) : 0)

// スコアの更新
const score = computed(() => isEnd.value ? correctCount.value*6500-(mistakeCount.value*1200) : 0)

// ページ離脱時の警告ポップ
window.onbeforeunload = function(event) {
  var message = 'このページを離れますか？';
  event.returnValue = message; // 古いブラウザ用
  return message;
};

// 始まり
function startQuiz() {
  isStarted.value = true;
  startTime.value = Date.now()
  shuffleQuizzes(); // シャッフル

  // 入力される問題数が全ての問題数を超えられない
  if (totalQuizzes.value < totalQuizzesPersonal.value) {
    totalQuizzesPersonal.value = totalQuizzes.value;
  }
}

// 単語をクリックしたときに選択
function seletWord(index) {
  if (buttonTextPrint.value === 'Next') {
    correctText.value = 'Nextボタンを押して次に移動してください'
    return
  }

  selectedWordIndex.value = index
}

// メインボタンを押したときの処理
function checkAnswer() {

  // 何も選択していない場合
  if (selectedWordIndex.value == null) {
    correctText.value = '選択してからボタンを押してください'
    return
  }

  // Checkモード時の処理
  if (buttonTextPrint.value === 'Check') {
    
    // ユーザの選択が答えと一致しているのなら
    if (selectedWordIndex.value == currentQuiz.value.correctIndex) {
      correctText.value = 'Excellent!!'
      isCorrect.value = true
      correctCount.value++

      // ボタンの文字を'Next'に変更
      buttonTextPrint.value = 'Next'

      // 正解マークを表示
      markImagePointer.value = './image/check-mark.png'
    }

    // 間違いである場合
    else {
      isCorrect.value = false
      correctText.value = 'あともう少し'
      mistakeCount.value++

      // 不正解マークを表示
      markImagePointer.value = './image/batu-mark.png'
    }
  }

  // Nextモード時の処理
  else {
    // 次の問題に移る
    currentIndex.value++
    isCorrect.value = undefined

    // 単語の選択をリセット
    selectedWordIndex.value = null

    // メインテキストをリセット
    correctText.value = undefined

    // ボタンの文字を'Check'に変更
    buttonTextPrint.value = 'Check'

    // マークを非表示
    markImagePointer.value = './image/none-mark.png'
  }

  /*
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
   
  buttonTextPrint.value=buttonTextC.value.word[buttonTextC.value.correctIndex]
*/
}


// クイズのデータであるJSONファイルを読み込む非同期処理
const loadQuizzes = async () => {
  const response = await fetch('./json/easy-lesson.json'); // jsonファイルへのパス
  const data = await response.json();
  quizzes.value = data.quizzes;
  totalQuizzes.value = quizzes.value.length;
};

// 読み込んだデータをシャッフル
function shuffleQuizzes() {
  for (let i = 0; i < totalQuizzes.value; i++) {
    // 0~問題数の乱数を取得
    let random = Math.floor(Math.random() * (totalQuizzes.value - 1));
    
    // 問題の入れ替え
    let tmp = quizzes.value[i];
    quizzes.value[i] = quizzes.value[random];
    quizzes.value[random] = tmp;
  }
}

// Vue.jsにとって重要なデータの読み込みが終了したときにJSONを読み込む
onMounted(() => {
  loadQuizzes();
});
</script>




<style>/*CSS */

/* メインコンテンツであるクイズのデザイン */

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden; /* スクロールを無効化 */
}

/* 背景 */
body {
  background-image: url('../image/background.jpg');
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.main {
  height: 100svh;
  width: 100%;
  padding: 0;
  margin: 0;
  border: 0;
  box-sizing: border-box;
}

.start-contener {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;

  height: 100svh;
  width: 100%;
}

.main-contener {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;

  height: 65svh;
  width: 100%;
}

/* メインテキスト */
.text-contener {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;

  height: 12svh;
  width: 100%;
}

/* 入力出力 */
.io-contener {
  position: relative;
  height: 20svh;
  width: 100%;
  border-top: 3px solid #8f8f8f;
}

/* 空っぽの進捗バー（全体） */
.progress-bar {
  height: 2.5svh;
  max-height: 30px;
  background-color: #ddd;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  border-radius:20px;
  margin-top: 5px;
}

/* 実際の進捗バー（長さが変わるところ） */
.progress {
  height: 100%;
  background-color: #44bd48;
  border-radius:20px;
}

/* 画像 */
.image {
  height: 40%;
  width: auto;
}

/* 選択候補の単語をきれいに並べる */
.word-options {
  margin: 15px;
  width: 100%;
  height: 25%;
  max-height: 110px;

  display: flex;
  justify-content: center;
  flex-direction: row;
}

/* 単語のボタンのデザイン */
.word-options button {
  width: 24%;
  max-width: 150px;
  background-color: #efefef;
  color: #000000;
  font-size: 2.5vh;
  margin-right: 2px;

  border-radius: 100px;
  border: 2px solid #ffacac;

  line-break: anywhere;
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

/*メインテキスト*/
.main-text {
  font-family: 'MyCustomFont',sans-serif;
  font-size: 4vh;
  color: #3b3b3b;
}

/* メインボタン */
/* 通常または正解時のボタン */
@media screen and (orientation: landscape) {
  .main-button {
    right: 20%;
  }
  .mark-image {
    left: 20%;
  }
  .result-contener {
    width: 50%;
  }
}

@media screen and (orientation: portrait) {
  .main-button {
    right: 5%;
  }
  .mark-image {
    left: 5%;
  }
  .result-contener {
    width: 100%;
  }
}

/* メインボタン */
.main-button {
  z-index: 1;
  font-family: 'MyCustomFont',sans-serif;
  position: absolute;
  bottom: 30%;

  font-size: 3.5vh;
  width: 22%;
  height: 33%;

  min-width: 100px;
  min-height: 50px;
  max-width: 300px;

  border-radius: 2vh;
  border: 0.5vh solid #cccc00;
}

.main-button:hover {
  border: 1vh ridge #ffff80;
}

.main-button:focus {
  border: 10px ridge #ffff00;
}

/* 正解時のボタン */
.main-button-correct {
  color: #ffffff;
  background-color: #007bff;
}

/* 不正解時のボタン */
.main-button-incorrect {
  color: #ffffff;
  background-color: #df1674;
}

.mark-image {
  position: absolute;
  bottom: 30%;

  height: 40%;
  width: auto;
}

.bar {
  position: absolute;
  bottom: 0;
  left: 0;

  width: 100%;
  height: 100%;
}

.correct-bar {
  background: #b9ff9e;
}

.incorrect-bar {
  background: #ffb7b7;
}

.start-button{
  margin-top: 6vh;

  background-color: #fd90ff;
  color: #000000;
  font-size: 4vh;

  border-radius: 50px;
  width: 20%;
  height: 15%;

  max-width: 320px;
  min-width: 150px;
  
  max-height: 120px;

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
  font-size: 4vh;
  width: 15%;
  height: auto;

  min-width: 100px;
  max-width: 150px;
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
   font-size: 6vh;
   
   font-weight: bold;
   color: #f8f8f8;
   text-shadow: 1px 1px 10px #383838;
}
/*サブタイトルの編集*/
.sub-title{
  font-family: 'MyCustomFont',sans-serif;
  font-size: 2.5vh;
  color: #3b3b3b;
}
/*サブタイトル２の編集*/
.sub-title2{
  font-family: 'MyCustomFont',sans-serif;
  font-size: 4vh;
  color: #3b3b3b;
}
/*サブタイトル３の編集*/
.sub-title3{
  font-family: 'MyCustomFont',sans-serif;
  font-size: 3vh;
  color: #3b3b3b;
}

.result-contener {
  font-family: 'MyCustomFont',sans-serif;
  font-size: 4vh;
  margin-top: 5svh;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: #cfcfcf;
  padding-left: 25px;

  height: 60svh;
}

.score-contener {
  font-size: 6vh;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  margin-bottom: 45px;
}

.score-text {
  color: #e94483;
}

.result-background {
  position: absolute;
  top: 0;
  left: 0;
  height: 100svh;
  width: 100%;
  background-color: #00000067;
}

/*フォントの定義*/
@font-face{
  font-family:'MyCustomFont';
  src: url('../fonts/PixelMplus12-Regular.ttf')format('truetype');
  font-weight: normal;
  font-style: normal;
}


</style>
