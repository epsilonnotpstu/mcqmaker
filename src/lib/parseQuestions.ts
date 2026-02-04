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
 * Safe parser for admin-pasted question arrays.
 * Input format:
 *   var questions = [
 *     { q: "Question?", options: ["A","B","C","D"], correct: 0 },
 *     ...
 *   ];
 *
 * Security considerations:
 * - Never uses eval.
 * - Normalizes object keys to quoted JSON and single quotes to double quotes.
 * - Validates each entry strictly with zod.
 */
export function parseQuestionsFromJS(code: string): ParsedQuestion[] {
  const src = code.trim();
  const re = /var\s+questions\s*=\s*(\[[\s\S]*\]);?/m;
  const m = src.match(re);
  if (!m) {
    throw new Error('Could not find a var questions = [...] declaration');
  }
  const arraySrc = m[1];

  // Normalize to JSON-like string:
  // - Quote known keys
  // - Convert single quotes to double quotes
  // - Remove trailing commas in objects/arrays
  const jsonLike = arraySrc
    .replace(/([\{\,\s])(q|options|correct)\s*:/g, '$1"$2":')
    .replace(/'([^']*)'/g, '"$1"')
    .replace(/,\s*([\]\}])/g, '$1');

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
