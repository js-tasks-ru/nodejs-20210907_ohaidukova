import url from 'url';
import http from 'http';
import path from 'path';
import fs from 'fs';
import LimitSizeStream from '../01-limit-size-stream/LimitSizeStream';
import LimitExceededError from '../01-limit-size-stream/LimitExceededError';

const server = new http.Server();

server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (/[/\\]/.test(pathname)) {
    res.statusCode = 400;
    res.end('Nested paths are not supported');
    return;
  }

  switch (req.method) {
    case 'POST':
      {
        const limitedStream = new LimitSizeStream({
          limit: 1048576,
          encoding: 'utf-8',
        }); // 1 Mb (1024*1024)
        const stream: fs.WriteStream = fs.createWriteStream(filepath, {
          flags: 'wx',
        });
        req.pipe(limitedStream).pipe(stream);

        limitedStream.on('error', (error: LimitExceededError) => {
          if (error.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            res.end(error.message);
          } else {
            res.statusCode = 500;
            res.end('Unexpected error');
          }

          stream.destroy();
          fs.unlink(filepath, (error) => {});
        });

        stream.on('error', (error: NodeJS.ErrnoException) => {
          if (error.code === 'EEXIST') {
            res.statusCode = 409;
            res.end('File exists');
          } else {
            res.statusCode = 500;
            res.end('Unexpected error');
          }
        });

        stream.on('finish', () => {
          res.statusCode = 201;
          res.end('File was saved');
        });

        server.on('connection', function (socket) {
          socket.on('close', function (hadError: boolean) {
            if (hadError) {
              stream.destroy();
              fs.unlink(filepath, (error) => {});
            }
          });
        });

        // req.on('aborted', (err) => {
        //   stream.destroy();
        //   fs.unlink(filepath, (error) => {});
        // });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

export default server;
