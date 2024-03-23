---
title: 지속 컨테이너 데이터
description:
date: 2024-03-23
tags: [container, volume]
references:
  [
    {
      key: 'Docker 공식 문서',
      value: 'https://docs.docker.com/guides/walkthroughs/persist-data/',
    },
  ]
---

이 가이드에서는 컨테이너의 데이터를 지속하는 방법을 보여준다.

Docker는 컨테이너 내부의 모든 컨텐츠, 코드 및 데이터를 로컬 파일시스템으로부터 격리시킨다. 컨테이너를 삭제하면 Docker는 해당 컨테이너 내부의 모든 컨텐츠를 삭제한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-persist-container-data/1.png)

때때로 컨테이너가 생성한 데이터를 지속시키고 싶을 때가 있다. 이를 위해 볼륨(volumes)을 사용할 수 있다.

:::note
시작하기 전에 최신 버전의 [Docker Desktop](https://docs.docker.com/get-docker/)을 설치한다. Docker는 정기적으로 새로운 기능을 추가하므로 이 가이드의 일부분은 최신 버전의 Docker Desktop에서만 작동할 수 있다.
:::

## 단계1: 샘플 애플리케이션 다운받기 {#step-1-get-the-sample-application}

터미널에서 다음 명령을 사용하여 샘플 애플리케이션 레포지토리를 복제한다.

```bash
git clone https://github.com/docker/multi-container-app
```

## 단계2: 데이터를 유지할 볼륨 추가하기 {#step-2-add-a-volume-to-persist-data}

컨테이너를 삭제한 후에도 데이터를 유지하려면 볼륨을 사용해야 한다. 볼륨은 로컬 파일시스템 상의 특정 위치로, Docker Desktop에서 자동으로 관리한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-persist-container-data/2.png)

프로젝트에 볼륨을 추가하려면 텍스트 편집기에서 `compose.yaml` 파일을 연 다음 아래와 같이 주석을 해제한다.

```dockerfile
todo-database:
    # ...
    volumes:
      - database:/data/db

# ...
volumes:
  database:
```

`todo-database` 아래의 `volumes` 속성은 Compose에게 `database` 라는 이름의 볼륨을 todo-database 서비스 컨테이너의 `/data/db` 에 마운트하도록 지시한다.

최상위 `volumes` 속성은 Compose 파일의 모든 서비스에서 사용할 수 있는 `database` 라는 이름의 볼륨을 정의하고 구성한다.

## 단계3: 애플리케이션 실행하기 {#step-3-run-the-application}

애플리케이션을 실행하려면 터미널을 열고 다음 명령을 실행한다.

```bash
cd /path/to/multi-container-app/
docker compose up -d
```

## 단계4: 프론트엔드 페이지에서 할일 추가하기

Docker Desktop의 **Containers** 탭에는 두 개의 컨테이너(`todo-app`, `todo-database`)가 실행 중인 애플리케이션 스택을 확인할 수 있다.

프론트엔드 페이지에서 할 일을 추가하려면 다음과 같이 한다:

1. Docker Desktop의 **Containers**에서 애플리케이션 스택을 확장한다.
2. **Port(s)** 열에서 **3000**포트 링크를 선택하거나 http://localhost:3000 페이지를 연다.
3. 프론트엔드에서 할 일을 추가한다.

## 단계5: 애플리케이션 스택을 삭제하고 새 컨테이너 시작하기 {#step-5-delete-the-application-stack-and-run-new-containers}

이제 컨테이너를 삭제하고 다시 생성하는 횟수에 상관없이 Docker Desktop은 데이터를 지속시키고, `database` 볼륨을 마운트하여 시스템의 모든 컨테이너에서 해당 데이터에 액세스할 수 있다. Docker Desktop은 `database` 볼륨을 찾고, 존재하지 않으면 생성한다.

애플리케이션 스택을 삭제하려면 다음과 같이 한다:

1.  Docker Desktop의 **Containers** 탭을 연다.
2.  애플리케이션 스택의 옆에 삭제 아이콘을 선택한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-persist-container-data/3.png)

애플리케이션 스택을 삭제한 후 앞선 3단계에 따라 애플리케이션을 다시 실행한다. 이제 컨테이너를 삭제하고 다시 실행해도 Docker Desktop은 사용자가 만든 모든 할 일을 유지한다.

## 요약 {#summary}

이 가이드에서는 볼륨을 사용하여 컨테이너의 데이터를 지속시켰다. 이를 통해 격리된 임시 컨테이너의 데이터를 지속시키고 공유할 수 있다.
