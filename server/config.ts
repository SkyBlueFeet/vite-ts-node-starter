import dotenv from "dotenv";
import path from "path";

dotenv.config();

dotenv.config({
  path: path.resolve(".env." + process.env.NODE_ENV),
});

export const PORT = Number(process.env.SERVER_PORT);
export const NODE_ENV = process.env.NODE_ENV;
export const CLIENT_PORT = Number(process.env.CLIENT_PORT);
export const SERVER_PORT = Number(process.env.SERVER_PORT);
export const DEST = process.env.DEST;
export const CLIENT_DEST = process.env.CLIENT_DEST;
