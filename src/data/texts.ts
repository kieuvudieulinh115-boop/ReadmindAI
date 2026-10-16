import { TextItem } from '../types';
import { TEXTS_GRADE_6 } from './textsGrade6';
import { TEXTS_GRADE_7 } from './textsGrade7';
import { TEXTS_GRADE_8 } from './textsGrade8';
import { TEXTS_GRADE_9 } from './textsGrade9';

// Combine all grade text sets and guarantee unique IDs
const rawTexts: TextItem[] = [
  ...TEXTS_GRADE_6,
  ...TEXTS_GRADE_7,
  ...TEXTS_GRADE_8,
  ...TEXTS_GRADE_9
];

const seenTextIds = new Set<string>();
export const INITIAL_TEXTS: TextItem[] = rawTexts.filter(item => {
  if (!item.id || seenTextIds.has(item.id)) return false;
  seenTextIds.add(item.id);
  return true;
});

export { TEXTS_GRADE_6, TEXTS_GRADE_7, TEXTS_GRADE_8, TEXTS_GRADE_9 };
