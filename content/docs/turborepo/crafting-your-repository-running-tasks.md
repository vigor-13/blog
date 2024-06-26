---
title: 태스크 실행하기
description:
date: 2024-06-23
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/crafting-your-repository/running-tasks',
    },
  ]
---

`turbo` 는 프로젝트의 스크립트를 효율적으로 관리하고 실행할 수 있는 여러 기능들을 제공한다.

## `package.json` 의 `scripts` 에 등록하여 실행하기

자주 실행하는 태스크의 경우, 루트 `package.json` 에 직접 `turbo` 를 실행하는 스크립트를 등록하여 사용한다.

```json
// ./package.json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  }
}
```

:::note
`turbo` 는 `turbo run` 의 별칭이다. 하지만 `package.json` 과 CI 워크플로우에서는 `turbo run` 을 사용하는 것을 권장한다.

이는 향후 추가될 수 있는 `turbo` 하위 명령어와의 잠재적 충돌을 피하기 위함이다.
:::

이렇게 등록한 스크립트는 패키지 관리자를 사용하여 실행할 수 있다.

```bash
npm run dev
```

:::warning
`turbo` 명령어는 루트 `package.json` 에만 작성해야 한다.

패키지의 `package.json` 에 `turbo` 명령어를 작성하면 `turbo` 가 재귀적으로 호출될 수 있다.
:::

## 전역으로 `turbo` 실행하기

`turbo` 를 전역적으로 설치하면 터미널에서 직접 명령어를 실행할 수 있다.

전역 `turbo` 는 다음과 같은 이점이 있다.

1. **로컬 개발 환경에서의 이점**:
   - 터미널에서 직접 `turbo` 명령어를 사용할 수 있어 편리하다.
   - 필요한 작업을 즉시 실행할 수 있는 유연성을 제공한다.
2. **CI 파이프라인에서의 이점**:
   - 자동화된 빌드, 테스트, 배포 과정에서 더 세밀한 제어가 가능하다.
   - 각 단계에서 필요한 정확한 태스크만 실행할 수 있다.

### 자동 패키지 범위 지정

특정 패키지 폴더 안에서 `turbo` 명령을 실행하면, 자동으로 해당 패키지의 태스크만 실행된다.

이렇게 하면 필터링 옵션을 적용하지 않고도 특정 패키지의 태스크를 실행할 수 있다.

```bash
cd apps/docs
turbo build
```

:::note
`--filter` 옵션을 사용하면 현재 있는 폴더와 상관없이 필터에 지정된 패키지에 대해 태스크가 실행된다.
:::

### 명령어 옵션

