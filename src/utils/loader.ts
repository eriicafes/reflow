import ora from "ora";

export const createLoader = (name: string) => ora(name);
