const finalHandler = require("finalhandler");
const staticServe = require("serve-static");
const http = require("http");
const path = require("path");

/**
 * @type import('consola').Consola
 */
const consola = require("consola");

require("./env");

const port = 8080;

const serve = staticServe(`${process.env.DEST}/client`, {
  index: "index.html",
});

const server = http.createServer(function (req, res) {
  serve(req, res, finalHandler(req, res));
});

server.listen(port);

server.on("listening", () => {
  consola.success(`The application run at http://localhost:${port}`);
});

server.on("error", (err) => {
  consola.error(err.message);
});

require(path.resolve(
  process.env.DEST,
  process.env.SERVER_DEST,
  process.env.FILE_NAME
));
