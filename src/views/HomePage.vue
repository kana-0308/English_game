<template>
<v-btn to="/word-manager" fixed top left class="ma-4 word-manager-btn">単語集の作成<v-icon>mdi-plus</v-icon></v-btn>
<v-container height="90dvh" max-width="800px" class="center">
  <div class="w-100">
    <v-img src="/image/title.png" alt="logo"></v-img>
    <p class="text">遊びたい単語集を選択してください</p>
    <v-select
      v-model="selectedDocument"
      :items="wordbookList"
      label="単語集を選択"
      item-title="name"
      item-value="documentName"
      bg-color="#ffffffc0"
    />
    <p class="text">チャレンジする問題数を入力してください</p>
    <v-text-field v-model="quizNumber" label="数字を入力" type="number" bg-color="#ffffffc0"></v-text-field>
    <v-btn class="mt-4 start-btn" @click="startQuiz">START</v-btn>
  </div>
</v-container>
</template>

<style scoped>
.start-btn {
  height: auto;
  width: clamp(150px, 15vw, 220px);
  min-height: 55px;
  font-size: clamp(30px, 6vw, 45px);
  background-color: #fd90ff;
  color: #000000;
  border-radius: 2dvh;
  border: 5px solid #cccc00;
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
.word-manager-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 5px;
    box-shadow: 0 2px 3px rgb(0 0 0 / 25%), 0 2px 3px -2px rgb(0 0 0 / 15%);
    background-color: #27c9b5;
    color: #fff;
    height: auto;
    width: clamp(180px, 20vw, 250px);
    font-size: clamp(16px, 3vw, 22px);
}

.word-manager-btn:hover {
    background-color: #19a599;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWordbookDataStore } from '@/stores/dataStore'
import { db } from '@/firebase';
import { collection, getDocs } from "firebase/firestore";

const router = useRouter()
const dataStore = useWordbookDataStore()

const quizNumber = ref('')
const selectedDocument = ref('')
const wordbookList = ref([])

onMounted(async () => {
  // 存在する単語集のリストコレクションをfirestoreから読み込む
  const querySnapshot = await getDocs(collection(db, "wordbookList"));
  wordbookList.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
});

// クイズを始める
const startQuiz = async () => {
  // 単語集を選んでいない、問題数が0以下であるなら
  if (!selectedDocument.value || quizNumber.value <= 0) return;

  // ユーザが選択した単語集と問題数をデータ置き場に保存
  dataStore.setWordbookData(selectedDocument.value, quizNumber.value);

  // ゲームに移る
  router.push('/game');
};
</script>