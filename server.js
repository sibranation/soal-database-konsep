const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const SOAL = path.join(__dirname, 'data', 'soal.json');
const HASIL = path.join(__dirname, 'data', 'hasil.json');

const readJson = (file, fallback) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
};

const send = (res, code, body, type = 'application/json') => {
  res.writeHead(code, { 'Content-Type': type });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
};

// Score answers against the key; key never leaves the server.
function nilai(jawaban) {
  const soal = readJson(SOAL, []);
  const benar = soal.filter(s => jawaban[s.id] === s.jawaban).length;
  return { benar, total: soal.length, skor: Math.round((benar / soal.length) * 100) };
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    return send(res, 200, fs.readFileSync(path.join(__dirname, 'index.html')), 'text/html; charset=utf-8');
  }
  if (req.method === 'GET' && req.url === '/api/soal') {
    return send(res, 200, readJson(SOAL, []).map(({ jawaban, ...s }) => s));
  }
  if (req.method === 'POST' && req.url === '/api/submit') {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 1e5) req.destroy(); });
    req.on('end', () => {
      let data;
      try { data = JSON.parse(body); } catch { return send(res, 400, { error: 'JSON tidak valid' }); }
      const nama = String(data.nama || '').trim();
      const nim = String(data.nim || '').trim();
      if (!nama || !nim || typeof data.jawaban !== 'object' || !data.jawaban) {
        return send(res, 400, { error: 'Nama, NIM, dan jawaban wajib diisi' });
      }
      const hasil = { nama, nim, ...nilai(data.jawaban), waktu: new Date().toISOString() };
      const semua = readJson(HASIL, []);
      semua.push(hasil);
      fs.writeFileSync(HASIL, JSON.stringify(semua, null, 2));
      send(res, 200, hasil);
    });
    return;
  }
  send(res, 404, { error: 'Not found' });
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`Kuis jalan di http://localhost:${PORT}`));
}

module.exports = { nilai };
