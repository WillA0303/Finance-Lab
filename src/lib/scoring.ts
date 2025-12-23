import { QuestionResult } from '../types/state';

export function computeStars(score: number): 0 | 1 | 2 | 3 {
  if (score >= 0.9) return 3;
  if (score >= 0.75) return 2;
  if (score >= 0.6) return 1;
  return 0;
}

export function computeXp(results: QuestionResult[]): number {
  const correctCount = results.filter((result) => result.correct).length;
  const wrongCount = results.length - correctCount;
  const base = correctCount * 10 + wrongCount * 2;
  const bonus = correctCount === results.length ? 10 : 0;
  return base + bonus;
}

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function computeStreak(
  prevStreak: number,
  lastCompletedDate: string | null,
  completedDate: Date,
): { streakCount: number; lastCompletedDate: string } {
  const currentDate = toLocalDateString(completedDate);
  if (!lastCompletedDate) {
    return { streakCount: 1, lastCompletedDate: currentDate };
  }
  if (lastCompletedDate === currentDate) {
    return { streakCount: prevStreak, lastCompletedDate };
  }

  const [year, month, day] = lastCompletedDate.split('-').map(Number);
  const lastDate = new Date(year, month - 1, day);
  const diffMs = completedDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { streakCount: prevStreak + 1, lastCompletedDate: currentDate };
  }

  return { streakCount: 0, lastCompletedDate: currentDate };
}