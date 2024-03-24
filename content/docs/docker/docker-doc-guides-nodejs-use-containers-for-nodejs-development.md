---
title: Node.js 개발을 위해 컨테이너 사용하기
description:
date: 2024-03-23
tags: [node_js]
references:
  [
    {
      key: 'Docker 공식 문서',
      value: 'https://docs.docker.com/language/nodejs/develop/',
    },
  ]
---

## 개요 {#overview}

이 섹션에서는 컨테이너화된 애플리케이션을 위한 개발 환경을 설정하는 방법을 배운다. 여기에는 다음과 같은 내용이 포함된다:

- 로컬 데이터베이스 추가 및 데이터 지속성 유지
- 개발 환경을 실행하도록 컨테이너 구성
- 컨테이너화된 애플리케이션 디버깅

## 로컬 데이터베이스 추가 및 데이터 지속성 유지 {#add-a-local-database-and-persist-data}

데이터베이스와 같은 로컬 서비스를 설정하기 위해 컨테이너를 사용할 수 있다. 이 섹션에서는 `compose.yaml` 파일을 업데이트하여 데이터베이스 서비스와 데이터를 유지하기 위한 볼륨을 정의한다.

`compose.yaml` 파일을 살펴보면 Postgres 데이터베이스와 볼륨에 대한 주석이 포함되어 있다.

`src/persistence/postgres.js` 파일을 살펴보면 이 애플리케이션이 Postgres 데이터베이스를 사용하며, 데이터베이스에 연결하기 위해 일부 환경 변수가 필요하다는 것을 알 수 있다. `compose.yaml` 파일에는 이러한 변수가 정의되어 있지 않다.

`compose.yaml` 파일에서 다음 항목을 업데이트해야 한다:

- 모든 데이터베이스 관련 주석을 해제한다.
- server 서비스 아래에 환경 변수를 추가한다.
- 데이터베이스 비밀번호를 위해 서버 서비스에 `secrets` 을 추가한다.

다음은 업데이트된 `compose.yaml` 파일이다.

```yaml
services:
  server:
    build:
      context: .
    ports:
      - 3000:3000
    environment:
      NODE_ENV: production
      POSTGRES_HOST: db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD_FILE: /run/secrets/db-password
      POSTGRES_DB: example
    depends_on:
      db:
        condition: service_healthy
    secrets:
      - db-password
  db:
    image: postgres
    restart: always
    user: postgres
    secrets:
      - db-password
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=example
      - POSTGRES_PASSWORD_FILE=/run/secrets/db-password
    expose:
      - 5432
    healthcheck:
      test: ['CMD', 'pg_isready']
      interval: 10s
      timeout: 5s
      retries: 5
volumes:
  db-data:
secrets:
  db-password:
    file: db/password.txt
```

Compose를 사용하여 애플리케이션을 실행하기 전에, 이 Compose 파일이 `secrets` 을 사용하고 데이터베이스의 비밀번호를 저장하기 위해 `password.txt` 파일을 지정한다는 점에 유의한다. 소스 저장소에 포함되어 있지 않으므로 이 파일을 직접 생성해야 한다.

복제된 저장소의 디렉토리에서 `db` 라는 새 디렉토리를 생성하고 디렉토리 안에 `password.txt` 라는 파일을 생성한다. 그리고 `password.txt` 파일에 비밀번호를 추가한다. 비밀번호는 파일에 추가 줄 없이 한 줄로 작성되어야 한다.

이제 `docker-nodejs-sample` 디렉토리에는 다음과 같은 내용이 있어야 한다.

```text
├── docker-nodejs-sample/
│ ├── db/
│ │ └── password.txt
│ ├── spec/
│ ├── src/
│ ├── .dockerignore
│ ├── .gitignore
│ ├── compose.yaml
│ ├── Dockerfile
│ ├── package-lock.json
│ ├── package.json
│ ├── README.Docker.md
│ └── README.md
```

다음의 명령으로 애플리케이션을 시작한다.

```bash
docker compose up --build
```

브라우저를 열고 http://localhost:3000 에서 애플리케이션이 실행 중인지 확인한다.

데이터 지속성을 테스트하기 위해 할 일 목록에 몇 가지 항목을 추가한다.

할 일 목록에 몇 가지 항목을 추가한 후, 터미널에서 `ctrl+c` 를 눌러 애플리케이션을 중지한다.

터미널에서 `docker compose rm` 을 실행하여 컨테이너를 제거한 다음, `docker compose up` 을 실행하여 애플리케이션을 다시 실행한다.

```bash
docker compose rm
docker compose up --build
```

브라우저에서 http://localhost:3000을 새로 고침하고, 컨테이너가 제거되고 다시 실행된 후에도 할 일 항목이 유지되는지 확인한다.

## 개발 컨테이너 구성 및 실행 {#configure-and-run-a-development-container}

