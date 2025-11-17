# Stage 1: Maven build
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /workspace

# Parent ve modül POM dosyalarını kopyala
COPY pom.xml .
COPY auth-service/pom.xml auth-service/

# Bağımlılıkları önceden indir (cache için)
RUN mvn -f auth-service/pom.xml dependency:go-offline

# Kaynak kodu kopyala ve paketi oluştur
COPY auth-service/src auth-service/src
RUN mvn -f auth-service/pom.xml package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=builder /workspace/auth-service/target/auth-service-*.jar app.jar

ARG SERVER_PORT=8081
EXPOSE ${SERVER_PORT}

ENTRYPOINT ["java", "-jar", "app.jar"]

