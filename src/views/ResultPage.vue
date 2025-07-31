<template height="100dvh" background-color="#000000">
<v-container class="center">
  <div width="100vw">
    <p>CLEAR</p>
    <p>SCORE:{{ resultStore.score }}</p>
    <p>GOOD:{{ resultStore.correctCount }}</p>
    <p>MISS:{{ resultStore.mistakeCount }}</p>
    <p>TIME:{{ resultStore.time }} s</p>
  </div>
</v-container>

<!-- スコア表示 -->
<div class="result-background">
  <div class="result-contener">

  </div>
</div>
</template>


<script setup>
import { useResultDataStore } from '@/stores/dataStore'
const resultStore = useResultDataStore()

</script>