/**
  This small script strips the `atomTranspilers` key from the repos `package.json`.
  Which prevents the editor (Pulsar) from trying to transpile the package at
  startup time, which is unnecessary and redudant on a 'pretranspiled' tag of the
  package. Should save some CPU cycles.
*/

const fs = require("node:fs");

const pkgJSON = JSON.parse(fs.readFileSync("./package.json", { encoding: "utf8" }));

delete pkgJSON.atomTranspilers;

fs.writeFileSync("./package.json", JSON.stringify(pkgJSON, null, 2) + '\n', { encoding: "utf8" });
