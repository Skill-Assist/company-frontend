import { Option } from "./option";

export type Question = {
  id?: string;
  type: string;
  statement: string;
  options?: Option;
  gradingRubric: any;
  difficulty?: number;
  tags?: string[];
  isShareable?: boolean;
};
