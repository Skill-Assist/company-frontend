type User = {
  id: number,
  name: string,
  email: string,
  roles: string[],
  ownedQuestions?: string[]
};
