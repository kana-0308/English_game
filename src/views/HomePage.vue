<template>
<v-container height="90dvh" max-width="800px" class="center">
  <div class="w-100">
    <v-img src="/image/title.png" alt="logo"></v-img>
    <p class="text">遊びたい単語集を選択してください</p>
    <v-select
      v-model="selectedFile"
      :items="jsonFiles"
      label="単語集を選択"
      item-title="name"
      item-value="path"
      bg-color="#ffffffc0"
    />
    <p class="text">チャレンジする問題数を入力してください</p>
    <v-text-field v-model="quizNumber" label="数字を入力" type="number" bg-color="#ffffffc0"></v-text-field>
    <v-btn class="start-btn" @click="startQuiz">START</v-btn>
  </div>
</v-container>
</template>

<style scoped>
.start-btn {
  height: auto;
  width: auto;
  min-height: 55px;
  font-size: clamp(30px, 6vw, 45px);
  background-color: #fd90ff;
  color: #000000;
  border-radius: 2dvh;
  border: 5px solid #cccc00;
  margin-top: 5dvh;
}
.start-btn:hover {
  background-color: #feadff;
  border: 5px solid #fbfb33;
}
.start-btn:focus {
  background-color: #feadff;
  border: 5px solid #fbfb33;
}
.text {
  font-size: clamp(16px, 4vw, 25px);
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJsonDataStore } from '@/stores/dataStore'

const router = useRouter()
const dataStore = useJsonDataStore()

const quizNumber = ref('')
const jsonFiles = ref([])
const selectedFile = ref('')

onMounted(async () => {
  const response = await fetch('/json/file-list.json');
  jsonFiles.value = await response.json();
});

// クイズを始める
const startQuiz = async () => {
  // 単語集を選んでいない場合
  if (!selectedFile.value || quizNumber.value <= 0) return;

  // jsonファイルを事前に読み込んでおく
  const response = await fetch(`/json/${selectedFile.value}`);
  const jsonData = await response.json();
  
  // 読み込んだjsonデータをデータ置き場に配置
  dataStore.setJsonData(jsonData);

  router.push({
    name: 'game',
    query: { number: quizNumber.value }
  });
};
</script>