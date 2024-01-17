---
title: Turborepo 빠르게 시작하기
description: Turborepo 소개
date: 2024-01-16
tags: []
references:
  [{ key: 'Turborepo 공식 문서', value: 'https://turbo.build/repo/docs' }]
---

Turborepo는 자바스크립트 및 타입스크립트 코드베이스에 최적화된 지능형 빌드 시스템이다.

코드베이스의 규모에 따라 `lint`, `build` 및 `test`와 같은 작업의 실행 속도가 느려질 수 있다. Turborepo는 캐싱을 사용하여 이러한 문제를 해결한다.

Turborepo는 점진적으로 적용할 수 있도록 설계되었기 때문에 대부분의 코드베이스에 빠르게 적용할 수 있다.

- 기존 프로젝트에 적용 가능하다
- 새로운 모노레포 프로젝트에 적용 가능하다
- 기존의 모노레포 프로젝트에 적용 가능하다

## 기능

Turborepo는 보다 진보된 빌드 시스템 기술을 활용하여 로컬 환경과 CI/CD 환경 모두에서 개발 속도를 높인다.

- **같은 작업은 두 번 반복하지 않는다.** Turborepo는 작업 결과물을 캐싱하기 때문에 한 번 수행한 작업은 다시 반복하지 않는다.
- **최상의 멀티태스킹** Truborepo는 스마트한 스케줄링으로 작업 속도를 높혀 유휴 CPU를 최소화 한다.

## 모노레포

Turborepo는 `npm`, `pnpm` , `yarn` 과 같은 모노레포 도구와 함께 바로 사용할 수 있다. 모노레포 환경 때문에 작업 속도가 느려졌다고 느껴진다면 Turborepo를 사용해야 할 때이다.
