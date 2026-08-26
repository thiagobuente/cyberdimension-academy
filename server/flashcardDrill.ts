/**
 * Mini-simulado de reforço (SRS drill): agrupa os termos esquecidos ou
 * atrasados dos flashcards e gera questões de múltipla escolha com
 * distratores extraídos do vocabulário da plataforma.
 */

import { englishVocabulary } from "../shared/englishVocabulary";
import { getFlashcardDueTerms, FLASHCARD_DRILL_MAX_QUESTIONS } from "./db";

export interface FlashcardDrillQuestion {
  termId: string;
  term: string;
  phonetic: string;
  options: string[];
  correctAnswer: number;
}

/** Deterministic Fisher–Yates shuffle so the same due set always produces the same ordering per term. */
function seededShuffle<T>(list: readonly T[], seed: number): T[] {
  const copy = [...list];
  for (let currentIndex = copy.length - 1; currentIndex > 0; currentIndex -= 1) {
    const pseudoRandom = (seed * (currentIndex + 3) * 9301 + 49297) % 233280;
    const swapIndex = Math.floor((pseudoRandom / 233280) * (currentIndex + 1));
    const temp = copy[currentIndex];
    copy[currentIndex] = copy[swapIndex];
    copy[swapIndex] = temp;
  }
  return copy;
}

/** Builds the reinforcement questions for the learner's overdue/forgotten flashcards. */
export async function buildDrillQuestionsForUser(userId: number): Promise<FlashcardDrillQuestion[]> {
  const dueRows = await getFlashcardDueTerms(userId);
  const termIds = new Set(dueRows.filter((row) => row.stage < 5).map((row) => row.termId));
  const dueTerms = englishVocabulary.filter((term) => termIds.has(term.id));
  if (dueTerms.length === 0) return [];
  const picked = dueTerms.slice(0, FLASHCARD_DRILL_MAX_QUESTIONS);
  const deterministicSeed = picked.map((term) => term.id).join("|").length + picked.length * 7;

  return picked.map((term, termIndex) => {
    const distractorPool = englishVocabulary.filter((other) => other.id !== term.id);
    const distractors = seededShuffle(distractorPool, deterministicSeed + termIndex).slice(0, 3);
    const options = seededShuffle([term, ...distractors], deterministicSeed + termIndex + 100);
    const correctAnswer = options.findIndex((option) => option.id === term.id);
    return { termId: term.id, term: term.term, phonetic: term.phonetic, options: options.map((option) => option.meaning), correctAnswer };
  });
}
