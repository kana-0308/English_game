<template>
  <v-navigation-drawer permanent>
    <v-toolbar flat>
      <v-toolbar-title>単語集リスト</v-toolbar-title>
    </v-toolbar>

    <v-divider></v-divider>

    <div class="pa-4">
      <v-btn 
        @click="addWordbook"
        color="primary"
        block
        size="large"
        class="text-none"
      >
        <v-icon left>mdi-plus</v-icon>
        新規追加
      </v-btn>
    </div>

    <v-list dense nav>
      <v-list-item
        v-for="wordbook in wordbooks"
        :key="wordbook.path"
        link
        :value="wordbook.path"
        :active="selectedWordbook && selectedWordbook.path === wordbook.path"
        @click="selectWordbook(wordbook)"
      >
        <v-list-item-title>{{ wordbook.name }}</v-list-item-title>
        <template v-slot:append>
          <v-btn icon="mdi-pencil" size="x-small" variant="text" @click.stop="openEditWordbookDialog(wordbook)"></v-btn>
          <v-btn icon="mdi-delete" size="x-small" variant="text" @click.stop="openDeleteWordbookDialog(wordbook)"></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <v-container fluid>
      <div v-if="selectedWordbook">
        <v-toolbar flat>
          <v-toolbar-title>{{ selectedWordbook.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="openAddWordDialog" size="large">
            <v-icon left>mdi-plus</v-icon>
            新規単語追加
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>

        <v-row class="mt-4">
          <v-col
            v-for="(word, index) in selectedWordbook.quizzes"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-img
                :src="word.image || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'"
                height="200px"
                cover
              ></v-img>
              <v-card-title>{{ word.words[word.correctIndex] }}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="openEditWordDialog(word, index)">編集</v-btn>
                <v-btn color="error" variant="text" @click="openDeleteWordDialog(word, index)">削除</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <div v-if="!selectedWordbook.quizzes.length" class="text-center text-grey mt-10">
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

  <v-dialog v-model="wordDialog.show" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">{{ wordDialog.isEdit ? '単語の編集' : '新しい単語の追加' }}</span>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-container>
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field
                v-model="editableWord.words[editableWord.correctIndex]"
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
                <v-img v-if="editableWord.image" :src="editableWord.image" max-height="150" contain class="mb-4"></v-img>
                <p>画像をここにドラッグ＆ドロップ</p>
                <p class="text-caption">または</p>
                <v-btn small @click="triggerFileInput">ファイルを選択</v-btn>
                <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" class="d-none" />
              </div>
            </v-col>
          </v-row>
          <v-row v-for="(choice, index) in editableWord.words" :key="index" no-gutters>
            <v-col cols="auto" class="mr-4">
                <v-radio-group v-model="editableWord.correctIndex" label="正解">
                  <v-radio :label="`${index + 1}`" :value="index"></v-radio>
                </v-radio-group>
            </v-col>
            <v-col>
              <v-text-field
                v-model="editableWord.words[index]"
                :label="`選択肢 ${index + 1}`"
                required
              ></v-text-field>
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
</template>

<script setup>
import { ref, onMounted } from 'vue';

// --- リアクティブな状態定義 ---

// すべての単語集データを保持 (file-list.jsonの内容)
const wordbooks = ref([]);
// 現在選択されている単語集 (個別の単語集JSONの内容)
const selectedWordbook = ref(null);
// ドラッグ＆ドロップ時のUI制御用
const isDragging = ref(false);
// ファイル選択インプットへの参照
const fileInput = ref(null);

// 単語追加・編集ダイアログの状態
const wordDialog = ref({
  show: false,
  isEdit: false,
  editIndex: null, // 編集対象の単語のインデックス
});

// 単語集名編集ダイアログの状態
const wordbookDialog = ref({
    show: false,
    path: '',
    name: ''
});

// 削除確認ダイアログの状態
const deleteDialog = ref({
    show: false,
    type: '', // 'wordbook' or 'word'
    path: '', // 単語集の場合
    index: null, // 単語の場合
    message: ''
});

// 編集中の単語データ
const editableWord = ref({
  image: null,
  words: ['', '', '', ''],
  correctIndex: 0,
});

// --- JSONファイルの読み書き関数 (ここではダミーの実装) ---
// 実際にはサーバーサイドのAPI経由でファイル操作を行う必要があるため、
// ここではlocalStorageを模倣した関数を実装します。
// 本番環境では、これらの関数をAPI呼び出しに置き換えてください。
const FILE_LIST_PATH = 'file-list.json';

const fetchJson = async (path) => {
    try {
        // publicフォルダからの相対パスを想定
        const response = await fetch(`/json/${path}`);
        if (!response.ok) {
            // ファイルが存在しない場合は空のデータを返す
            return { quizzes: [] };
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch JSON from ${path}:`, error);
        return { quizzes: [] };
    }
};

const saveJson = async (path, data) => {
    // サーバーサイドでのJSONファイル書き込みを想定したダミー実装
    // Vue.jsのアプリケーションから直接ファイルシステムを操作することはできないため、
    // 実際にはサーバーサイドのAPIエンドポイントを呼び出す必要があります。
    // 例: await axios.post('/api/save-json', { path, data });
    console.log(`Saving to ${path}:`, data);
    
    // デモンストレーションのため、localStorageで擬似的に保存
    localStorage.setItem(`json-${path}`, JSON.stringify(data));
};

const loadData = async () => {
    // file-list.jsonを読み込む
    const data = await fetchJson(FILE_LIST_PATH);
    wordbooks.value = data;

    // 最初の単語集を選択状態にする
    if (wordbooks.value.length > 0) {
      selectWordbook(wordbooks.value[0]);
    }
};


// --- 単語集 (Wordbook) の操作 ---

// 新しい単語集を追加
const addWordbook = async () => {
  const newFileName = `wordbook-${Date.now()}.json`;
  const newWordbookMeta = {
    name: `新しい単語集 ${wordbooks.value.length + 1}`,
    path: newFileName,
  };
  
  wordbooks.value.push(newWordbookMeta);
  
  // 新しい単語集ファイルを作成（空のデータで保存）
  await saveJson(newFileName, { quizzes: [] });
  await saveJson(FILE_LIST_PATH, wordbooks.value);
  
  selectWordbook(newWordbookMeta);
  openEditWordbookDialog(newWordbookMeta);
};

// 単語集を選択し、その単語データを読み込む
const selectWordbook = async (wordbookMeta) => {
  if (wordbookMeta) {
    const wordbookData = await fetchJson(wordbookMeta.path);
    selectedWordbook.value = { ...wordbookMeta, ...wordbookData };
  } else {
    selectedWordbook.value = null;
  }
};

// 単語集名編集ダイアログを開く
const openEditWordbookDialog = (wordbook) => {
    wordbookDialog.value.path = wordbook.path;
    wordbookDialog.value.name = wordbook.name;
    wordbookDialog.value.show = true;
};

// 単語集名を更新
const updateWordbookName = async () => {
    const book = wordbooks.value.find(wb => wb.path === wordbookDialog.value.path);
    if (book) {
        book.name = wordbookDialog.value.name;
        await saveJson(FILE_LIST_PATH, wordbooks.value);
        if (selectedWordbook.value && selectedWordbook.value.path === book.path) {
            selectedWordbook.value.name = book.name;
        }
    }
    wordbookDialog.value.show = false;
};

// 単語集削除ダイアログを開く
const openDeleteWordbookDialog = (wordbook) => {
    deleteDialog.value.type = 'wordbook';
    deleteDialog.value.path = wordbook.path;
    deleteDialog.value.message = `単語集「${wordbook.name}」を削除します。よろしいですか？`;
    deleteDialog.value.show = true;
};

// --- 単語 (Word) の操作 ---

// 空の単語フォームを準備する
const resetEditableWord = () => {
  editableWord.value = {
    image: null,
    words: ['', '', '', ''],
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
const openEditWordDialog = (word, index) => {
  // 編集用にデータをディープコピーする
  editableWord.value = JSON.parse(JSON.stringify(word));
  wordDialog.value.isEdit = true;
  wordDialog.value.editIndex = index;
  wordDialog.value.show = true;
};

// 単語ダイアログを閉じる
const closeWordDialog = () => {
  wordDialog.value.show = false;
  resetEditableWord();
};

// 単語を保存（追加または更新）
const saveWord = async () => {
  if (!selectedWordbook.value) return;

  if (wordDialog.value.isEdit) {
    // 編集モード
    selectedWordbook.value.quizzes[wordDialog.value.editIndex] = { ...editableWord.value };
  } else {
    // 追加モード
    selectedWordbook.value.quizzes.push({ ...editableWord.value });
  }
  
  await saveJson(selectedWordbook.value.path, { quizzes: selectedWordbook.value.quizzes });
  closeWordDialog();
};

// 単語削除ダイアログを開く
const openDeleteWordDialog = (word, index) => {
    deleteDialog.value.type = 'word';
    deleteDialog.value.index = index;
    deleteDialog.value.message = `単語「${word.words[word.correctIndex]}」を削除します。よろしいですか？`;
    deleteDialog.value.show = true;
};

// --- 削除の確定処理 ---
const confirmDelete = async () => {
    if (deleteDialog.value.type === 'wordbook') {
        const index = wordbooks.value.findIndex(wb => wb.path === deleteDialog.value.path);
        if (index !== -1) {
            if (selectedWordbook.value && selectedWordbook.value.path === deleteDialog.value.path) {
                selectedWordbook.value = null;
            }
            wordbooks.value.splice(index, 1);
            // file-list.jsonを更新
            await saveJson(FILE_LIST_PATH, wordbooks.value);
            // 該当単語集ファイルを削除する処理も必要（サーバーサイドで実装）
        }
    } else if (deleteDialog.value.type === 'word') {
        if (selectedWordbook.value) {
            selectedWordbook.value.quizzes.splice(deleteDialog.value.index, 1);
            // 選択中の単語集ファイルを更新
            await saveJson(selectedWordbook.value.path, { quizzes: selectedWordbook.value.quizzes });
        }
    }
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
    editableWord.value.image = e.target.result;
  };
  reader.readAsDataURL(file);
};

// --- ライフサイクル ---

// コンポーネントがマウントされた時にデータを読み込む
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.fill-height {
  min-height: 80vh;
}
.drag-over {
  border: 2px dashed #000;
  background-color: #e0e0e0 !important;
}
</style>