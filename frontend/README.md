# MucizeOl Frontend

MucizeOl hayvan sahiplendirme platformunun frontend uygulaması.

## Teknolojiler

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- React Icons

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env` dosyası oluşturun (`.env.example` dosyasını kopyalayın):
```bash
cp .env.example .env
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## Yapı

```
src/
├── components/      # Yeniden kullanılabilir bileşenler
├── pages/          # Sayfa bileşenleri
├── services/        # API servisleri
├── context/         # Context API
├── utils/           # Yardımcı fonksiyonlar
└── styles/          # CSS dosyaları
```

## API Bağlantısı

Backend API Gateway'in `http://localhost:8080` adresinde çalıştığı varsayılmaktadır.

Vite proxy yapılandırması sayesinde `/api` ile başlayan istekler otomatik olarak backend'e yönlendirilir.
