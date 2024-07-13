---
title: 내부 패키지
description:
date: 2024-07-11
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/core-concepts/internal-packages',
    },
  ]
---

내부 패키지는 프로젝트 내부에서 직접 만들어 사용하는 라이브러리 패키지다.

모노레포 내에서 코드를 공유하기 위해 빠르게 내부 패키지를 만들 수 있으며, 필요한 경우 나중에 [npm 레지스트리에 배포](https://turbo.build/repo/docs/guides/publishing-libraries)할 수 있다.

내부 패키지는 npm 레지스트리에서 설치하는 외부 패키지와 유사하게 `package.json` 에 설치하여 사용한다.

그러나 특정 버전을 설치하는 대신 패키지 관리자가 제공하는 <u>워크스페이스</u> 기능을 사용해서 설치한다.

예를 들어:

:::tabs

@tab:active npm#npm

```json
// ./apps/web/package.json
{
  "dependencies": {
    "@repo/ui": "*"
  }
}
```

@tab yarn#yarn

```json
// ./apps/web/package.json
{
  "dependencies": {
    "@repo/ui": "*"
  }
}
```

@tab pnpm#pnpm

```json
// ./apps/web/package.json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

:::

그런 다음 외부 패키지와 마찬가지로 코드에서 패키지를 가져와 사용할 수 있다:

```jsx
import { Button } from '@repo/ui';

export default function Page() {
  return <Button>Submit</Button>;
}
```

내부 패키지를 만드는 여러 전략과 트레이드오프가 있으며, 필요한 경우 npm 레지스트리에 배포하여 외부 패키지로 만들 수도 있다.

## 컴파일 전략

라이브러리의 용도와 목적에 땨라 다음 세 가지 컴파일 전략 중 하나를 선택할 수 있다:

- [Just-in-Time 패키지](https://turbo.build/repo/docs/core-concepts/internal-packages#just-in-time-packages)
  - 코드를 그대로 두고, 앱에서 사용할 때 자동으로 컴파일된다.
  - 애플리케이션 번들러가 패키지를 사용할 때 컴파일하도록 허용함으로써 패키지에 대한 설정을 최소화한다.
- [컴파일된 패키지](https://turbo.build/repo/docs/core-concepts/internal-packages#compiled-packages)
  - 코드를 미리 컴파일하여 준비해둔다.
  - 적당한 수준의 구성으로, `tsc` 와 같은 빌드 도구나 번들러를 사용하여 패키지를 컴파일한다.
- [배포 가능한 패키지](https://turbo.build/repo/docs/core-concepts/internal-packages#publishable-packages)
  - 누구나 사용할 수 있도록 코드를 완전히 준비하여 공개한다.
  - npm 레지스트리에 배포할 수 있도록 패키지를 컴파일하고 준비한다. 이 접근 방식은 가장 많은 설정이 필요하다.

### Just-in-Time 컴파일 패키지

JIT 컴파일 패키지는 해당 패키지를 사용하는 애플리케이션에 의해 컴파일된다.

TypeScript(또는 JavaScript) 파일을 그대로 사용할 수 있어, 다른 전략들보다 설정이 간편하다.

이 전략은 다음과 같은 경우에 가장 유용하다:

- Turbopack, webpack, Vite와 같은 현대적인 번들러를 사용하여 애플리케이션을 구축하는 경우
- 설정과 셋업 단계를 피하고 싶은 경우
- 패키지의 캐시를 사용하지 않더라도 애플리케이션의 빌드 시간에 만족하는 경우

JIT 컴파일 패키지의 `package.json` 은 다음과 같은 형태다:

```json
// ./packages/ui/package.json
{
  "name": "@repo/ui",
  "exports": {
    "./button": "./src/button.tsx",
    "./card": "./src/card.tsx"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit"
  }
}
```

여기서 중요한 점은 다음과 같다:

- **TypeScript 직접 내보내기**
  - `exports` 필드는 패키지의 진입점을 나타내며, 이 경우 <u>TypeScript 파일을 직접 export</u>하고 있다.
  - 이는 애플리케이션의 번들러가 빌드 과정에서 코드를 컴파일하기 때문에 가능하다.
- **`build` 스크립트 없음**
  - 이 패키지는 TypeScript를 내보내기 때문에 패키지를 트랜스파일하기 위한 빌드 단계가 필요 없다.
  - 즉, 워크스페이스에서 이 패키지를 작동시키기 위해 빌드 도구를 설정할 필요가 없다.

#### 제한사항 및 트레이드오프

- **소비자가 트랜스파일을 수행할 때만 적용 가능**
  - 이 전략은 소비자 패키지가 번들러를 사용하거나 TypeScript를 지원하는 환경에서 사용될 때만 적용할 수 있다.
  - 소비자의 번들러가 TypeScript를 JavaScript로 트랜스파일 한다.
  - 소비자 패키지에서 TypeScript를 사용할 수 없다면 "컴파일된 패키지" 전략으로 전환해야 한다.
- **TypeScript `paths` 사용 불가**
  - 소비자에 의해 트랜스파일되는 라이브러리는 `compilerOptions.paths` 설정을 사용할 수 없다.
    - 이 옵션은 TypeScript에서 import 경로를 쉽게 관리할 수 있게 해주는 기능이다. 긴 경로를 별칭을 사용하여 짧게 줄일 수 있다.
  - TypeScript는 소스 코드가 작성된 패키지에서 트랜스파일되고 있다고 가정하기 때문이다.
  - TypeScript 5.4 이상을 사용하고 있다면 Node.js 서브패스 임포트 사용을 권장한다.
- **Turborepo는 JIT 컴파일 패키지의 빌드를 캐시할 수 없음**
  - 패키지 자체의 `build` 단계가 없기 때문에 Turborepo에 의해 캐시될 수 없다.
  - 설정을 최소화하고 싶고 애플리케이션의 빌드 시간이 괜찮다면 이 트레이드오프를 선택할 수 있다.

### 컴파일된 패키지

컴파일된 패키지는 `tsc` 와 같은 빌드 도구를 사용하여 자체적으로 컴파일을 처리하는 패키지다.

```json
// ./packages/ui/package.json
{
  "name": "@repo/ui",
  "exports": {
    "./button": {
      "types": "./src/button.tsx",
      "default": "./dist/button.js"
    },
    "./card": {
      "types": "./src/card.tsx",
      "default": "./dist/card.js"
    }
  },
  "scripts": {
    "build": "tsc"
  }
}
```

라이브러리를 컴파일하면 컴파일된 JavaScript 출력물이 디렉토리(`dist`, `build` 등)에 생성되며, 이를 패키지의 진입점으로 사용한다.

빌드 출력물은 Turborepo에 의해 캐시되어 빌드 시간을 단축할 수 있다.

#### 제한사항 및 트레이드오프

- **TypeScript 컴파일러 사용**
  - 대부분의 컴파일된 패키지는 `tsc` 를 사용해야 한다.
- **더 많은 설정**
  - 컴파일된 패키지는 빌드 출력물을 생성하기 위해 더 깊은 지식과 설정이 필요하다.
  - TypeScript 컴파일러에는 [많은 설정](https://www.typescriptlang.org/docs/handbook/compiler-options.html#compiler-options)이 있다.
  - TypeScript 가이드에서 [몇 가지 권장 사항](https://turbo.build/repo/docs/guides/tools/typescript)을 찾아볼 수 있다.

:::note TypeScript 컴파일러를 사용해야 하는 이유
대부분의 경우 `tsc` 를 사용하여 TypeScript 코드를 JavaScript로 변환한다. 이는 간단하고 직접적인 방법이다.

- 보통 라이브러리를 만들 때는 번들러(예: webpack)를 사용하지 않는다.
  - 라이브러리를 사용하는 애플리케이션에서 이미 번들러를 사용하고 있기 때문이다.
  - 애플리케이션의 번들러는 다음과 같은 작업을 수행 한다:
    - 라이브러리 코드를 애플리케이션에 통합
    - 필요한 폴리필 추가 (오래된 브라우저 지원)
    - 코드를 더 낮은 JavaScript 버전으로 변환 (다운레벨링)
    - 기타 최적화 작업
- 번들러를 사용하는 경우
  - 특별한 경우에만 라이브러리에서 번들러를 사용한다.
  - 예: 이미지나 CSS 같은 정적 파일을 라이브러리에 포함시켜야 할 때

정리해 보면, 라이브러리를 만들 때는 보통 간단한 TypeScript 컴파일러만 사용하고, 복잡한 처리는 라이브러리를 사용하는 애플리케이션의 번들러에게 맡긴다. 이렇게 하면 라이브러리를 더 쉽게 만들고 유지보수할 수 있다.
:::

### 배포 가능한 패키지

npm 레지스트리에 패키지를 배포하는 것은 이 페이지에서 소개한 패키징 전략들 중 가장 엄격한 요구사항을 갖는다.

소비자들이 어떻게 패키지를 사용할지 알 수 없기 때문에, 수많은 설정이 필요하다.

또한, npm 레지스트리에 패키지를 배포하는 과정은 전문적인 지식과 도구를 필요로 한다.

버전 관리, 변경 로그 작성, 그리고 배포 과정을 관리하기 위해 [`changesets`](https://github.com/changesets/changesets) 를 사용하는 것을 추천한다.

:::note
자세한 내용은 [패키지 배포하기 가이드](https://turbo.build/repo/docs/guides/publishing-libraries)를 참조한다.
:::
