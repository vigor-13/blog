---
title: 모노레포에서 태스크 실행하기
description:
date: 2024-01-17
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks',
    },
  ]
---

모든 모노레포에는 **워크스페이스**(작업 공간)와 **태스크**(작업)라는 두 가지 주요 구성 요소가 있다. 각각 3개의 태스크가 있는 3개의 워크스페이스가 있는 모노레포가 있다고 가정해 보자:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo-doc-turborepo-in-monorepo/3.png)

여기서 `apps/web`과 `apps/doc` 모두 `packages/shared` 코드를 사용한다. 실제로 `build`를 통해 빌드할 때 `packages/shared`를 먼저 빌드해야 한다.

## 대다수의 도구는 속도에 최적화되어 있지 않다 {#optimization}

모든 워크스페이스에서 모든 태스크를 실행하고 싶다고 가정해 보자. `yarn` 과 같은 도구를 사용하면 다음과 같은 스크립트를 실행해야 한다:

```bash
yarn workspaces run lint
yarn workspaces run test
yarn workspaces run build
```

결과, 태스크들은 다음과 같은 형태로 실행된다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo-doc-running-task/1.png)

보시다시피 모든 워크스페이스에서 `lint` 가 실행된다. 그런 다음 `build` 가 실행되고 (`shared` 워크스페이스가 먼저 실행된다). 마지막으로 `test` 가 실행된다.

이 방법은 이러한 태스크를 실행하는 가장 느린 방법이다. _각 태스크는 이전 태스크가 완료될 때까지 기다려야 시작할 수 있다._ 이 문제를 개선하려면 멀티태스킹이 가능한 도구가 필요하다.

## 터보레포는 멀티태스킹이 가능하다 {#multitasking}

터보레포는 태스크 간의 종속성을 파악하여 작업 속도를 극대화할 수 있다.

먼저 `turbo.json` 에 태스크를 선언한다:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**", ".svelte-kit/**"],
      // ^build means `build` must be run in dependencies
      // before it can be run in this workspace
      "dependsOn": ["^build"]
    },
    "test": {},
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

다음으로, `yarn workspaces` 스크립트를 아래의 스크립트로 대체할 수 있다:

```bash
- yarn workspaces run lint
- yarn workspaces run test
- yarn workspaces run build
+ turbo run lint test build
```

터보레포를 실행하면 사용 가능한 모든 CPU를 통해 최대한 많은 작업을 멀티태스킹하므로 작업이 다음과 같이 실행된다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo-doc-running-task/2.png)

`lint` 와 `test`는 모두 `turbo.json` 에 `dependeOn` 이 지정되어 있지 않므로 즉시 실행된다.

`shared` 워크스페이스 내부의 `build` 태스크가 먼저 완료된 다음 `web` 및 `docs` 빌드가 나중에 완료된다.

## 파이프라인 정의하기 {#pipeline}

`pipeline` 구성은 모노레포에서 어떤 태스크가 서로 종속되는지를 선언한다. 다음은 기본 예시다:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      // 워크스페이스의 `build` 태스크는 해당 워크스페이스의 종속성에 의존한다.
      // `build` 태스크는 먼저 완료된다. 기호 `^`는 업스트림 종속성을 나타낸다.
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", ".svelte-kit/**"]
    },
    "deploy": {
      // 워크스페이스의 'deploy' 태스크는 같은 워크스페이스의 `build`, `test`, `lint` 태스크의 결과에 의존한다,
      "dependsOn": ["build", "test", "lint"]
    },
    "test": {
      // 워크스페이스의 `test` 태스크는 해당 워크스페이스의 `build` 태스크에 의존한다.
      "dependsOn": ["build"],
      // 워크스페이스의 `test` 태스크는 다음과 같은 경우에만 다시 실행해야 한다.
      // 즉 `.tsx` 또는 `.ts` 파일이 변경된 경우에만 재실행된다.
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts", "test/**/*.tsx"]
    },
    // 워크스페이스의 `lint` 작업에는 종속성이 없으며
    // 언제든 실행할 수 있습니다.
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

