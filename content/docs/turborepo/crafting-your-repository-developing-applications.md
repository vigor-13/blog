---
title: 애플리케이션 개발하기
description:
date: 2024-06-30
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/crafting-your-repository/developing-applications',
    },
  ]
---

Turborepo는 애플리케이션 개발 과정을 더 쉽고 효율적으로 만들어준다.

- 코드를 한 군데서 관리하므로 접근성이 높아지고 더 체계적으로 커밋할 수 있다.
- 강력한 터미널 UI와 여러 기능들로 개발자가 코드를 수정하고 확인하는 과정을 더 쉽고 효율적으로 만들어준다.

## 개발 태스크 구성하기

개발 태스크는 코드를 수정하는 동안 계속해서 백그라운드에서 실행되어야 하는 **장기 실행 태스크**다.

:::note
장기실행 태스크는 다음과 같은 것들이 있다.

- 개발 서버 실행 (예: hot reloading)
- 테스트 실행 (예: watch 모드)
- 애플리케이션 빌드 (예: hot reloading)

:::

다음과 같이 `turbo.json` 파일에 `dev` 태스크를 등록한다:

```json
// ./turbo.json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

- `cache: false`
  - Turborepo에게 태스크 결과를 캐시하지 않도록 지시한다.
  - 개발 태스크는 코드를 자주 변경하므로 캐시를 사용하지 않는 것이 좋다.
- `persistent: true`
  - Turborepo에게 태스크를 계속 유지하도록 지시한다.
  - 이렇게 설정된 태스크는 중지하기 전까지 끝나지 않는다.
  - 다른 태스크가 이러한 끝나지 않는 태스크에 의존하지 못하도록 방지한다.

이제 `dev` 태스크를 통해 개발 스크립트를 병렬로 실행할 수 있다:

```bash
turbo dev
```

### 다른 태스크 먼저 실행하기

`dependsOn` 을 사용하여 `dev` 태스크를 실행하기 전에 먼저 환경 설정이나 패키지 빌드를 수행할 수 있다.

```json
// ./turbo.json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["//#dev:setup"]
    },
    "//#dev:setup": {
      "outputs": [".codegen/**"]
    }
  }
}
```

위의 코드에서는 [루트 태스크](https://turbo.build/repo/docs/crafting-your-repository/configuring-tasks#registering-root-tasks)를 사용하고 있지만, [패키지내의 임의의 태스크](https://turbo.build/repo/docs/crafting-your-repository/configuring-tasks#depending-on-a-specific-task-in-a-specific-package)를 사용할 수도 있다.

### 특정 애플리케이션 실행하기

`--filter` 플래그를 사용하여 특정 패키지에서만 `dev` 태스크를 실행할 수 있다.

```bash
turbo dev --filter=web
```

## 감시 모드

`tsc --watch` 와 같이 많은 도구들이 내장 감시 모드를 지원한다.

하지만 감시 모드를 지원하지 않는 도구들도 있다.

이러한 경우 `turbo watch` 를 사용하여 감시 모드를 추가할 수 있다.

예를 들어 다음과 같은 경우:

:::tabs

@tab:active turbo.json#turbo.json

```json
{
  "tasks": {
    "dev": {
      "persistent": true,
      "cache": false
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

@tab packages/ui#packages-ui

```json
{
  "name": "@repo/ui"
  "scripts": {
    "dev": "tsc --watch",
    "lint": "eslint ."
  }
}
```

@tab apps/web#apps-web

```json
{
  "name": "web"
  "scripts": {
    "dev": "next dev",
    "lint": "eslint ."
  },
  "dependencies": {
      "@repo/ui": "workspace:*"
    }
}
```

:::

`turbo watch dev lint` 를 실행하면, ESLint가 감시 모드를 지원하지 않음에도 소스 코드를 변경할 때마다 `lint` 스크립트가 다시 실행된다.

`turbo watch` 는 내부 의존성도 인식하므로, `@repo/ui` 의 코드를 변경하면 `web` 의 태스크도 다시 실행된다.

`dev` 태스크는 `persistent` 를 설정하였으므로, `web` 의 Next.js 개발 서버와 `@repo/ui` 의 TypeScript 내장 감시 모드를 방해하지 않고 그대로 활용할 수 있다.

## 제한 사항

### 정리 태스크

`dev` 태스크를 끝내고 나서 마무리 작업이 필요할 수 있다.

예를 들어, 임시 파일을 삭제하거나 연결을 끊는 등의 작업이다.

하지만 `dev` 태스크가 끝나면 `turbo` 도 함께 종료된다.

때문에 `dev` 태스크가 끝난 후에는 다른 작업을 수행할 수 없다.

대신 `dev` 태스크 후에 수동으로 실행할 수 있는 별도의 `turbo dev:teardown` 스크립트를 만든다.

좀 번거롭긴 하지만, 현재로서는 이 방법이 가장 좋다.
