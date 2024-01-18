---
title: 태스크 의존성
description:
date: 2024-01-18
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/core-concepts/monorepos/task-dependencies',
    },
  ]
---

터보레포(Turborepo)는 태스크(tasks)들이 서로 어떻게 연관되어 있는지 표현할 때 가장 강력하다. 이러한 관계를 "종속성"이라고 부르지만, 패키지 종속성은 `package.json` 파일에서 설치하는 패키지 종속성과는 다르다. 터보레포는 워크스페이스(workspaces)를 인식하지만, `turbo.json`에 명시적으로 `dependOn` 하지 않는 한 태스크 간의 관계를 자동으로 그리지는 않는다.

한 태스크가 다른 태스크에 종속되도록 만드는 방법에 대한 몇 가지 일반적인 패턴을 살펴보자.

## 동일한 워크스페이스에서 {#same-workspace}

다른 태스크보다 먼저 실행해야 하는 태스크이 있을 수 있다. 예를 들어 배포 전에 빌드를 실행해야 할 수도 있다.

두 태스크가 동일한 워크스페이스에 있는 경우 다음과 같이 관계를 지정할 수 있다:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {},
    "deploy": {
      // 워크스페이스의 `deploy` 태스크는 같은 워크스페이스의 `build` 태스크에 의존한다.
      "dependsOn": ["build"]
    }
  }
}
```

즉, `turbo deploy` 가 실행될 때마다 `build` 도 동일한 워크스페이스 내에서 실행된다.

## 의존하는 워크스페이스에서 {#dependent-workspace}

모노레포의 일반적인 패턴은 워크스페이스의 `build` 태스크가 종속된 모든 워크스페이스의 `build` 태스크의 완료된 후에만 실행되도록 선언하는 것이다.

:::note 태스크 종속성 vs 워크스페이스 종속성
이는 서로 다른 개념인 태스크 종속성(task dependencies)과 워크스페이스 종속성(workspace dependencies)을 모두 지칭하기 때문에 혼동될 수 있다. 워크스페이스 종속성은 `package.json`의 `dependencies` 및 `devDependencies` 인 반면, 태스크 종속성은 `turbo.json` 의 `dependsOn` 키를 말한다.
:::

`^` 기호("캐럿"이라고 함)는 태스크가 종속된 워크스페이스의 태스크에 종속되어 있음을 명시적으로 선언한다.

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      // 워크스페이스의 `build` 명령어는 해당 워크스페이스의 `dependencies` 와 `devDependencies`의 `build` 명령에 의존한다.
      "dependsOn": ["^build"]
    }
  }
}
```

위의 구성을 사용하면 앱에 다른 워크스페이스 패키지를 설치하는 경우 설치된 패키지의 `build` 스크립트가 항상 앱의 `build` 스크립트보다 먼저 실행된다.

## 임의의 워크스페이스에서 {#arbitrary-workspace}

때로는 한 워크스페이스 태스크가 다른 워크스페이스 태스크에 종속되기를 원할 수도 있다. 이는 기본적으로 태스크가 별도의 단계로 실행되는 `lerna` 또는 `rush` 에서 마이그레이션하는 레포지토리에 특히 유용할 수 있다. 때때로 이러한 구성은 위에서 본 것처럼 단순한 `pipeline` 구성으로는 표현할 수 없는 가정을 전제로 한다. 또는 CI/CD에서 `turbo` 를 사용할 때 애플리케이션 또는 마이크로서비스 간의 작업 시퀀스를 표현하고 싶을 수도 있다.

이러한 경우 `pipeline` 구성에서 `<workspace>#<task>` 구문을 사용하여 이러한 관계를 표현할 수 있다. 아래 예제에서는 백엔드의 `deploy` 및 `health-check` 스크립트에 종속되는 프론트엔드 애플리케이션의 `deploy` 스크립트와 `ui` 워크스페이스의 `test` 스크립트에 대해 설명한다:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    // 워크스페이스-태스크가 의존하는 다른 워크스페이스-태스크를 명시적으로 선언한다.
    "frontend#deploy": {
      "dependsOn": ["ui#test", "backend#deploy", "backend#health-check"]
    }
  }
}
```

`frontend#deploy` 에 대한 위와 같은 설정은 `test` 및 `deploy` 태스크 설정과 충돌하는 것처럼 보일 수 있지만 그렇지 않다. `test` 및 `deploy`는 다른 워크스페이스(예: `^<task>`)에 대한 종속성이 없으므로 해당 워크스페이스의 `build` 및 `test` 스크립트가 완료된 후 언제든지 실행할 수 있다.

:::warning

1. 이 `<workspace>#<task>` 구문은 유용한 이스케이프 해치이지만, 일반적으로 빌드-시간 종속성보다는 상태 확인(health checks)과 같은 배포 오케스트레이션 작업에 사용하는 것이 좋으므로 터보레포가 이러한 작업을 보다 효율적으로 최적화할 수 있다.
2. Workspace-tasks는 캐시 구성을 상속하지 않는다. 현 시점에서 `outputs`을 다시 선언해야 한다.
3. `<workspace>`는 워크스페이스의 `package.json`에 있는 `name` 키와 일치해야 하며, 그렇지 않으면 태스크가 무시된다.

:::

## 종속성 없음 {#no-dependencies}

