# Etapa de construcción (Build)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Descarga las dependencias primero (mejora el caché de Docker)
RUN mvn dependency:go-offline -B
COPY src ./src
# Compila el proyecto saltándose las pruebas para hacerlo más rápido
RUN mvn clean package -DskipTests

# Etapa de ejecución (Run)
FROM eclipse-temurin:17-jre
WORKDIR /app
# Copia el JAR generado desde la etapa de build
COPY --from=build /app/target/*.jar app.jar
# Expone el puerto 8080 (Render lo detecta automáticamente)
EXPOSE 8080
# Comando para iniciar la aplicación Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
