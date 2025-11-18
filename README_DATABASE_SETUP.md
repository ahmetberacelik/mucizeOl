# Veritabanı Kurulum Rehberi

## Sorun
Herkes kendi local veritabanını kullanıyor, bu yüzden ilanlar görünmüyor.

## Çözüm: Ortak Veritabanı Kullanımı

### Yöntem 1: Bir Kişinin Bilgisayarını Veritabanı Sunucusu Yapmak

#### 1. Veritabanı Sunucusu (Bir kişi yapacak)

1. **IP Adresinizi Öğrenin:**
   - Windows: `ipconfig` komutunu çalıştırın
   - Mac/Linux: `ifconfig` komutunu çalıştırın
   - Örnek IP: `192.168.1.100`

2. **Docker Compose'u Başlatın:**
   ```bash
   docker-compose up -d
   ```

3. **Firewall'u Kontrol Edin:**
   - Windows Firewall'da 3306 portunu açın
   - MySQL portunun (3306) erişilebilir olduğundan emin olun

#### 2. Diğer Kullanıcılar

1. **`.env` dosyasını düzenleyin:**
   ```env
   # Veritabanı sunucusunun IP adresini yazın
   DB_HOST=192.168.1.100  # ← Buraya sunucunun IP'si
   DB_PORT=3306
   DB_NAME=mucizeol
   DB_USER=root
   DB_PASSWORD=your_password
   ```

2. **Backend servislerini yeniden başlatın**

### Yöntem 2: Bulut Veritabanı (Önerilen - Uzun Vadeli)

1. **DigitalOcean, AWS RDS veya benzeri bir MySQL veritabanı oluşturun**

2. **Herkes `.env` dosyasında aynı bilgileri kullanır:**
   ```env
   DB_HOST=your-cloud-db-host.com
   DB_PORT=3306
   DB_NAME=mucizeol
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

## Kontrol

1. **Veritabanı bağlantısını test edin:**
   ```bash
   # MySQL'e bağlanmayı deneyin
   mysql -h DB_HOST -u DB_USER -p
   ```

2. **Backend loglarını kontrol edin:**
   - Veritabanı bağlantı hataları varsa loglarda görünecektir

3. **Frontend'de konsolu kontrol edin:**
   - F12 → Console
   - API çağrılarının başarılı olup olmadığını kontrol edin

## Notlar

- **Güvenlik:** Production'da kesinlikle bulut veritabanı kullanın
- **Backup:** Veritabanını düzenli olarak yedekleyin
- **Network:** Tüm kullanıcılar aynı ağda olmalı (aynı WiFi/router)

