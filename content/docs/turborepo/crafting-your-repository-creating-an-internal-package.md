---
title: 내부 패키지 생성하기
description:
date: 2024-06-10
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/crafting-your-repository/creating-an-internal-package',
    },
  ]
---

[내부 패키지(Internal Packages)](https://turbo.build/repo/docs/core-concepts/internal-packages)는 모노레포 내에서 다른 패키지들과 공유할 수 있는 코드 모음이다.

내부 패키지는 여러 프로젝트에서 공통으로 사용되는 유틸리티 함수, 컴포넌트, 설정 등을 포함한다.

예를 들어, 여러 프로젝트에서 날짜 포맷을 다루는 함수가 필요한 경우 이 함수를 각 프로젝트에서 별도로 구현하는 대신, 내부 패키지로 만들어 공유할 수 있다.

<u>Turborepo는 내부 패키지 관리를 도와주는 도구다.</u>

각 패키지의 `package.json` 파일에 명시된 의존성 정보를 바탕으로, 패키지들 간의 관계를 파악하고 이를 [패키지 그래프](https://turbo.build/repo/docs/core-concepts/package-and-task-graph#package-graph)로 나타낸다.

이 그래프를 활용하여 Turborepo는 저장소의 작업을 최적화할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo/crafting-your-repository-creating-an-internal-package/1.png)

## 예제

:::note
아래 단계에서는 `create-turbo` 를 사용하여 새 저장소를 생성했거나 유사한 구조의 저장소를 사용하고 있다고 가정한다.
:::

### 1. 빈 디렉토리 생성하기

레포지토리에 `./packages/math` 디렉토리를 생성한다.

```diff-text
├── package.json
├── turbo.json
├── apps
├── packages
+   ├── math
    ├── ui
    │   └── package.json
    ├── eslint-config
    │   └── package.json
    └── typescript-config
        └── package.json
```

### 2. package.json 추가하기

다음으로, 패키지에 `package.json` 파일을 생성한다.

이 파일을 추가함으로써, [내부 패키지의 두 가지 요구사항](https://turbo.build/repo/docs/crafting-your-repository/structuring-a-repository#specifying-packages-in-a-monorepo)을 충족하게 되어 Turborepo와 워크스페이스의 나머지 부분에서 패키지를 인식할 수 있게 된다:

```json
// ./packages/math/package.json
{
  "name": "@repo/math",
  "type": "module",
  "scripts": {
    "dev": "tsc --watch",
    "build": "tsc"
  },
  "exports": {
    "./add": {
      "types": "./src/add.ts",
      "default": "./dist/add.js"
    },
    "./subtract": {
      "types": "./src/subtract.ts",
      "default": "./dist/subtract.js"
    }
  },
  "devDependencies": {
    "@repo/typescript-config": "*",
    "typescript": "latest"
  }
}
```

`package.json` 의 각 부분을 살펴보자:

| 속성              | 설명                                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts`         | `dev` 와 `build` 스크립트는 TypeScript 컴파일러를 사용하여 패키지를 컴파일한다. <br/> `dev` 스크립트는 소스 코드의 변경 사항을 감시하여 자동으로 패키지를 다시 컴파일한다. |
| `devDependencies` | `@repo/math` 패키지에서 `typescript` 와 `@repo/typescript-config` 패키지를 사용할 수 있다.                                                                                 |
| `exports`         | 패키지에 대한 여러 진입점을 정의하여 다른 패키지에서 사용할 수 있도록 한다. <br/> ( ex. `import { add } from '@repo/math'`)                                                |

특히, 내부 `@repo/typescript-config` 패키지를 의존성으로 추가한다.

그 결과 Turborepo는 작업 순서를 정할 때 `@repo/math` 가 `@repo/typescript-config` 에 의존한다는 것을 알 수 있다.

### 3. tsconfig.json 추가하기

패키지에서 TypeScript를 사용하기위해 `tsconfig.json` 파일을 패키지의 최상위 디렉토리에 추가한다.

```json
// ./packages/math/tsconfig.json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

1. `extends` 를 사용하여 외부 설정 파일을 상속받는다.
   - 여기서는 `@repo/typescript-config/base.json` 이라는 공통 설정 파일을 상속받는다.

<br/>

2. `compilerOptions`
   - `outDir` : 컴파일된 JavaScript 파일이 저장될 디렉토리를 지정한다.
   - `rootDir` : `outDir` 의 출력이 `src` 디렉토리와 동일한 구조를 사용하도록 보장한다.

<br/>

3. `include`, `exclude` 는 TypeScript 명세에 따라 외부에서 상속되지 않으므로, 여기서 설정한다.

:::note
위 설정은 TypeScript를 시작하는데 필요한 기본적인 구성이다.

더 자세한 내용이 궁금하다면 [TypeScript 공식 문서](https://www.typescriptlang.org/tsconfig)나 [TypeScript 가이드](https://turbo.build/repo/docs/guides/tools/typescript)를 참조한다.
:::

### 4. src 디렉토리와 소스 코드 추가하기

이제 소스 코드를 추가한다.

`src` 디렉토리 안에 두 개의 파일을 생성한다.

:::tabs

@tab:active add.ts#add

```typescript
// ./packages/math/src/add.ts
export const add = (a: number, b: number) => a + b;
```

@tab subtract.ts#subtract

```typescript
// ./packages/math/src/subtract.ts
export const subtract = (a: number, b: number) => a - b;
```

:::

### 5. 애플리케이션에 패키지 추가하기

이제 새로운 패키지를 애플리케이션에서 사용할 준비가 되었다.

`web` 애플리케이션에 추가해 보자.

```diff-json
// apps/web/package.json
  "dependencies": {
+   "@repo/math": "*",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
```

:::warning
저장소의 의존성을 변경했으므로, 패키지 매니저의 설치 명령어를 실행하여 lockfile을 업데이트해야 한다.
:::

이제 `@repo/math` 를 다음과 같이 사용할 수 있다.

```tsx
// apps/web/src/app/page.tsx
import { add } from '@repo/math';

function Page() {
  return <div>{add(1, 2)}</div>;
}

export default Page;
```

### 6. turbo.json 수정하기

`@repo/math` 패키지의 출력물( `dist/**` )을 `build` 의 `outputs` 에 추가한다.

이렇게 하면 Turborepo가 해당 빌드 출력물을 캐시하여 빌드를 시작할 때 즉시 사용할 수 있다.

```diff-json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
+      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    }
  }
}
```

### 7. turbo build 실행하기

turbo를 전역으로 설치한 경우, 워크스페이스의 루트에서 `turbo build` 를 실행한다.

또는 `turbo run build` 를 사용하여 `package.json` 의 `build` 스크립트를 패키지 매니저로 실행한다.

`web` 애플리케이션이 빌드되기 전에 `@repo/math` 패키지가 먼저 빌드된다.

`./packages/math/dist` 코드가 `web` 애플리케이션 번들링에 포함된다.

:::note
`turbo build` 를 다시 실행하면 `web` 애플리케이션이 밀리초 단위로 빠르게 재빌드되는 것을 볼 수 있다.

이에 대해서는 [Caching 가이드](https://turbo.build/repo/docs/crafting-your-repository/caching)에서 자세히 다룬다.
:::

## 내부 패키지 모범 사례

### 단일 목적 패키지

각 패키지는 하나의 목적만을 수행해야 한다.

여기에는 다음과 같은 이점이 있다:

- **이해하기 쉽다**: 개발자들이 필요한 코드를 더 쉽게 찾을 수 있다.
- **패키지 의존성이 줄어든다**: 패키지마다 의존하는 패키지 수를 줄이면 Turborepo가 패키지 의존 관계를 더 잘 정리할 수 있다.

:::note 단일 목적 패키지가 의존성을 감소시키는 이유

1. **집중된 기능**: 단일 목적 패키지는 특정 기능이나 도메인에 집중한다. 이로 인해 해당 패키지가 필요로 하는 의존성의 수가 자연스럽게 줄어든다. 예를 들어, UI 컴포넌트만을 위한 패키지는 데이터베이스 관련 의존성이 필요 없다.
2. **명확한 경계**: 각 패키지의 목적이 명확하면, 패키지 간의 경계가 뚜렷해진다. 이는 불필요한 의존성을 추가하는 것을 방지하는 데 도움이 된다.
3. **의존성 관리 용이성**: 작고 집중된 패키지는 의존성을 더 쉽게 관리할 수 있게 해준다. 개발자들은 각 패키지에 정확히 어떤 의존성이 필요한지 더 명확하게 이해할 수 있다.
4. **최소 필요 의존성**: 단일 목적 패키지는 해당 목적을 달성하는 데 필요한 최소한의 의존성만을 포함하게 된다. 이는 전체적인 의존성 그래프를 단순화한다.
5. **재사용성 향상**: 의존성이 적은 단일 목적 패키지는 다른 프로젝트나 컨텍스트에서 더 쉽게 재사용될 수 있다.
6. **빌드 및 테스트 최적화**: 의존성이 적은 패키지는 빌드와 테스트 과정이 더 빠르고 효율적이다. 이는 특히 Turborepo와 같은 도구를 사용할 때 더욱 중요해진다.

이러한 방식으로, 단일 목적 패키지 전략은 전체적인 프로젝트의 의존성 구조를 단순화하고 최적화하는 데 기여한다.
:::

### 애플리케이션 패키지에는 공유 코드를 포함시키지 않는다

애플리케이션 패키지를 만들 때는 공유 코드를 해당 패키지에 포함하지 것이 가장 좋다.

대신 공유 코드를 위한 별도의 패키지를 만들고 애플리케이션 패키지가 해당 패키지에 의존하도록 해야 한다.

애플리케이션 패키지는 다른 패키지에 설치하기 위한 용도가 아니다. 대신 패키지 그래프의 진입점으로 생각해야 한다.

:::note
이 규칙에는 [예외](https://turbo.build/repo/docs/core-concepts/package-types#installing-an-applicaiton-package-into-another-package)가 있다.
:::
