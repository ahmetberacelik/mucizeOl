# Build Stage
FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder
WORKDIR /build

# Copy parent pom and listing pom
COPY pom.xml ../pom.xml
COPY listing-service/pom.xml ./pom.xml

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY listing-service/src ./src

# Build application
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy jar from build stage
COPY --from=builder /build/target/*.jar app.jar

# Expose port
EXPOSE 8082

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]

