import { createPromptModule, QuestionCollection } from "inquirer";

const Prompt = createPromptModule();

export const prompt = async (questions: QuestionCollection) => {
  const result = await Prompt(questions);

  return result;
};
