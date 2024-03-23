---
title: 컨테이너에서 로컬 폴더에 접근하기
description:
date: 2024-03-23
tags: [bind_mount]
references:
  [
    {
      key: 'Docker 공식 문서',
      value: 'https://docs.docker.com/guides/walkthroughs/access-local-folder/',
    },
  ]
---

이 가이드에서는 컨테이너에서 로컬 폴더에 액세스하는 방법을 보여준다.

Docker는 컨테이너 내부의 모든 컨텐츠, 코드 및 데이터를 로컬 파일시스템으로부터 격리시킨다. 기본적으로 컨테이너는 로컬 파일시스템의 디렉터리에 액세스할 수 없다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-access-a-local-folder-from-a-container/1.png)

때로는 컨테이너에서 로컬 파일시스템 디렉터리에 액세스해야 하는 경우가 있다. 이를 위해 bind mounts를 사용할 수 있다.

:::note
시작하기 전에 최신 버전의 [Docker Desktop](https://docs.docker.com/get-docker/)을 설치해야 한다. Docker는 정기적으로 새로운 기능을 추가하며 이 가이드의 일부 부분은 최신 버전의 Docker Desktop에서만 작동할 수 있다.
:::

## 단계1: 샘플 애플리케이션 다운받기 {#step-1-get-the-sample-application}

터미널에서 다음 명령을 사용하여 샘플 애플리케이션 레포지토리를 복제한다.

```bash
git clone https://github.com/docker/bindmount-apps
```

## 단계2: Compose를 사용하여 bind mount를 추가한다 {#step-2-add-a-bind-mount-using-compose}

컨테이너에서 로컬시스템의 데이터에 액세스하려면 bind mount를 추가해야 한다. bind mount를 통해 호스트 파일시스템 디렉토리를 컨테이너에 공유할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-access-a-local-folder-from-a-container/2.png)

프로젝트에 bind mount를 추가하려면 텍스트 편집기에서 `compose.yaml` 파일을 열고 다음의 주석을 해제한다.

```yaml
todo-app:
  # ...
  volumes:
    - ./app:/usr/src/app
    - /usr/src/app/node_modules
```

`volumes` 속성은 Compose에게 로컬 폴더 `./app` 을 `todo-app` 서비스 컨테이너의 `/usr/src/app` 에 마운트하도록 지시한다. 이 bind mount는 컨테이너의 `/usr/src/app` 디렉토리의 정적 컨텐츠를 덮어쓰고 개발 컨테이너라고 불리는 것을 생성한다. 두 번째 `/usr/src/app/node_modules` 는 bind mount가 컨테이너의 `node_modules` 디렉터리를 덮어쓰지 않도록 하여 컨테이너에 설치된 패키지를 보존한다.

## 단계3: 애플리케이션을 실행한다 {#step-3-run-the-application}

터미널에서 다음의 명령으로 애플리케이션을 실행한다.

```bash
cd /path/to/bindmount-apps/
docker compose up -d
```

## 단계4: 애플리케이션 개발하기 {#step-4-develop-the-application}

이제 로컬 시스템에서 애플리케이션을 개발하면서 컨테이너 환경의 이점을 누릴 수 있다. 로컬 시스템에서 애플리케이션에 대한 변경 사항은 컨테이너에 반영된다. 로컬 디렉토리에서 `app/views/todos.ejs` 파일을 텍스트 편집기로 열고, `Enter your task` 문자열을 업데이트한 후 파일을 저장한다. localhost:3001을 방문하거나 새로고침하여 변경사항을 확인한다.

## 요약 {#summary}

이번 가이드에서는 컨테이너에서 로컬 폴더에 액세스하기 위해 bind mount를 추가했다. 이를 사용하면 코드를 업데이트할 때 컨테이너를 다시 빌드할 필요 없이 더 빠르게 개발할 수 있다.
