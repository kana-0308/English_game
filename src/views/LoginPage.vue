<template>
  <v-main class="third-color">
    <v-container height="90dvh" class="center" fluid>
      <v-card class="w-100" max-width="800px">
        <v-card-title class="title  pa-4 mb-4 kyokasho-font-b">
          ログイン
          <div style="font-size: 16px;" class="text-grey-darken-1">
            アカウントにログインしてください
          </div>
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              type="email"
              label="メールアドレス"
              required
              prepend-inner-icon="mdi-email-outline"
            ></v-text-field>
            <v-text-field
              v-model="password"
              type="password"
              label="パスワード"
              required
              prepend-inner-icon="mdi-lock-outline"
            ></v-text-field>
            
            <v-alert v-if="error" type="error">
              {{ error }}
            </v-alert>

            <v-btn type="submit" class="thema-color kyokasho-font-b" rounded="lg" block size="large">
              <v-icon start icon="mdi-login"></v-icon>
              ログイン
            </v-btn>
            <div class="mt-5">
              <a href="https://english-app-pbl.web.app/#/auth">新しいアカウントの作成 サインアップ</a>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const email = ref('');
const password = ref('');
const error = ref(null);

const router = useRouter();
const route = useRoute();

const handleLogin = async () => {
  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email.value, password.value);

    // ログイン成功後、元のページにリダイレクト
    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);
  } catch (err) {
    error.value = 'ログインに失敗しました。メールアドレスまたはパスワードが間違っています。';
    console.error(err);
  }
};
</script>

<style scoped>
.thema-color {
  background-color: #27c9b5;
  color: #f2f2f2;
}
.sub-color {
  background-color: #696e79;
  color: #f2f2f2;
}
.third-color {
  background-color: #dbeeeb;
}
.title {
  font-size: clamp(16px, 3vw, 32px);
}
</style>