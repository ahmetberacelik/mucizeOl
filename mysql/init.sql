-- MySQL Veritabanı Oluşturma Scripti
-- Bu script, Docker container ilk kez ayağa kalkarken çalıştırılır.

-- Veritabanını mucizeol_db değeriyle oluştur
CREATE DATABASE IF NOT EXISTS `mucizeol_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'mucizeol_user'@'%' IDENTIFIED BY 's0m3_s3cur3_4pp_p4ssw0rd';
GRANT ALL PRIVILEGES ON `mucizeol_db`.* TO 'mucizeol_user'@'%';

FLUSH PRIVILEGES;