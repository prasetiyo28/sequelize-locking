// Import Transaction class dari Sequelize
const { Transaction } = require('sequelize');
// Import instance koneksi database
const sequelize = require('../db');
// Import model Account
const Account = require('../models/Account');

// Fungsi transfer untuk memindahkan saldo antar akun
async function transfer({ fromId, toId, amount }) {
  // Tidak boleh transfer ke akun sendiri
  if (fromId === toId) throw new Error('Cannot transfer to the same account');
  // Validasi amount harus angka positif
  const amt = Number(amount); if (!(amt > 0)) throw new Error('Invalid amount');
  // Mulai transaksi database dengan isolation level READ_COMMITTED
  return sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED }, async (t) => {
    // Urutkan ID untuk konsistensi pengambilan data
    const ids = [fromId, toId].sort((a, b) => Number(a) - Number(b));
    // Ambil kedua akun dengan lock UPDATE (pessimistic locking)
    const accounts = await Account.findAll({ where: { id: ids }, transaction: t, lock: t.LOCK.UPDATE });
    // Temukan objek akun asal dan tujuan
    const from = accounts.find(a => a.id === fromId); 
    const to = accounts.find(a => a.id === toId);
    // Validasi akun ditemukan
    if (!from || !to) throw new Error('Account not found');
    // Cek saldo akun asal cukup
    const fromBal = Number(from.balance); 
    if (fromBal < amt) throw new Error('Insufficient balance');
    // Update saldo kedua akun
    from.balance = (fromBal - amt).toFixed(2); to.balance = (Number(to.balance) + amt).toFixed(2);
    // Simpan perubahan saldo dalam transaksi
    // Tunggu 1 menit sebelum update saldo
   
    // Tunggu 60 detik sebelum update saldo
    await new Promise(resolve => setTimeout(resolve, 60000));
    await from.save({ transaction: t }); 
    await to.save({ transaction: t });
    // Return hasil transfer
   
    return { ok: true, fromId, toId, amount: amt };
  });
}
// Ekspor fungsi transfer
module.exports = { transfer };
