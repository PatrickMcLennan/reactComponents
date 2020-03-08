import fs from "fs";
import path from "path";
import inquirer from "inquirer";

interface IAnswers {
  name: String;
  language: string;
  style: string;
  test: boolean;
}

interface IQuestion {
  type: string;
  name: string;
  message: string;
  choices?: string[];
  default?: string[];
}

const exitWithError: Function = (error: Error) => {
  console.error(error);
  process.exit(1);
};

const newDir = (name: string) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path.join(__dirname, name), () => {
      resolve();
    });
  });
};

const newFile = (name: string, ext: string) => {
  return new Promise((resolve, reject) => {
    // - Styles - //
    if (ext === "scss") {
      const newFile: fs.WriteStream = fs.createWriteStream(`${name}.${ext}`);
      newFile.on("close", () => {
        resolve();
      });
    }
    if (name.includes(".style") && ext !== "scss")
      fs.copyFile("../blueprints/style.js", `${name}.${ext}`, (err: Error | null) => {
        if (err) return exitWithError(err);
        else resolve();
      });
    // - React - //
    if (ext.includes("x"))
      fs.copyFile(`../blueprints/component.${ext}`, `${name}.${ext}`, (err: Error | null) => {
        if (err) return exitWithError(err);
        else resolve();
      });
    // - Reducer - //
    if (name === "reducer") {
      const newFile: fs.WriteStream = fs.createWriteStream(`reducer.${ext}`);
      newFile.on("close", () => {
        resolve();
      });
    }
  });
};

const questions: IQuestion[] = [
  {
    type: "input",
    name: "name",
    message: "Component Name?"
  },
  {
    type: "list",
    name: "language",
    message: "TypeScript or JavaScript?",
    choices: ["JavaScript", "TypeScript"],
    default: ["JavaScript"]
  },
  {
    type: "list",
    name: "style",
    message: "SCSS or stlyled-components?",
    choices: ["SCSS", "styled-components"],
    default: ["styled-components"]
  },
  {
    type: "confirm",
    name: "reducer",
    message: "Do you want a reducer?"
  },
  {
    type: "confirm",
    name: "test",
    message: "Will this be tested?"
  }
];

inquirer
  .prompt(questions)
  .then((answers: any) => {
    newDir(answers.name);
    return answers;
  })
  .then(({ language, name, reducer, style, test }: any) => {
    const ext: string = language === "TypeScript" ? "ts" : "js";
    process.chdir(path.join(__dirname, name));
    return Promise.all([
      newFile(name, `${ext}x`),
      newFile(`${style === "SCSS" ? "_" : ""}${name}.style`, `${style === "SCSS" ? "scss" : ext}`),
      reducer && newFile(`reducer`, ext),
      test && newDir(`${name}/__tests__`).then(() => newFile(`__tests__/${name}.test`, ext))
    ]).catch(error => exitWithError(error));
  })
  .catch((error: Error) => exitWithError(error));
