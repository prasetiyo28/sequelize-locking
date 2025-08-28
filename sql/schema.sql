-- Membuat database dan user untuk aplikasi
CREATE DATABASE IF NOT EXISTS sequelize_tx_demo CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER IF NOT EXISTS 'demo'@'%' IDENTIFIED BY 'demopass';
GRANT ALL PRIVILEGES ON sequelize_tx_demo.* TO 'demo'@'%';
FLUSH PRIVILEGES;

-- Menggunakan database yang baru dibuat
USE sequelize_tx_demo;

-- Schema untuk tabel Account
CREATE TABLE IF NOT EXISTS `Accounts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `balance` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
