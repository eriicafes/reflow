import inquirer from "inquirer"

const Prompt = inquirer.createPromptModule()

export const prompt = async (questions: inquirer.QuestionCollection) => {
    const result = await Prompt(questions)

    return result
}