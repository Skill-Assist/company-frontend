import { Exam } from "./exam";

export type Section = {
  id: number;
  name: string;
  description: string;
  weight: string;
  startDate: null | Date,
  durationInHours: number;
  isShuffleQuestions?: boolean;
  hasProctoring?: boolean;
  questionIds: string[];
  __exam__: Partial<Exam>;
  questionId: string[]
  answerCount: number;
};
