export type Grade = 6 | 7 | 8 | 9;

export type Genre = 
  | 'truyen'
  | 'tho'
  | 'nghi-luan'
  | 'thong-tin'
  | 'ngu-ngon'
  | 'khoa-hoc'
  | 'doi-song-moi-truong';

export type Difficulty = 'de' | 'trung-binh' | 'nang-cao';

export type QuestionLevel = 'nhan-biet' | 'thong-hieu' | 'van-dung' | 'tu-duy-nang-cao';

export type QuestionType = 
  | 'multiple-choice'
  | 'true-false'
  | 'fill-blank'
  | 'order-events'
  | 'short-essay'
  | 'open-opinion';

export interface QuestionItem {
  id: string;
  type: QuestionType;
  level: QuestionLevel;
  prompt: string;
  options?: string[];
  correctAnswer?: string | number | boolean | string[];
  explanation: string;
  hint: string;
  rubricCriteria?: string[];
}

export interface VocabularyItem {
  word: string;
  meaning: string;
  wordType?: string;
  nuance?: string;
  example?: string;
}

export interface PoetryRhythmLine {
  line: string;
  rhythm: string; // e.g. "2/3", "4/3", "2/2/2"
  emotion?: string; // e.g. "Hào hùng", "Trầm lắng", "Thiết tha"
}

export interface StanzaAnalysis {
  stanzaIndex: number;
  lines: string[];
  summary: string;
  rhythm?: string;
  rhetoricDevices?: string[];
  poeticImages?: string[];
  emotionsTone?: string;
}

export interface PoemAnalysis {
  poeticForm?: string;
  sourceOrigin?: string;
  centralTheme?: string;
  mainMessage?: string;
  tone?: string;
  stanzas?: StanzaAnalysis[];
}

export interface TextItem {
  id: string;
  title: string;
  authorOrSource: string;
  grade: Grade;
  bookCollection: string; // "Kết nối tri thức với cuộc sống"
  unit: string; // e.g. "Bài 1: Tôi và các bạn"
  genre: Genre;
  difficulty: Difficulty;
  estimatedReadMinutes: number;
  excerpt: string;
  coverImage?: string;
  content: string;
  isPoem?: boolean;
  isExcerpt?: boolean;
  poeticForm?: string;
  poemAnalysis?: PoemAnalysis;
  poetryRhythms?: PoetryRhythmLine[];
  vocabularyList: VocabularyItem[];
  questions: QuestionItem[];
  storyEvents?: string[]; // for ordering game
  keywordsToFind?: { word: string; isCorrect: boolean; explanation: string }[];
  secretMessage?: {
    clue: string;
    encoded: string;
    answer: string;
    meaning: string;
  };
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface ReadingHistoryItem {
  textId: string;
  textTitle: string;
  grade: Grade;
  accuracy: number;
  wpm: number;
  completedAt: string;
  quizScore?: number;
}

export interface RewardItem {
  id: string;
  title: string;
  desc: string;
  cost: number;
  icon: string;
  type: 'title' | 'frame' | 'boost' | 'certificate';
}

export interface EssayRubricItem {
  criteria: string;
  maxPoints: number;
  description: string;
}

export interface EssayPrompt {
  id: string;
  type: 'social' | 'literary';
  title: string;
  topic: string;
  grade: Grade;
  difficulty: 'Cơ bản' | 'Khá' | 'Nâng cao';
  suggestedMinutes: number;
  maxScore: number;
  prompt: string;
  requirements: string[];
  rubric: EssayRubricItem[];
  relatedTextId?: string;
  relatedTextTitle?: string;
  relatedAuthor?: string;
  quoteOrExcerpt?: string;
}

export interface EssayGradingResult {
  score: number;
  criteriaScores: {
    criteria: string;
    score: number;
    maxPoints: number;
    comment: string;
  }[];
  overallFeedback: string;
  strengths: string[];
  weaknesses: string[];
  advancedSuggestions: string;
  improvedSampleParagraph?: string;
  teacherPraise: string;
}

export interface EssaySubmission {
  id: string;
  userId: string;
  promptId: string;
  promptTitle: string;
  type: 'social' | 'literary';
  grade: Grade;
  content: string;
  wordCount: number;
  mode: 'practice' | 'exam';
  timeSpentSeconds: number;
  submittedAt: string;
  grading: EssayGradingResult;
  coinsAwarded: number;
  xpAwarded: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  grade: Grade;
  avatar: string;
  xp: number;
  coins: number;
  streak: number;
  completedTextIds: string[];
  quizScores: Record<string, number>;
  badges: Badge[];
  unlockedItems: string[];
  history: ReadingHistoryItem[];
  essaySubmissions?: EssaySubmission[];
  equippedFrameId?: string;
  equippedTitleId?: string;
  rewardedEssayPromptIds?: string[];
  isGuest: boolean;
  createdAt: string;
}

export interface EvaluationResult {
  score: number;
  feedback: string;
  suggestions: string[];
  praise?: string;
}

export interface SpeechFeedback {
  accuracy: number;
  wpm: number;
  expressionFeedback: string;
  encouragement: string;
}

