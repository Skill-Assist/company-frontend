export type Candidate = {
  id: number;
  email: string;
  name?: string;
  nickname?: string;
  logo?: string;
  status:
    | "pending"
    | "accepted"
    | "expired"
    | "denied"
    | "started"
    | "finished";
  aiScore?: string | null;
  answerSheet?: number;
};
