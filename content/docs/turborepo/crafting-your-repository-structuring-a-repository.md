---
title: 레포지토리 구조 잡기
description:
date: 2024-06-09
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/crafting-your-repository/structuring-a-repository',
    },
  ]
---

`turbo` 는 JavaScript 패키지 매니저(npm, yarn, pnpm 등)의 [워크스페이스](https://vercel.com/docs/vercel-platform/glossary#workspace) 기능을 활용해 만들어진 도구다.

워크스페이스를 사용하면 하나의 저장소 안에 여러 패키지를 함께 관리할 수 있다.

이렇게 하나의 저장소로 다수의 패키지를 관리하는 방식을 <u>모노레포</u>라고 부른다.

`turbo`를 제대로 활용하려면 프로젝트를 모노레포 형태로 구성해야 한다.

모노레포로 프로젝트를 구성하면 다음과 같은 장점이 있다.

- 번들러, 린터, 테스트 러너 등의 도구를 프로젝트 전체에 일관되게 적용할 수 있다.
- 프로젝트에 `turbo` 를 도입하기가 수월해진다.

이번 문서에서는 `turbo` 를 사용할 수 있는 토대를 마련하기 위해, 직접 모노레포를 구성하는 과정을 알아본다.

## 시작하기

모노레포를 직접 셋팅하는 건 꽤 번거로운 작업이다.

모노레포가 처음이라면 `create-turbo` 를 사용하는 게 좋다.

이 도구를 이용하면 몇 가지 기본 설정이 된 모노레포 프로젝트를 쉽게 만들 수 있다.

```bash
npx create-turbo@latest
```

이렇게 생성된 프로젝트는 여기서 설명하는 모노레포의 특징들을 갖추고 있다. 한번 살펴보면서 모노레포 구조를 살펴보는 것을 추천한다.

## 워크스페이스 구조

자바스크립트 프로젝트의 워크스페이스는 두 가지 형태가 있다.

- 단일 패키지 워크스페이스
- 다중 패키지 워크스페이스

다중 패키지 워크스페이스를 보통 <u>모노레포</u>라고 부른다.

앞으로 살펴볼 내용은 주로 이 <u>모노레포 형태의 워크스페이스</u>에 관한 것이다.

`create-turbo` 로 만든 프로젝트를 살펴보면, <u>모노레포로서 갖춰야 할 구조적 특징</u>들이 잘 드러나 있다.

```text
├── package.json
├── package-lock.json
├── turbo.json
├── apps
│   ├── docs
│   │   └── package.json
│   └── web
│       └── package.json
├── packages
    └── ui
        └── package.json
```

### 최소 요구사항

- 패키지 매니저로 기술된 패키지들
- 패키지 매니저 lockfile
- 루트 `package.json`
- 루트 `turbo.json`
- 각 패키지 내의 `package.json`

### 패키지 지정하기

#### 1. 패키지 디렉토리 선언

우선 패키지들이 어디에 위치하는지 패키지 매니저에게 알려줘야 한다.

보통은 패키지를 두 종류로 나눠서 관리하는 게 좋다.

- `apps/` : 실행 가능한 애플리케이션이나 서비스 관련 패키지
- `packages/` : 재사용 가능한 라이브러리나 개발 도구 같은 나머지 패키지

```json
// ./package.json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

위의 구성을 사용하면 `apps` 또는 `packages` 에서 `package.json` 을 포함한 디렉토리가 패키지로 간주된다.

:::note npm 워크스페이스 공식 문서
[https://docs.npmjs.com/cli/v7/using-npm/workspaces#defining-workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces#defining-workspaces)
:::

:::caution

❌ Turborepo는 중첩된 패키지를 지원하지 않는다.

```json
{
  "workspaces": ["apps/**", "packages/**"]
}
```

```text
apps/
  a/
    package.json
    b/
      package.json
```

✅ 대신 패키지를 그룹화하려면 다음과 같이 할 수 있다.

```json
{
  "workspaces": ["packages/*", "packages/group/*"]
}
```

```text
packages/
  package1/
    package.json
  group/
    package2/
      package.json
    package3/
      package.json
```

:::

#### 2. 각 패키지의 package.json

패키지 디렉토리에는 패키지 매니저와 `turbo` 에서 패키지를 검색할 수 있도록 `package.json` 파일이 있어야 한다.

### 루트 package.json

루트 디렉토리에 있는 `package.json` 파일은 전체 프로젝트의 기반이 되는 중요한 파일이다.

보통 다음과 같은 형태다.

```json
// ./package.json
{
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "latest"
  },
  "packageManager": "npm@10.0.0"
}
```

### 루트 turbo.json

`turbo.json` 은 turbo를 설정하는 데 사용된다.

자세히 방법은 [작업 구성 페이지](https://turbo.build/repo/docs/crafting-your-repository/configuring-tasks)를 참조한다.

### 패키지 매니저 lockfile

lockfile은 패키지 매니저가 프로젝트의 의존성을 일관되게 설치할 수 있게 해준다.

다른 환경에서 프로젝트를 셋업할 때도, 항상 같은 버전의 패키지가 설치되도록 보장한다.

`turbo` 역시 lockfile 파일에 크게 의존한다.

`turbo` 는 lockfile을 통해 모노레포 [내부의 패키지](https://turbo.build/repo/docs/core-concepts/internal-packages)들이 서로 어떤 관계를 갖고 있는지 파악한다.

:::warning
만약 lockfile이 없으면 `turbo` 가 패키지 간 의존 관계를 제대로 분석하지 못해서, 예상치 못한 동작을 보일 수 있다.
:::

## 패키지 구조

모노레포 안의 각 패키지는 하나의 독립적인 단위다.

패키지는 자체 소스코드, `package.json`, 필요한 도구들의 설정을 갖춘 작은 <u>프로젝트</u>다.

물론 완전히 독립적일 순 없지만, 일단은 이런 개념을 갖고 패키지를 설계하는 것이 좋다.

그리고 각 패키지는 외부에 공개할 <u>진입점(entrypoint)</u>을 갖고 있다.

진입점은 `package.json` 의 [`exports`](https://turbo.build/repo/docs/crafting-your-repository/structuring-a-repository#exports) 필드에 정의되며, 다른 패키지에서 이 패키지를 사용할 때 진입점을 통해 접근한다.

### 패키지 package.json

#### name

`name` 필드는 패키지를 식별하는 데 사용되며, 워크스페이스 내에서 고유해야 한다.

:::note
npm 레지스트리의 다른 패키지와 충돌을 피하기 위해 내부 패키지에 네임스페이스 접두사를 사용하는 것이 좋다.

예를 들어 조직 이름이 `acme` 인 경우 패키지 이름을 `@acme/package-name` 으로 지정한다.
:::

#### scripts

`scripts` 필드는 해당 패키지에서 실행할 수 있는 명령어를 정의하는데 사용된다.

Turborepo는 `scripts` 에 정의된 이름을 사용하여 패키지에서 실행할 스크립트를 식별한다.

자세한 내용은 [작업 실행 페이지](https://turbo.build/repo/docs/crafting-your-repository/running-tasks)를 참조한다.

#### exports

`exports` 필드는 패키지의 진입점을 지정하는 데 사용된다.

다른 패키지에서 이 패키지를 사용할 때, 어떤 모듈을 어떻게 불러올 수 있는지를 명시한다.

```json
// ./packages/math/package.json
{
  "exports": {
    ".": "./dist/constants.ts",
    "./add": "./dist/add.ts",
    "./subtract": "./dist/subtract.ts"
  }
}
```

예를들어 위와 같이 설정하면 다음과 같이 `@repo/math` 패키지에서 `add` 와 `subtract` 함수를 가져올 수 있다:

```ts
// ./apps/my-app/src/index.ts
import { GRAVITATIONAL_CONSTANT, SPEED_OF_LIGHT } from '@repo/math';
import { add } from '@repo/math/add';
import { subtract } from '@repo/math/subtract';
```

`exports` 를 사용하면 몇 가지 이점이 있다.

1. **배럴 파일일 피하기**:
   - 배럴 파일은 전체 패키지에 대한 하나의 진입점을 생성한다.
   - 편리해 보일 수 있지만 [컴파일러와 번들러가 처리하기 어렵고](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js#what's-the-problem-with-barrel-files) 성능 문제로 이어질 수 있다.
2. **더 강력한 기능**:
   - `exports` 는 `main` 과 비교하여 더 강력한 기능을 제공한다.
   - 일반적으로 가능한 경우 `main` 대신 `exports` 를 사용하는 것이 좋다. `exports` 가 더 현대적인 옵션이다.
   - 조건부 내보내기가 가능하다. 공개하고 싶은 부분만 `exports` 에 명시하면 된다.
3. **IDE 자동완성**
   - `exports` 를 사용하여 패키지의 진입점을 지정하면 에디터가 패키지의 내보내기에 대한 자동 완성 기능을 제공할 수 있다.

:::note
와일드카드를 사용하여 `exports` 를 지정할 수도 있다.

그러나 TypeScript 컴파일러와의 성능 절충으로 인해 IDE 자동 완성 기능을 사용할 수 없게 된다.

자세한 내용은 [TypeScript 가이드](https://turbo.build/repo/docs/guides/tools/typescript#package-entrypoint-wildcards)를 참조한다.
:::

#### imports (선택 사항)

`imports` 필드는 패키지 내부의 모듈 간 경로를 간편하게 지정하는 방법으로, 일종의 <u>단축경로</u>다.

```json
// ./packages/ui/package.json
{
  "imports": {
    "#*": "./*"
  }
}
```

여기에는 몇 가지 이점이 있다.

1. import 경로가 깔끔해지며, 상대경로를 사용할 때보다 가독성이 좋다.
2. 모듈 구조를 변경해도 리펙토링하기 더 수월하다.

:::note
TypeScript에는 `compilerOptions.paths` 라는 비슷한 기능이 있는데, TS 5.4부터는 `imports` 에서 경로를 추론할 수 있게 되었다.

자세한 내용은 [TypeScript 가이드](https://turbo.build/repo/docs/guides/tools/typescript#use-nodejs-subpath-imports-instead-of-typescript-compiler-paths)를 참조한다.
:::

### 소스 코드

물론 패키지 안에는 소스 코드가 포함된다.

보통은 `src` 폴더에 소스 코드를 두고, `dist` 폴더에 빌드 결과물을 내보내는 식으로 구성하지만 필수 사항은 아니다.

## 일반적인 함정

- TypeScript를 쓴다면 루트 폴더에 `tsconfig.json` 파일을 두지 않는 것이 좋다.
  - 각 패키지마다 별도의 tsconfig.json 파일을 두는 것이 좋다.
  - 공통 설정은 별도의 패키지로 분리하여 상속받는 식으로 구성하는 게 좋다.
  - 이에 대한 자세한 내용은 [TypeScript 가이드](https://turbo.build/repo/docs/guides/tools/typescript#you-likely-dont-need-a-tsconfigjson-file-in-the-root-of-your-project)를 참고한다.

<br />

- 가능한 한 패키지 경계를 넘어 파일에 액세스하는 것은 피한다.
  - 만약 코드에서 `../` 를 사용해서 다른 패키지의 파일에 접근하고 있다면 이는 잘못된 방식이다.
  - 필요한 패키지로 직접 이동하는 대신 해당 패키지를 의존성으로 설치하고 모듈로 가져오는 방식을 사용한다.
