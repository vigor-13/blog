---
title: 애플리케이션 컨테이너화하기
description:
date: 2024-03-23
tags: [container]
references:
  [
    {
      key: 'Docker 공식 문서',
      value: 'https://docs.docker.com/guides/walkthroughs/containerize-your-app/',
    },
  ]
---

컨테이너를 사용할 때는 일반적으로 이미지를 정의하는 `Dockerfile` 과 이를 실행하는 방식을 정의하는 `compose.yaml` 파일을 작성해야 한다.

이러한 파일을 만드는 데 도움이 되도록 Docker Desktop은 `docker init` 명령을 제공한다. 프로젝트 폴더 내의 터미널에서 이 명령을 실행한다. `docker init` 은 애플리케이션을 컨테이너화하는 데 필요한 모든 파일을 생성한다. 이 가이드에서는 이 작업 방식을 보여준다.

:::note
시작하기 전에 최신 버전의 [Docker Desktop](https://docs.docker.com/get-docker/)을 설치해야 한다. Docker는 정기적으로 새로운 기능을 추가하며 이 가이드의 일부 부분은 최신 버전의 Docker Desktop에서만 작동할 수 있다.
:::

## 단계1: Docker 에셋을 만들기 위한 명령을 실행한다 {#step-1-run-the-command-to-create-docker-asset}

컨테이너화하려는 애플리케이션을 선택하고 터미널에서 다음의 명령을 실행한다:

```bash
cd /path/to/your/project/
docker init
```

## 단계2: 프롬프트의 안내를 따라 답변을 작성한다 {#step-2-follow-the-on-screen-prompts}

`docker init` 은 프로젝트의 기본값을 구성하기 위해 몇 가지 질문을 한다. 답변을 지정한 후 `Enter` 를 누른다.

## 단계3: 애플리케이션을 실행한다 {#step-3-try-to-run-your-application}

프롬프트의 질문에 답변을 완료했다면 터미널에서 다음의 명령을 실행한다.

```bash
cd /path/to/your/project/
docker compose up
```

## 단계4: Docker 에셋을 업데이트한다 {#step-4-update-the-docker-assets}

`docker init` 명령은 최대한 많은 부분을 자동으로 처리하려고 노력하지만, 때로는 직접 작업해야 하는 부분이 있다. 자세한 내용은 [Dockerfile 레퍼런스](https://docs.docker.com/reference/dockerfile/)와 [Compose 파일 레퍼런스](https://docs.docker.com/compose/compose-file/)를 참조하여 `docker init` 에 의해 생성된 파일을 업데이트하는 방법을 알아볼 수 있다.

## 요약 {#summary}

이번 가이드에서는 애플리케이션을 컨테이너화하는 방법을 알아보았다.
