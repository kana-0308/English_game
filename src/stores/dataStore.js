// src/stores/dataStore.js
import { defineStore } from 'pinia'

export const useJsonDataStore = defineStore('jsonData', {
  state: () => ({
    jsonData: null
  }),
  actions: {
    setJsonData(data) {
      this.jsonData = data
    }
  }
})

export const useResultDataStore = defineStore('resultData', {
  state: () => ({
    score: 0,
    time: 0,
    correctCount: 0,
    mistakeCount: 0,
  }),
  actions: {
    setResultData(score, time, correctCount, mistakeCount) {
      this.score = score
      this.time = time
      this.correctCount = correctCount
      this.mistakeCount = mistakeCount
    }
  }
})
