type User = {
  id: number,
  name: string,
  email: string,
  roles: string[],
  logo: string,
  ownedQuestions?: string[]
};
