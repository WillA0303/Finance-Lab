import { Question } from '../types/content';

/**
 * Select session questions from a filtered pool, optionally prioritising weak questions.
 * Hard guarantees:
 * - Never mutates inputs
 * - Always terminates
 * - Never hangs if pool is smaller than requested length
 */
export function selectSessionQuestions(
  questionPool: Question[],
  weakQuestionIds: string[],
  sessionLength: number,
): Question[] {
  // Defensive copies (never mutate caller arrays)
  const pool = Array.isArray(questionPool) ? [...questionPool] : [];
  const weakIds = Array.isArray(weakQuestionIds) ? [...weakQuestionIds] : [];

  if (pool.length === 0 || sessionLength <= 0) return [];

  // Build a quick lookup for pool by id
  const byId = new Map<string, Question>();
  for (const q of pool) byId.set(q.id, q);

  // 1) Pull up to 2 weak questions that exist in the current pool
  const picked: Question[] = [];
  const pickedIds = new Set<string>();

  for (const id of weakIds) {
    if (picked.length >= 2) break;
    const q = byId.get(id);
    if (q && !pickedIds.has(q.id)) {
      picked.push(q);
      pickedIds.add(q.id);
    }
  }

  // 2) Fill the rest from a shuffled copy of the pool (excluding already-picked)
  const remaining = pool.filter((q) => !pickedIds.has(q.id));
  shuffleInPlace(remaining);

  for (const q of remaining) {
    if (picked.length >= sessionLength) break;
    picked.push(q);
    pickedIds.add(q.id);
  }

  // 3) If still short (pool smaller than sessionLength), allow repeats but bounded
  if (picked.length < sessionLength) {
    // Repeat from what we already have, or from the pool if somehow picked is empty
    const source = picked.length > 0 ? picked : pool;
    let i = 0;
    while (picked.length < sessionLength && i < sessionLength * 3) {
      picked.push(source[i % source.length]);
      i += 1;
    }
  }

  // 4) Final trim (in case sessionLength < picked)
  return picked.slice(0, sessionLength);
}

/**
 * Fisher–Yates shuffle (in place) on a local array only.
 */
function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
}
