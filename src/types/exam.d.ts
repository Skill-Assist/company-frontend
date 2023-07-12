import { AnswerSheet } from "./answerSheet";
import { Section } from "./section";
import { User } from "./user";

export type Exam = {
  id: number,
  title: string,
  subtitle: string,
  level: string,
  durationInHours: number,
  submissionInHours: number,
  dateToArchive: Date,
  showScore: boolean,
  isPublic: boolean,
  status: "live" | "archived" | "draft" | "published",
  createdByRef?: User
  answerSheetsRef?: AnswerSheet
  __sections__?: Section[]
};
