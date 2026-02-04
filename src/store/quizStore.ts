import { create } from 'zustand';
import { QuizState } from '@/lib/types';
import { QUIZ_CONFIG } from '@/lib/questions';

interface QuizStore extends QuizState {
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionIndex: number, answerIndex: number) => void;
  decrementTime: () => void;
  setSubmitted: (submitted: boolean) => void;
  resetQuiz: (totalQuestions: number) => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  currentQuestionIndex: 0,
  answers: [],
  timeLeft: QUIZ_CONFIG.totalTime,
  submitted: false,
  startTime: Date.now(),

  setCurrentQuestion: (index) =>
    set({ currentQuestionIndex: index }),

  setAnswer: (questionIndex, answerIndex) =>
    set((state) => {
      const newAnswers = [...state.answers];
      // Only allow setting answer if not already answered
      if (newAnswers[questionIndex] === null) {
        newAnswers[questionIndex] = answerIndex;
      }
      return { answers: newAnswers };
    }),

  decrementTime: () =>
    set((state) => ({
      timeLeft: Math.max(0, state.timeLeft - 1),
    })),

  setSubmitted: (submitted) => set({ submitted }),

  resetQuiz: (totalQuestions) =>
    set({
      currentQuestionIndex: 0,
      answers: new Array(totalQuestions).fill(null),
      timeLeft: QUIZ_CONFIG.totalTime,
      submitted: false,
      startTime: Date.now(),
    }),
}));
