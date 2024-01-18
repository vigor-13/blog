---
title: 워크스페이스 구성하기
description:
date: 2024-01-19
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/core-concepts/monorepos/configuring-workspaces',
    },
  ]
---

대부분의 모노레포는 루트 디렉토리의 `turbo.json` 으로 모든 워크스페이스에 적용되는 균일한 파이프라인을 선언할 수 있다. 때로는 모노레포에 태스크를 다르게 구성해야 하는 워크스페이스가 포함될 수 있다. 이를 수용하기 위해 버전 1.8부터는 터보레포에서 개별 워크스페이스의 `turbo.json` 으로 루트 설정을 확장할 수 있다. 이러한 유연성 덕분에 더욱 다양한 앱과 패키지가 공존할 수 있으며, 워크스페이스 소유자는 모노레포의 다른 앱과 패키지에 영향을 주지 않으면서도 특수한 작업과 구성을 유지할 수 있다.

## 어떻게 작동하는가 {#how-it-works}

루트 `turbo.json`에 정의된 모든 태스크에 대한 구성을 재정의하려면 최상위(top-level) `extends` 키를 사용하여 모노레포의 워크스페이스에 `turbo.json` 파일을 추가하면 된다:

```json
{
  "extends": ["//"],
  "pipeline": {
    "build": {
      // 이 워크스페이스의 빌드 작업에 대한 커스텀 설정
    },
    // 이 워크스페이스에서만 사용할 수 있는 새 태스크
    "special-task": {}
  }
}
```

:::warning
현재 `extends` 키에 유효한 값은 `["//"]` 뿐이다. `//`는 모노레포의 루트 디렉터리를 식별하는 데 사용되는 특수 이름이다.
:::

워크스페이스의 구성은 파이프라인 태스크에 대한 모든 설정을 재정의할 수 있다. 키를 포함하지 않으면 확장된 `turbo.json`에 설정이 상속된다.

## 예제 {#examples}

이해를 돕기 위해 몇 가지 사용 사례를 살펴보자.

### 다른 프레임워크 {#different-frameworks}

모노레포에 여러 개의 Next.js 앱과 하나의 SvelteKit 앱이 있다고 가정해 보자. 두 프레임워크 모두 각각의 `package.jsons`에 있는 빌드 스크립트를 사용하여 빌드 출력을 생성한다. 다음과 같이 루트에서 단일 `turbo.json`으로 이러한 태스크를 실행하도록 터보레포를 구성할 수 있다:

```json
{
  "pipeline": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**", ".svelte-kit/**"]
    }
  }
}
```

Next.js 앱이 `.svelte-kit` 디렉토리를 생성하지 않더라도 `.next/**` 및 `.svelte-kit/**`를 모두 `outputs`으로 지정해야 하며, 그 반대의 경우도 마찬가지다. 대신 워크스페이스 구성을 사용하면 `apps/my-svelte-kit-app/turbo.json`의 SvelteKit 워크스페이스에서 사용자 지정 구성을 추가할 수 있다:

```json
{
  "extends": ["//"],
  "pipeline": {
    "build": {
      "outputs": [".svelte-kit/**"]
    }
  }
}
```

그리고 루트 구성에서 설정을 제거한다.

```diff-json
{
  "pipeline": {
    "build": {
-      "outputs": [".next/**", "!.next/cache/**", ".svelte-kit/**"]
+      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

이렇게 하면 각 구성을 더 쉽게 읽을 수 있을 뿐만 아니라 구성을 사용하는 위치에 더 가깝게 배치할 수 있다.

### 특화된 태스크 {#specialized-tasks}

다른 예로, 한 워크스페이스의 `build` 태스크가 `compile` 태스크에 의존한다고 가정해 보자. 이때 보통은 `dependsOn: ["compile"]`으로 선언할 수 있다. 그 결과, 루트 `turbo.json`에 빈 `compile` 태스크 항목이 있어야 한다:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["compile"]
    },
    "compile": {}
  }
}
```

워크스페이스 구성을 사용하면 해당 `compile` 태스크를 `apps/my-custom-app/turbo.json`으로 이동할 수 있다,

```json
{
  "extends": ["//"],
  "pipeline": {
    "build": {
      "dependsOn": ["compile"]
    },
    "compile": {}
  }
}
```

그리고 루트에선 코드를 제거한다.

```diff-json
{
  "pipeline": {
+    "build": {}
-    "build": {
-      "dependsOn": ["compile"]
-    },
-    "compile": {}
  }
}
```

