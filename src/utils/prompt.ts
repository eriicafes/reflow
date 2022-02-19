import inquirer from "inquirer"

const Prompt = inquirer.createPromptModule()

export const prompt = async (questions: inquirer.QuestionCollection<inquirer.Answers>) => {
    const result = await Prompt(questions)

    return result
}