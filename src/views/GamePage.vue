<template>
<v-container height="100dvh" fluid class="d-flex flex-column pa-0">
  <v-container max-width="900px" class="pa-2">
    <v-progress-linear class="mt-2" :model-value="progressPercentage" bg-color="white" color="green" height="20" rounded />

    <v-container v-if="currentQuiz" height="60dvh" class="pa-0 center">
      <div class="w-100">

        <p class="subtitle">イラストに合う単語を選択してください</p>

        <!-- イラストを表示 -->
        <v-container height="40dvh" class="pa-0 center img-container">
          <v-img class="img" :src="currentQuiz.image" alt="illust"></v-img>
        </v-container>

        <!-- 単語選択肢 -->
        <v-row no-gutters align="center" class="mt-8 flex-nowrap">
          <v-col
          v-for="(word, index) in currentQuiz.words"
          :key="index"
          :cols="colSpan"
          >
          <button
          ref="buttons"
          @click="selectWord(index)"
          :class="{ selected: selectedWordIndex === index }"
          class="word-btn"
          :style="{ fontSize: fontSizes[index] + 'px' }"
          >
          {{ word }}
          </button>
          </v-col>
        </v-row>

      </div>
    </v-container>
  </v-container>

  <!-- メッセージ -->
  <v-container height="5dvh" class="message kyokasho-font-b pa-0 mt-auto">
    <p>{{ informText }}</p>
  </v-container>

  <!-- 正解、不正解を表示しボタンを押して次の問題に移れる -->
  <v-container height="20dvh" fluid class="top-line center pa-0 mt-auto" :class="[{ 'correct-bar': isCorrect, 'incorrect-bar': isCorrect == false}, undefined]">
    <v-row style="max-width: 900px;">
      <v-col cols="auto" class="me-auto">
        <v-img width="60px" height="auto" :src="markImagePointer" alt="mark"></v-img>
      </v-col>
      <v-col cols="auto">
        <v-btn class="mr-5 main-btn" :class="[{ 'main-btn-incorrect': isCorrect == false }, 'main-btn-correct']" @click="checkAnswer">{{ buttonText }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</v-container>
</template>

<style scoped>
.v-btn {
  text-transform: none;
}
.img-container {
  background-image: url('../image/image-contener.png');
  background-repeat:  no-repeat;
  background-position:center center;
}
@media screen and (orientation: landscape) {
  .img-container {
    background-size: contain;
  }
  .img {
    height: 32dvh;
  }
}
@media screen and (orientation: portrait) {
  .img-container {
    background-size: 100% 90%;
  }
  .img {
    height: 28dvh;
  }
}
.subtitle {
  font-size: clamp(16px, 5vw, 25px);
}
.message {
  text-align: center;
  font-size: clamp(16px, 5vw, 25px);
}
.top-line {
  border-top: 3px solid #8f8f8f;
  background-color: #ffffff85;
}
.correct-bar {
  background: #b9ff9e;
}
.incorrect-bar {
  background: #ffb7b7;
}
.word-btn {
  width: 95%;
  height: auto;
  min-height: 50px;
  background-color: #efefef;
  color: #000000;
  white-space: nowrap;
  text-align: center;
  border-radius: 50px;
  border: 2px solid #ffacac;
}
.word-btn:hover{
  background-color: #dddddd;
  color: black;
  border: dashed #ffacac;
}
.word-btn:focus{
  background-color: #ffcdcd;
  color: black;
  border: 0;
}
.word-btn.selected {
  background-color: #ffa7a7;
  color: black;
}
.main-btn {
  font-size: clamp(30px, 6vw, 45px);
  width: auto;
  height: auto;
  min-height: 50px;
  color: #ffffff;
  border-radius: 2dvh;
  border: 4px solid #cccc00;
}
.main-btn:hover {
  border: 5px ridge #ffff80;
}
.main-btn:focus {
  border: 5px ridge #ffff00;
}
.main-btn-correct {
  background-color: #007bff;
}
.main-btn-incorrect {
  background-color: #df1674;
}
</style>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJsonDataStore, useResultDataStore } from '@/stores/dataStore'

const route = useRoute()
const router = useRouter()
const jsonStore = useJsonDataStore()
const resultStore = useResultDataStore()

let quizNumberAll // 選んだ単語集に存在する単語全ての数
let quizNumber // 今回学ぶクイズの数
let currentIndex = 0  // 現在学習しているクイズの識別番号（現在完了しているクイズの数）
const selectedWordIndex = ref(null)  // 選択している単語

let quizzes = []
let quizzeIndexs = []
let mistakeIndexs = []
const currentQuiz = ref(null) // 現在取り組んでいるクイズのデータ

const isCorrect = ref(undefined)  // 問題に正解しているか、不正解であるか
const informText = ref('')  // 正解や不正解、警告を知らせるためのテキスト
const buttonText = ref('Check') //表示用ボタンのテキスト

const markImagePointer = ref(undefined)

let startTime = 0  // 時間測定用、開始時間
let takenTime  // 時間測定
let score // スコア
let correctCount = 0   // 正解数
let mistakeCount = 0 // 間違えた数

const progressPercentage = ref(0)  // 進捗バー

const fontSizes = ref([])  // ボタンそれぞれの文字の大きさ
const buttons = ref([])  // ボタンの要素データ

