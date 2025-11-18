# Stage 1: Maven build
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /workspace

# Parent ve modül POM dosyalarını kopyala
COPY pom.xml .
COPY request-service/pom.xml request-service/

# Bağımlılıkları önceden indir (cache için)
RUN mvn -f request-service/pom.xml dependency:go-offline

# Kaynak kodu kopyala ve paketi oluştur
COPY request-service/src request-service/src
RUN mvn -f request-service/pom.xml package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=builder /workspace/request-service/target/request-service-*.jar app.jar

ARG SERVER_PORT=8083
EXPOSE ${SERVER_PORT}

ENTRYPOINT ["java", "-jar", "app.jar"]

