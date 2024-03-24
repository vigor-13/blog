---
title: 애플리케이션 컨테이너화하기
description:
date: 2024-03-24
tags: []
references:
  [
    {
      key: 'Docker 공식 문서',
      value: 'https://docs.docker.com/get-started/02_our_app/',
    },
  ]
---

## 애플리케이션 다운받기 {#get-the-app}

애플리케이션을 실행하기 전에, 애플리케이션 소스 코드를 다운받아야 한다.

1. 다음의 명령을 사용하여 레포지토리를 다운받는다.

```bash
git clone https://github.com/docker/getting-started-app.git
```

2. 레포지토리의 내용을 확인한다.

```text
├── getting-started-app/
│ ├── package.json
│ ├── README.md
│ ├── spec/
│ ├── src/
│ └── yarn.lock
```

## 애플리케이션 이미지 빌드하기 {#build-the-app-image}

이미지를 빌드하려면 Dockerfile을 사용해야 한다. Dockerfile은 단순히 명령 스크립트를 포함한 파일 확장자가 없는 텍스트 파일이다. Docker는 이 스크립트를 사용하여 컨테이너 이미지를 빌드한다.

1. `getting-started-app` 디렉토리에서 `package.json` 파일과 동일한 위치에 `Dockerfile` 을 생성한다. 터미널에서 다음 명령을 사용하여 Dockerfile을 생성할 수 있다.

```bash
cd /path/to/getting-started-app
touch Dockerfile
```

2. Dockerfile에 다음 내용을 추가한다:

```dockerfile
# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
EXPOSE 3000
```

3. 다음의 명령을 사용하여 이미지를 빌드한다.

```bash
docker build -t getting-started .
```

`docker build` 명령은 Dockerfile을 사용하여 새 이미지를 빌드한다. Docker는 이미지를 빌드하는 과정에서 여러 "레이어"를 다운로드한다. 예를 들어 빌더에게 `node:18-alpine` 이미지에서 시작한다고 지시한 경우 머신에 해당 이미지가 없으면 Docker는 이미지를 다운로드한다.

Docker가 이미지를 다운로드한 후, Dockerfile의 지시사항에 따라 애플리케이션을 복사하고 `yarn` 을 사용하여 애플리케이션의 종속성을 설치한다. `CMD` 지시어는 이 이미지에서 컨테이너를 시작할 때 실행할 기본 명령을 지정한다.

마지막으로, `-t` 플래그는 이미지에 태그를 지정한다. 태그는 최종 이미지에 사람이 읽을 수 있는 이름을 지정하는 것이다. 이미지 이름을 `getting-started` 로 지정했으므로, 컨테이너를 실행할 때 해당 이미지를 참조할 수 있다.

`docker build` 명령 끝에 있는 `.` 은 Docker에게 현재 디렉토리에서 `Dockerfile` 을 찾아야 한다고 알려준다.

## 애플리케이션 컨테이너 시작하기 {#start-an-app-container}

이제 이미지가 있으므로 `docker run` 명령을 사용하여 컨테이너에서 애플리케이션을 실행할 수 있다.

1. 방금 생성한 이미지의 이름을 지정하고 `docker run` 명령을 사용하여 컨테이너를 실행한다:

```bash
docker run -dp 127.0.0.1:3000:3000 getting-started
```

`-d` 플래그(`--detach`의 약어)는 컨테이너를 백그라운드에서 실행한다. Docker 대시보드의 **Containers** 탭에서 또는 터미널에서 `docker ps` 를 실행하여 컨테이너가 실행 중인지 확인할 수 있다.

`-p` 플래그(`--publish`의 약어)는 호스트와 컨테이너 간에 포트 매핑을 생성한다. `-p` 플래그는 `HOST:CONTAINER` 형식의 문자열 값을 사용하며, 여기서 `HOST`는 호스트의 주소이고 `CONTAINER` 는 컨테이너의 포트다. 이 명령은 컨테이너의 3000 포트를 호스트의 `127.0.0.1:3000`(`localhost:3000`)에 게시한다. 포트 매핑이 없으면 호스트에서 애플리케이션에 액세스할 수 없다.

2. http://localhost:3000에서 앱을 확인할 수 있다.
3. 애플리케이션에서 항목을 하나 또는 두 개 추가하고 예상대로 작동하는지 확인한다. 항목을 완료로 표시하고 제거할 수도 있다.

여기까지 컨테이너를 간단히 살펴보면, `getting-started` 이미지를 사용하여 `3000` 포트에서 실행 중인 컨테이너가 적어도 하나 이상 있어야 한다. 컨테이너 목록을 확인하려면 CLI 또는 Docker Desktop의 그래픽 인터페이스를 사용할 수 있다.

## 요약 {#summary}

이 섹션에서는 이미지를 빌드하기 위해 Dockerfile을 생성하는 기본 사항을 배웠다. 이미지를 빌드한 후에는 컨테이너를 시작하고 실행 중인 앱을 확인할 수 있다.
