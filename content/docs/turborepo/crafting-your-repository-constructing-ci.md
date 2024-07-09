---
title: CI 구축하기
description:
date: 2024-07-03
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/crafting-your-repository/constructing-ci',
    },
  ]
---

Turborepo는 CI 파이프라인에서 수행해야 하는 빌드, 린트, 테스트 및 기타 모든 태스크의 속도를 높인다.

병렬화와 [원격 캐싱](https://turbo.build/repo/docs/core-concepts/remote-caching)을 통해 Turborepo는 CI를 획기적으로 빠르게 만들 수 있다.

:::note
CI와 원격 캐시를 연결하고 태스크를 실행하는 방법에 대한 예시는 [CI 가이드 문서](https://turbo.build/repo/docs/guides/ci-vendors)를 참조하다.
:::

## 원격 캐싱 활성화

CI에서 원격 캐싱을 사용하려면 Turborepo가 원격 캐시에 접근할 수 있도록 환경 변수를 설정해야 한다.

| 환경변수      | 설명                                  |
| ------------- | ------------------------------------- |
| `TURBO_TOKEN` | 원격 캐시에 접근하기 위한 Bearer 토큰 |
| `TURBO_TEAM`  | 레포지토리와 연결된 계정 이름         |

`turbo` 를 통해 태스크를 실행하면 CI가 캐시에 접근할 수 있어 파이프라인 속도가 향상된다.

:::note 원격 캐시 호스팅
Vercel의 내장 CI/CD를 사용한다면 별도의 설정 없이 Vercel이 관리하는 원격 캐시에 자동으로 연결된다.

다른 CI 벤더를 Vercel 원격 캐시에 연결하기 위한 토큰을 받으려면 [Vercel 원격 캐시 문서](https://vercel.com/docs/monorepos/remote-caching#use-remote-caching-from-external-ci/cd)를 참조한다.

자체 호스팅 원격 캐시 옵션에 대해서는 [Turborepo의 원격 캐시 문서](https://turbo.build/repo/docs/core-concepts/remote-caching#remote-cache-api)를 참조한다.
:::

## CI에서 태스크 실행하기

개발 머신과 CI 머신에 `turbo` 를 [전역으로 설치](https://turbo.build/repo/docs/getting-started/installation#global-installation)하면, 개발에서부터 배포까지 전체 레포지토리를 실행하는 데 일관된 방식을 사용할 수 있다.

`turbo.json` 에 등록한 태스크들은 CI에서도 정확히 동일하게 작동한다.

- 태스크 설정 방법에 대한 자세한 정보는 [태스크 구성 페이지](http://localhost:8090/docs/turborepo/crafting-your-repository-configuring-tasks/)를 참조한다.
- CI에서 태스크를 실행하는 예시는 [CI 가이드](https://turbo.build/repo/docs/guides/ci-vendors)를 참조한다.

### 엔트리포인트 필터링

로컬에서 `turbo` 를 사용할 때와 똑같이 [`--filter` 플래그](https://turbo.build/repo/docs/reference/run#--filter-string)를 사용하여 태스크를 필터링할 수 있다.

CI에서도 패키지, 디렉토리, Git 히스토리별 필터링이 모두 지원된다.

:::note CI에서 Git 히스토리 사용하기
얕은 클론(shallow clone)을 사용하면 전체 히스토리가 없기 때문에, 변경 이력을 기반으로 한 필터링 기능을 사용할 수 없다.

이 기능을 사용하려면 전체 Git 히스토리를 가져와야 한다.
:::

## Docker

Docker는 많은 배포 파이프라인에서 사용되는 도구로, 애플리케이션을 쉽게 패키징하고 배포할 수 있게 해준다.

Turborepo의 [`prune` 명령어](https://turbo.build/repo/docs/reference/prune)는 불필요한 의존성과 코드를 이미지에서 제거하여 가벼운 이미지를 생성할 수 있도록 도와준다.

:::note
Turborepo에서 Docker를 사용하여 배포하는 방법에 대한 자세한 내용은, [전용 Docker 가이드](https://turbo.build/repo/docs/guides/tools/docker)를 참조한다.
:::

## 태스크 및 기타 불필요한 작업 건너뛰기

Turborepo의 캐싱 기능을 사용하는 것은 CI 속도를 높이는 좋은 방법이다.

하지만 코드베이스와 CI가 성장함에 따라 더 빠른 속도를 위한 방법이 필요할 수 있다.

이때 캐시를 활용하는 것도 유용하지만, 태스크 자체를 완전히 건너뛰는 것도 한가지 방법이다.

`turbo-ignore` 를 사용하면 의존성 설치와 같은 긴 컨테이너 준비 단계를 건너뛸 수 있다.

즉 <u>어차피 캐시에서 가져올 수 있는 결과라면, 긴 시간이 걸리는 준비 과정을 아예 건너뛰자는 개념이다.</u>

### 1. 레포지토리 체크아웃

먼저 레포지토리를 클론하는 것부터 시작한다.

Git에서는 전체 히스토리를 가져오는 대신, 특정 깊이까지만 히스토리를 가져올 수 있다. (예: 최근 10개의 커밋만 가져오기)

클로닝 할 때, 비교에 필요한 만큼의 히스토리를 포함해야 한다.

- 너무 얕게 클론하면 (예: 마지막 커밋만) Turborepo가 제대로 작동하지 않을 수 있다.
- 반대로, 너무 깊게 클론하면 불필요한 데이터를 가져와 시간이 오래 걸릴 수 있다.

:::note
기본적으로 `turbo-ignore` 는 부모 커밋을 사용한다.

더 깊은 깊이로 사용자 지정하려면 [`turbo-ignore` 레퍼런스 문서](https://turbo.build/repo/docs/reference/turbo-ignore)를 확인한다.
:::

### 2. 패키지와 태스크에 대해 `turbo-ignore` 실행하기

`turbo-ignore` 는 기본적으로 현재 디렉토리의 `package.json` 에서 `build` 스크립트와 관련된 변경 사항을 확인한다.

```bash
npx turbo-ignore
```

- 다른 태스크의 변경 사항을 확인하려면 `--task` 플래그를 사용한다.
- 특정 패키지와 그 의존성의 변경 사항을 확인하려면 패키지 이름을 인자로 전달한다.

:::tabs

@tab:active web#build (Named)#named

`web` 패키지를 인자로 전달하여 `web` 패키지의 `build` 태스크 및 해당 종속성에 대한 변경 사항을 확인한다:

```bash
npx turbo-ignore web
```

@tab web#build (Inferred)#inferred

[자동 패키지 범위 지정 기능](https://turbo.build/repo/docs/crafting-your-repository/running-tasks#automatic-package-scoping)을 사용하여 `web` 패키지의 `build` 태스크 및 해당 종속성에 대한 변경 사항을 확인한다:

```bash
cd apps/web
npx turbo-ignore
```

@tab docs#test (--task flag)#flag

자동 패키지 범위 지정 및 --task 플래그를 사용하여 문서 패키지의 테스트 작업 및 해당 종속성에 대한 변경 사항을 확인합니다:

```bash
cd apps/docs
npx turbo-ignore --task=test
```

:::

### 3. 결과 처리

`turbo-ignore` 를 실행하면 다음과 같이 상태 코드를 반환하고 종료된다.

- `1` : 패키지나 그 내부 의존성에서 변경 사항이 감지됨
- `0` : 패키지나 그 내부 의존성에서 변경 사항이 감지되 않음

이 상태 코드를 사용하여 CI 파이프라인의 나머지 부분에서 무엇을 해야 할지 결정할 수 있다.

예를 들어:

- 변경 사항이 있는 경우 (상태 코드 `1` ):
  - 의존성 설치, 빌드, 테스트 등의 전체 CI 과정을 진행한다.
- 변경 사항이 없는 경우 (상태 코드 `0` ):
  - 추가적인 CI 단계를 건너뛰고, 이전 빌드 결과를 재사용할 수 있다.

이렇게 함으로써 불필요한 빌드 과정을 줄이고 CI/CD 파이프라인의 효율성을 높일 수 있다.

:::note

고급 사용 사례는 [`turbo-ignore` 레퍼런스 문서](https://turbo.build/repo/docs/reference/turbo-ignore)를 참조한다.

:::

## 모범 사례

### 캐싱에 의존하기

Turborepo의 캐싱 기능을 사용하면 복잡성을 최소화하면서 빠른 CI 파이프라인을 만들 수 있다.

원격 캐싱과 `--filter` 플래그를 사용하여 패키지를 지정하면, 대규모 모노레포에서도 변경된 부분만 빠르게 처리할 수 있다.

예를 들어, CI에서 다음 두 명령을 실행하여 테스트를 빠르게 처리하고 애플리케이션을 빌드할 수 있다:

- `turbo run lint check-types test`
  - 전체 저장소에 대해 테스트를 실행한다.
  - 변경되지 않은 패키지는 캐시를 사용한다.
- `turbo build --filter=web`
  - `turbo.json` 에 등록한 `build` 태스크를 사용하여 `web` 패키지를 빌드한다.
  - `web` 패키지나 그 의존성이 변경되지 않았다면, 빌드 또한 캐시를 사용한다.

코드베이스가 확장됨에 따라 CI를 최적화할 더 구체적인 기회를 찾을 수 있겠지만, 캐싱에 의존하는 것은 좋은 시작점이다.

### CI에서의 전역 `turbo`

CI 워크플로우에서 전역 `turbo` 를 사용하면 CI에 특화된 명령을 쉽게 실행하고 [자동 워크스페이스 범위 지정](https://turbo.build/repo/docs/crafting-your-repository/running-tasks#automatic-package-scoping)의 이점을 활용할 수 있어 편리하다.

하지만 일부 경우에는 <u>패키지 매니저로 패키지를 설치하기 전에</u> `turbo` 명령을 실행해야 할 수 있다.

예를 들어 Docker 이미지를 만들기 위해 `turbo prune` 을 사용하는 경우가 있다.

이런 경우, `package.json` 에 지정된 버전의 `turbo` 를 사용할 수 없다.

이러한 이유로, CI에서 전역 `turbo` 설치 시 `package.json` 의 주 버전(major version)과 같은 버전을 설치하는 것이 좋다.

### CI에서 `turbo run` 사용하기

`turbo run` 은 Turborepo에서 가장 일반적으로 사용되는 명령어다.

`turbo run` 은 편의상 `turbo` 로 줄여서 사용할 수 있다.

다만, `turbo` 에는 `run` 외에도 [`prune`](https://turbo.build/repo/docs/reference/prune) 이나 [`generate`](https://turbo.build/repo/docs/reference/generate) 와 같은 다른 하위 명령어들도 있으며, 앞으로 더 많은 명령어들이 추가될 수 있다.

이런 이유로, 나중에 `turbo` 에 새로운 명령어가 추가되어도 충돌이 발생하지 않도록 CI에서는 `turbo run` 을 사용한다.

예를 들어, `turbo deploy` 라는 새 기능이 생겨도 레포지토리의 `deploy` 명령과 충돌하지 않는다.

## 트러블슈팅

### 캐시 히트가 빌드 실패를 유발하는 경우

캐시를 사용하지 않을 때는 태스크가 성공하지만 캐시를 사용할 때 실패한다면, 해당 태스크의 [`outputs` 키](https://turbo.build/repo/docs/reference/configuration#outputs)를 올바르게 구성하지 않았을 가능성이 높다.

### 잘못된 환경 변수로 배포되는 경우

태스크에 대한 `env` 또는 `globalEnv` 키를 정의하지 않았다면, Turborepo는 해시를 생성할 때 해당 환경 변수를 사용할 수 없다.

때문에 환경이 변해도 태스크가 이를 인식하지 못하여 이전 캐시를 재사용할 수 있다.
