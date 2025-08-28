// Import library Express untuk membuat server HTTP
const express = require('express');
// Import pino untuk logging
const pino = require('pino');
// Import koneksi database Sequelize
const sequelize = require('./db');
// Import model Account
const Account = require('./models/Account');
// Import fungsi transfer
const { transfer } = require('./services/transfer');
// Import fungsi withdraw
const { withdraw } = require('./services/withdraw');
// Import utilitas retry untuk handle error sementara
const { withRetry } = require('./utils/withRetry');

// Inisialisasi aplikasi Express
const app = express();
// Inisialisasi logger
const logger = pino();
// Middleware untuk parsing JSON body
app.use(express.json());

// Endpoint health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Endpoint untuk menambah saldo akun
app.post('/credit', async (req, res) => {
  try {
    const { id, amount } = req.body;
    const acc = await Account.findByPk(id);
    if (!acc) return res.status(404).json({ error: 'Account not found' });
    acc.balance = (Number(acc.balance) + Number(amount)).toFixed(2);
    await acc.save();
    res.json({ ok: true, account: acc });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint untuk withdraw saldo akun, dengan mekanisme retry
app.post('/withdraw', async (req, res) => {
  try {
    const result = await withRetry(() => withdraw(req.body), { retries: 3, delayMs: 100 });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint untuk transfer saldo antar akun, dengan mekanisme retry
app.post('/transfer', async (req, res) => {
  try {
    const result = await withRetry(() => transfer(req.body), { retries: 3, delayMs: 100 });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Tentukan port server
const PORT = process.env.PORT || 3000;
// Jalankan server dan koneksi ke database
(async () => {
  try {
    await sequelize.authenticate(); // Autentikasi koneksi database
    await sequelize.sync(); // Sinkronisasi model ke database
    app.listen(PORT, () => console.log(`Server running on :${PORT}`)); // Jalankan server
  } catch (err) {
    logger.error(err, 'Failed to start');
    process.exit(1);
  }
})();
