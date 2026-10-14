"use strict";
const fs = require("node:fs"),
  path = require("node:path"),
  { spawnSync } = require("node:child_process");
const files = fs
  .readdirSync(__dirname)
  .filter((file) => file.endsWith(".cjs") && file !== "run.cjs")
  .sort();
for (const file of files) {
  console.log("\n" + file);
  const result = spawnSync(process.execPath, [path.join(__dirname, file)], { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log("\nTodas as suítes passaram.");
