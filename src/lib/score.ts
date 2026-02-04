import { Question, QuizResult, QuestionResult } from './types';
import { QUIZ_CONFIG } from './questions';

export function calculateScore(
  questions: Question[],
  answers: (number | null)[]
): QuizResult {
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let unattempted = 0;
  let score = 0;

  const details: QuestionResult[] = questions.map((q, index) => {
    const selectedAnswer = answers[index];
    const isCorrect = selectedAnswer === q.correctAnswer;
    let points = 0;

    if (selectedAnswer === null) {
      unattempted++;
      points = QUIZ_CONFIG.unattemptedPoints;
    } else if (isCorrect) {
      correctAnswers++;
      points = QUIZ_CONFIG.correctPoints;
      score += points;
    } else {
      wrongAnswers++;
      points = QUIZ_CONFIG.wrongPoints;
      score += points;
    }

    return {
      questionId: q.id,
      question: q.question,
      options: q.options,
      selectedAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      points,
    };
  });

  const totalPossible = questions.length * QUIZ_CONFIG.correctPoints;
  const percentage = ((score / totalPossible) * 100).toFixed(2);

  return {
    score,
    totalQuestions: questions.length,
    correctAnswers,
    wrongAnswers,
    unattempted,
    totalPossible,
    percentage: parseFloat(percentage),
    details,
  };
}
