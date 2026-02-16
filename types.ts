export interface FlashcardData {
  id: string;
  question: string;
  answer: string;
}

export interface ParseResult {
  data: FlashcardData[];
  error?: string;
}

export type SwipeDirection = 'left' | 'right';
