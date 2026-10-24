const http = require('http');
const fs = require('fs');
const path = require('path');
const soal = require('./api/soal');
const submit = require('./api/submit');
const hasil = require('./api/hasil');

const PORT = process.env.PORT || 3000;

// Local dev server; on Vercel, index.html is static and api/*.js are functions.
http.createServer((req, res) => {
  const page = { '/': 'index.html', '/hasil': 'hasil.html' }[req.url];
  if (req.method === 'GET' && page) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(path.join(__dirname, page)));
  }
  if (req.url === '/api/soal') return soal(req, res);
  if (req.url === '/api/submit') return submit(req, res);
  if (req.url === '/api/hasil') return hasil(req, res);
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
}).listen(PORT, () => console.log(`Kuis jalan di http://localhost:${PORT}`));
