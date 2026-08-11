const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const bundle = path.join(__dirname, "dist", "app.js");
const source = fs.readFileSync(bundle, "utf8");

// A bundled path of the build machine breaks the CLI on every other machine,
// and is invisible to a smoke test running on the platform that built it.
const bakedPath = source.match(/file:\/\/\/[^"']*/);
assert.strictEqual(
  bakedPath,
  null,
  `dist/app.js contains a build-time path: ${bakedPath}`
);

const help = spawnSync(process.execPath, [path.join(__dirname, "cli.js"), "--help"], {
  encoding: "utf8",
});
assert.strictEqual(
  help.status,
  0,
  `cli.js --help exited with ${help.status}:\n${help.stderr}`
);

console.log("Build verified.");
