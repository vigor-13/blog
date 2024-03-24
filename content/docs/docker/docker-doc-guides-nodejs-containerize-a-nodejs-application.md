---
title: Node.js 애플리케이션 컨테이너화하기
description:
date: 2024-03-23
tags: [node_js]
references:
  [
    {
      key: 'Docker 공식 문서',
      value: 'https://docs.docker.com/language/nodejs/',
    },
  ]
---

## 개요 {#overview}

이 섹션에서는 Node.js 애플리케이션을 컨테이너화하고 실행하는 방법을 안내한다.

## 샘플 애플리케이션 다운받기 {#get-the-sample-application}

이 가이드에서 사용할 샘플 애플리케이션을 복제한다. 터미널을 열고, 작업하고자 하는 디렉토리로 이동한 후, 다음 명령을 실행하여 저장소를 복제한다:

```bash
git clone https://github.com/docker/docker-nodejs-sample
```

## Docker 에셋 초기화하기 {#initialize-docker-assets}

이제 애플리케이션이 준비되었으므로, `docker init` 명령어를 사용하여 애플리케이션을 컨테이너화하는 데 필요한 Docker 에셋을 생성할 수 있다. `docker-nodejs-sample` 디렉토리 안에서 터미널에 `docker init` 명령어를 실행한다. `docker init` 은 기본 설정을 제공하지만, 애플리케이션에 대한 몇 가지 질문에 답해야 한다. `docker init` 의 프롬프트에 답하려면 다음 예제를 참조하고, 프롬프트에 동일한 답변을 사용한다.

```bash
docker init
Welcome to the Docker Init CLI!

This utility will walk you through creating the following files with sensible defaults for your project:
  - .dockerignore
  - Dockerfile
  - compose.yaml
  - README.Docker.md

Let's get started!

? What application platform does your project use? Node
? What version of Node do you want to use? 18.0.0
? Which package manager do you want to use? npm
? What command do you want to use to start the app: node src/index.js
? What port does your server listen on? 3000
```

이제 `docker-nodejs-sample` 디렉토리에 다음과 같은 내용이 있어야 한다.

```text
├── docker-nodejs-sample/
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

`docker init` 명령어가 추가한 파일에 대해 더 알아보려면 다음을 참조한다:

- [Dockerfile](https://docs.docker.com/reference/dockerfile/)
- [.dockerignore](https://docs.docker.com/reference/dockerfile/#dockerignore-file)
- [compose.yaml](https://docs.docker.com/compose/compose-file/)

## 애플리케이션 시작하기 {#run-the-application}

터미널에서 다음 명령을 실행한다.

```bash
docker compose up --build
```

브라우저를 열고 http://localhost:3000 에서 애플리케이션을 확인한다.

터미널에서 `ctrl+c` 를 눌러 애플리케이션을 중지할 수 있다.

### 백그라운드에서 애플리케이션 실행하기 {#run-the-application-in-the-background}

터미널에서 분리하여 애플리케이션을 실행하려면 `-d` 옵션을 추가하면 된다.

```bash
docker compose up --build -d
```

브라우저를 열고 http://localhost:3000 에서 애플리케이션을 확인한다.

터미널에서 `ctrl+c` 를 눌러 애플리케이션을 중지할 수 있다.

## 요약 {#summary}

이 섹션에서는 Docker를 사용하여 Node.js 애플리케이션을 컨테이너화하고 실행하는 방법을 배웠다.
