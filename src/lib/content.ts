import { Content, Module, Question, Skill } from '../types/content';

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isQuestion(value: unknown): value is Question {
  if (typeof value !== 'object' || value === null) return false;
  const q = value as Question;
  if (!isString(q.id) || !isString(q.mode) || !isString(q.type) || !isString(q.prompt)) return false;
  if (![1, 2, 3].includes(q.difficulty)) return false;
  if (!isString(q.explanation)) return false;
  if (q.type === 'mcq' && !Array.isArray(q.options)) return false;
  if (q.type === 'numeric' && typeof q.answer !== 'number') return false;
  return true;
}

function isSkill(value: unknown): value is Skill {
  if (typeof value !== 'object' || value === null) return false;
  const skill = value as Skill;
  return isString(skill.id) && isString(skill.title) && Array.isArray(skill.questions) && skill.questions.every(isQuestion);
}

function isModule(value: unknown): value is Module {
  if (typeof value !== 'object' || value === null) return false;
  const mod = value as Module;
  return isString(mod.id) && isString(mod.title) && Array.isArray(mod.skills) && mod.skills.every(isSkill);
}

export function validateContent(content: Content): { valid: boolean; error?: string } {
  if (!content || !Array.isArray(content.modules)) {
    return { valid: false, error: 'Content is missing modules.' };
  }
  if (!content.modules.every(isModule)) {
    return { valid: false, error: 'One or more modules are invalid.' };
  }
  return { valid: true };
}

export function findModule(content: Content, moduleId: string): Module | undefined {
  return content.modules.find((module) => module.id === moduleId);
}

export function findSkill(module: Module, skillId: string): Skill | undefined {
  return module.skills.find((skill) => skill.id === skillId);
}

export function findQuestion(content: Content, questionId: string): Question | undefined {
  for (const module of content.modules) {
    for (const skill of module.skills) {
      const question = skill.questions.find((item) => item.id === questionId);
      if (question) return question;
    }
  }
  return undefined;
}