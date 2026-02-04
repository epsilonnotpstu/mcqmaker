import { z } from 'zod';

export type ParsedQuestion = {
  q: string;
  options: [string, string, string, string];
  correct: number; // 0-3
};

const QuestionSchema = z.object({
  q: z.string().min(1),
  options: z.array(z.string()).length(4),
  correct: z.number().int().min(0).max(3),
});

/**
 * Safely parse an admin-pasted JavaScript snippet of the form:
 * var questions = [ { q: "...", options: ["A","B","C","D"], correct: 0 }, ... ];
 * Returns a validated array; throws on invalid input.
 */
export function parseQuestionsFromJS(code: string): ParsedQuestion[] {
  // Find top-level variable declaration named 'questions'
  let arraySrc = '';
  const src = code;
  // Use regex as a fallback for extracting array literal
  const re = /var\s+questions\s*=\s*(\[[\s\S]*\]);?/m;
  const m = src.match(re);
  if (!m) {
    throw new Error('Could not find a var questions = [...] declaration');
  }
  arraySrc = m[1];

  // Convert JS object keys to quoted for JSON parsing, e.g., { q: "..." } -> { "q": "..." }
  const jsonLike = arraySrc
    .replace(/([\{\,\s])(q|options|correct)\s*:/g, '$1"$2":')
    .replace(/'([^']*)'/g, '"$1"');

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonLike);
  } catch {
    throw new Error('Invalid array JSON after normalization');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('questions is not an array');
  }

  const result: ParsedQuestion[] = [];
  for (const item of parsed) {
    const safe = QuestionSchema.safeParse(item);
    if (!safe.success) {
      throw new Error('Invalid question format: ' + safe.error.message);
    }
    const q = safe.data;
    const options = q.options as [string, string, string, string];
    result.push({ q: q.q, options, correct: q.correct });
  }
  return result;
}
