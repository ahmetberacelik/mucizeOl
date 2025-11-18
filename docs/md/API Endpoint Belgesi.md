# MucizeOl API Endpoint Dokümantasyonu (Frontend Ekibi İçin)

Bu belge, "MucizeOl" hayvan sahiplenme platformunun frontend geliştiricileri için backend API
sözleşmesini tanımlar.

## 📍 Genel Bilgiler

Tüm istekler, API Gateway servisi üzerinden tek bir ana giriş noktasından yapılmalıdır.
Ana (Base) URL (Lokal): [http://localhost:](http://localhost:)
API Versiyonu: v

## 🔐 Güvenlik ve Yetkilendirme (Authentication)

API, JWT (JSON Web Token) kullanarak korunmaktadır.

1. Public Endpoint'ler: (Public) olarak işaretlenen endpoint'ler (örn: ilan listeleme, giriş yapma)
   herhangi bir yetkilendirme başlığı gerektirmez.
2. Protected Endpoint'ler: (Protected) olarak işaretlenen endpoint'ler (örn: ilan oluşturma, talep
   gönderme) geçerli bir Access Token gerektirir.

Kimlik Doğrulama Akışı

1. Kullanıcı POST /api/v1/auth/login endpoint'ine email ve password gönderir.
2. Başarılı girişte, API bir accessToken ve refreshToken döner.
3. Frontend, tüm (Protected) isteklere accessToken'ı Authorization başlığına eklemelidir:
   Header: Authorization: Bearer <SizinAccessTokenBurada>
4. accessToken süresi dolduğunda (örn: 401 Unauthorized hatası alındığında), frontend POST
   /api/v1/auth/refresh endpoint'ine refreshToken'ı göndererek yeni bir accessToken alır.
5. Çıkış yapmak için POST /api/v1/auth/logout çağrılır; bu, sunucudaki refreshToken'ı geçersiz
   kılar.

## 🔑 Auth Servisi (Kullanıcı & Yetkilendirme)

Kullanıcı hesapları, giriş/çıkış ve token yönetiminden sorumludur.

```
POST /api/v1/auth/register
Açıklama: Yeni bir kullanıcı hesabı oluşturur.
Erişim: (Public)
Request Body (JSON):
```

```
{
"first_name": "Ahmet",
"last_name": "Çelik",
"email": "ahmet@mail.com",
"password": "GucluBirSifre123",
"phone_number": "5551234567"
}
```
```
Success Response (201 Created): Oluşturulan User objesini (veya bir başarı mesajını) döner.
```
POST /api/v1/auth/login
Açıklama: Kullanıcı girişi yapar ve token'ları döndürür.
Erişim: (Public)
Request Body (JSON):

```
{
"email": "ahmet@mail.com",
"password": "GucluBirSifre123"
}
```
```
Success Response (200 OK):
```
```
{
"accessToken": "eyJhbGciOiJIUzI1Ni...",
"refreshToken": "def456-abc123-..."
}
```
POST /api/v1/auth/refresh
Açıklama: Süresi dolmuş accessToken'ı yenilemek için kullanılır.
Erişim: (Public)
Request Body (JSON):

```
{
"refreshToken": "def456-abc123-..."
}
```
```
Success Response (200 OK):
```
```
{
"accessToken": "yeniAccessToken-eyJ..."
```

```
}
```
```
POST /api/v1/auth/logout
Açıklama: Güvenli çıkış yapar. Sunucudaki refreshToken'ı geçersiz kılar.
Erişim: (Protected) (Kullanıcının geçerli refreshToken'ını göndermesi gerekebilir veya
backend token'dan userId'yi alıp ilgili token'ı DB'den siler).
Success Response (200 OK):
```
```
{
"message": "Çıkış başarılı"
}
```
```
GET /api/v1/users/me
Açıklama: Giriş yapmış olan kullanıcının kendi profil bilgilerini döndürür.
Erişim: (Protected)
Success Response (200 OK): User objesi döner (Bkz: Data Modelleri).
```
## 🐾 Listing Servisi (İlan & Meta Veri)

İlanların, ilan meta verilerinin (şehir, tür vb.) ve resim yüklemelerinin yönetiminden sorumludur.

```
GET /api/v1/listings
Açıklama: "Mevcut" durumdaki ilanları filtreli ve sayfalı olarak listeler.
Erişim: (Public)
Query Parametreleri (Opsiyonel):
page: Sayfa numarası (örn: 0 )
size: Sayfa boyutu (örn: 10 )
city_id: Şehir ID'si
animal_type_id: Hayvan türü ID'si
animal_breed_id: Hayvan cinsi ID'si
sort: Sıralama (örn: created_at,desc)
Success Response (200 OK): Sayfalanmış Listing objeleri listesi döner.
POST /api/v1/listings
Açıklama: Yeni bir sahiplendirme ilanı oluşturur. Resim yükleme işlemi de burada yapılır.
Erişim: (Protected)
```

```
Request Body: multipart/form-data (JSON değil!)
image: Resim dosyası (örn: kedi.jpg)
title: (String) İlan başlığı
description: (String) İlan açıklaması
animal_type_id: (Number) Hayvan tür ID'si
animal_breed_id: (Number) Hayvan cins ID'si
city_id: (Number) Şehir ID'si
age: (Number) Hayvanın yaşı
gender: (String) "Dişi" veya "Erkek"
Success Response (201 Created): Oluşturulan Listing objesini döner (içeriğinde image_url
alanı DigitalOcean'dan gelen URL ile dolu olarak).
```
GET /api/v1/listings/{id}
Açıklama: Tek bir ilanın detaylı bilgilerini döndürür.
Erişim: (Public)
Path Parametresi:
id: İstenen ilanın listing_id değeri.
Success Response (200 OK): Listing objesi döner.

PUT /api/v1/listings/{id}
Açıklama: İlan sahibinin kendi ilanını güncellemesini sağlar. (Resim güncelleme ayrı bir endpoint
olabilir veya burada multipart/form-data kabul edilebilir, bu detayı backend ile netleştirin).
Erişim: (Protected)
Path Parametresi:
id: Güncellenecek ilanın listing_id değeri.
Request Body (JSON): Güncellenmesi istenen alanlar.

```
{
"title": "Yeni Başlık",
"description": "Güncellenmiş açıklama...",
"age": 3
}
```
```
Success Response (200 OK): Güncellenmiş Listing objesini döner.
```
DELETE /api/v1/listings/{id}


```
Açıklama: İlan sahibinin (veya Admin'in) ilanı silmesini sağlar.
Erişim: (Protected)
Path Parametresi:
id: Silinecek ilanın listing_id değeri.
Success Response (204 No Content): Response body boş döner.
GET /api/v1/meta/cities
Açıklama: Filtreleme için kullanılabilir tüm şehirleri listeler.
Erişim: (Public)
Success Response (200 OK): City objeleri dizisi döner.
GET /api/v1/meta/animal-types
Açıklama: Filtreleme için kullanılabilir tüm hayvan türlerini listeler.
Erişim: (Public)
Success Response (200 OK): AnimalType objeleri dizisi döner.
GET /api/v1/meta/animal-types/{typeId}/breeds
Açıklama: Belirli bir hayvan türüne ait (örn: Kedi) tüm cinsleri (Tekir, Siyam vb.) listeler.
Erişim: (Public)
Path Parametresi:
typeId: Cinsleri listelenecek türün type_id değeri.
Success Response (200 OK): AnimalBreed objeleri dizisi döner.
```
## ✉ Request Servisi (Sahiplenme Talepleri)

Kullanıcıların ilanlara yaptığı sahiplenme başvurularını yönetir.

```
POST /api/v1/requests
Açıklama: Bir ilana sahiplenme talebi gönderir.
Erişim: (Protected)
Request Body (JSON):
```
```
{
"listing_id": 123,
"request_message": "Bu kediyi çok sevdim, ona iyi bakabilirim..."
}
```
```
Not: Talep yapan user_id, Authorization header'ındaki token'dan otomatik olarak alınacaktır.
```

```
Success Response (201 Created): Oluşturulan AdoptionRequest objesini döner.
GET /api/v1/requests/my-requests
Açıklama: Giriş yapmış kullanıcının gönderdiği tüm taleplerin listesini döndürür.
Erişim: (Protected)
Success Response (200 OK): AdoptionRequest objeleri dizisi döner.
GET /api/v1/requests/my-listings-requests
Açıklama: Giriş yapmış kullanıcının ilanlarına gelen tüm taleplerin listesini döndürür.
Erişim: (Protected)
Success Response (200 OK): AdoptionRequest objeleri dizisi döner.
POST /api/v1/requests/{id}/approve
Açıklama: İlan sahibinin, ilanına gelen bir talebi onaylamasını sağlar. Bu işlem, ilgili listing'in
durumunu da "Sahiplendirildi" olarak günceller.
Erişim: (Protected)
Path Parametresi:
id: Onaylanacak talebin request_id değeri.
Success Response (200 OK):
```
```
{
"message": "Talep onaylandı ve ilan 'Sahiplendirildi' olarak güncellendi."
}
```
```
POST /api/v1/requests/{id}/reject
Açıklama: İlan sahibinin, ilanına gelen bir talebi reddetmesini sağlar.
Erişim: (Protected)
Path Parametresi:
id: Reddedilecek talebin request_id değeri.
Success Response (200 OK):
```
```
{
"message": "Talep reddedildi."
}
```
## 📦 Data Modelleri (Referans)


Endpoint'lerde (Obje) olarak belirtilen temel veri yapılarının referanslarıdır.

User
Kullanıcı bilgilerini temsil eder (Not: password_hash gibi hassas veriler asla response'a dahil edilmez).

```
{
"user_id": 1,
"first_name": "Ahmet",
"last_name": "Çelik",
"email": "ahmet@mail.com",
"phone_number": "5551234567",
"role_name": "ROLE_USER", // (role_id yerine role_name daha kullanışlı olabilir)
"created_at": "2025-11-04T10:30:00Z"
}
```
Listing
Bir sahiplendirme ilanını temsil eder.

```
{
"listing_id": 77,
"user_id": 1,
"title": "Tekir Kedi 'Duman' Yuva Arıyor",
"description": "Çok uysal bir kedi...",
"image_url": "[https://mucizeol-images.fra1.digitaloceanspaces.com/kedi-123.jpg](http
"animal_type_id": 1,
"animal_breed_id": 5,
"city_id": 34,
"age": 2,
"gender": "Erkek",
"status": "Mevcut", // ("Mevcut", "Sahiplendirildi", "Askıda")
"created_at": "2025-11-05T14:00:00Z",
"updated_at": "2025-11-05T14:00:00Z"
// Frontend'in ihtiyacına göre user, city, type, breed bilgileri de nested olarak ekl
// "owner": { "first_name": "Ahmet", "last_name": "Çelik" },
// "city": { "city_name": "İstanbul" },
// "animal_type": { "type_name": "Kedi" },
// "animal_breed": { "breed_name": "Tekir" }
}
```
AdoptionRequest
Bir sahiplenme talebini temsil eder.

```
{
"request_id": 123,
"user_id": 2,
"listing_id": 77,
"status": "Beklemede", // ("Beklemede", "Onaylandı", "Reddedildi")
```

```
"request_message": "Bu kediyi çok sevdim...",
"created_at": "2025-11-06T09:15:00Z"
// Frontend'in ihtiyacına göre talep yapan kullanıcı ve ilan bilgileri de nested olar
// "user": { "first_name": "Zeynep", "phone_number": "..." },
// "listing": { "title": "Tekir Kedi 'Duman'..." }
}
```
City

```
{
"city_id": 34,
"city_name": "İstanbul"
}
```
AnimalType

```
{
"type_id": 1,
"type_name": "Kedi"
}
```
AnimalBreed

```
{
"breed_id": 5,
"type_id": 1,
"breed_name": "Tekir"
}
```

