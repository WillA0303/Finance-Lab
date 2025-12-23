export type Mode = 'learn' | 'practice';

export interface SkillProgress {
  bestScore: number;
  stars: 0 | 1 | 2 | 3;
  sessionsCompleted: number;
}

export interface ModuleProgress {
  skills: Record<string, { learn: SkillProgress; practice: SkillProgress }>;
}

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  userAnswer: string | number;
  correctAnswer: string | number;
}

export interface LastSession {
  mode: Mode;
  moduleId: string;
  skillId: string;
  startedAtISO: string;
  completedAtISO: string;
  questionResults: QuestionResult[];
}

export interface AppState {
  xpTotal: number;
  streakCount: number;
  lastCompletedDate: string | null;
  modules: Record<string, ModuleProgress>;
  weakQuestionIds: string[];
  lastSession: LastSession | null;
}