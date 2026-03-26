import http from 'node:http';
import handler from './contact.js';

const port = Number(process.env.PORT || 3000);

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;
  if (pathname !== '/api/contact' && pathname !== '/api/contact/') {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, message: 'Not found' }));
    return;
  }
  Promise.resolve(handler(req, res)).catch((err) => {
    console.error(err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ ok: false, message: 'Internal server error' }));
    }
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Contact API listening on ${port}`);
});