bind mount를 사용하여 소스 코드를 컨테이너에 마운트할 수 있다. 그러면 컨테이너에서 코드에 대한 변경 사항을 즉시 확인할 수 있다. 이는 컨테이너 내에서 파일 시스템 변경을 감시하고 이에 대응하는 nodemon과 같은 프로세스를 실행할 수 있음을 의미한다. 바인드 마운트에 대한 자세한 내용은 [문서](https://docs.docker.com/storage/)를 참조한다.

bind mount를 추가하는 것 외에도, Dockerfile과 `compose.yaml` 파일을 구성하여 개발 종속성을 설치하고 개발 도구를 실행할 수 있다.

### 개발을 위한 Dockerfile 업데이트 {#update-your-dockerfile-for-development}

Dockerfile을 열어보면 Dockerfile이 개발 종속성을 설치하지 않고 nodemon을 실행하지 않는다는 것을 알 수 있다. 개발 종속성을 설치하고 nodemon을 실행하도록 Dockerfile을 업데이트해야 한다.

**프로덕션용 Dockerfile과 개발용 Dockerfile을 별도로 생성하는 대신, 하나의 다단계 Dockerfile을 사용하여 두 가지 모두에 사용할 수 있다.**

Dockerfile을 다음과 같은 다단계 Dockerfile로 업데이트한다.

```dockerfile
# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.0.0

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app
EXPOSE 3000

FROM base as dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
USER node
COPY . .
CMD npm run dev

FROM base as prod
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
USER node
COPY . .
CMD node src/index.js
```

Dockerfile에서 먼저 `FROM node:${NODE_VERSION}-alpine` 문에 `as base` 레이블을 추가한다. 이를 통해 다른 빌드 단계에서 이 빌드 단계를 참조할 수 있다. 그 다음, 개발 종속성을 설치하고 `npm run dev` 를 사용하여 컨테이너를 시작하는 `dev` 로 레이블이 지정된 새로운 빌드 단계를 추가합니다. 마지막으로, 개발 종속성을 생략하고 `node src/index.js` 를 사용하여 애플리케이션을 실행하는 `prod` 로 레이블이 지정된 단계를 추가한다. 다단계 빌드에 대한 자세한 내용은 [다단계 빌드](https://docs.docker.com/build/building/multi-stage/)를 참조한다.

다음으로, 새로운 단계를 사용하도록 Compose 파일을 업데이트해야 한다.

### 개발을 위한 Compose 파일 업데이트 {#update-your-compose-file-for-development}

Compose로 `dev` 단계를 실행하려면 `compose.yaml` 파일을 업데이트해야 한다. `compose.yaml` 파일을 열고, Dockerfile의 `dev` 단계를 대상으로 지정하는 `target: dev` 명령을 추가한다.

또한 서버 서비스에 bind mount를 위한 새로운 볼륨을 추가한다. 이 애플리케이션에서는 로컬 머신의 `./src` 를 컨테이너의 `/usr/src/app/src` 에 마운트한다.

마지막으로, 디버깅을 위해 포트 `9229` 를 게시한다.

다음은 업데이트된 Compose 파일이다.

```yaml
services:
  server:
    build:
      context: .
      target: dev
    ports:
      - 3000:3000
      - 9229:9229
    environment:
      NODE_ENV: production
      POSTGRES_HOST: db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD_FILE: /run/secrets/db-password
      POSTGRES_DB: example
    depends_on:
      db:
        condition: service_healthy
    secrets:
      - db-password
    volumes:
      - ./src:/usr/src/app/src
  db:
    image: postgres
    restart: always
    user: postgres
    secrets:
      - db-password
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=example
      - POSTGRES_PASSWORD_FILE=/run/secrets/db-password
    expose:
      - 5432
    healthcheck:
      test: ['CMD', 'pg_isready']
      interval: 10s
      timeout: 5s
      retries: 5
volumes:
  db-data:
secrets:
  db-password:
    file: db/password.txt
```

### 개발 컨테이너 실행 및 애플리케이션 디버깅 {#run-your-development-container-and-debug-your-application}

`Dockerfile` 과 `compose.yaml` 파일의 새로운 변경 사항을 적용하여 애플리케이션을 실행하려면 다음 명령을 실행한다.

```bash
docker compose up --build
```

브라우저를 열고 http://localhost:3000에서 애플리케이션이 실행 중인지 확인한요.

이제 로컬 머신의 애플리케이션 소스 파일에 대한 모든 변경 사항이 실행 중인 컨테이너에 즉시 반영된다.

편집기에서 `docker-nodejs-sample/src/static/js/app.js` 파일을 열고 109번 줄의 버튼 텍스트를 `Add Item` 에서 `Add` 로 업데이트한다.

```diff-js
+                         {submitting ? 'Adding...' : 'Add'}
-                         {submitting ? 'Adding...' : 'Add Item'}
```

브라우저에서 http://localhost:3000를 새로 고침하고 업데이트된 텍스트가 나타나는지 확인한다.

이제 디버깅을 위해 인스펙터 클라이언트를 애플리케이션에 연결할 수 있습니다. 인스펙터 클라이언트에 대한 자세한 내용은 [Node.js 문서](https://nodejs.org/en/docs/guides/debugging-getting-started)를 참조한다.

## 요약 {#summary}

이 섹션에서는 Compose 파일을 설정하여 모의 데이터베이스를 추가하고 데이터를 유지하는 방법을 살펴보았다. 또한 다단계 Dockerfile을 만들고 개발을 위한 bind mount를 설정하는 방법도 배웠다.
