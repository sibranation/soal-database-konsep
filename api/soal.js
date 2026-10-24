const { SOAL, readJson, send } = require('./_lib');

module.exports = (req, res) => send(res, 200, readJson(SOAL, []).map(({ jawaban, ...s }) => s));
