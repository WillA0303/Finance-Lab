import { AppState, Mode } from '../types/state';
import { computeStars } from './scoring';

const STORAGE_KEY = 'financeLabState:v1';

export function defaultState(): AppState {
  return {
    xpTotal: 0,
    streakCount: 0,
    lastCompletedDate: null,
    modules: {},
    weakQuestionIds: [],
    lastSession: null,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!isRecord(parsed)) return defaultState();

    const state = parsed as Partial<AppState>;
    return {
      xpTotal: typeof state.xpTotal === 'number' ? state.xpTotal : 0,
      streakCount: typeof state.streakCount === 'number' ? state.streakCount : 0,
      lastCompletedDate: typeof state.lastCompletedDate === 'string' ? state.lastCompletedDate : null,
      modules: isRecord(state.modules) ? (state.modules as AppState['modules']) : {},
      weakQuestionIds: Array.isArray(state.weakQuestionIds)
        ? (state.weakQuestionIds.filter((id) => typeof id === 'string') as string[])
        : [],
      lastSession: state.lastSession ?? null,
    };
  } catch (error) {
    return defaultState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getSkillProgress(state: AppState, moduleId: string, skillId: string, mode: Mode) {
  const module = state.modules[moduleId];
  if (!module) return null;
  const skill = module.skills[skillId];
  if (!skill) return null;
  return skill[mode];
}

export function updateSkillProgress(
  state: AppState,
  moduleId: string,
  skillId: string,
  mode: Mode,
  score: number,
): AppState {
  const module = state.modules[moduleId] ?? { skills: {} };
  const skill = module.skills[skillId] ?? {
    learn: { bestScore: 0, stars: 0, sessionsCompleted: 0 },
    practice: { bestScore: 0, stars: 0, sessionsCompleted: 0 },
  };

  const existing = skill[mode];
  const bestScore = Math.max(existing.bestScore, score);
  const stars = computeStars(score);

  const updatedSkill = {
    ...skill,
    [mode]: {
      bestScore,
      stars: Math.max(existing.stars, stars) as 0 | 1 | 2 | 3,
      sessionsCompleted: existing.sessionsCompleted + 1,
    },
  };

  return {
    ...state,
    modules: {
      ...state.modules,
      [moduleId]: {
        ...module,
        skills: {
          ...module.skills,
          [skillId]: updatedSkill,
        },
      },
    },
  };
}

export function updateWeakQuestions(state: AppState, wrongIds: string[], correctIds: string[]): AppState {
  const set = new Set(state.weakQuestionIds);
  wrongIds.forEach((id) => set.add(id));
  correctIds.forEach((id) => set.delete(id));
  const capped = Array.from(set).slice(0, 50);
  return { ...state, weakQuestionIds: capped };
}