// ページ読み込み時、最初に実行される
onMounted(() => {
  preloadImage(imageURLs);
  window.addEventListener("resize", resizeText); // ウィンドウリサイズ時に再調整
  initialize();
});

// 単語ボタンの幅を均等にそろえる
const colSpan = computed(() => {
  const count = currentQuiz.value.words.length;
  return count > 0 ? Math.floor(12 / count) : 12;
});

// クイズを始めるための初期化処理
function initialize() {
  // 時間計測
  startTime = Date.now();

  // クイズデータの初期化
  quizzes = jsonStore.jsonData.quizzes; // jsonデータの受け取り
  quizNumberAll = quizzes.length;
  quizNumber = Number(route.query.number); // 今回解くクイズの数受け取り
  shuffleQuizzes();
  currentQuiz.value = quizzes[0];

  if (quizNumberAll < quizNumber) {
    quizNumber = quizNumberAll;
  }

  resizeText();
}

// 単語をクリックしたときに選択
function selectWord(index) {
  if (buttonText.value === 'Next') {
    informText.value = 'Nextボタンを押して次に移動してください'
    return
  }
  selectedWordIndex.value = index
}

// メインボタンを押したときの処理
function checkAnswer() {

  // 何も選択していない場合
  if (selectedWordIndex.value == null) {
    informText.value = '選択してからボタンを押してください'
    return
  }

  // Checkモード時の処理
  if (buttonText.value === 'Check') {
    
    // ユーザの選択が答えと一致しているのなら
    if (selectedWordIndex.value == currentQuiz.value.correctIndex) {
      informText.value = 'よくできました！！'
      isCorrect.value = true
      correctCount++

      // ボタンの文字を'Next'に変更
      buttonText.value = 'Next'

      // 正解マークを表示
      markImagePointer.value = './image/check-mark.png'
    }

    // 間違いである場合
    else {
      isCorrect.value = false
      informText.value = 'あともう少し'
      mistakeCount++
      mistakeIndexs.push(quizzeIndexs[currentIndex])

      buttonText.value = 'Next'

      // 不正解マークを表示
      markImagePointer.value = './image/batu-mark.png'
    }
  }

  // Nextモード時の処理
  else {
    // 次の問題に移る
    currentIndex++

    // クイズが終了したら
    if (currentIndex >= quizNumber) {
      // スコアの更新
      score = correctCount*6500 - (mistakeCount*1200)

      // 時間の更新
      takenTime = Math.floor( (Date.now() - startTime) / 1000 )

      // データストアに送信
      resultStore.setResultData(score, takenTime, correctCount, mistakeCount, mistakeIndexs)
      
      // 結果発表に移る
      router.push('/result')
    }

    isCorrect.value = undefined

    // リセット
    selectedWordIndex.value = null
    informText.value = undefined
    buttonText.value = 'Check'
    markImagePointer.value = './image/none-mark.png'

    // 更新
    currentQuiz.value = quizzes[ quizzeIndexs[currentIndex] ] // クイズデータの更新
    progressPercentage.value = (currentIndex / quizNumber) * 100  // 進捗バーの更新
    resizeText(); // 単語の文字のサイズを調整
  }
}

// 読み込んだデータをシャッフル
function shuffleQuizzes() {
  for(let i = 0; i < quizNumberAll; i++){
    quizzeIndexs[i] = i
  }
  for (let i = 0; i < quizNumberAll; i++) {
    // 0~問題数の乱数を取得
    let random = Math.floor(Math.random() * (quizNumberAll - 1));

    // 問題の入れ替え
    let tmp = quizzeIndexs[i];
    quizzeIndexs[i] = quizzeIndexs[random];
    quizzeIndexs[random] = tmp;
  }
}

// 事前に画像を読み込む
function preloadImage(urls) {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}
// 事前に読み込む画像リスト
const imageURLs = [
  "./image/check-mark.png",
  "./image/batu-mark.png",
  "./image/none-mark.png",
  "./image/image-contener.png"
];

// 文字の大きさをボタンの幅に合わせて調整
function resizeText() {
  // 重要なデータをしっかり読み込んだうえで処理
  nextTick(() => {
    fontSizes.value = buttons.value.map((button) => {
      if (!button) return 32; // デフォルトフォントサイズ

      let fontSize = 32; // 初期フォントサイズ
      const maxWidth = button.clientWidth - 8; // ボタンの幅（余白を考慮）

      // 仮の要素を作成してテキストの幅を測る
      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.style.whiteSpace = "nowrap";
      tempSpan.style.fontSize = "32px";
      tempSpan.textContent = button.textContent;

      // 実際に生成
      document.body.appendChild(tempSpan);

      // 少しづつ小さくして調整
      console.log(tempSpan.offsetWidth)
      while (tempSpan.offsetWidth > maxWidth && fontSize > 5) {
        fontSize--; // フォントサイズを小さくする
        tempSpan.style.fontSize = fontSize + "px";
      }

      console.log(fontSize);

      // 仮の要素を削除
      document.body.removeChild(tempSpan);
      return fontSize;
    });
  });
};

// ページ離脱時の警告ポップ
window.onbeforeunload = function(event) {
  var message = 'このページを離れますか？';
  event.returnValue = message; // 古いブラウザ用
  return message;
};
</script>