---
title: Docker Node.js 가이드
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

Node.js 언어 특화 가이드는 Docker를 사용하여 Node.js 애플리케이션을 컨테이너화하는 방법을 알려준다.

이 가이드에서는 다음 내용을 배운다:

- Node.js 애플리케이션을 컨테이너화하고 실행하기
- 컨테이너를 사용하여 Node.js 애플리케이션을 개발하기 위한 로컬 환경 설정하기
- 컨테이너를 사용하여 Node.js 애플리케이션을 테스트하기
- GitHub Actions를 사용하여 컨테이너화된 Node.js 애플리케이션을 위한 CI/CD 파이프라인 구성하기
- 배포를 테스트하고 디버깅하기 위해 컨테이너화된 Node.js 애플리케이션을 로컬에서 Kubernetes에 배포하기
