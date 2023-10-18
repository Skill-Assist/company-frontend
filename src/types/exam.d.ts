import { AnswerSheet } from "./answerSheet";
import { Section } from "./section";
import { User } from "./user";

export type Exam = {
  id: number,
  jobTitle: string,
  jobLevel: string,
  description: string,
  durationInHours: number,
  submissionInHours: number,
  showScore: boolean,
  isPublic: boolean,
  status: "published" | "draft" | "archived",
  createdByRef?: User
  answerSheetsRef?: AnswerSheet
  __sections__?: Section[]
};
