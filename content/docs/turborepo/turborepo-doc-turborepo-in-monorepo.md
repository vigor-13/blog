---
title: 모노레포속의 Turborepo
description: 모노레포환경에서 왜 Turborepo가 필요할까?
date: 2024-01-16
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/core-concepts/monorepos',
    },
  ]
---

## 문제점 {#problem}

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo-doc-turborepo-in-monorepo/1.png)

모노레포는 많은 장점이 있지만 확장하기가 어렵다. 각 워크스페이스에는 자체 테스트 슈트, 자체 린팅 및 자체 빌드 프로세스가 있다. 하나의 모노레포에 실행해야 할 작업이 수백 개에 달할 수도 있다.

## 해결방법 {#solution}

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo-doc-turborepo-in-monorepo/2.png)

터보레포(Turborepo)는 모노레포의 확장 문제를 해결한다. 터보레포의 원격 캐시(Remote cache)는 모든 작업의 결과를 저장하므로 CI가 동일한 작업을 두 번 수행하지 않도록 해준다.

모노레포에서는 작업 스케줄링이 어려울 수 있다. `yarn test` 전에 모든 워크스페이스에서 `yarn build`를 실행해야 한다고 가정해 보자. 터보레포는 가장 빠른 방식으로 모든 작업을 스케줄링하여 처리한다.

터보레포는 점진적으로 적용할 수 있다. 기존의 `package.json` 스크립트, 기존의 개발 종속성에 단일 `turbo.json` 파일을 사용한다. `npm`, `yarn`, `pnpm` 등 모든 패키지 관리자와 함께 사용할 수 있다. 단 몇 분 만에 모든 모노레포에 추가할 수 있다.

## Turborepo가 아닌것 {#not-turborepo}

터보레포는 패키지 설치에는 관여하지 않는다. 대신 `npm`, `pnpm` 또는 `yarn` 과 같은 도구들이 최적화하여 수행할 수 있다. 하지만 작업(tasks)을 실행하는 것은 터보레포가 더 효율적으로 처리할 수 있다.

작업(tasks)는 터보보레포가 실행하고, 패키지를 설치는 여러분이 선호하는 클라이언트를 사용하는 것을 권장한다.
