---
title: 환경변수 사용하기
description:
date: 2024-07-02
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/crafting-your-repository/using-environment-variables',
    },
  ]
---

환경 변수는 애플리케이션이 어떻게 동작할지 결정하는 중요한 설정이다.

물론 Turborepo를 사용할 때도 환경 변수를 잘 관리해야 한다.

Turborepo에서 환경 변수를 사용할 때, 다음 세 가지를 꼭 확인해야 한다:

- 태스크 지문에 환경 변수가 포함되는가?
- Turborepo가 어떤 <u>환경 모드</u>를 사용하고 있는가?
- `.env` 파일은 잘 처리했는가?

:::caution
환경 변수를 제대로 관리하지 않으면 잘못된 설정으로 앱을 배포할 수 있으며 심각한 경우, 프리뷰 버전을 프로덕션에 배포하는 등의 문제가 발생할 수 있다.
:::

:::note

두 가지 종류의 환경변수가 있다.

- **태스크 런타임을 위한 환경 변수**: 애플리케이션이나 스크립트가 실행될 때 사용하는 변수들이다.
- **Turborepo 설정을 위한 환경 변수**: Turborepo 자체의 동작을 제어하는 변수들이다.

Turborepo는 자체의 동작을 설정하기 위해 [시스템 환경 변수](https://turbo.build/repo/docs/reference/system-environment-variables)를 사용한다.

이중 일부 환경 변수는 Turborepo가 태스크의 고유 식별자(해시)를 생성할 때 영향을 미친다.

이는 캐시 사용 여부를 결정하는 데 중요한 역할을 한다.
:::

## 태스크 해시에 환경 변수 추가하기

Turborepo는 애플리케이션 동작의 변화를 고려하기 위해 환경 변수를 인식해야 힌다.

이를 위해 `turbo.json` 파일에서 `env` 와 `globalEnv` 키를 사용한다.

```json
// ./turbo.json
{
  "globalEnv": ["IMPORTANT_GLOBAL_VARIABLE"],
  "tasks": {
    "build": {
      "env": ["MY_API_URL", "MY_API_KEY"]
    }
  }
}
```

- `globalEnv`
  - 모든 태스크의 해시에 영향을 미친다.
- `env`
  - 모든 태스크가 환경 변수에 반응할 필요는 없다. 각 태스크에 필요한 환경 변수만 지정할 수 있다.
  - 특정 태스크에만 관련된 환경 변수를 지정한다. 즉, 각 태스크마다 다른 환경 변수 세트를 사용할 수 있다.
  - 예시
    - `lint` 태스크의 경우 `API_KEY` 가 변경되어도 태스크를 다시 실행할 필요는 없다.
    - `build` 태스크의 경우 `API_KEY` 가 변경되면 빌드를 다시 실행해야 한다.

:::note
Turborepo는 환경 변수에 대한 와일드카드를 지원한다.

특정 접두사를 가진 모든 환경 변수를 쉽게 고려할 수 있습니다.

자세한 내용은 [API 문서](https://turbo.build/repo/docs/reference/configuration#wildcards)를 참조한다.
:::

### 프레임워크 추론

Turborepo는 몇몇 프레임워크에 대해 자동으로 `env` 키에 접두사 와일드카드를 추가한다.

패키지에서 아래 프레임워크 중 하나를 사용하고 있다면, 이러한 접두사를 가진 환경 변수를 직접 추가할 필요가 없다:

| 프레임워크       | `env` 와일드카드  |
| ---------------- | ----------------- |
| Astro            | `PUBLIC_*`        |
| Blitz            | `NEXT_PUBLIC_*`   |
| Create React App | `REACT_APP_*`     |
| Gatsby           | `GATSBY_*`        |
| Next.js          | `NEXT_PUBLIC_*`   |
| Nuxt.js          | `NUXT_ENV_*`      |
| RedwoodJS        | `REDWOOD_ENV_*`   |
| Sanity Studio    | `SANITY_STUDIO_*` |
| Solid            | `VITE_*`          |
| SvelteKit        | `VITE_*`          |
| Vite             | `VITE_*`          |
| Vue              | `VUE_APP_*`       |

:::note
프레임워크 추론은 패키지별로 이루어진다.
:::

:::note 프레임워크 추론을 사용하지 않으려면?

- `--framework-inference=false` 옵션
- `env` 키에 부정 와일드카드를 추가 (예: `"env": ["!NEXT_PUBLIC_*"]`)

:::

## 환경 모드

Turborepo에는 환경 변수를 관리하는 두 가지 방법이 있다. 이를 **환경 모드**라고 한다.

환경 모드를 사용하면 태스크에서 어떤 환경 변수를 사용할지 제어 할 수 있다.

| 모드                                                                                                                   | 설명                                                                              |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [Strict 모드](https://turbo.build/repo/docs/crafting-your-repository/using-environment-variables#strict-mode) (기본값) | `turbo.json` 의 `env` 와 `globalEnv` 키에 지정된 환경 변수만 필터링하여 사용한다. |
| [Loose 모드](https://turbo.build/repo/docs/crafting-your-repository/using-environment-variables#loose-mode)            | 프로세스에 대해 모든 환경 변수를 사용할 수 있게 한다.                             |

### Strict 모드

strict 모드는 사용 가능한 환경 변수를 `turbo.json` 의 `globalEnv` 와 `env` 키에 지정된 변수만으로 제한한다.

strict 모드는 환경 변수 관련 문제를 조기에 발견하게 해주고, 태스크의 캐시가 오용되는 것을 방지한다.

:::warning Stict 모드의 캐시 안전성
strict 모드는 대부분의 경우 환경 변수 문제를 잡아내는 데 도움이 되지만 완벽하지는 않다.

일부 패키지는 환경 변수가 없어도 잘 작동하는 경우가 있다.

이런 경우, 태스크가 성공적으로 완료되어 의도하지 않은 캐시 히트가 발생할 수 있다.
:::

#### Passthrough 변수

Passthrough 변수는 특별한 종류의 환경 변수다. 이 변수들은 태스크에 필요하지만, 태스크의 결과에는 영향을 주지 않는다.

예를 들면 다음과 같은 경우다:

1. 로그를 남기는 데 사용하는 변수가 있다.
2. 이 변수가 바뀌어도 프로그램의 실제 결과물은 변하지 않는다.
3. 하지만 프로그램이 제대로 돌아가려면 이 변수가 필요하다.

이런 변수들은 특별하게 다뤄야 한다:

- [`globalPassThroughEnv`](https://turbo.build/repo/docs/reference/configuration#globalpassthroughenv) 또는 [`passThroughEnv`](https://turbo.build/repo/docs/reference/configuration#passthroughenv) 에 변수를 추가한다.
- 이렇게 하면 태스크에서 변수들을 사용할 수 있지만, 캐시에는 영향을 미치지 않는다.

#### CI 벤더 호환성

Strict 모드에서는 기본적으로 CI 벤더의 환경 변수를 사용하지 않는다.

사용하고 싶은 CI 환경 변수가 있다면, 이를 `env` 나 `globalEnv` 에 명시적으로 지정해야 한다.

일부 프레임워크의 경우 자동으로 CI 환경 변수를 포함시키기도 하지만 그렇지 않은 경우 설정 파일에 수동으로 추가해야 한다.

### Loose 모드

loose 모드는 환경 변수를 제한 없이 사용할 수 있다.

즉 `globalEnv` 와 `env` 설정에 상관없이 모든 환경 변수를 사용할 수 있다.

이는 strict 모드로 점진적으로 마이그레이션하고 싶은 경우 유용하다.

만약 스크립트가 특정 환경 변수를 찾지 못해 문제가 생긴다면, 다음과 같이 loose 모드를 활성화 할 수 있다:

```bash
turbo run build --env-mode=loose
```

loose 모드를 사용하면 모든 환경 변수를 쉽게 사용할 수 있다. 하지만 이로 인해 문제가 발생할 수 았다.

대표적으로 설정 파일에 환경 변수를 등록하는 것을 잊어버려, 캐싱 동작에서 오용이 발생할 수 있다.

예를 들어 다음과 같은 상황이 있을 수 있다:

```ts
// ./apps/web/data-fetcher.ts
const data = fetch(`${process.env.MY_API_URL}/resource/1`);
```

1. 앱에서 `API URL` 을 환경 변수로 사용한다.
2. 먼저 프리뷰용 URL로 앱을 빌드한다.
3. 나중에 프로덕션용 URL로 바꿔서 다시 빌드한다.
4. 프로덕션용 애플리케이션을 빌드할 때 캐시에서 이전 빌드를 그대로 사용한다.
5. 결과적으로, 새 URL이 아닌 이전의 프리뷰용 URL을 사용하게 되는 문제가 발생한다.

즉, 태스크 해시에 환경 변수를 고려하기 위해서 strict 모드를 사용하는 것을 권장한다.

## .env 파일 다루기

`.env` 파일은 로컬에서 환경 설정을 쉽게 관리할 수 있게 해준다.

`turbo` 는 `.env` 파일 처리에 관여하지 않는다. 대신, 프레임워크나 `dotenv` 같은 도구가 이 파일을 읽어 환경 변수로 설정한다.

그럼에도 `turbo` 가 `.env` 파일의 값 변경을 인식하는 것이 중요하다. (캐시의 사용 여부를 결정하기 위함)

이를 위해 `inputs` 에 파일들을 추가한다:

```json
// ./turbo.json
{
  "globalDependencies": [".env"], // 모든 태스크 해시에 적용
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", ".env", ".env.local"] // `build` 태스크 해시에만 적용
    }
  }
}
```

:::note
`.env` 파일을 사용하면 환경 변수가 `env` 에 추가되지 않았더라도 런타임에 변수를 로드할 수 있다.

하지만 CI, 프로덕션 환경에서는 `.env` 를 사용할 수 없는 경우가 있기 때문에 중요한 환경 변수는 반드시 `env` 키에 추가해야 한다.
:::

## 모범 사례

### 패키지 내에서 `.env` 파일 사용하기

레포지토리의 루트에서 `.env` 파일을 사용하지 않는 것이 좋다.

대신 `.env` 파일이 사용되는 패키지 내에 배치하는 것을 권장한다.

여기엔 다음과 같은 이점이 있다.

1. **실제 환경과 유사하게 만들기**
   - 각 패키지는 보통 자기만의 환경 설정을 갖는다. 패키지마다 별도의 `.env` 파일을 두면 이런 실제 환경을 더 잘 반영할 수 있다.
2. **대규모 프로젝트에의 이점**
   - 패키지가 많아질수록 관리상 이점이 있다.
3. **실수 방지**
   - 패키지의 설정이 다른 패키지에 잘못 적용되는 것을 방지할 수 있다.

### `eslint-config-turbo` 사용하기

[`eslint-config-turbo` 패키지](https://turbo.build/repo/docs/reference/eslint-config-turbo)는 코드에서 사용되고 있지만 `turbo.json` 에 등록되지 않은 환경 변수를 찾는 데 도움을 준다.

이를 통해 모든 환경 변수가 설정에 제대로 반영되도록 할 수 있다.

### 런타임에 환경 변수를 생성하거나 변경하지 않기

Turborepo는 태스크를 시작할 때 해당 태스크의 환경 변수를 해시화한다.

런타임에 환경 변수를 생성하거나 변경하면, Turborepo는 이러한 변경을 인식하지 못하고 태스크 해시에 반영하지 않는다.

예를 들어, Turborepo는 아래 예시의 인라인 변수를 감지할 수 없다:

```json
// ./apps/web/package.json
{
  "scripts": {
    "dev": "export MY_VARIABLE=123 && next dev"
  }
}
```

`MY_VARIABLE` 은 `dev` 태스크가 시작된 후에 환경에 추가되므로, `turbo` 는 이를 해시화에 사용할 수 없다.

## 예제

다음은 몇 가지 인기 있는 프레임워크에 대한 환경 변수 구성 예시다:

:::tabs

@tab:active Next.js#nextjs

- `build` 와 `dev` 태스크는 `MY_API_URL` 과 `MY_API_KEY` 의 변경에 대해 서로 다른 해시를 갖는다.
- Next.js와 같은 프레임워크는 여러 `.env` 파일을 [특정 순서](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#environment-variable-load-order)로 읽는다.
  - `turbo.json` 에서 이 로딩 순서를 반영하여 설정할 수 있다.
  - `build` 와 `dev` 태스크는 Next.js와 같은 파일 로딩 순서를 사용하며, `.env` 파일이 가장 높은 우선순위를 갖는다.
- `test` 태스크는 환경 변수를 사용하지 않으므로 `env` 를 생략했다.
  - 테스트 구조에 따라 `test` 태스크에 `env` 가 필요할 수 있다.

```json
// .turbo.json
{
  "tasks": {
    "build": {
      "env": ["MY_API_URL", "MY_API_KEY"],
      "inputs": [
        "$TURBO_DEFAULT$",
        ".env.production.local",
        ".env.local",
        ".env.production",
        ".env"
      ]
    },
    "dev": {
      "inputs": [
        "$TURBO_DEFAULT$",
        ".env.development.local",
        ".env.local",
        ".env.development",
        ".env"
      ]
    },
    "test": {}
  }
}
```

@tab Vite#vite

- `build` 와 `dev` 태스크는 `MY_API_URL` 과 `MY_API_KEY` 의 변경에 대해 서로 다른 해시를 갖는다.
- Vite는 여러 `.env` 파일을 [특정 순서](https://vitejs.dev/guide/env-and-mode#env-files)로 읽는다.
  - `turbo.json` 에서 이 로딩 순서를 반영하여 설정할 수 있다.
  - `build` 와 `dev` 태스크는 Vite와 같은 파일 로딩 순서를 사용하며, `.env` 파일이 가장 높은 우선순위를 갖는다.
- `test` 태스크는 환경 변수를 사용하지 않으므로 `env` 를 생략했다.
  - 테스트 구조에 따라 `test` 태스크에 `env` 가 필요할 수 있다.

```json
// .turbo.json
{
  "tasks": {
    "build": {
      "env": ["MY_API_URL", "MY_API_KEY"],
      "inputs": [
        "$TURBO_DEFAULT$",
        ".env.production.local",
        ".env.local",
        ".env.production",
        ".env"
      ]
    },
    "dev": {
      "inputs": [
        "$TURBO_DEFAULT$",
        ".env.development.local",
        ".env.local",
        ".env.development",
        ".env"
      ]
    },
    "test": {}
  }
}
```

:::

## 트러블슈팅

### `--summarize` 사용하기

`turbo run` 명령어에 [`--summarize` 플래그](https://turbo.build/repo/docs/reference/run#--summarize)를 추가하면 태스크에 대한 데이터를 요약한 JSON 파일을 생성한다.

이 파일은 전역적으로 사용된 환경 변수(globalEnv)와 특정 작업에만 사용된 환경 변수(env)를 구분하여 보여준다.

이를 통해 실제로 사용된 환경 변수와 `turbo.json` 에 설정된 환경 변수를 비교할 수 있다.
