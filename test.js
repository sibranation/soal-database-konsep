const assert = require('assert');
const soal = require('./data/soal.json');
const { nilai } = require('./api/_lib');

assert.strictEqual(soal.length, 15);
const semuaBenar = Object.fromEntries(soal.map(s => [s.id, s.jawaban]));
assert.deepStrictEqual(nilai(semuaBenar), { benar: 15, total: 15, skor: 100 });
assert.deepStrictEqual(nilai({}), { benar: 0, total: 15, skor: 0 });
assert.strictEqual(nilai({ ...semuaBenar, 1: 0, 2: 0 }).skor, 87);
console.log('ok');
