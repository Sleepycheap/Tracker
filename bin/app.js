#! /usr/bin/env_node

import inquirer from "inquirer";
import figlet from "figlet";
import { Command } from "commander";
import chalk from "chalk";
import { readFile, writeFile, appendFile } from "fs";
const program = new Command();
function showError(message) {
  console.error(chalk.red.bold(`Error: ${message}`));
  process.exit(1);
}
const validTypes = ["default", "special", "custom"];
const path = "./tasks.json";
// figlet("Tracker CLI", function (err, data) {
//   console.log(data);
// });

// const saveTask = function readFile(path, (err, data) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   const parsedData = JSON.parse(data);
//   parsedData.createdAt = new Date().toISOString();
//   writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
//     if (err) {
//       console.log("Failed to write updated data to file");
//       return;
//     }
//     console.log("Updated file successfully");
//   });
// });

program
  .name("CLI Project")
  .description("A CLI Application built with Commander")
  .version("1.00")
  .option("-d, --debug", "output extra debugging information")
  .option("-f, --file <path>", "specify the file to process")
  .option("-t, --timeout <seconds>", "specify the timeout in seconds", "60")
  .option("-v, --verbose", "enable verbose output");

program
  .command("list")
  .description("list all items")
  .option("-a, --all", "list all items, including hidden oners")
  .action((options) => {
    console.log("Listing Items...");
    if (options.all) {
      console.log("Including Hidden items");
    }
  });

program
  .command("create")
  .description("Create a new task")
  .option("-t, --type <type>", "specify the item type", "default")
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the task name:",
        validate: (input) =>
          input.length >= 3
            ? true
            : "The name must be at least 3 characters long.",
      },
    ]);
    appendFile("tasks.json", answers.name, (err) => {
      if (err) throw err;
      console.log("The data was added to the file");
    });
    console.log(chalk.green(`Successfully created item: ${answers.name}`));
  });

program.parse();

const options = program.opts();
if (options.debug) {
  console.log("Debug mode is enabled");
  console.log("Options:", options);
}