다음 섹션에서 태스크를 설정하는 방법에 대해 자세히 알아볼 수 있다.

## 루트 패키지의 태스크 실행하기 {#root-task}

`turbo` 는 모노레포의 루트에 있는 `package.json` 파일에 존재하는 태스크들도 실행할 수 있다. 이러한 태스크들은 `"//#<task>"` 구문을 사용하여 명시적으로 파이프라인 구성에 추가되어야 한다. 이는 이미 해당 태스크에 대한 항목이 있는 경우에도 적용된다. 예를 들어 파이프라인이 `"build"` 태스크를 선언하고 있으며, 루트 `package.json` 파일에 정의된 빌드 스크립트를 `turbo run build` 에 포함시키고 싶다면 구성에서 `"//#build": {...}` 를 선언하여 루트를 이에 참여시켜야 한다. 반대로 `"//#my-task": {...}` 만 필요한 경우에는 일반적인 `"my-task": {...}` 항목을 정의할 필요가 없다.

루트의 `format` 태스크를 정의하고 루트를 `test` 태스크의 대상으로 선택하는 샘플 파이프라인은 다음과 같다:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", ".svelte-kit/**"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    // "turbo run test" 명령어가 실행될 때 루트 패키지의 "test" 스크립트도 실행되도록 한다.
    "//#test": {
      "dependsOn": []
    },
    // "turbo run format" 명령어가 실행될 때 루트 패키지의 package.json의 "format" 스크립트가 실행되도록 한다.
    // turbo.json 파일에 일반 "format" 태스크가 정의되어 있지 않으므로 루트의 "format" 스크립트만 실행된다.
    "//#format": {
      "dependsOn": [],
      "outputs": ["dist/**/*"],
      "inputs": ["version.txt"]
    }
  }
}
```

:::warning 재귀에 대한 참고 사항
모노레포의 루트 `package.json` 에 정의된 스크립트는 종종 `turbo` 자체를 호출한다. 예를 들어 `build` 스크립트가 `turbo run build` 일 수 있다. 이 경우 `turbo run build` 에 `//#build`를 포함하면 무한 재귀가 발생한다. 이러한 이유로 모노레포의 루트에서 실행되는 태스크는 파이프라인 구성에 `//#<task>` 를 포함하여 명시적으로 선택해야 한다. `turbo` 에는 재귀 상황에서 오류를 생성하는 몇 가지 최선의 검사 기능이 포함되어 있지만, 재귀를 유발하는 `turbo run`을 트리거하지 않는 태스크만 선택하도록 하는 것은 사용자의 책임이다.
:::

### 증분 채택(Incremental Adoption) {#incremental-adoption}

`turbo.json` 에서 태스크를 선언한 후에는 `package.json` 이를 구현하는 것은 사용자의 몫이다. 스크립트를 한 번에 모두 추가하거나 한 번에 하나의 워크스페이스를 추가할 수 있다. 터보레포는 워크스페이스의 `package.json` 에 태스크가 포함되지 않았다면 자동으로 건너뛴다.

예를 들어 위에서 언급한 것과 비슷한 세 개의 워크스페이스가 있는 경우를 상상해보자:

```text
apps/
  web/package.json
  docs/package.json
packages/
  shared/package.json
turbo.json
package.json
```

여기서 `turbo.json`은 `build` 태스크를 선언하지만 두 개의 `package.json`에서만 해당 `build` 태스크를 구현한다:

:::tabs

@tab:active turbo.json#turbo-json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    }
  }
}
```

@tab web#web

```json
{
  "name": "web",
  "scripts": {
    "build": "next build"
  }
}
```

@tab docs#docs

```json
{
  "name": "docs",
  "scripts": {
    "build": "vite build"
  }
}
```

@tab shared#shared

`build` 스크립트가 없다!

```json
{
  "name": "shared",
  "scripts": {}
}
```

:::

```bash
turbo run build
```

터보 빌드는 `web` 및 `docs` 워크스페이스에 대한 `build` 스크립트만 실행한다. `shared` 패키지는 여전히 작업 그래프의 일부가 되지만 자동으로 건너뛰게 된다.