이제 `my-app`의 소유자는 `build` 태스크에 대한 완전한 소유권을 가지면서도 루트에 정의된 다른 모든 태스크를 계속 상속할 수 있다.

## Workspace-specific tasks 와의 차이점 {#comparison-to-workspace-specific-tasks}

언뜻 보기에 워크스페이스 구성은 루트 `turbo.json`의 `workspace#task` 구문과 매우 비슷하게 보일 수 있다. 기능은 비슷하지만 한 가지 중요한 차이점이 있다. 루트 `turbo.json`에서 Workspace-specific tasks를 선언하면 기본 태스크 설정을 완전히 덮어쓴다. 워크스페이스 구성을 사용하면 대신 태스크 설정이 병합된다.

여러 개의 Next.js 앱과 Sveltekit 앱이 있는 모노레포의 예를 다시 생각해 보자. 다음과 같이 루트 `turbo.json`을 구성할 수 있다:

```json
{
  "pipeline": {
    "build": {
      "outputMode": "hash-only",
      "inputs": ["src/**"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "my-sveltekit-app#build": {
      "outputMode": "hash-only", // 중복 코드 발생
      "inputs": ["src/**"], // 중복 코드 발생
      "outputs": [".svelte-kit/**"]
    }
  }
}
```

이 예제에서는 `my-sveltekit-app#build`가 Sveltekit 앱의 `build`를 완전히 덮어쓰므로 `outputMode`와 `inputs`도 복제해야 한다.

워크스페이스 구성을 사용하면 `outputMode`와 `inputs`이 상속되므로 복제할 필요가 없다. `outputs` `my-sveltekit-app` 설정만 재정의하면 된다.

:::note
Workspace-specific tasks 구성을 제거할 계획은 없지만, 대신 대부분의 사용 사례에 워크스페이스 구성을 사용할 수 있을 것으로 예상된다.
:::

## 제한 {#limitations}

일반적인 아이디어는 루트 `turbo.json`과 동일하지만, 워크스페이스 구성에는 워크스페이스가 혼란스러운 상황을 만드는 것을 방지할 수 있는 가드레일 세트가 함께 제공된다. 이러한 가드레일은 우발적인 것이 아니라 의도적인 것임을 분명히 하기 위해 여기에 소개한다:

- 워크스페이스 구성은 파이프라인 항목으로 `workspace#task` 구문을 사용할 수 없다.

`workspace`는 구성 위치에 따라 추론되며, 다른 워크스페이스에 대한 구성은 변경할 수 없다. 예를 들어, 'my-nextjs-app'에 대한 워크스페이스 구성에서:

```json
{
  "pipeline": {
    "my-nextjs-app#build": {
      // ❌ 허용되지 않는다.
      // 올바른 워크스페이스를 참조하고 있지만 중복이다.
      // 또한 이 문법은 다른 워크스페이스에 영향을 줄 수 있으므로 허용되지 않는다.
    },
    "my-sveltekit-app#build": {
      // ❌ 다른 워크스페이스 구성을 변경하는 것은 허용되지 않는다.
    },
    "build": {
      // ✅ 그냥 태스크 이름을 사용하면 된다!
    }
  }
}
```

`build` 태스크는 여전히 Workspace-specific tasks에 종속될 수 있다는 점에 유의하라:

```json
{
  "pipeline": {
    "build": {
      // ✅ dependsOn에 다른 워크스페이스#태스크를 추가하는 것은 여전히 가능하다!
      "dependsOn": ["some-pkg#compile"]
    }
  }
}
```

- 워크스페이스 구성은 `pipeline` 키 외부의 어떤 것도 재정의할 수 없다.

예를 들어, `globalEnv` 또는 `globalDependencies`를 재정의할 수 없다. 모노레포 소유자가 이를 절대적으로 제어해야 하며, 이 구성이 진정한 글로벌 구성이 아니라면 그런 식으로 구성해서는 안 된다.

- 루트 `turbo.json`은 `extends` 키를 사용할 수 없다.

워크스페이스에 순환 종속성을 피하기 위해 루트 `turbo.json`은 어디에서도 확장할 수 없다.

## 트러블슈팅 {#troubleshooting}

대규모 모노레포의 경우 터보레포가 구성을 어떻게 해석하는지 이해하기 어려울 수 있다. 이를 돕기 위해 `resolvedTaskDefinition`을 추가했다. 예를 들어, `turbo run build --dry-run`을 실행하면 `build` 태스크를 실행하기 전에 고려한 모든 `turbo.json` 구성의 조합이 출력에 포함된다.
