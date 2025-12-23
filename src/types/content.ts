export type QuestionMode = 'learn' | 'practice' | 'both';
export type QuestionType = 'mcq' | 'numeric';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  mode: QuestionMode;
  type: QuestionType;
  difficulty: 1 | 2 | 3;
  prompt: string;
  scenarioContext?: string;
  options?: QuestionOption[];
  answer: string | number;
  numericTolerance?: number;
  explanation: string;
  inPractice?: string;
  examTip?: string;
  tags?: string[];
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
}

export interface Content {
  modules: Module[];
}