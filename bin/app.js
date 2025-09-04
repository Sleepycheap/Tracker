#! /usr/bin/env_node

import inquirer from "inquirer";
//import { prompt } from "inquirer";
import { select, Separator, input, confirm, number } from "@inquirer/prompts";
import figlet from "figlet";
import { Command } from "commander";
import chalk from "chalk";
import { modifierNames } from "chalk";
import { readFile, writeFile, appendFile } from "fs";
import axios from "axios";
import "dotenv/config";
import { json } from "stream/consumers";
const log = console.log();
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

const headers = {
  Authorization: `Bearer ${process.env.EGNYTE_TOKEN}`,
  "Content-Type": "application/json",
};

const fsUrl = "https://splashtacular.egnyte.com/pubapi/v1/fs/Shared/";
const permUrl = "https://splashtacular.egnyte.com/pubapi/v2/perms/Shared/";

// const params = JSON.stringify({
//   action: "add_folder",
//   //inheritsPermissions: true,
// });

const payLoad = JSON.stringify({ action: "add_folder" });
// const perms = JSON.stringify({

// })

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
  .action(async (options) => {
    console.log("Listing Items...");
    if (options.all) {
      console.log("Including Hidden items");
    }
  });

program
  .command("create")
  .description("Create a new task")
  .option("-t, --type <type>", "specify the item type", "default")
  .action(
    async () => {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Enter the folder name:",
          folderType: await select({
            message: "Select a folder type",
            choices: [
              {
                name: "Project",
                value: "Project",
                description: "Project Folder",
              },
              {
                name: "Restoration & Maintenance",
                value: "Restoration & Maintenance",
                description: "R&M Folder",
              },
              {
                name: "Preliminary",
                value: "Preliminary",
                description: "Preliminary Folder",
              },
            ],
          }),
        },
      ]);
      // appendFile("tasks.json", answers.name + "\r\n", (err) => {
      //   if (err) throw err;
      //   console.log("The data was added to the file");
      // });
      console.log(answers.choices);
      // try {
      //   const res = await fetch(
      //     `https://splashtacular.egnyte.com/pubapi/v1/fs/Shared/ProjectsTest/${answers.name}`,
      //     {
      //       method: "POST",
      //       headers: headers,
      //       body: payLoad,
      //     }
      //   );
      console.log(
        chalk.green.bold.bgWhite(`Successfully created item: ${answers.name}`)
      );
      // } catch (err) {
      //   console.log(
      //     chalk.red.italic.bgYellow(`Can't create folder ${answers.name}! ${err}`)
      //   );
    }
    // }
  );

program.command("test2").action(async () => {
  const testFolder = await select({
    message: "Please select the folder type",
    choices: [
      {
        name: "Projects",
        value: "Projects",
      },
      {
        name: "Restoration & Maintenance",
        value: "Restoration & Maintenance",
      },
      {
        name: "Preliminary",
        value: "Preliminary",
      },
    ],
  });
  const data = testFolder;
  console.log(data.response);
});

program
  .command("permissions")
  .description("Manages permissions to Egnyte folders")
  .action(async () => {
    const folder = await select({
      message: "Please select the folder type",
      choices: [
        {
          name: "Projects",
          value: "Projects",
        },
        {
          name: "Restoration & Maintenance",
          value: "Restoration & Maintenance",
        },
        {
          name: "Preliminary",
          value: "Preliminary",
        },
      ],
    });
    const projectNum = await number({
      message: "Please enter the project number",
    });
    const folderList = await axios.get(fsUrl + folder, { headers });
    const data = folderList.data;
    const folders = data.folders.map((item) => item.name);
    const project = folders.find((f) => f.includes(projectNum));
    //console.log(chalk.redBright(project));
    const confirmation = await confirm({
      message: `Is ${project} the correct folder?`,
    });
    if (confirmation) {
      const perms = await axios.get(permUrl + folder + "/" + project, {
        headers,
      });
      console.log(
        chalk.green.bgWhite(`You have been given access to ${project}`)
      );
      console.log(perms.data);
    }
  });

program
  .command("test")
  .description("Testing calling API from CLI")
  .action(async () => {
    const data = await axios.get(
      "https://splashtacular.egnyte.com/pubapi/v2/perms/Shared/Projects/North Platte, NE - Cody Park Pool - 10825",
      { headers }
    );
    console.log(data.data);
  });

program.parse();

const options = program.opts();
if (options.debug) {
  console.log("Debug mode is enabled");
  console.log("Options:", options);
}
