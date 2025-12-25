# Dockerfile pour Product Service
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copier les fichiers Maven
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN chmod +x mvnw

# Télécharger les dépendances (mise en cache)
RUN ./mvnw dependency:go-offline

# Copier le code source
COPY src ./src

# Build l'application
RUN ./mvnw clean package -DskipTests

# Stage de production
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copier le JAR depuis le builder
COPY --from=builder /app/target/*.jar app.jar

# Exposer le port
EXPOSE 8004

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8004/actuator/health || exit 1

# Démarrer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
