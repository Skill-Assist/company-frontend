import { Answer } from "./answer";
import { AnswerSheet } from "./answerSheet";
import { Section } from "./section";

export type SectionToAnswerSheet = {
  aiScore: string;
  deadline: string;
  endDate: string;
  id: number;
  isExpired: boolean;
  open?: boolean;
  revisedScore: string;
  startDate: string;
  __answerSheet__: Partial<AnswerSheet>;
  __answers__: Partial<Answer>[];
  __section__: Partial<Section>;
};
