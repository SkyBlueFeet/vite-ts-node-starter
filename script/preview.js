const path = require("path");
const shelljs = require("shelljs");
const { existsSync } = require("fs");

/**
 * @type import('consola').Consola
 */
const consola = require("consola");

process.env.NODE_ENV = "production";

require("./env");

const port = process.env.SERVER_PORT;
const dir = path.resolve(process.env.DEST, process.env.SERVER_DEST);

if (!existsSync(dir)) {
  consola.error("The dest directory was not found");
  process.exit();
}

shelljs.cd(dir);

const child_process = shelljs.exec("npm run start", { async: true });

child_process.on("spawn", () => {
  consola.success(`The application run at http://localhost:${port}`);
});

child_process.on("error", (err) => {
  consola.error(err);
});
