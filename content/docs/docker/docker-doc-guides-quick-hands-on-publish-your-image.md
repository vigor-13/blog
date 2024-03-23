---
title: 이미지 배포하기
description:
date: 2024-03-23
tags: [image]
references:
  [
    {
      key: 'Docker 공식 문서',
      value: 'https://docs.docker.com/guides/walkthroughs/publish-your-image/',
    },
  ]
---

이 가이드에서는 Docker Hub에 이미지를 배포하고 공유하는 방법을 알아본다.

:::note
시작하기 전에 최신 버전의 [Docker Desktop](https://docs.docker.com/get-docker/)을 설치한다. Docker는 정기적으로 새로운 기능을 추가하므로 이 가이드의 일부분은 최신 버전의 Docker Desktop에서만 작동할 수 있다.
:::

## 단계1: 예제 이미지 다운받기 {#step-1-get-the-example-image}

1. Docker Desktop에서 검색창을 선택한다.
2. 검색창에 `docker/welcome-to-docker`를 입력한다.
3. **Pull**을 선택하여 Docker Hub에서 이미지를 다운받는다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-publish-your-image/1.png)

## 단계2: Docker에 로그인하기 {#step-2-sign-in-to-docker}

Docker Desktop 오른쪽 상단에서 **Sign in**을 선택하여 Docker 계정에 로그인하거나 새 계정을 만든다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-publish-your-image/2.png)

## 단계3: 이미지의 이름을 변경한다 {#step-3-rename-your-image}

이미지를 배포하기 전에 Docker Hub가 해당 이미지가 당신의 것임을 알 수 있도록 이름을 변경해야 한다. 터미널에서 다음 명령을 실행하여 이미지 이름을 변경한다. ( `YOUR-USERNAME` 을 Docker ID로 바꾼다)

```bash
docker tag docker/welcome-to-docker YOUR-USERNAME/welcome-to-docker
```

## 단계4: Docker Hub에 이미지 배포하기

1. Docker Desktop에서 **Images** 탭으로 이동한다.
2. **Actions** 열에서 **Show image action** 아이콘을 선택한다.
3. **Push to Hub** 를 선택한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-publish-your-image/3.png)

Docker Hub로 이동하여 레포지토리 목록에 `YOUR-USERNAME/welcome-to-docker` 가 포함되어 있는지 확인한다.

## 요약 {#summary}

이번 가이드에서는 Dockr Hub에 이미지를 배포하여 공유하는 방법을 알아보았다.
