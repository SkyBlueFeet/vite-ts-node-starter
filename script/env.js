const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

dotenv.config({
  path: path.resolve(".env." + process.env.NODE_ENV),
});
