export type User = {
  id: number,
  name: string,
  email: string,
  roles: string[],
  logo: string,
  color: string,
  ownedQuestions?: string[]
};
