const { send, semuaHasil } = require('./_lib');

module.exports = async (req, res) => {
  try { send(res, 200, await semuaHasil()); } catch (e) {
    console.error('gagal baca hasil', e);
    send(res, 500, { error: 'Gagal memuat hasil' });
  }
};
