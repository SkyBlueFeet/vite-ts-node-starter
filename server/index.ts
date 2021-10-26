import express from 'express';
import { staticServer } from './middlewares/serve';

const app = express();

import {
  PORT,
  NODE_ENV,
  CLIENT_PORT,
  CLIENT_DEST,
  SERVER_PORT,
} from './config';
import { logger } from './utils/log';

app.use(staticServer(NODE_ENV, CLIENT_PORT, CLIENT_DEST));

app.use(process.env.API_PROFIX, (req, res) => {
  res.send({ api: req.path });
});

app.listen(PORT, () => {
  logger.info(`The application is run at http://localhost:${PORT}`);
});
