import express from 'express'
import {staticServer} from './middlewares/serve'

import {CLIENT_DEST, CLIENT_PORT, NODE_ENV, PORT} from './config'
import {logger} from './utils/log'

const app = express()

app.use(staticServer(NODE_ENV, CLIENT_PORT, CLIENT_DEST))

app.use("/api", (req, res) => {
  res.send({api: req.path})
})

app.listen(PORT, () => {
  logger.info(`The application is run at http://localhost:${PORT}`)
})
