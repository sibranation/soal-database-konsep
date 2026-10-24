const fs = require('fs');
const { HASIL, readJson, nilai, send } = require('./_lib');

const readBody = req => req.body !== undefined
  ? Promise.resolve(typeof req.body === 'string' ? JSON.parse(req.body) : req.body)
  : new Promise((resolve, reject) => {
      let body = '';
      req.on('data', c => { body += c; if (body.length > 1e5) req.destroy(); });
      req.on('end', () => { try { resolve(JSON.parse(body)); } catch (e) { reject(e); } });
    });

module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  let data;
  try { data = await readBody(req); } catch { return send(res, 400, { error: 'JSON tidak valid' }); }
  const nama = String(data?.nama || '').trim();
  const nim = String(data?.nim || '').trim();
  if (!nama || !nim || typeof data.jawaban !== 'object' || !data.jawaban) {
    return send(res, 400, { error: 'Nama, NIM, dan jawaban wajib diisi' });
  }
  const hasil = { nama, nim, ...nilai(data.jawaban), waktu: new Date().toISOString() };
  const semua = readJson(HASIL, []);
  semua.push(hasil);
  try { fs.writeFileSync(HASIL, JSON.stringify(semua, null, 2)); } catch (e) { console.error('gagal simpan hasil', e); }
  send(res, 200, hasil);
};
