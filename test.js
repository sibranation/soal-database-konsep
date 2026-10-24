const assert = require('assert');
const soal = require('./data/soal.json');
const { nilai } = require('./api/_lib');

assert.strictEqual(soal.length, 20);
const semuaBenar = Object.fromEntries(soal.map(s => [s.id, s.jawaban]));
assert.deepStrictEqual(nilai(semuaBenar), { benar: 20, total: 20, skor: 100 });
assert.deepStrictEqual(nilai({}), { benar: 0, total: 20, skor: 0 });
assert.strictEqual(nilai({ ...semuaBenar, 1: 0, 2: 0 }).skor, 90);
console.log('ok');
