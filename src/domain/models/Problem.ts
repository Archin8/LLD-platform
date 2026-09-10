export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  difficulty: Difficulty;
  requiresAbstraction?: string[];
  createdAt?: Date;
}
