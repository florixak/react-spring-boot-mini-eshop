FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:21-jdk-slim
WORKDIR /app

RUN apt-get update && \
    apt-get install -y dnsutils && \
    rm -rf /var/lib/apt/lists/* && \
    echo "nameserver 8.8.8.8" > /etc/resolv.conf && \
    echo "nameserver 1.1.1.1" >> /etc/resolv.conf

COPY --from=build /app/target/*.jar app.jar
COPY supabase-ca.crt /app/certs/root.crt
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]