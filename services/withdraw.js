const sequelize = require('../db');
const Account = require('../models/Account');

// Fungsi withdraw untuk menarik saldo dari akun dengan transaksi dan pessimistic locking
async function withdraw({ id, amount }) {
  const t = await sequelize.transaction(); // Mulai transaksi database
  try {
    const amt = Number(amount); if (!(amt > 0)) throw new Error('Invalid amount'); // Validasi amount harus angka positif
    // Ambil akun dengan lock UPDATE (pessimistic locking)
    const acc = await Account.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE }); 
    if (!acc) throw new Error('Account not found'); // Validasi akun ditemukan
    const bal = Number(acc.balance); if (bal < amt) throw new Error('Insufficient balance'); // Cek saldo cukup
    acc.balance = (bal - amt).toFixed(2); // Update saldo akun
    await acc.save({ transaction: t }); // Simpan perubahan saldo dalam transaksi
    await t.commit(); // Commit transaksi jika sukses
    return { ok: true, id, amount: amt }; // Return hasil withdraw
  } catch (err) {
    await t.rollback(); // Rollback transaksi jika error
    throw err; // Lempar error ke atas
  }
}

// Jenis locking: PESSIMISTIC LOCKING digunakan pada baris 'lock: t.LOCK.UPDATE'

module.exports = { withdraw };
