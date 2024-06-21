---
title: 태스크 구성하기
description:
date: 2024-06-21
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/crafting-your-repository/configuring-tasks',
    },
  ]
---

Turborepo는 다음과 같은 방식으로 태스크를 실행한다.

- `turbo.json` 과 패키지 그래프에 설명된 순서대로 태스크를 실행한다.
- 가능한 모든 태스크를 동시에(병렬로) 실행하여 전체 실행 시간을 단축한다.

:::tabs

@tab:active Turborepo를 사용하지 않은 경우#no-turborepo

예를들어, Turborepo를 사용하지 않는 경우 태스크는 다음과 같이 실행된다.

```bash
yarn workspaces run lint && yarn workspaces run test && yarn workspaces run build
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo/crafting-your-repository-configuring-tasks/1.png)

@tab Turborepo를 사용한 경우#with-turborepo

반대로, Turborepo를 사용하면 동일한 태스크를 <u>더 빠르게</u> 수행할 수 있다.

```bash
turbo run lint test build
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo/crafting-your-repository-configuring-tasks/2.png)

:::

## 시작하기

- 태스크는 루트 디렉토리의 `turbo.json` 파일에서 정의할 수 있다.
- 태스크를 정의하고 나면 `turbo run` 명령을 사용하여 태스크를 실행할 수 있다.

## 태스크 정의하기

