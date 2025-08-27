FROM maven:3.9.11-eclipse-temurin-11-alpine
WORKDIR /app
COPY ..
RUN mvn clean package -DskipTests

FROM openjdk:21-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]