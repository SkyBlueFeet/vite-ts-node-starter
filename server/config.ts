import dotenv from "dotenv";
import path from "path";

dotenv.config();

dotenv.config({
  path: path.resolve(".env." + process.env.NODE_ENV),
});

export const PORT = Number(process.env.SERVER_PORT);
