export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3 index
  subject?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: (number | null)[];
  timeLeft: number; // seconds
  submitted: boolean;
  startTime: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  totalPossible: number;
  percentage: number;
  details: QuestionResult[];
}

export interface QuestionResult {
  questionId: number;
  question: string;
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
  points: number; // +4, -1, or 0
}
