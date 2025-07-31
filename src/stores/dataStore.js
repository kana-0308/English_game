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
    takenTime: 0,
    correctCount: 0,
    mistakeCount: 0,
    mistakeIndexs: null,
    incorrectWords: [],
  }),
  actions: {
    setResultData(score, takenTime, correctCount, mistakeCount, mistakeIndexs) {
      this.score = score
      this.takenTime = takenTime
      this.correctCount = correctCount
      this.mistakeCount = mistakeCount
      this.mistakeIndexs = mistakeIndexs
    },
    addIncorrectWord(word){
      this.incorrectWords.push(word);
    } 
  }
});
