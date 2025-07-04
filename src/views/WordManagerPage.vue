<template>
  <v-app>
    <!-- 左側: 単語集リストのナビゲーションドロワー -->
    <v-navigation-drawer permanent>
      <v-toolbar flat>
        <v-toolbar-title>単語集リスト</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="addWordbook">
          <v-icon>mdi-plus-box</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="wordbook in wordbooks"
          :key="wordbook.id"
          link
          :value="wordbook.id"
          :active="selectedWordbook && selectedWordbook.id === wordbook.id"
          @click="selectWordbook(wordbook.id)"
        >
          <v-list-item-title>{{ wordbook.name }}</v-list-item-title>
          <template v-slot:append>
            <v-btn icon="mdi-pencil" size="x-small" variant="text" @click.stop="openEditWordbookDialog(wordbook)"></v-btn>
            <v-btn icon="mdi-delete" size="x-small" variant="text" @click.stop="openDeleteWordbookDialog(wordbook)"></v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 中央: メインコンテンツエリア -->
    <v-main>
      <v-container fluid>
        <div v-if="selectedWordbook">
          <v-toolbar flat>
            <v-toolbar-title>{{ selectedWordbook.name }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openAddWordDialog">
              <v-icon left>mdi-plus</v-icon>
              新規単語追加
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>

          <!-- 単語カードリスト -->
          <v-row class="mt-4">
            <v-col
              v-for="word in selectedWordbook.words"
              :key="word.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card>
                <v-img
                  :src="word.imageData || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'"
                  height="200px"
                  cover
                ></v-img>
                <v-card-title>{{ word.englishWord }}</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" variant="text" @click="openEditWordDialog(word)">編集</v-btn>
                  <v-btn color="error" variant="text" @click="openDeleteWordDialog(word)">削除</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
           <div v-if="!selectedWordbook.words.length" class="text-center text-grey mt-10">
            <p>まだ単語が登録されていません。</p>
            <p>「新規単語追加」ボタンから最初の単語を追加しましょう。</p>
          </div>
        </div>
        <div v-else class="d-flex justify-center align-center fill-height text-grey">
          <div>
            <p>左のリストから単語集を選択してください。</p>
            <p>単語集がない場合は、「＋」ボタンから作成できます。</p>
          </div>
        </div>
      </v-container>
    </v-main>

    <!-- 単語追加・編集ダイアログ -->
    <v-dialog v-model="wordDialog.show" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{ wordDialog.isEdit ? '単語の編集' : '新しい単語の追加' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editableWord.englishWord"
                  label="英単語"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div
                  class="pa-5 text-center grey lighten-4 rounded"
                  :class="{ 'drag-over': isDragging }"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleFileDrop"
                >
                  <v-img v-if="editableWord.imageData" :src="editableWord.imageData" max-height="150" contain class="mb-4"></v-img>
                  <p>画像をここにドラッグ＆ドロップ</p>
                  <p class="text-caption">または</p>
                  <v-btn small @click="triggerFileInput">ファイルを選択</v-btn>
                  <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" class="d-none" />
                </div>
              </v-col>
              <v-col cols="12" v-for="(choice, index) in editableWord.choices" :key="index">
                <v-text-field
                  v-model="editableWord.choices[index]"
                  :label="`選択肢 ${index + 1}`"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                 <v-radio-group v-model="editableWord.correctIndex" label="正解の選択肢" inline>
                    <v-radio v-for="(choice, index) in editableWord.choices" :key="index" :label="`${index + 1}`" :value="index"></v-radio>
                 </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeWordDialog">キャンセル</v-btn>
          <v-btn color="blue darken-1" text @click="saveWord">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 単語集名編集ダイアログ -->
    <v-dialog v-model="wordbookDialog.show" max-width="500px">
        <v-card>
            <v-card-title>単語集の名前を編集</v-card-title>
            <v-card-text>
                <v-text-field v-model="wordbookDialog.name" label="単語集名"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="wordbookDialog.show = false">キャンセル</v-btn>
                <v-btn color="primary" text @click="updateWordbookName">保存</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- 削除確認ダイアログ -->
    <v-dialog v-model="deleteDialog.show" max-width="500px">
        <v-card>
            <v-card-title class="headline">本当に削除しますか？</v-card-title>
            <v-card-text>{{ deleteDialog.message }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="deleteDialog.show = false">キャンセル</v-btn>
                <v-btn color="error" text @click="confirmDelete">削除</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

  </v-app>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

// --- リアクティブな状態定義 ---

// すべての単語集データを保持
const wordbooks = ref([]);
// 現在選択されている単語集
const selectedWordbook = ref(null);
// ドラッグ＆ドロップ時のUI制御用
const isDragging = ref(false);
// ファイル選択インプットへの参照
const fileInput = ref(null);

// 単語追加・編集ダイアログの状態
const wordDialog = ref({
  show: false,
  isEdit: false,
});

// 単語集名編集ダイアログの状態
const wordbookDialog = ref({
    show: false,
    id: null,
    name: ''
});

// 削除確認ダイアログの状態
const deleteDialog = ref({
    show: false,
    type: '', // 'wordbook' or 'word'
    id: null,
    message: ''
});

// 編集中の単語データ
const editableWord = ref({
  id: null,
  englishWord: '',
  imageData: null,
  choices: ['', '', '', ''],
  correctIndex: 0,
});

// --- データ永続化 (localStorage) ---

// データをlocalStorageに保存する
const saveData = () => {
  localStorage.setItem('word-app-data', JSON.stringify(wordbooks.value));
};

// localStorageからデータを読み込む
const loadData = () => {
  const data = localStorage.getItem('word-app-data');
  if (data) {
    wordbooks.value = JSON.parse(data);
  } else {
    // データがない場合はサンプルデータを作成
    wordbooks.value = [
      {
        id: `wb-${Date.now()}`,
        name: '動物 (サンプル)',
        words: [
          {
            id: `w-${Date.now()}`,
            englishWord: 'cat',
            imageData: 'https://placehold.co/600x400/ABC/31343C?text=Cat',
            choices: ['dog', 'cat', 'bird', 'fish'],
            correctIndex: 1
          }
        ]
      }
    ];
  }
};

// --- 単語集 (Wordbook) の操作 ---

// 新しい単語集を追加
const addWordbook = () => {
  const newWordbook = {
    id: `wb-${Date.now()}`,
    name: `新しい単語集 ${wordbooks.value.length + 1}`,
    words: [],
  };
  wordbooks.value.push(newWordbook);
  selectWordbook(newWordbook.id);
  saveData();
};

// IDで単語集を選択
const selectWordbook = (id) => {
  selectedWordbook.value = wordbooks.value.find(wb => wb.id === id) || null;
};

// 単語集名編集ダイアログを開く
const openEditWordbookDialog = (wordbook) => {
    wordbookDialog.value.id = wordbook.id;
    wordbookDialog.value.name = wordbook.name;
    wordbookDialog.value.show = true;
};

// 単語集名を更新
const updateWordbookName = () => {
    const book = wordbooks.value.find(wb => wb.id === wordbookDialog.value.id);
    if (book) {
        book.name = wordbookDialog.value.name;
        saveData();
    }
    wordbookDialog.value.show = false;
};

// 単語集削除ダイアログを開く
const openDeleteWordbookDialog = (wordbook) => {
    deleteDialog.value.type = 'wordbook';
    deleteDialog.value.id = wordbook.id;
    deleteDialog.value.message = `単語集「${wordbook.name}」を削除します。よろしいですか？`;
    deleteDialog.value.show = true;
};

// --- 単語 (Word) の操作 ---

// 空の単語フォームを準備する
const resetEditableWord = () => {
  editableWord.value = {
    id: null,
    englishWord: '',
    imageData: null,
    choices: ['', '', '', ''],
    correctIndex: 0,
  };
};

// 新規単語追加ダイアログを開く
const openAddWordDialog = () => {
  resetEditableWord();
  wordDialog.value.isEdit = false;
  wordDialog.value.show = true;
};

// 単語編集ダイアログを開く
const openEditWordDialog = (word) => {
  // 編集用にデータをディープコピーする
  editableWord.value = JSON.parse(JSON.stringify(word));
  wordDialog.value.isEdit = true;
  wordDialog.value.show = true;
};

// 単語ダイアログを閉じる
const closeWordDialog = () => {
  wordDialog.value.show = false;
  resetEditableWord();
};

// 単語を保存（追加または更新）
const saveWord = () => {
  if (!selectedWordbook.value) return;

  if (wordDialog.value.isEdit) {
    // 編集モード
    const index = selectedWordbook.value.words.findIndex(w => w.id === editableWord.value.id);
    if (index !== -1) {
      selectedWordbook.value.words[index] = { ...editableWord.value };
    }
  } else {
    // 追加モード
    editableWord.value.id = `w-${Date.now()}`;
    selectedWordbook.value.words.push({ ...editableWord.value });
  }
  
  saveData();
  closeWordDialog();
};

// 単語削除ダイアログを開く
const openDeleteWordDialog = (word) => {
    deleteDialog.value.type = 'word';
    deleteDialog.value.id = word.id;
    deleteDialog.value.message = `単語「${word.englishWord}」を削除します。よろしいですか？`;
    deleteDialog.value.show = true;
};

// --- 削除の確定処理 ---
const confirmDelete = () => {
    if (deleteDialog.value.type === 'wordbook') {
        const index = wordbooks.value.findIndex(wb => wb.id === deleteDialog.value.id);
        if (index !== -1) {
            // 削除対象が選択中の単語集だった場合、選択を解除
            if (selectedWordbook.value && selectedWordbook.value.id === deleteDialog.value.id) {
                selectedWordbook.value = null;
            }
            wordbooks.value.splice(index, 1);
        }
    } else if (deleteDialog.value.type === 'word') {
        if (selectedWordbook.value) {
            const index = selectedWordbook.value.words.findIndex(w => w.id === deleteDialog.value.id);
            if (index !== -1) {
                selectedWordbook.value.words.splice(index, 1);
            }
        }
    }
    saveData();
    deleteDialog.value.show = false;
};


// --- 画像処理 ---

// ファイル選択ダイアログを開くトリガー
const triggerFileInput = () => {
  fileInput.value.click();
};

// ドラッグ＆ドロップでファイルがドロップされた時の処理
const handleFileDrop = (event) => {
  isDragging.value = false;
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    readFileAsBase64(files[0]);
  }
};

// ファイル選択ダイアログでファイルが選択された時の処理
const handleFileSelect = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    readFileAsBase64(files[0]);
  }
};

// ファイルをBase64形式のデータURLに変換
const readFileAsBase64 = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    editableWord.value.imageData = e.target.result;
  };
  reader.readAsDataURL(file);
};

// --- ライフサイクル ---

// コンポーネントがマウントされた時にデータを読み込む
onMounted(() => {
  loadData();
  // 最初の単語集を選択状態にする
  if (wordbooks.value.length > 0) {
    selectWordbook(wordbooks.value[0].id);
  }
});
</script>

<style>
.fill-height {
  min-height: 80vh;
}
.drag-over {
  border: 2px dashed #000;
  background-color: #e0e0e0 !important;
}
</style>
