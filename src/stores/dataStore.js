// src/stores/dataStore.js
import { defineStore } from 'pinia'

export const useWordbookDataStore = defineStore('wordbookData', {
  state: () => ({
    quizNumber: 0,
    documentName: '',
  }),
  actions: {
    setWordbookData(documentName, quizNumber) {
      this.documentName = documentName
      this.quizNumber = quizNumber
    }
  }
});

export const useResultDataStore = defineStore('resultData', {
  state: () => ({
    score: 0,
    takenTime: 0,
    correctCount: 0,
    mistakeCount: 0,
    mistakeIndexs: [],
    incorrectWords: [],
    incorrectQuizzes: [],
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
    },
    addIncorrectQuizz(quiz) {
      this.incorrectQuizzes.push(quiz);
    }
  }
});
