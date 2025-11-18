-- MucizeOl başlangıç şeması

-- Roller tablosunu oluştur
CREATE TABLE roles (
    role_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Kullanıcı bilgilerini tut
CREATE TABLE users (
    user_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    refresh_token_expires_at DATETIME,
    phone_number VARCHAR(20) NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Şehir lookup tablosu
CREATE TABLE cities (
    city_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    city_name VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hayvan türleri tablosu
CREATE TABLE animal_types (
    type_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hayvan cinslerini tut
CREATE TABLE animal_breeds (
    breed_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    type_id INT UNSIGNED NOT NULL,
    breed_name VARCHAR(120) NOT NULL,
    CONSTRAINT fk_breeds_type FOREIGN KEY (type_id) REFERENCES animal_types (type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- İlan kayıtlarını oluştur
CREATE TABLE listings (
    listing_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    animal_type_id INT UNSIGNED NOT NULL,
    animal_breed_id INT UNSIGNED NOT NULL,
    city_id INT UNSIGNED NOT NULL,
    age TINYINT UNSIGNED NOT NULL,
    gender ENUM ('Erkek','Dişi') NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Mevcut',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_listings_user FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_listings_city FOREIGN KEY (city_id) REFERENCES cities (city_id),
    CONSTRAINT fk_listings_type FOREIGN KEY (animal_type_id) REFERENCES animal_types (type_id),
    CONSTRAINT fk_listings_breed FOREIGN KEY (animal_breed_id) REFERENCES animal_breeds (breed_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sahiplenme talepleri tablosu
CREATE TABLE adoption_requests (
    request_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    listing_id BIGINT UNSIGNED NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Beklemede',
    request_message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_request_user_listing UNIQUE (user_id, listing_id),
    CONSTRAINT fk_requests_user FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_requests_listing FOREIGN KEY (listing_id) REFERENCES listings (listing_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Varsayılan roller ekle
INSERT INTO roles (role_id, role_name)
VALUES (1, 'ROLE_USER'), (2, 'ROLE_ADMIN')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

-- Büyük şehirler ekle
INSERT INTO cities (city_name) VALUES
('İstanbul'), ('Ankara'), ('İzmir'), ('Antalya'), ('Bursa');

-- Hayvan türlerini ekle
INSERT INTO animal_types (type_name) VALUES
('Kedi'), ('Köpek');

-- Kedi cinsleri (type_id = 1)
INSERT INTO animal_breeds (type_id, breed_name) VALUES
(1, 'Tekir'),
(1, 'Van Kedisi'),
(1, 'British Shorthair'),
(1, 'Scottish Fold'),
(1, 'Melez');

-- Köpek cinsleri (type_id = 2)
INSERT INTO animal_breeds (type_id, breed_name) VALUES
(2, 'Golden Retriever'),
(2, 'Kangal'),
(2, 'Husky'),
(2, 'Bulldog'),
(2, 'Melez');

