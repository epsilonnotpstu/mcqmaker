import { Question, QuizResult, QuestionResult } from './types';
// passPercentage is used in UI, scoring config is provided by caller

export function calculateScore(
  questions: Question[],
  answers: (number | null)[],
  config: { marksPerCorrect: number; negativePerWrong: number; unattemptedPoints?: number }
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
      points = Number(config.unattemptedPoints ?? 0);
    } else if (isCorrect) {
      correctAnswers++;
      points = Number(config.marksPerCorrect);
      score += points;
    } else {
      wrongAnswers++;
      points = Number(config.negativePerWrong);
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

  const totalPossible = questions.length * Number(config.marksPerCorrect);
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
