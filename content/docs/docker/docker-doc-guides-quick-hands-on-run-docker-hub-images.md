---
title: Docker Hub 이미지 실행하기
description:
date: 2024-03-22
tags: [docker_hub]
references:
  [
    {
      key: 'Docker 공식 문서',
      value: 'https://docs.docker.com/guides/walkthroughs/run-hub-images/',
    },
  ]
---

Docker Hub([http://hub.docker.com](http://hub.docker.com))에서 이미지를 저장하고 공유할 수 있다. Docker Hub에는 로컬에서 실행할 수 있는 10만 개가 넘는 이미지가 있다. Docker Hub의 이미지를 검색하고 Docker Desktop에서 직접 실행할 수 있다.

:::note
시작하기 전에 최신 버전의 [Docker Desktop](https://docs.docker.com/get-docker/)을 설치해야 한다. Docker는 정기적으로 새로운 기능을 추가하며 이 가이드의 일부 부분은 최신 버전의 Docker Desktop에서만 작동할 수 있다.
:::

## 1단계: 이미지 검색하기 {#step-1-search-for-the-image}

Docker Desktop에서 Docker Hub 이미지를 검색할 수 있다. 이 연습에 사용된 이미지를 검색하려면 다음과 같이 한다:

1. Docker Desktop을 실행하고 검색창을 선택한다.
2. `docker/welcome-to-docker` 를 검색한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-run-docker-hub-images/1.png)

## 2단계: 이미지 실행하기 {#step-2-run-the-image}

`docker/welcome-to-docker` 이미지를 실행하려면 다음과 같이 한다:

1. 검색창에서 이미지를 찾은 후, **Run**을 클릭한다.
2. **Optional settings**를 선택한다.
3. **Host port**를 `8090` 으로 설정한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-run-docker-hub-images/2.png)

4. **Run** 버튼을 클릭한다.

:::note
Docker Hub에 호스팅된 많은 이미지들은 해당 이미지를 실행하기 위해 설정해야 하는 사항들을 알려준다. Docker Hub에서 검색 결과의 이미지 이름을 선택하거나 https://hub.docker.com에서 직접 이미지를 검색하면 해당 이미지에 대한 설명을 읽을 수 있다.
:::

## 3단계: 컨테이너 탐색하기 {#step-3-explore-the-container}

끝이다! 컨테이너를 사용할 준비가 되었다. Docker Desktop의 **Containers** 탭으로 이동하여 컨테이너를 확인한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-run-docker-hub-images/3.png)

## 요약 {#summary}

이번 가이드에서는 Docker Hub에서 이미지를 검색하여 컨테이너로 실행했다. Docker Hub에는 애플리케이션을 빌드하는 데 사용할 수 있는 100,000개 이상의 이미지가 있다.
