export type Role = 'client' | 'trainer';

export type Discipline = 'bodybuilding' | 'powerlifting' | 'weightlifting' | 'general';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  discipline?: Discipline;
  healthScreeningCompletedAt?: string | null;
}

export interface Ebook {
  id: string;
  title: string;
  priceInr: number;
  blurb: string;
  pages: number;
  format: 'PDF';
}

export interface CoachingTier {
  id: string;
  name: string;
  priceInr: number;
  billing: 'per month' | 'per 12-week cycle';
  discipline: Discipline;
  description: string;
  features: string[];
}

export interface Trainer {
  id: string;
  name: string;
  discipline: Discipline;
  rating: number;
  clients: number;
  verified: boolean;
}

export interface FormCheckFault {
  timestampSec: number;
  label: string;
  detail: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface FormCheckResult {
  id: string;
  lift: string;
  createdAt: string;
  aiProvider: 'gemini-2.5-flash' | 'gpt-4o-mini';
  status: 'processing' | 'complete';
  overallNote: string;
  faults: FormCheckFault[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  provider?: 'gemini' | 'chatgpt';
}
