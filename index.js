"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var inquirer_1 = __importDefault(require("inquirer"));
var exitWithError = function (error) {
    console.error(error);
    process.exit(1);
};
var newDir = function (name) {
    return new Promise(function (resolve, reject) {
        fs_1.default.mkdir(path_1.default.join(__dirname, name), function () {
            resolve();
        });
    });
};
var newFile = function (name, ext) {
    return new Promise(function (resolve, reject) {
        // - Styles - //
        if (ext === "scss") {
            var newFile_1 = fs_1.default.createWriteStream(name + "." + ext);
            newFile_1.on("close", function () {
                resolve();
            });
        }
        if (name.includes(".style") && ext !== "scss")
            fs_1.default.copyFile("../blueprints/style.js", name + "." + ext, function (err) {
                if (err)
                    return exitWithError(err);
                else
                    resolve();
            });
        // - React - //
        if (ext.includes("x") && name !== ".test")
            fs_1.default.copyFile("../blueprints/component." + ext, name + "." + ext, function (err) {
                if (err)
                    return exitWithError(err);
                else
                    resolve();
            });
        // - To Do - Finish Testing files here - //
        // if (name.includes(".test")) {
        //   fs.copyFile(`../blueprints/components`);
        // }
        // - Reducer - //
        if (name === "reducer") {
            var newFile_2 = fs_1.default.createWriteStream("reducer." + ext);
            newFile_2.on("close", function () {
                resolve();
            });
        }
    });
};
var questions = [
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
inquirer_1.default
    .prompt(questions)
    .then(function (answers) {
    return newDir(answers.name)
        .then(function () { return answers; })
        .catch(function (error) { return exitWithError(error); });
})
    .then(function (_a) {
    var language = _a.language, name = _a.name, reducer = _a.reducer, style = _a.style, test = _a.test;
    var ext = language === "TypeScript" ? "ts" : "js";
    process.chdir(path_1.default.join(__dirname, name));
    return Promise.all([
        newFile(name, ext + "x"),
        newFile("" + (style === "SCSS" ? "_" : "") + name + ".style", "" + (style === "SCSS" ? "scss" : ext)),
        reducer && newFile("reducer", ext),
        test && newDir(name + "/__tests__").then(function () { return newFile("__tests__/" + name + ".test", ext + "x"); })
    ])
        .then(function () { return ({ name: name, ext: ext }); })
        .catch(function (error) { return exitWithError(error); });
})
    .then(function (_a) {
    var name = _a.name, ext = _a.ext;
    var filePath = name + "/" + name + "." + ext + "x";
    fs_1.default.readFile(filePath, "utf8", function (err, fileContents) {
        var newContents = fileContents.replace(/REPLACE_ME/g, name);
        if (err)
            exitWithError(err);
        else
            return fs_1.default.writeFile(filePath, newContents, "utf8", function (err) {
                if (err)
                    return exitWithError(err);
                else {
                    console.log("he;;lo");
                    return process.exit(0);
                }
            });
    });
})
    .catch(function (error) { return exitWithError(error); });