종속성 목록이 비어 있으면(`dependsOn`이 정의되지 않았거나 `[]`) 이 태스크 전에 아무것도 실행할 필요가 없다는 뜻이다! 즉 종속성이 없다.

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    // 워크스페이스의 `lint` 명령은 종속성이 없으며 언제든지 실행할 수 있다.
    "lint": {}
  }
}
```

## 태스크 외부의 종속성 {#outside-task-dependencies}

두 개의 앱, 즉 `docs` 와 `web` 에서 사용하는 공통 `ui` 패키지가 있다고 가정해 보자.

```text
apps/
  docs/package.json # Depends on ui
  web/package.json  # Depends on ui
packages/
  ui/package.json   # No workspace dependencies
turbo.json
package.json
```

워크스페이스에 타입스크립트로 코드를 작성했으면 이제 `tsc`를 실행하여 타입을 확인할 차례다. 여기에는 두 가지 요구 사항이 있다:

- **모든 타입 검사는 빠른 속도를 유지하기 위해 병렬로 실행된다**: 타입 검사 결과는 서로 의존하지 않으므로 모든 검사를 병렬로 실행할 수 있다.
- **종속성이 변경되면 캐시가 누락될 수 있다**: `ui` 패키지가 변경되면 `docs` 또는 `web`의 타입 검사 태스크에서 캐시 miss를 하여 새로 태스크를 실행해야 한다.

이를 위해 그래프에 가짜 재귀 태스크를 생성하고 이에 의존한다:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "topo": {
      "dependsOn": ["^topo"]
    },
    "typecheck": {
      "dependsOn": ["topo"]
    }
  }
}
```

`topo` 태스크는 스크립트에 존재하지 않으므로 터보레포는 태스크를 "즉시" 완료한 다음 해당 워크스페이스에 종속되어 있던 모든 워크스페이스를 찾는다. 따라서 태스크 그래프에서 다른 워크스페이스와의 관계를 이해하면서 태스크가 병렬로 실행된다.

### 왜 이 방법이 효과가 있을까? {#why-work}

요구 사항을 거의 충족하는 파이프라인을 살펴봄으로써 이것이 작동하는 이유를 더 깊이 이해할 수 있다.

다음과 같이 작업 정의에서 `dependsOn`을 생략하면 태스크의 병렬 처리를 달성할 수 있다:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "typecheck": {} // 이것으로는 충분하지 않다!
  }
}
```

`typecheck` 태스크는 성공적으로 병렬로 실행되지만 워크스페이스 종속성에 대해서는 알 수 없다!

다음 단계를 통해 이를 시연해 볼 수 있다:

1. `turbo typecheck` 실행
2. `ui` 패키지에서 일부 소스 코드 변경
3. `turbo typecheck --filter=web` 실행

이렇게 하면 3단계에서 캐시 히트에 도달하게 되지만 그렇게 하면 안 된다! `web` 워크스페이스에서 `ui` 패키지 코드의 변경으로 인해 유형 오류가 발생했을 수 있다. 3단계의 캐시 히트는 잘못된 것이므로 타입 오류를 발견할 수 없다.

이 문제를 해결하려면 `build` 태스크에서와 마찬가지로 토폴로지 종속성 그래프에 직접 종속되도록 선택할 수 있다:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "typecheck": {
      "dependsOn": ["^typecheck"] // 이것으로도 충분하지 않다!
    }
  }
}
```

이제 올바른 캐시 동작이 적용되어 `ui` 코드가 변경되면 `web` 에서 캐시가 miss 된다. 하지만 파이프라인을 매우 빠르게 실행할 수 있게 해주던 병렬 처리 기능이 사라졌다. 이제 `ui` 워크스페이스의 `typecheck` 태스크는 `web` 태스크가 시작되기 전에 완료되어야 한다.

종속된 워크스페이스에서 `typecheck` 명령을 훨씬 더 빨리 시작하여 "즉시 완료"되는 `ui` 태스크에 의존할 수 있다면 어떨까?

이것이 바로 '가짜' `topo` 태스크가 필요한 이유다:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "topo": {
      "dependsOn": ["^topo"]
    },
    "typecheck": {
      "dependsOn": ["topo"]
    }
  }
}
```

이 파이프라인에서는 `topo`라는 "synthetic" 태스크를 선언한다. `package.json` 파일에 `topo` 스크립트가 없으므로 `turbo typecheck` 파이프라인은 모든 `typecheck` 스크립트를 병렬로 실행하여 첫 번째 요구 사항을 충족한다.

하지만 이 `topo` 태스크는 `web`에서 `ui`로, 그리고 `docs`에서 `ui`로 "synthetic" 워크스페이스 종속성을 생성한다. 즉, `ui`에서 코드를 변경하면 `web` 및 `docs`의 워크스페이스에 대한 캐시 Miss가 발생하여 두 번째 요구 사항을 충족하게 된다.

파이프라인은 `typecheck`가 `topo` 태스크에 종속되고 `topo`가 `^topo`에 종속된다고 선언한다. 즉, 동일한 워크스페이스에서 `topo` 태스크가 모든 `typecheck` 태스크보다 먼저 실행되어야 하고 모든 패키지 종속성의 `topo` 태스크가 `topo` 태스크 자체보다 먼저 실행되어야 한다는 뜻이다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo-doc-task-dependencies/1.png)

왜 `typecheck`가 `^topo` 직접 종속되지 않는 걸까? 워크스페이스가 합성 작업을 통해 패키지 종속성을 재귀적으로 연결하기를 원하기 때문이다. `typecheck`가 `^topo`에 종속되면 `turbo`가 첫 번째 종속성 수준 이후에는 그래프에 추가를 중지한다.
