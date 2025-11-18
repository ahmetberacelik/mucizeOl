# Gateway Service

API Gateway servisi - Tüm mikroservislere tek giriş noktası.

## Sorumluluklar

✅ **Routing**: İstekleri ilgili servislere yönlendirir
✅ **JWT Doğrulama**: Access token'ları doğrular
✅ **Header Injection**: Kullanıcı bilgilerini header'a ekler (X-User-Id, X-User-Email, X-User-Role)
✅ **CORS**: Frontend isteklerini yönetir
✅ **Exception Handling**: Teknik hataları yakalar

## Port

- **8080** (Ana giriş noktası)

## Public Endpoint'ler (JWT gerektirmez)

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/listings` (İlan listesi)
- `GET /api/v1/meta/*` (Şehir, tür, cins)

## Protected Endpoint'ler (JWT gerekir)

Diğer tüm endpoint'ler JWT gerektirir. Gateway token'ı parse edip header'lara şu bilgileri ekler:

```
X-User-Id: 123
X-User-Email: user@mail.com
X-User-Role: ROLE_USER
```

## Routing Tablosu

| Path | Servis | Port |
|------|--------|------|
| `/api/v1/auth/**` | auth-service | 8081 |
| `/api/v1/listings/**` | listing-service | 8082 |
| `/api/v1/meta/**` | listing-service | 8082 |
| `/api/v1/requests/**` | request-service | 8083 |

## Lokal Çalıştırma

```bash
# Docker Compose ile
docker-compose up gateway-service

# Standalone (auth-service çalışıyor olmalı)
cd backend/gateway-service
mvn spring-boot:run
```

## Test

```bash
# Public endpoint (JWT yok)
curl http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@mail.com","password":"password123"}'

# Protected endpoint (JWT var)
curl http://localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

