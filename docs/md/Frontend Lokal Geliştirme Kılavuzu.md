# Frontend Lokal Geliştirme Kılavuzu

## 📋 İçindekiler
1. [Ön Gereksinimler](#ön-gereksinimler)
2. [Backend'i Ayağa Kaldırma](#backendi-ayağa-kaldırma)
3. [API Endpoint'leri](#api-endpointleri)
4. [Kullanım Örnekleri](#kullanım-örnekleri)
5. [Hata Durumları](#hata-durumları)
6. [Sorun Giderme](#sorun-giderme)

---

## 🔧 Ön Gereksinimler

Backend'i çalıştırmak için bilgisayarınızda şunlar yüklü olmalı:

- **Docker Desktop** (Windows/Mac) veya **Docker + Docker Compose** (Linux)
- **Git** (projeyi klonlamak için)

### Docker Desktop Kurulumu

**Windows/Mac için:**
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) adresinden indirin
2. Kurulumu tamamlayın ve Docker Desktop'u başlatın
3. Terminal/CMD'de doğrulayın:
```bash
docker --version
docker-compose --version
```

---

## 🚀 Backend'i Ayağa Kaldırma

### Adım 1: Projeyi Klonlayın
```bash
git clone <repo-url>
cd mucizeOl
```

### Adım 2: Docker Container'ları Başlatın
```bash
docker-compose up -d --build
```

Bu komut şunları yapar:
- MySQL veritabanını oluşturur
- Auth Service'i başlatır (Port: 8081)
- Listing Service'i başlatır (Port: 8082)
- API Gateway'i başlatır (Port: 8080)
- phpMyAdmin'i başlatır (Port: 8090)

⏳ **İlk çalıştırmada 2-3 dakika sürebilir** (Docker image'ları indirilecek ve build edilecek)

### Adım 3: Servislerin Durumunu Kontrol Edin
```bash
docker-compose ps
```

**Çıktı şuna benzer olmalı:**
```
NAME                     STATUS    PORTS
mucizeol-auth-service    Up        0.0.0.0:8081->8081/tcp
mucizeol-gateway         Up        0.0.0.0:8080->8080/tcp
mucizeol-listing-service Up        0.0.0.0:8082->8082/tcp
mucizeol-mysql           Up        0.0.0.0:3306->3306/tcp
phpmyadmin               Up        0.0.0.0:8090->80/tcp
```

---

## 🌐 API Endpoint'leri

### Base URL
Tüm API istekleri API Gateway üzerinden yapılır:
```
http://localhost:8080
```

### Servisler

| Servis | Port (Doğrudan Erişim) | Gateway Path |
|--------|------------------------|--------------|
| API Gateway | 8080 | - |
| Auth Service | 8081 | `/api/v1/auth/**` |
| Listing Service | 8082 | `/api/v1/listings/**`, `/api/v1/meta/**` |
| phpMyAdmin | 8090 | - |

⚠️ **Önemli:** Frontend uygulamanız **sadece Gateway (8080)** üzerinden istek atmalıdır!

---

## 📚 Kullanım Örnekleri

### 1️⃣ Kullanıcı Kaydı (Register)

**Endpoint:**
```
POST http://localhost:8080/api/v1/auth/register
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "password": "Sifre123!",
  "phoneNumber": "5551234567"
}
```

**Response (201 Created):**
```json
{
  "userId": 1,
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "phoneNumber": "5551234567",
  "roleName": "ROLE_USER"
}
```

---

### 2️⃣ Kullanıcı Girişi (Login)

**Endpoint:**
```
POST http://localhost:8080/api/v1/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "ahmet@example.com",
  "password": "Sifre123!"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjQwMDAwMDAwLCJleHAiOjE2NDAwMDM2MDAsImVtYWlsIjoiYWhtZXRAZXhhbXBsZS5jb20iLCJyb2xlIjoiUk9MRV9VU0VSIn0.abc123...",
  "refreshToken": "1.abc123def456..."
}
```

⚠️ **Önemli:** `accessToken`'ı kaydedin! Diğer korumalı endpoint'ler için gerekli.

---

### 3️⃣ Token Yenileme (Refresh Token)

**Endpoint:**
```
POST http://localhost:8080/api/v1/auth/refresh
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "1.abc123def456..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "1.newtoken..."
}
```

---

### 4️⃣ Şehir Listesini Getirme (Public)

**Endpoint:**
```
GET http://localhost:8080/api/v1/meta/cities
```

**Headers:** Yok (Public endpoint)

**Response (200 OK):**
```json
[
  { "cityId": 1, "cityName": "İstanbul" },
  { "cityId": 2, "cityName": "Ankara" },
  { "cityId": 3, "cityName": "İzmir" },
  { "cityId": 4, "cityName": "Antalya" },
  { "cityId": 5, "cityName": "Bursa" }
]
```

---

### 5️⃣ Hayvan Türlerini Getirme (Public)

**Endpoint:**
```
GET http://localhost:8080/api/v1/meta/animal-types
```

**Response (200 OK):**
```json
[
  { "typeId": 1, "typeName": "Kedi" },
  { "typeId": 2, "typeName": "Köpek" }
]
```

---

### 6️⃣ Hayvan Cinslerini Getirme (Public)

**Endpoint:**
```
GET http://localhost:8080/api/v1/meta/animal-types/{typeId}/breeds
```

**Örnek:**
```
GET http://localhost:8080/api/v1/meta/animal-types/1/breeds
```

**Response (200 OK):**
```json
[
  { "breedId": 1, "typeId": 1, "breedName": "Tekir" },
  { "breedId": 2, "typeId": 1, "breedName": "Van Kedisi" },
  { "breedId": 3, "typeId": 1, "breedName": "British Shorthair" },
  { "breedId": 4, "typeId": 1, "breedName": "Scottish Fold" },
  { "breedId": 5, "typeId": 1, "breedName": "Melez" }
]
```

---

### 7️⃣ İlan Oluşturma (Protected - Token Gerekli)

**Endpoint:**
```
POST http://localhost:8080/api/v1/listings
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body Type:** `multipart/form-data` (resim dosyası için)

**Form Data:**
| Key | Type | Value | Zorunlu |
|-----|------|-------|---------|
| `image` | File | kedi.jpg | ✅ |
| `title` | Text | "Sevimli Tekir Kedi" | ✅ |
| `description` | Text | "Çok uysal bir kedi, yuva arıyor" | ✅ |
| `animalTypeId` | Text | 1 | ✅ |
| `animalBreedId` | Text | 1 | ✅ |
| `cityId` | Text | 1 | ✅ |
| `age` | Text | 2 | ✅ |
| `gender` | Text | "Erkek" veya "Dişi" | ✅ |

**Response (201 Created):**
```json
{
  "listingId": 1,
  "userId": 1,
  "title": "Sevimli Tekir Kedi",
  "description": "Çok uysal bir kedi, yuva arıyor",
  "imageUrl": "https://mucizeol.fra1.cdn.digitaloceanspaces.com/abc123.jpg",
  "animalTypeId": 1,
  "animalBreedId": 1,
  "cityId": 1,
  "age": 2,
  "gender": "Erkek",
  "status": "Mevcut",
  "createdAt": "2025-11-18T14:30:00Z",
  "updatedAt": "2025-11-18T14:30:00Z"
}
```

**JavaScript Fetch Örneği:**
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('title', 'Sevimli Tekir Kedi');
formData.append('description', 'Çok uysal bir kedi');
formData.append('animalTypeId', '1');
formData.append('animalBreedId', '1');
formData.append('cityId', '1');
formData.append('age', '2');
formData.append('gender', 'Erkek');

fetch('http://localhost:8080/api/v1/listings', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### 8️⃣ İlanları Listeleme (Public)

**Endpoint:**
```
GET http://localhost:8080/api/v1/listings
```

**Query Parametreleri (Opsiyonel):**
| Parametre | Tip | Açıklama | Örnek |
|-----------|-----|----------|-------|
| `page` | Integer | Sayfa numarası (0'dan başlar) | `page=0` |
| `size` | Integer | Sayfa başına kayıt sayısı | `size=10` |
| `sort` | String | Sıralama (alan,yön) | `sort=createdAt,desc` |
| `cityId` | Integer | Şehre göre filtrele | `cityId=1` |
| `animalTypeId` | Integer | Türe göre filtrele | `animalTypeId=1` |
| `animalBreedId` | Integer | Cinse göre filtrele | `animalBreedId=1` |

**Örnek:**
```
GET http://localhost:8080/api/v1/listings?page=0&size=10&sort=createdAt,desc&cityId=1&animalTypeId=1
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "listingId": 1,
      "userId": 1,
      "title": "Sevimli Tekir Kedi",
      "description": "Çok uysal bir kedi",
      "imageUrl": "https://mucizeol.fra1.cdn.digitaloceanspaces.com/abc123.jpg",
      "animalTypeId": 1,
      "animalBreedId": 1,
      "cityId": 1,
      "age": 2,
      "gender": "Erkek",
      "status": "Mevcut",
      "createdAt": "2025-11-18T14:30:00Z",
      "updatedAt": "2025-11-18T14:30:00Z"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "empty": false,
      "unsorted": false
    }
  },
  "totalElements": 1,
  "totalPages": 1,
  "last": true,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "empty": false,
    "unsorted": false
  },
  "first": true,
  "numberOfElements": 1,
  "empty": false
}
```

---

### 9️⃣ Tek İlan Detayı (Public)

**Endpoint:**
```
GET http://localhost:8080/api/v1/listings/{listingId}
```

**Örnek:**
```
GET http://localhost:8080/api/v1/listings/1
```

**Response (200 OK):**
```json
{
  "listingId": 1,
  "userId": 1,
  "title": "Sevimli Tekir Kedi",
  "description": "Çok uysal bir kedi",
  "imageUrl": "https://mucizeol.fra1.cdn.digitaloceanspaces.com/abc123.jpg",
  "animalTypeId": 1,
  "animalBreedId": 1,
  "cityId": 1,
  "age": 2,
  "gender": "Erkek",
  "status": "Mevcut",
  "createdAt": "2025-11-18T14:30:00Z",
  "updatedAt": "2025-11-18T14:30:00Z"
}
```

---

### 🔟 İlan Güncelleme (Protected - Sadece İlan Sahibi)

**Endpoint:**
```
PUT http://localhost:8080/api/v1/listings/{listingId}
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body (Değiştirmek istediğiniz alanlar):**
```json
{
  "title": "Güncellenmiş Başlık",
  "description": "Yeni açıklama",
  "age": 3,
  "status": "Sahiplendirildi"
}
```

**Response (200 OK):**
```json
{
  "listingId": 1,
  "userId": 1,
  "title": "Güncellenmiş Başlık",
  "description": "Yeni açıklama",
  "imageUrl": "https://mucizeol.fra1.cdn.digitaloceanspaces.com/abc123.jpg",
  "animalTypeId": 1,
  "animalBreedId": 1,
  "cityId": 1,
  "age": 3,
  "gender": "Erkek",
  "status": "Sahiplendirildi",
  "createdAt": "2025-11-18T14:30:00Z",
  "updatedAt": "2025-11-18T15:45:00Z"
}
```

---

### 1️⃣1️⃣ İlan Silme (Protected - Sadece İlan Sahibi veya Admin)

**Endpoint:**
```
DELETE http://localhost:8080/api/v1/listings/{listingId}
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (204 No Content):**
Body yok, sadece HTTP 204 status code döner.

---

## ⚠️ Hata Durumları

### Genel Hata Formatı
Tüm hata durumları aşağıdaki formatta döner:

```json
{
  "timestamp": "2025-11-18T14:30:00Z",
  "path": "/api/v1/listings",
  "status": 400,
  "code": "COMMON.VALIDATION_ERROR",
  "message": "Geçersiz alanlar mevcut",
  "errors": [
    {
      "field": "title",
      "message": "must not be blank"
    }
  ]
}
```

### Yaygın Hata Kodları

| HTTP Status | Code | Açıklama | Çözüm |
|-------------|------|----------|-------|
| 400 | `COMMON.VALIDATION_ERROR` | Validasyon hatası | Request body'yi kontrol edin |
| 401 | `AUTH.INVALID_CREDENTIALS` | Giriş bilgileri hatalı | Email/password'u kontrol edin |
| 401 | `Unauthorized` | Token yok veya geçersiz | Access token'ı ekleyin/yenileyin |
| 403 | `LISTING.UNAUTHORIZED` | Bu işlem için yetkiniz yok | Sadece kendi ilanınızı düzenleyebilirsiniz |
| 404 | `LISTING.NOT_FOUND` | İlan bulunamadı | İlan ID'sini kontrol edin |
| 404 | `LISTING.CITY_NOT_FOUND` | Şehir bulunamadı | Geçerli bir cityId kullanın (1-5) |
| 409 | `AUTH.EMAIL_ALREADY_EXISTS` | Email zaten kullanımda | Farklı bir email kullanın |
| 500 | `COMMON.UNEXPECTED_ERROR` | Beklenmeyen hata | Backend loglarını kontrol edin |

### Örnek Hata Senaryoları

**1. Token Olmadan Korumalı Endpoint'e İstek:**
```json
{
  "timestamp": "2025-11-18T14:30:00Z",
  "path": "/api/v1/listings",
  "status": 401,
  "error": "Unauthorized"
}
```

**2. Başkasının İlanını Güncelleme Denemesi:**
```json
{
  "timestamp": "2025-11-18T14:30:00Z",
  "path": "/api/v1/listings/1",
  "status": 403,
  "code": "LISTING.UNAUTHORIZED",
  "message": "Bu ilanı düzenleme yetkiniz yok"
}
```

**3. Validasyon Hatası:**
```json
{
  "timestamp": "2025-11-18T14:30:00Z",
  "path": "/api/v1/listings",
  "status": 400,
  "code": "COMMON.VALIDATION_ERROR",
  "message": "Geçersiz alanlar mevcut",
  "errors": [
    {
      "field": "title",
      "message": "must not be blank"
    },
    {
      "field": "age",
      "message": "must be greater than 0"
    }
  ]
}
```

---

## 🛠️ Sorun Giderme

### Docker Container'ları Başlamıyor

**Sorun:** `docker-compose up` çalışmıyor veya hata veriyor.

**Çözüm:**
```bash
# Container'ları tamamen temizle
docker-compose down -v

# Docker sistemini temizle
docker system prune -a

# Yeniden başlat
docker-compose up -d --build
```

---

### Port Zaten Kullanılıyor Hatası

**Sorun:** `Bind for 0.0.0.0:8080 failed: port is already allocated`

**Çözüm:**
```bash
# Windows'ta port kullanan uygulamayı bul
netstat -ano | findstr :8080

# Linux/Mac'te
lsof -i :8080

# İlgili uygulamayı durdurun veya docker-compose.yml'de portu değiştirin
```

---

### Gateway'den 502 Bad Gateway Hatası

**Sorun:** Gateway açıldı ama backend servislerine ulaşamıyor.

**Çözüm:**
```bash
# Servislerin durumunu kontrol et
docker-compose ps

# Auth-service loglarını incele
docker-compose logs auth-service

# Listing-service loglarını incele
docker-compose logs listing-service

# Genellikle servisler henüz başlamadığı için olur, 30 saniye bekleyin
```

---

### MySQL Bağlantı Hatası

**Sorun:** `Communications link failure` veya `Connection refused`

**Çözüm:**
```bash
# MySQL container'ının çalıştığını kontrol et
docker-compose ps mysql-db

# MySQL loglarını incele
docker-compose logs mysql-db

# Veritabanını sıfırla
docker-compose down -v
docker-compose up -d
```

---

### CORS Hatası

**Sorun:** Browser console'da `CORS policy` hatası

**Çözüm:**
Gateway'de CORS ayarları yapılmış durumda. Frontend uygulamanız `http://localhost:3000` veya `http://localhost:5173` adreslerinden çalışıyorsa sorun olmaz.

Farklı bir port kullanıyorsanız backend ekibine bildirin, `.env` dosyasına eklesinler:
```
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:SIZIN_PORT
```

---

### Token Süresi Doldu

**Sorun:** API'den 401 hatası alıyorsunuz

**Çözüm:**
Access token süresi dolmuş olabilir (60 dakika). Refresh token ile yeni token alın:

```javascript
const refreshAccessToken = async (refreshToken) => {
  const response = await fetch('http://localhost:8080/api/v1/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  const data = await response.json();
  // Yeni accessToken ve refreshToken'ı kaydedin
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
};
```

---

## 🎯 Hızlı Başlangıç Checklist

- [ ] Docker Desktop kurulumu yapıldı
- [ ] Proje klonlandı
- [ ] `docker-compose up -d --build` çalıştırıldı
- [ ] Container'lar çalışıyor (`docker-compose ps`)
- [ ] Test kullanıcısı oluşturuldu (`POST /api/v1/auth/register`)
- [ ] Login yapıldı ve token alındı (`POST /api/v1/auth/login`)
- [ ] Meta data API'leri test edildi (`GET /api/v1/meta/*`)
- [ ] İlan oluşturma test edildi (`POST /api/v1/listings`)
- [ ] İlanlar listelendi (`GET /api/v1/listings`)

---

## 📞 Yardım

Herhangi bir sorun yaşarsanız:

1. **Docker loglarını kontrol edin:** `docker-compose logs -f`
2. **Container'ları yeniden başlatın:** `docker-compose restart`
3. **Veritabanını sıfırlayın:** `docker-compose down -v && docker-compose up -d --build`
4. **Backend ekibiyle iletişime geçin**

---

## 📊 Faydalı Komutlar

```bash
# Container'ları başlat
docker-compose up -d

# Container'ları durdur
docker-compose down

# Container'ları yeniden başlat
docker-compose restart

# Log'ları görüntüle
docker-compose logs -f

# Belirli bir servisin loglarını görüntüle
docker-compose logs -f auth-service

# Container içine gir (debugging için)
docker exec -it mucizeol-mysql mysql -u mucizeol_user -p

# Veritabanını tamamen sıfırla (DİKKAT: Tüm veriler silinir!)
docker-compose down -v
docker-compose up -d --build
```

---

## 🌍 Ek Bilgiler

### phpMyAdmin Erişimi
Veritabanını görsel olarak incelemek için:
- URL: http://localhost:8090
- Username: `mucizeol_user`
- Password: `.env` dosyasında (backend ekibinden alın)

### API Gateway Routes
- Auth Service: `http://localhost:8080/api/v1/auth/**`
- Listing Service: `http://localhost:8080/api/v1/listings/**`
- Meta Data: `http://localhost:8080/api/v1/meta/**`

### Resim Yükleme
- Desteklenen formatlar: JPG, JPEG, PNG
- Maksimum dosya boyutu: 5 MB
- Resimler DigitalOcean Spaces'te saklanır
- Dönen `imageUrl` doğrudan kullanılabilir (CDN URL'i)

---

**Son Güncelleme:** 18 Kasım 2025  
**Backend Versiyonu:** 1.0.0

