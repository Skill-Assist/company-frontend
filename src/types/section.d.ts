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
  questions: {
    id: string;
    weight: number;
  }[]
  __exam__: Partial<Exam>;
  answerCount: number;
};
