<template>
<!-- スコア表示 -->
<div class="result-background">
  <div class="result-contener">

    <!-- スコア -->
    <div class="score-contener">
      <div>SCORE:&nbsp;</div>
      <div class="score-text">{{ score }}</div>
    </div>

    <!-- その他詳細 -->
    <div>GOOD: {{ correctCount }}</div>
    <div>MISS: {{ mistakeCount }}</div>
    <div>TIME: {{ takenTime }} 秒</div>
  </div>
</div>
</template>


<script setup>

</script>