# MucizeOl API Endpoint Dokümantasyonu (v1)

Bu belge frontend ekibinin backend API sözleşmesini doğru kullanabilmesi için güncellenmiş formatları içerir. Tüm örnekler camelCase alan adları ile verilmiştir.

---

## Genel Bilgiler
- **Base URL (Lokal)**: `http://localhost:8080`
- **Versiyon**: `v1`
- Tüm istekler API Gateway üzerinden yönlendirilir.

### Yetkilendirme
- **Public** endpoint'ler JWT gerektirmez.
- **Protected** endpoint'ler `Authorization: Bearer <accessToken>` başlığı ister.
- Access token süresi dolarsa `POST /api/v1/auth/refresh` ile yenilenir.

---

## Auth Servisi

### `POST /api/v1/auth/register` _(Public)_
Yeni kullanıcı oluşturur.
```jsonc
{
  "firstName": "Ahmet",
  "lastName": "Çelik",
  "email": "ahmet@mail.com",
  "password": "GucluBirSifre123",
  "phoneNumber": "5551234567"
}
```
**201 Created**
```jsonc
{
  "userId": 1,
  "firstName": "Ahmet",
  "lastName": "Çelik",
  "email": "ahmet@mail.com",
  "phoneNumber": "5551234567",
  "roleName": "ROLE_USER"
}
```

### `POST /api/v1/auth/login` _(Public)_
```jsonc
{
  "email": "ahmet@mail.com",
  "password": "GucluBirSifre123"
}
```
**200 OK**
```jsonc
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "1.1c9ca2..."
}
```

### `POST /api/v1/auth/refresh` _(Public)_
```jsonc
{
  "refreshToken": "1.1c9ca2..."
}
```
**200 OK**
```jsonc
{
  "accessToken": "yeniAccessToken",
  "refreshToken": "1.71fbb0..."
}
```

### `POST /api/v1/auth/logout` _(Protected)_
- Refresh token'ı geçersiz kılar.
- **204 No Content**

### `GET /api/v1/auth/me` _(Protected)_
Giriş yapmış kullanıcının profilini döner.
**200 OK**
```jsonc
{
  "userId": 1,
  "firstName": "Ahmet",
  "lastName": "Çelik",
  "email": "ahmet@mail.com",
  "phoneNumber": "5551234567",
  "roleName": "ROLE_USER"
}
```

---

## Listing Servisi (Planlanan)
_Bu bölüm önceki gereksinimlere göre korunmuştur; geliştirme tamamlandığında örnekler güncellenecektir._

### `GET /api/v1/listings` _(Public)_
Filtre ve sayfalama parametreleri: `page`, `size`, `cityId`, `animalTypeId`, `animalBreedId`, `sort`.

### `POST /api/v1/listings` _(Protected)_
`multipart/form-data` (resim + JSON alanları) kabul eder.

### `GET /api/v1/listings/{id}` _(Public)_

### `PUT /api/v1/listings/{id}` _(Protected)_
Kısmi JSON güncellemesi.

### `DELETE /api/v1/listings/{id}` _(Protected)_
**204 No Content**

### Meta Endpoint'leri _(Public)_
- `GET /api/v1/meta/cities`
- `GET /api/v1/meta/animal-types`
- `GET /api/v1/meta/animal-types/{typeId}/breeds`

---

## Request Servisi (Planlanan)

- `POST /api/v1/requests`
- `GET /api/v1/requests/my-requests`
- `GET /api/v1/requests/my-listings-requests`
- `POST /api/v1/requests/{id}/approve`
- `POST /api/v1/requests/{id}/reject`

Endpoint davranışları önceki dökümantasyone göre geçerlidir; servisin tamamlanmasıyla birlikte JSON örnekleri camelCase olarak güncellenecektir.

---

## Veri Modelleri (CamelCase)

### User
```jsonc
{
  "userId": 1,
  "firstName": "Ahmet",
  "lastName": "Çelik",
  "email": "ahmet@mail.com",
  "phoneNumber": "5551234567",
  "roleName": "ROLE_USER",
  "createdAt": "2025-11-04T10:30:00Z"
}
```

### Listing
```jsonc
{
  "listingId": 77,
  "userId": 1,
  "title": "Tekir Kedi 'Duman' Yuva Arıyor",
  "description": "Çok uysal bir kedi...",
  "imageUrl": "https://mucizeol-images.fra1.digitaloceanspaces.com/kedi-123.jpg",
  "animalTypeId": 1,
  "animalBreedId": 5,
  "cityId": 34,
  "age": 2,
  "gender": "Erkek",
  "status": "Mevcut",
  "createdAt": "2025-11-05T14:00:00Z",
  "updatedAt": "2025-11-05T14:00:00Z"
}
```

### AdoptionRequest
```jsonc
{
  "requestId": 123,
  "userId": 2,
  "listingId": 77,
  "status": "Beklemede",
  "requestMessage": "Bu kediyi çok sevdim...",
  "createdAt": "2025-11-06T09:15:00Z"
}
```

### City / AnimalType / AnimalBreed
Alan adları sırasıyla `cityId`, `cityName`, `typeId`, `typeName`, `breedId`, `breedName` şeklindedir.

---

## Hata Formatı
Tüm hatalar aşağıdaki JSON yapısını izler:
```jsonc
{
  "timestamp": "2025-11-17T17:45:12.345Z",
  "path": "/api/v1/auth/login",
  "status": 401,
  "code": "AUTH.INVALID_CREDENTIALS",
  "message": "Geçersiz bilgiler",
  "errors": [
    { "field": "email", "message": "Geçerli bir email giriniz" }
  ]
}
```

---

> Not: Listing ve Request servisleri için alan isimleri camelCase'e geçirilecek, geliştirme tamamlandıkça örnekler güncellenecektir.

