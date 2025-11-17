-- MySQL Veritabanı Oluşturma Scripti
-- Bu script, Docker container ilk kez ayağa kalkarken çalıştırılır.

CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};

GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';

FLUSH PRIVILEGES;
