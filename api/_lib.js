const fs = require('fs');
const path = require('path');

const SOAL = path.join(__dirname, '..', 'data', 'soal.json');
// ponytail: Vercel filesystem read-only except /tmp (ephemeral, lost on cold start); swap for a real DB if results must persist there
const HASIL = process.env.VERCEL ? '/tmp/hasil.json' : path.join(__dirname, '..', 'data', 'hasil.json');

const readJson = (file, fallback) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
};

// Score answers against the key; key never leaves the server.
function nilai(jawaban) {
  const soal = readJson(SOAL, []);
  const benar = soal.filter(s => jawaban[s.id] === s.jawaban).length;
  return { benar, total: soal.length, skor: Math.round((benar / soal.length) * 100) };
}

const send = (res, code, body) => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

module.exports = { SOAL, HASIL, readJson, nilai, send };
