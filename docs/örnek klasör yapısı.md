mucizeOl/
├── .git/
├── .gitignore                (Tüm proje için Git'e gönderilmeyecek dosyalar)
├── README.md                 (Ana proje tanıtım dosyası)
├── docker-compose.yml        (Tüm servisleri (MySQL, backend, frontend) ayağa kaldıran dosya)
├── .env                      (Docker Compose için gizli bilgiler - DB şifresi vb.)
│
├── frontend/                 (React/Frontend projesinin ana klasörü)
│   ├── Dockerfile            (Frontend uygulamasını Docker imajı yapmak için)
│   ├── .gitignore            (Frontend'e özel ignore dosyaları)
│   ├── package.json
│   └── src/
│
└── backend/                  (Bizim ana backend klasörümüz)
    ├── pom.xml               (Backend ana Parent POM)
    │
    ├── auth-service/
    │   ├── Dockerfile        (BU servisi Docker imajı yapmak için)
    │   ├── pom.xml
    │   └── src/
    │       ├── main/
    │       │   ├── java/
    │       │   │   └── com/mucizeol/auth/
    │       │   │       ├── api/
    │       │   │       │   ├── controller/
    │       │   │       │   └── dto/
    │       │   │       ├── config/
    │       │   │       ├── data/
    │       │   │       │   ├── entity/
    │       │   │       │   └── repository/
    │       │   │       ├── security/
    │       │   │       │   ├── config/
    │       │   │       │   ├── filter/
    │       │   │       │   └── jwt/
    │       │   │       ├── service/
    │       │   │       │   └── impl/
    │       │   │       └── AuthServiceApplication.java
    │       │   └── resources/
    │       │       ├── db/migration/ (Flyway scriptleri V1__, V2__)
    │       │       └── application.yml
    │       └── test/
    │
    ├── listing-service/
    │   ├── Dockerfile        (BU servisi Docker imajı yapmak için)
    │   ├── pom.xml
    │   └── src/
    │       ├── main/
    │       │   ├── java/
    │       │   │   └── com/mucizeol/listing/
    │       │   │       ├── api/
    │       │   │       ├── data/
    │       │   │       ├── service/
    │       │   │       └── ListingServiceApplication.java
    │       │   └── resources/
    │       │       └── application.yml
    │       └── test/
    │
    ├── request-service/
    │   ├── Dockerfile        (BU servisi Docker imajı yapmak için)
    │   ├── pom.xml
    │   └── src/
    │       ├── main/
    │       │   ├── java/
    │       │   │   └── com/mucizeol/request/
    │       │   │       ├── api/
    │       │   │       ├── data/
    │       │   │       ├── service/
    │       │   │       └── RequestServiceApplication.java
    │       │   └── resources/
    │       │       └── application.yml
    │       └── test/
    │
    └── gateway-service/
        ├── Dockerfile        (BU servisi Docker imajı yapmak için)
        ├── pom.xml
        └── src/
            ├── main/
            │   ├── java/
            │   │   └── com/mucizeol/gateway/
            │   │       ├── config/
            │   │       ├── filter/
            │   │       └── GatewayServiceApplication.java
            │   └── resources/
            │       └── application.yml
            └── test/