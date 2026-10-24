const fs = require('fs');
const path = require('path');

const SOAL = path.join(__dirname, '..', 'data', 'soal.json');
const HASIL = path.join(__dirname, '..', 'data', 'hasil.json');

// Upstash Redis (Vercel Marketplace) env names; without them, results go to the local JSON file.
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const readJson = (file, fallback) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
};

async function redis(...command) {
  const res = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    body: JSON.stringify(command)
  });
  const body = await res.json();
  if (!res.ok || body.error) throw new Error(body.error || `Redis HTTP ${res.status}`);
  return body.result;
}

async function simpanHasil(hasil) {
  if (REDIS_URL) return redis('RPUSH', 'hasil', JSON.stringify(hasil));
  const semua = readJson(HASIL, []);
  semua.push(hasil);
  fs.writeFileSync(HASIL, JSON.stringify(semua, null, 2));
}

async function semuaHasil() {
  if (REDIS_URL) return (await redis('LRANGE', 'hasil', 0, -1)).map(s => JSON.parse(s));
  return readJson(HASIL, []);
}

// Score answers against the key; key never leaves the server.
function nilai(jawaban) {
  const soal = readJson(SOAL, []);
  const benar = soal.filter(s => jawaban[s.id] === s.jawaban).length;
  return { benar, total: soal.length, skor: Math.round((benar / soal.length) * 100) };
}

const send = (res, code, body) => {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
};

module.exports = { SOAL, readJson, nilai, send, simpanHasil, semuaHasil };
