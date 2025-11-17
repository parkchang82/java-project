# ======================== 1. 빌드 단계 (Build Stage) ========================
# openjdk:21-jdk-slim 이미지를 'builder'라는 이름으로 사용합니다.
FROM openjdk:21-jdk-slim-buster AS builder 

# Docker 컨테이너 내부의 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# CodeJavaApp 폴더(Root Directory)의 모든 파일(gradlew, build.gradle 등)을 
# 컨테이너의 /app 디렉토리로 복사합니다.
COPY . . 

# gradlew 파일에 실행 권한을 부여합니다.
RUN chmod +x gradlew

# Gradle Wrapper를 사용하여 프로젝트를 클린 빌드하고 실행 가능한 JAR 파일(bootJar)을 생성합니다.
RUN ./gradlew clean bootJar


# ======================== 2. 실행 단계 (Runtime Stage) ========================
# 실행을 위해 openjdk:21-jre-slim(Java Runtime Environment, 더 가벼움) 이미지를 사용합니다.
FROM openjdk:21-jre-slim-buster

# Docker 컨테이너 내부의 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# 빌드 단계(builder)에서 생성된 JAR 파일을 복사하고 이름을 app.jar로 변경합니다.
# JAR 파일 이름은 프로젝트 폴더 이름(CodeJavaApp)과 버전 정보를 따릅니다.
COPY --from=builder /app/build/libs/CodeJavaApp-0.0.1-SNAPSHOT.jar app.jar

# 애플리케이션 실행 명령어(Start Command)를 정의합니다.
ENTRYPOINT ["java", "-jar", "app.jar"]