- 태스크는 `turbo.json` 파일의 [`tasks` 객체](https://turbo.build/repo/docs/reference/configuration#tasks)에 정의한다.
- Turborepo는 `turbo.json` 에 정의된 태스크와 같은 이름의 스크립트를 각 패키지의 `package.json` 파일에서 찾는다.
- `tasks` 객체의 각 키는 `turbo run` 으로 실행할 수 있다.

예를 들어, 의존성이나 출력이 없는 기본적인 `build` 태스크는 다음과 같이 정의할 수 있다:

```json
// ./turbo.json
{
  "tasks": {
    "build": {} // 추가적인 세부 설정 필요!
  }
}
```

위의 상태에서 `turbo run build` 를 실행하면, Turborepo는 모든 패키지의 `build` 스크립트를 병렬로 실행하지만 출력을 캐시하지 않는다.

태스크를 더 안전하고 효율적으로 실행하기 위해서는 추가적인 설정이 필요하다.

### 올바른 순서로 태스크 실행하기

`dependsOn` 을 사용하여 태스크의 의존성을 정의할 수 있다.

예를 들어, 대부분의 경우 라이브러리 패키지의 `build` 스크립트가 애플리케이션 패키지의 `build` 스크립트보다 먼저 완료되어야 한다.

이를 위해 다음과 같이 `turbo.json` 을 정의할 수 있다:

```json
// ./turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

위의 설정은 "build" 태스크가 다른 "build" 태스크에 의존한다는 것을 나타낸다.

#### 다른 패키지의 태스크에 의존하기 (`^` 기호의 의미)

`^` 기호는 **의존성의 가장 기본이 되는 부분부터 시작해서 위로 올라가며 태스크를 실행하라**는 의미다.

예를 들어, 애플리케이션이 `ui` 라이브러리에 의존한다면, `ui` 의 `build` 스크립트가 <u>먼저</u> 실행된다.

이를 통해서 애플리케이션의 `build` 태스크가 컴파일에 필요한 모든 의존성을 갖추도록 보장할 수 있다.

#### 같은 패키지 내의 태스크에 의존하기

때로는 같은 패키지 내의 다른 태스크에 의존하는 경우가 있다.

예를 들어, 라이브러리에서 `test` 태스크를 실행하기 전에 `build` 태스크를 먼저 실행해야 할 수 있다.

이를 위해 `dependsOn` 키에 스크립트를 일반 문자열(`^` 없이)로 지정한다.

```json
// ./turbo.json
{
  "tasks": {
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

#### 특정 패키지의 특정 태스크에 의존하기

특정 패키지의 개별 태스크에 의존하도록 지정할 수도 있다.

아래 예시에서는 모든 `lint` 태스크 전에 `utils` 의 `build` 태스크가 실행된다.

```json
// ./turbo.json
{
  "tasks": {
    "lint": {
      "dependsOn": ["utils#build"]
    }
  }
}
```

의존하는 태스크에 대해 더 구체적으로 지정할 수도 있으며, 특정 패키지로 제한할 수 있다:

```json
// ./turbo.json
{
  "tasks": {
    "web#lint": {
      "dependsOn": ["utils#build"]
    }
  }
}
```

위 예시에서는 `utils` 패키지의 `build` 태스크가 완료된 후에만 `web` 패키지의 `lint` 태스크를 실행한다.

#### 의존성 없음

일부 태스크는 의존성이 없을 수도 있다.

예를 들어, 마크다운 파일의 오타를 찾는 태스크의 경우 다른 태스크의 상태를 신경 쓸 필요가 없다.

이 경우 `dependsOn` 키를 생략하거나 빈 배열을 사용한다.

```json
// ./turbo.json
{
  "tasks": {
    "spell-check": {
      "dependsOn": []
    }
  }
}
```

### outputs 설정하기

Turborepo는 태스크의 결과물을 캐시하여 같은 작업을 두 번 하지 않도록 한다.

`outputs` 키는 Turborepo에게 태스크가 성공적으로 완료되었을 때 캐시해야 할 대상을 지정한다.

**이 키가 정의되지 않으면, Turborepo는 어떤 파일도 캐시하지 않으며, 이후 실행에서 어떤 파일 출력도 복원되지 않는다.**

:::tabs

@tab:active Next.js#nextjs

```json
// ./turbo.json
{
  "tasks": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

@tab Vite#vite

```json
// ./turbo.json
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}
```

@tab tsc#tsc

```json
// ./turbo.json
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}
```

:::

`outputs` 키에 대한 Glob 패턴 작성에 대해 더 알아보려면, [명세](https://turbo.build/repo/docs/reference/globs)를 참조한다.

### inputs 설정하기

기본적으로 Turborepo는 Git이 추적하는 모든 파일을 `inputs` 으로 간주한다.

때문에 Git이 변경을 감지하는 모든 파일이 캐시 대상이 된다.

`inputs` 키를 사용하면 이러한 기본 동작을 변경할 수 있다.

즉, 특정 파일이나 패턴만 캐시할 수 있도록 설정할 수 있다.

예를 들어, 마크다운 파일의 오타를 찾는 태스크는 다음과 같이 정의할 수 있다:

```json
// ./turbo.json
{
  "tasks": {
    "spell-check": {
      "inputs": ["**/*.md", "**/*.mdx"]
    }
  }
}
```

이제 마크다운 파일의 변경사항만이 `spell-check` 태스크의 캐시 미스를 유발한다.

다른 파일(예 `.js`, `.css` 등)이 변경되어도 `spell-check` 태스크는 이전 캐시를 그대로 사용한다.

:::caution
`inputs` 을 직접 지정하면, Git의 추적 정보를 사용하는 기본 동작이 완전히 무시된다.

이는 `.gitignore` 에 지정된 파일들도 더 이상 자동으로 제외되지 않음을 의미한다.

때문에 불필요한 파일(예: 로그, 임시 파일 등)이 포함되지 않도록 주의해야 하며,

이전에 `.gitignore` 로 제외되던 파일들도 Glob 패턴을 사용하여 명시적으로 제외해야 한다.
:::

#### `$TURBO_DEFAULT$`로 기본값 복원하기

대부분의 경우 기본 `inputs` 동작만으로도 충분하다.

하지만 `$TURBO_DEFAULT$` 문법을 사용하여 `inputs` 을 미세 조정하여 캐시 히트율을 높일 수 있다.

```json
// ./turbo.json
{
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", "!README.md"]
    }
  }
}
```

위의 예시에서 `build` 태스크는 기본 `inputs` 동작을 사용하지만, `README.md` 파일의 변경은 무시한다.

즉, `README.md` 파일이 변경되더라도 태스크는 여전히 캐시를 사용한다.

### 루트 태스크 등록하기

루트 `package.json` 에 있는 스크립트도 `turbo` 를 사용하여 실행할 수 있다.

예를 들어, 각 패키지의 `lint` 작업 외에도 루트 디렉토리의 파일에 대해 `lint` 작업을 실행하고 싶을 수 있다:

:::tabs

@tab:active turbo.json#turbo-json

```json
// ./turbo.json
{
  "tasks": {
    "lint": {
      "dependsOn": ["^lint"]
    },
    "//#lint:root": {}
  }
}
```

@tab package.json#package-json

```json
// package.json
{
  "scripts": {
    "lint": "turbo run lint",
    "lint:root": "eslint ."
  }
}
```

:::

#### 루트 태스크를 사용해야 하는 경우

- **워크스페이스 루트의 린팅과 포맷팅**: 워크스페이스 루트에 린팅과 포맷팅이 필요한 코드가 있는 경우.
- **점진적 마이그레이션**: Turborepo로 마이그레이션하는 동안, 아직 패키지로 옮기지 않은 일부 스크립트가 있는 경우.
- **패키지 범위가 없는 스크립트**: 특정 패키지에 속하지 않고, 프로젝트 전체에 관련된 스크립트가 있는 경우.

## 고급 사용 사례

### 개별 패키지 구성 사용하기

[패키지 구성](https://turbo.build/repo/docs/reference/package-configurations)은 패키지 내부에 위치한 `turbo.json` 파일이다.

이를 통해 패키지는 레포지토리의 나머지 부분에 영향을 주지 않으면서 자체 작업에 대한 개별 동작을 정의할 수 있다.

이는 다수의 팀이 참여하는 대규모 모노레포에서 팀들이 자신들의 태스크를 더 잘 제어할 수 있게 해준다. 자세한 내용은 [패키지 구성 문서](https://turbo.build/repo/docs/reference/package-configurations)를 참조한다.

네, 이 텍스트를 한국어로 번역해 드리겠습니다.

### 캐시 무시하고 태스크 실행하기

빌드 후의 배포처럼 일부 태스크는 캐시와 관계 없이 항상 새로 실행되어야 한다.

이러한 경우 `cache: false` 를 설정한다.

```json
// ./turbo.json
{
  "tasks": {
    "deploy": {
      "dependsOn": ["^build"],
      "cache": false
    },
    "build": {
      "outputs": ["dist/**"]
    }
  }
}
```

### 병렬로 실행할 수 있는 의존적 태스크들

일부 태스크는 다른 패키지에 의존하더라도 병렬로 실행될 수 있다.

대표적인 예로는 린터가 있다. 린터는 의존성의 출력을 기다리지 않고도 실행할 수 있기 때문이다.

때문에 `check-types` 태스크를 다음과 같이 정의하기 쉽다:

```json
// ./turbo.json
{
  "tasks": {
    "check-types": {} // 잘못된 예시다!
  }
}
```

위의 코드는 태스크를 병렬로 실행하기 때문에 빠르다.

하지만 패키지 간의 의존성 관계에 대한 설정을 하지 않았기에 의존성의 변경 사항을 고려하지 않는다.

이로 인해 다음과 같은 상황이 발생할 수 있다:

1. `ui` 패키지의 인터페이스에 중대한 변경을 한다.
2. `turbo check-types` 를 실행하면, `ui` 에 의존하는 애플리케이션 패키지에서 캐시 히트가 발생한다.

즉 `ui` 패키지가 변경되어도 애플리케이션 패키지는 캐시된 결과를 그대로 사용하게 된다.

이 때문에 `check-types` 태스크 정의를 다음과 같이 약간 변경한다:

```json
// ./turbo.json
{
  "tasks": {
    "check-types": {
      "dependsOn": ["^check-types"] // 이것은 작동 하지만 더 빠르게 수행할 수 있다!
    }
  }
}
```

이렇게 하면 의존성 관계를 파악하여 캐싱 동작을 정확하게 수행할 수 있지만, 모든 태스크가 순차적으로 실행되어 느리다.

두 요구 사항(정확성과 병렬성)을 모두 충족하기 위해 가상 태스크를 사용한다:

```json
// ./turbo.json
{
  "tasks": {
    "transit": {
      "dependsOn": ["^transit"]
    },
    "check-types": {
      "dependsOn": ["transit"]
    }
  }
}
```

- `transit` 은 존재하지 않는 가상의 태스크다.
- `transit` 이라는 가상의 태스크를 사용하여 패키지 간의 병렬 의존성 관계를 만든다.
- `check-types` 는 `transit` 에 의존하여 내부 의존성 변경을 인식할 수 있다.

:::note
앞선 예에서는 `transit` 이라는 이름을 사용했지만, 워크스페이스에 이미 존재하는 스크립트가 아닌 다른 어떤 이름이라도 사용할 수 있다.
:::
