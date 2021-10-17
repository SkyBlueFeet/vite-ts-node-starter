import ServeStatic from "serve-static";
import { logger } from "server/utils/log";
import { Request, Response, NextFunction, Handler } from "express";
import path from "path";
import fs from "fs";

export function staticServer(
  NODE_ENV: string,
  CLIENT_PORT: number,
  CLIENT_DEST: string
) {
  let ware: Handler;

  if (NODE_ENV === "development") {
    ware = function (req: Request, res: Response, next: NextFunction) {
      if (req.path.startsWith(process.env.API_PROFIX, 0)) {
        next();
      } else {
        const url = `http://localhost:${CLIENT_PORT}`;
        logger.info(
          `In development mode, the application will not handle the path ${req.path} and will be redirected to the ${url}`
        );
        res.redirect(url);
      }
    };
  } else {
    const WebrootPath = path.resolve(CLIENT_DEST);
    const stat = fs.statSync(WebrootPath);

    if (!stat.isDirectory()) {
      fs.mkdirSync(WebrootPath);
    }

    ware = ServeStatic(WebrootPath, { index: ["index.html", "index.htm"] });
  }

  return ware;
}
