---
title: 컨테이너란?
description:
date: 2024-03-22
tags: [container]
references:
  [
    {
      key: 'Docker 공식 문서',
      value: 'https://docs.docker.com/guides/walkthroughs/what-is-a-container/',
    },
  ]
---

**컨테이너는 코드를 위한 격리된 환경이다.** 즉 컨테이너에는 당신의 운영 체제나 파일에 대한 정보가 없다. 컨테이너는 Docker Desktop에서 제공하는 환경에서 실행된다. 컨테이너에는 코드 실행에 필요한 모든 것이 포함되어 있으며, 기본 운영 체제까지 포함된다. Docker Desktop을 사용하여 컨테이너를 관리하고 탐색할 수 있다.

이 가이드에서는 Docker Desktop에서 실제 컨테이너를 탐색해 본다.

시작하기 전에 최신 버전의 [Docker Desktop](https://docs.docker.com/get-docker/)을 설치한다. Docker는 정기적으로 새로운 기능을 추가하므로 이 가이드의 일부분은 최신 버전의 Docker Desktop에서만 작동할 수 있다.

## 1단계: 연습 설정 {#step1-set-up-the-walkthrough}

가장 먼저 필요한 것은 실행 중인 컨테이너다. 다음 안내에 따라 컨테이너를 실행한다.

1. Docker Desktop을 열고 검색을 선택한다.
2. 검색에서 `docker/welcome-to-docker` 를 지정한 다음 `Run` 을 선택한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-what-is-a-container/5.png)

3. 옵션 설정을 확장한다.
4. 컨테이너 이름에 `welcome-to-docker` 를 지정한다.
5. 호스트 포트에 `8088` 을 지정한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-what-is-a-container/1.png)

6. Run 버튼을 선택한다.

## 2단계: Docker Desktop에서 컨테이너 보기 {#step-2-view-containers-on-dokcer-desktop}

컨테이너를 실행했다! Docker Desktop의 `Containers` 탭에서 확인할 수 있다. 이 컨테이너는 간단한 웹사이트를 표시하는 간단한 웹 서버를 실행한다. 더 복잡한 프로젝트를 다룰 때는 서로 다른 컨테이너에서 프론트엔드, 백엔드, 데이터베이스 등 각 부분을 실행한다. 이 연습에서는 단순한 프론트엔드 컨테이너만 있다.

## 3단계: 프론트엔드 확인하기 {#step-3-view-the-frontend}

프론트엔드는 로컬 호스트의 `8088` 포트에서 액세스할 수 있다. 컨테이너의 `Port(s)` 열에서 링크를 선택하거나 브라우저에서 http://localhost:8088 으로 이동하여 확인한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-what-is-a-container/2.png)

## 4단계: 컨테이너 탐색하기 {#step-4-explore-your-container}

Docker Desktop을 사용하면 컨테이너의 다양한 측면을 쉽게 보고 상호 작용할 수 있다. 직접 살펴보자. 컨테이너를 선택한 다음 파일을 선택하여 컨테이너의 격리된 파일 시스템을 탐색할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-what-is-a-container/3.png)

## 5단계: 컨테이너 중지하기 {#step-5-stop-your-container}

`welcome-to-docker` 컨테이너는 중지할 때까지 계속 실행된다. Docker Desktop에서 컨테이너를 중지하려면 `Containers` 탭으로 이동하여 컨테이너의 `Actions` 열에서 중지 아이콘을 선택한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-quick-hands-on-what-is-a-container/4.png)

## 요약 {#summary}

이 연습에서는 미리 만들어진 이미지를 실행하고 컨테이너를 살펴봤다. 미리 만들어진 이미지를 실행하는 것 외에도 자신만의 애플리케이션을 컨테이너로 빌드하고 실행할 수 있다.
