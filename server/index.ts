import http from 'http';
import { PORT } from './config';
import { logger } from './utils/log';

const server = http.createServer();

server.listen(PORT, () => {});

server.addListener('request', (req, res) => {
  var html = `<html>
						<head>
							<meta charset="utf-8">
							<title>INDEX</title>
						</head>
							<body>
								<h1>Hello World!</h1>
							</body>
						</html>`;
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(html);
  res.end();
});

server.on('listening', () => {
  logger.info('server is running at http://localhost:' + PORT);
});
server.on('error', function (err) {
  logger.error(err.message);
});
