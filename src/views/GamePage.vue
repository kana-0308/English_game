<template>
<!-- 進捗がどれくらい進んでいるか確認するバー -->
<div class="progress-bar">
  <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
</div>

<!-- ゲーム本体 -->
<div class="main-contener">
  <h1 class="sub-title2">画像に合う単語を選んでください</h1>

  <!-- イラスト -->
  <div class="image-contener">
    <img class="image" :src="currentQuiz.image" alt="quiz image">
  </div>

  <!-- for文のように 現在扱っているクイズの単語配列を表示している -->
  <div class="word-options">
    <button 
      v-for="(word, index) in currentQuiz.words" 
      :key="index" 
      ref="buttons"
      @click="seletWord(index)"
      v-bind:class="{ selected: selectedWordIndex === index }"
      :style="{ fontSize: fontSizes[index] + 'px' }"
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
    {{ buttonText }}
  </button>
</div>

</template>


<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const router = useRoute()

const totalQuizNumber = ref(0)
const quizNumber = Number(router.params.number)
const currentIndex = ref(0)  // 現在学習しているクイズの識別番号（現在完了しているクイズの数）
const selectedWordIndex = ref(null)  // 選択している単語

const quizzes = ref([])
const currentQuiz = ref(null)

const isCorrect = ref(undefined)  // 問題に正解しているか、不正解であるか
const mainText = ref('')  // メインボタンを押した際に出力されるテキスト
const buttonText = ref('Check') //表示用ボタンのテキスト

const markImagePointer = ref(undefined)

let startTime = 0  // 時間測定用、開始時間
const takenTime = ref(0)  // 時間測定
const score = ref(0) // スコア
const correctCount = ref(0)   // 正解数
const mistakeCount = ref(0) // 間違えた数

const progressPercentage = ref(0)  // 進捗バー

const fontSizes = ref([])  // ボタンそれぞれの文字の大きさ
const buttons = ref([])  // ボタンの要素データ



// 文字のサイズを調整
watch(currentQuiz, resizeText); 

// ページ離脱時の警告ポップ
window.onbeforeunload = function(event) {
  var message = 'このページを離れますか？';
  event.returnValue = message; // 古いブラウザ用
  return message;
};

// ページが読み込まれた瞬間に実行
function startQuiz() {
  startTime = Date.now()  // 時間計測

  shuffleQuizzes() // シャッフル
  currentQuiz.value = quizzes.value[0]

  // これから解く問題数が全ての問題数を超えられない
  if (totalQuizNumber.value < quizNumber.value) {
    quizNumber.value = totalQuizNumber.value
  }

  resizeText()  // 文字のサイズを調整
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

    // リセット
    selectedWordIndex.value = null
    correctText.value = undefined
    buttonTextPrint.value = 'Check'
    markImagePointer.value = './image/none-mark.png'

    // 更新
    currentQuiz.value = quizzes.value[currentIndex.value] // クイズデータの更新
    progressPercentage.value = (currentIndex.value / totalQuizzesPersonal.value) * 100  // 進捗バーの更新

    // クイズが終了したら
    if (currentIndex.value >= totalQuizzesPersonal.value) {
      // スコアの更新
      score.value = correctCount.value*6500 - (mistakeCount.value*1200)

      // 時間の更新
      takenTime.value = Math.floor( (Date.now() - startTime) / 1000 )
    }
  }

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

// 事前に画像を読み込む
const preloadImages = (urls) => {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

// 事前に読み込む画像リスト
const urlImage = [
  "./image/background.jpg",
  "./image/check-mark.png",
  "./image/batu-mark.png",
  "./image/none-mark.png",
  "./image/image-contener.png"
];


// Vue.jsにとって重要なデータの読み込みが終了したときにJ読み込む
onMounted(() => {
  loadQuizzes();
  preloadImages(urlImage);
  window.addEventListener("resize", resizeText); // ウィンドウリサイズ時に再調整
});

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
      while (tempSpan.offsetWidth > maxWidth && fontSize > 5) {
        console.log("hey");
        fontSize--; // フォントサイズを小さくする
        tempSpan.style.fontSize = fontSize + "px";
      }

      // 仮の要素を削除
      document.body.removeChild(tempSpan);
      return fontSize;
    });
  });
  //console.log(fontSizes);
};


</script>