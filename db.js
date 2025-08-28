// Inisialisasi dan konfigurasi koneksi Sequelize ke database MySQL
require('dotenv').config(); // Load variabel lingkungan dari .env
const { Sequelize } = require('sequelize');

// Membuat instance Sequelize dengan parameter dari environment variable
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nama database
  process.env.DB_USER, // Username database
  process.env.DB_PASS, // Password database
  {
    host: process.env.DB_HOST, // Host database
    port: Number(process.env.DB_PORT || 3306), // Port database
    dialect: 'mysql', // Dialek database
    logging: false, // Nonaktifkan logging query SQL
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }, // Konfigurasi pool koneksi
  }
);

module.exports = sequelize; // Ekspor instance sequelize
