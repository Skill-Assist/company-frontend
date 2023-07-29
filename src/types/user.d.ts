export type User = {
  id: number,
  name: string,
  nickname: string,
  email: string,
  mobilePhone: string,
  nationalId: string,
  roles: string[],
  logo: string,
  color: string,
  ownedQuestions?: string[]
};
