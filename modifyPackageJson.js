const editJsonFile = require("edit-json-file");
const yargs = require("yargs");

/**
 * Setup command-line options.
 * Run `node <app> --help` to list all the options.
 */
const argv = yargs(process.argv.slice(2)).options({
  scope: {
    alias: "s",
    default: "@fdmg",
    description: "NPM Package organisation scope: @fdmg | @fdmediagroep",
    requiresArg: true,
    required: true,
  },
  verbose: {
    alias: "v",
    description: "Debug",
    requiresArg: false,
    required: false,
  },
}).argv;

let file = editJsonFile(`${__dirname}/package.json`);

file.set("name", `${argv.scope}/imgix-upload`);
file.save();