Turborepo는 명령어를 상황에 맞게 조정할 수 있도록 다양한 옵션 플래그를 제공한다. ([참조](https://turbo.build/repo/docs/reference/run))

예를 들면, 다음과 같은 워크플로가 있다:

- **일반적인 명령어의 변형**
  - `turbo build` : 전체 패키지를 빌드한다.
  - `turbo build --filter=@repo/ui` : ui 패키지만 빌드한다.
- **일회성 명령어**
  - 자주 사용하진 않지만 가끔씩 필요한 특수한 태스크를 실행한다.
  - 이러한 명령어는 필요할 때 직접 입력해서 사용한다.
  - `turbo build --dry`
- **설정 일시 변경**
  - `turbo.json` 에 지정된 기본 설정으로 일시적으로 변경할 수 있다.
  - `turbo lint --output-logs=errors`
    - 원래는 모든 로그를 보여주도록 설정되어 있지만, 옵션을 사용 하면 오류 로그만 보여줄 수 있다.

## 여러 태스크 실행하기

`turbo` 는 여러 태스크를 실행할 수 있으며, 가능한 경우 병렬로 처리한다.

```bash
turbo run build test lint check-types
```

:::note 태스크의 순서
명령어에서 태스크의 순서는 중요하지 않다.

Turborepo가 태스크 간의 관게를 고려하여 알아서 적절한 순서로 태스크를 실행한다.

예를 들어, `turbo test lint` 와 `turbo lint test` 의 결과는 같다.

특정 태스크가 다른 태스크에 의존성이 있다면 이를 별도로 [설정 파일에 정의](http://localhost:8090/docs/turborepo/crafting-your-repository-configuring-tasks/)해야 한다.
:::

## 필터 사용하기

- [캐싱](https://turbo.build/repo/docs/crafting-your-repository/running-tasks)은 동일한 태스크를 두 번 하지 않도록 하여 작업 속도를 유지하는 반면,
- 필터를 사용하면 필요에 따라 [태스크 그래프](https://turbo.build/repo/docs/core-concepts/package-and-task-graph#task-graph)의 일부만 실행하도록 태스크를 선별할 수 있다.

:::note --filter API 고급 사용 사례
자세한 내용은 [문서](https://turbo.build/repo/docs/reference/run#--filter-string)를 참조한다.
:::

필터의 일반적인 사용 사례는 다음과 같다.

### 패키지 이름으로 필터링하기

현재 작업 중인 패키지에 대해서만 태스크를 실행할 수 있다.

```bash
turbo build --filter=@acme/web
```

### 디렉토리로 필터링하기

관련 패키지들을 그룹화하는 디렉토리 구조가 있는 경우, 글로브(glob)를 사용하여 해당 그룹의 패키지들에 대해서만 태스크를 실행할 수 있다.

```bash
turbo lint --filter="./packages/utilities/*"
```

### 의존하는 패키지를 포함하여 필터링하기

어떤 패키지를 변경하면, 그 패키지를 사용하는 다른 패키지들도 영향을 받을 수 있다.

이때 `...` 문법을 사용할 수 있다.

```bash
turbo build --filter=...ui
```

위의 명령은 `ui` 패키지와 함께 `ui` 패키지를 사용하는 모든 다른 패키지들도 빌드한다.

이렇게 하면 한 패키지를 변경했을 때, 그 변경이 다른 패키지들에 문제를 일으키지 않는지 한 번에 확인할 수 있다.

### 소스 컨트롤 변경을 기준으로 필터링하기

프로젝트에서 코드를 변경했을 때, 변경된 부분과 관련된 태스크만 실행할 수 있다.

이 필터들은 `[]` 안에 넣어 사용한다. 예를 들면:

1. **이전 커밋과 비교하기**:
   - `turbo build --filter=[HEAD^1]`
   - 가장 최근에 변경한 부분만 빌드한다.
2. **메인 브랜치와 비교하기**:
   - `turbo build --filter=[main...my-feature]`
   - 메인 브랜치에서 변경된 부분만 빌드한다.
3. **SHA를 사용하여 특정 커밋들 사이의 변경 비교하기**:
   - `turbo build --filter=[a1b2c3d...e4f5g6h]`
   - 두 커밋 사이에 변경된 부분만 빌드한다.
4. **다른 브랜치와 비교하기**:
   - `turbo build --filter=[your-feature...my-feature]`
   - 두 브랜치 사이의 차이점만 빌드한다.

:::note
이 방법을 사용하면 변경된 부분만 효율적으로 작업할 수 있다.

또한 Turborepo의 캐시 기능을 사용하면, 변경되지 않은 부분은 이전 결과를 재사용하여 전체 작업 시간을 줄일 수 있다.
:::

### 필터 조합하기

더욱 세밀한 제어를 위해 여러 필터를 조합하여 사용할 수 있다.

```bash
turbo build --filter=...ui --filter={./packages/*} --filter=[HEAD^1]
```

필터는 **합집합**으로 결합되며, 이 중 어느 하나라도 해당되는 패키지에 대해 태스크가 실행된다.

:::note --filter API 고급 사용 사례
자세한 내용은 [문서](https://turbo.build/repo/docs/reference/run#--filter-string)를 참조한다.
:::
