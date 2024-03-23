---
title: 다중 컨테이너 실행하기
description:
date: 2024-03-23
tags: [container, docker_compose]
references:
  [
    {
      key: 'Docker 공식 문서',
      value: 'https://docs.docker.com/guides/walkthroughs/multi-container-apps/',
    },
  ]
---

앞서 컨테이너를 실행하는 방법에 대한 연습을 마쳤다면, 각 컨테이너를 개별적으로 시작해야 한다는 것을 알게 되었을 것이다. 만약 단일 명령어로 여러 컨테이너를 시작할 수 있는 도구가 있다면 얼마나 편리할까? 그 도구가 바로 **Docker Compose**다.

:::note
시작하기 전에 최신 버전의 [Docker Desktop](https://docs.docker.com/get-docker/)을 설치해야 한다. Docker는 정기적으로 새로운 기능을 추가하며 이 가이드의 일부 부분은 최신 버전의 Docker Desktop에서만 작동할 수 있다.
:::

## 단계1: 샘플 애플리케이션 다운받기 {#step-1-get-the-sample-application}

터미널에서 다음 명령을 사용하여 샘플 애플리케이션 레포지토리를 복제한다.

```bash
git clone https://github.com/docker/multi-container-app
```

샘플 애플리케이션은 ExpressJS와 Node.js를 사용하여 구축된 간단한 TODO 애플리케이션이다. 이 애플리케이션은 모든 할일을 MongoDB 데이터베이스에 저장한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-run-multi-container-applications/1.png)

## 단계2: Compose 파일 탐색하기 {#step-2-dig-into-the-compose-file}

샘플 애플리케이션의 파일을 살펴보자. `compose.yaml` 파일을 볼 수 있을 것이다. 이 파일은 Docker에게 애플리케이션을 실행하는 방법을 알려준다. 텍스트 편집기에서 `compose.yaml` 파일을 열어 포함된 내용을 알아보자.

## 단계3: 애플리케이션 실행하기 {#step-3-run-the-application}

터미널을 열고 다음 명령으로 애플리케이션을 실행한다.

```bash
cd /path/to/multi-container-app/
docker compose up -d
```

위의 명령에서 `-d` 플래그는 애플리케이션이 detached 모드에서 실행되도록 한다.

## 단계4: 프론트엔드 페이지에서 할일 추가하기 {#step-4-view-the-frontend-and-add-todos}

Docker Desktop의 **Containers** 탭에는 두 개의 컨테이너(`todo-app`, `todo-database`)가 실행 중인 애플리케이션 스택을 확인할 수 있다.

프론트엔드 페이지를 확인하려면 다음과 같이 한다:

1. Docker Desktop에서 **Containers**에 있는 애플리케이션 스택을 확장한다.
2. **Port(s)** 열에서 **3000** 포트 링크를 선택하거나 http://localhost:3000로 접속한다.

프론트엔드에서 몇 가지 할 일 작업을 추가한 다음 새 브라우저 탭에서 다시 http://localhost:3000을 연다. 작업이 등록된 것을 확인할 수 있다.

## 단계5: 컨테이너에서 개발하기 {#step-5-develop-in-your-container}

Docker를 사용하여 개발할 때는 코드를 편집하고 저장할 때마다 실행 중인 서비스를 자동으로 업데이트하고 미리 보기가 가능해야 한다. 이를 위해 Docker Compose Watch를 사용할 수 있다.

실시간으로 변경 사항을 확인하려면 다음과 같이 Compose Watch를 실행한다:

1. 터미널을 열고 다음 명령을 실행한다.

```bash
cd /path/to/the/multi-container-app/
docker compose watch
```

2. 텍스트 편집기에서 `app/views/todos.ejs` 를 연 다음 18번째 줄의 텍스트를 변경한다.
3. `app/views/todos.ejs` 의 변경 사항을 저장한다.
4. http://localhost:3000에서 실시간으로 변경사항을 확인한다.

## 단계6: 삭제하고 재시작하기 {#step-6-delete-everyting-and-start-over}

Compose 파일에 애플리케이션 설정이 저장되어 있으면 또 다른 장점이 있다. 모든 것을 쉽게 삭제하고 다시 시작할 수 있다.

애플리케이션 스택을 삭제하려면 다음과 같이 한다:

1. Docker Desktop의 **Containers** 탭을 연다.
2. 애플리케이션 스택 옆에 있는 삭제 아이콘을 선택한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-run-multi-container-applications/2.png)

애플리케이션 스택을 삭제한 후 앞선 3단계를 다시 실행한다. 다만, 컨테이너를 삭제하고 다시 실행하면 이전에 생성한 모든 할 일은 유지되지 않는다.

## 요약 {#summary}

이번 연습에서는 Docker Compose로 다중 컨테이너 애플리케이션을 실행했다. 또한 컨테이너에서 실시간으로 개발하는 방법과 모든 데이터와 함께 애플리케이션 스택을 삭제하는 방법도 배웠다.
