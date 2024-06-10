---
title: 소개
description:
date: 2024-06-06
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/getting-started/installation',
    },
  ]
---

## Turborepo란?

Turborepo는 JavaScript/TypeScript 코드베이스를 위한 고성능 빌드 시스템이다.

Turborepo는 모노레포의 규모가 커질수록 발생하는 확장성 문제를 해결하기 위한 도구다.

또한 [단일 패키지로 이루어진 일반적인 프로젝트](https://turbo.build/repo/docs/guides/single-package-workspaces)에서도 개발 작업을 더욱 빠르게 진행할 수 있다.

## 모노레포 문제점

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo/turborepo-docs-introduction/1.png)

모노레포는 여러 프로젝트를 하나의 저장소에서 관리하는 방식이다.

이러한 방식은 협업에는 좋지만 규모가 커질수록 복잡도가 증가하고 속도가 느려지는 단점이 있다.

모노레포 안에는 많은 개별 프로젝트(워크스페이스)가 있다. 문제는 각 워크스페이스마다 각자의 테스트, 린팅, 빌드 과정이 별도로 필요하다는 것이다.

워크스페이스 수가 늘어나면 전체 저장소 차원에서 관리해야 할 작업의 양도 늘어난다.

결국 모노레포의 규모가 커지면 이 모든 작업을 제때 끝내기가 점점 어려워진다. 빌드나 테스트 시간도 길어진다. 협업의 이점을 누리려고 모노레포를 도입했는데, 반대로 개발 속도가 느려지는 역효과가 생기는 것이다.

이렇게 개발 속도가 점점 느려지면 팀 전체의 개발 방식에 큰 차질이 생길 수 있다. 개발중 피드백 과정이 느려지면 좋은 코드를 만들기 힘들어진다.

이런 어려움을 해결하기위해 Turborepo같은 모노레포 최적화 도구의 도움을 받아야 한다. 일일이 수동으로 관리하기엔 모노레포가 너무 복잡해질 수 있다.

## 모노레포 솔루션

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo/turborepo-docs-introduction/2.png)

Turborepo는 모노레포의 확장 문제를 해결해주는 도구다.

- Turborepo는 작업 결과를 [원격 캐시](https://turbo.build/repo/docs/core-concepts/remote-caching)에 저장한다. 원격 캐시는 모든 작업의 결과를 저장하므로 CI가 동일한 작업을 두 번 수행할 필요가 없다.
- Turborepo는 빌드, 테스트, 린팅 같은 작업들의 순서를 최적화하여 전체 작업을 최대한 빠르게 수행한다. 가용한 모든 코어에서 작업을 병렬화하여 최대 속도로 작업을 스케줄링한다.
- Turborepo는 점진적으로 도입할 수도 있다. 원하는 레포에 조금씩 추가하면서 사용량을 늘려갈 수 있다.
- Turborepo는 npm, yarn, pnpm 등 다양한 패키지 관리자와 호환된다.
