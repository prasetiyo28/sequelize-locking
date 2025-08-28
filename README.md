# Demo Project: Sequelize Transaction Locking

Proyek ini adalah contoh aplikasi Node.js yang mendemonstrasikan penggunaan transaksi database dan locking (pessimistic locking) menggunakan Sequelize ORM pada MySQL. Studi kasus: transfer saldo antar akun bank secara aman dan konsisten.

## Fitur Utama
- Transfer saldo antar akun dengan transaksi dan locking
- Withdraw dan credit saldo akun
- Penanganan race condition dengan retry dan locking
- API berbasis Express

## Struktur Folder
- `models/Account.js` — Model Sequelize untuk tabel akun
- `services/transfer.js` — Logika transfer saldo (pessimistic locking)
- `services/withdraw.js` — Logika withdraw saldo
- `utils/withRetry.js` — Utility untuk retry otomatis
- `server.js` — HTTP API server (Express)
- `db.js` — Koneksi database
- `sql/schema.sql` — Skrip pembuatan database & tabel
- `scripts/seed.js` — Seed data akun awal
- `scripts/concurrency.js` — Simulasi transfer bersamaan (opsional demo race condition)

## Langkah Demo

1. **Clone & Install**
   ```sh
   git clone <repo-url>
   cd sequelize-tx-locking-demo
   npm install
   ```

2. **Setup Database**
   - Jalankan MySQL dan login sebagai root.
   - Jalankan skrip SQL:
     ```sh
     mysql -u root -p < sql/schema.sql
     ```
   - (Opsional) Edit `.env` jika perlu.

3. **Seed Data Akun**
   ```sh
   node scripts/seed.js
   ```

4. **Jalankan Server**
   ```sh
   node server.js
   ```
   Server berjalan di port 3000 (atau sesuai `.env`).

5. **Test API**
   - Cek health: `GET /health`
   - Tambah saldo: `POST /credit` `{ "id": 1, "amount": 100 }`
   - Withdraw: `POST /withdraw` `{ "id": 1, "amount": 50 }`
   - Transfer: `POST /transfer` `{ "fromId": 1, "toId": 2, "amount": 10 }`

6. **Simulasi Race Condition (Opsional)**
   Jalankan:
   ```sh
   node scripts/concurrency.js
   ```
   Untuk melihat efek locking pada transfer bersamaan.

## Catatan
- Koneksi DB diatur lewat file `.env`.
- Locking yang digunakan: `pessimistic locking` (lihat `services/transfer.js`).
- Pastikan MySQL sudah berjalan dan user sudah dibuat sesuai `.env`.

---

Jika ada pertanyaan atau error, silakan cek log di terminal atau file kode terkait.
