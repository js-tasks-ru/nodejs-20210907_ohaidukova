import url from 'url';
import http from 'http';
import path from 'path';
import fs from 'fs';

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (/[/\\]/.test(pathname)) {
    res.statusCode = 400;
    res.end('Nested paths are not supported');
    return;
  }

  switch (req.method) {
    case 'DELETE':
      fs.unlink(filepath, (error: NodeJS.ErrnoException) => {
        if (!error) {
          res.statusCode = 200;
          res.end('File was deleted');
        } else if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File not found');
        } else {
          res.statusCode = 500;
          res.end('Unexpected error');
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

export default server;
