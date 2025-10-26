export type UserSubmitCode = {
  problemID: number;
  sourceCode: string;
  languageId: number;
};

export type UserRunCode = UserSubmitCode & {
  testcases: string;
};
