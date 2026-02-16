import Papa from 'papaparse';
import { FlashcardData, ParseResult } from '../types';

export const parseCSV = (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.toLowerCase().trim(),
      complete: (results: Papa.ParseResult<Record<string, string>>) => {
        if (results.errors.length > 0 && !results.data.length) {
          resolve({ data: [], error: 'Failed to parse CSV. Please check the format.' });
          return;
        }

        const validData: FlashcardData[] = [];
        
        results.data.forEach((row, index) => {
          // Normalize keys to find 'question' and 'answer' flexibly
          const keys = Object.keys(row);
          const questionKey = keys.find(k => k.includes('question') || k.includes('front') || k.includes('term'));
          const answerKey = keys.find(k => k.includes('answer') || k.includes('back') || k.includes('definition'));

          if (questionKey && answerKey && row[questionKey] && row[answerKey]) {
            validData.push({
              id: `card-${index}-${Date.now()}`,
              question: row[questionKey].trim(),
              answer: row[answerKey].trim(),
            });
          }
        });

        if (validData.length === 0) {
          resolve({ data: [], error: 'No valid flashcards found. Ensure CSV has "question" and "answer" columns.' });
        } else {
          resolve({ data: validData });
        }
      },
      error: (error: Error) => {
        resolve({ data: [], error: error.message });
      },
    });
  });
};