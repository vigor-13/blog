---
title: 컨테이너는 어떻게 실행할까?
description:
date: 2024-03-22
tags: [container]
references:
  [
    {
      key: 'Docker 공식 문서',
      value: 'https://docs.docker.com/guides/walkthroughs/run-a-container/',
    },
  ]
---

이 연습에서는 나만의 이미지를 만들고 컨테이너를 실행하는 기본 단계를 배운다. 이 연습에서는 샘플 Node.js 애플리케이션을 사용하지만 Node.js를 몰라도 상관없다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-quick-hands-on-how-do-i-run-a-container/1.png)

:::note
시작하기 전에 최신 버전의 [Docker Desktop](https://docs.docker.com/get-docker/)을 설치해야 한다. Docker는 정기적으로 새로운 기능을 추가하며 이 가이드의 일부 부분은 최신 버전의 Docker Desktop에서만 작동할 수 있다.
:::

## 1단계: 샘플 애플리케이션 다운받기 {#step-1-get-the-sample-application}

터미널에서 다음 명령을 사용하여 샘플 애플리케이션 레포지토리를 복제한다.

```bash
git clone https://github.com/docker/welcome-to-docker
```

## 2단계: 프로젝트의 Dockerfile 살펴보기 {#step-2-view-the-dockerfile-in-your-project-folder}

컨테이너에서 코드를 실행하기 위해 가장 기본적으로 필요한 것은 `Dockerfile` 이다. `Dockerfile` 은 컨테이너에 포함될 내용을 설명한다. 이 샘플에는 이미 `Dockerfile` 이 포함되어 있다. 직접 프로젝트를 진행할 때는 자신만의 `Dockerfile` 을 만들어야 한다. 텍스트 편집기에서 `Dockerfile` 을 열고 그 내용을 살펴볼 수 있다.

## 3단계: 첫 이미지 빌드하기 {#step-3-build-your-first-image}

컨테이너를 실행하려면 항상 이미지가 필요하다. 터미널에서 다음 명령을 실행하여 이미지를 빌드한다.

```bash
cd /path/to/welcome-to-docker/
docker build -t welcome-to-docker .
```

위의 명령에서 `-t` 플래그는 이미지에 이름(이 경우 `welcome-to-docker`)을 지정한다. 그리고 `.` 는 Docker에게 Dockerfile의 위치를 알려준다.

이미지 빌드에는 다소 시간이 걸릴 수 있다. 이미지가 빌드되면 Docker Desktop의 `Images` 탭에서 확인할 수 있다.

## 4단계: 컨테이너 실행하기 {#step-4-run-your-container}

다음의 단계를 따라 이미지를 실행한다:

1. Docker Desktop의 **Images** 탭으로 이동한다.
2. 앞서 생성한 이미지에서 **Run** 버튼을 선택한다.
3. **Optional settings**를 연다.
4. **Host port**를 `8089` 로 지정한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-quick-hands-on-how-do-i-run-a-container/2.png)

5. **Run** 버튼을 선택한다.

## 5단계: 프론트엔드 확인하기 {#step-5-view-the-frontend}

Docker Desktop을 사용하여 실행 중인 컨테이너에 액세스할 수 있다. Docker Desktop에서 컨테이너 옆에 있는 링크를 선택하거나 http://localhost:8089 로 이동하여 프론트엔드를 확인한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-quick-hands-on-how-do-i-run-a-container/3.png)

## 요약 {#summary}

이번 가이드에서는 자체 이미지를 빌드하고 컨테이너로 실행했다. 자체 이미지를 빌드하고 실행하는 것 외에도 Docker Hub에서 이미지를 실행할 수 있다.
