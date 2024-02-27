---
title: 새 모노레포 생성하기
description:
date: 2024-02-27
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/getting-star',
    },
  ]
---

## 빠른 시작 {#quickstart}

[`create-turbo` NPM 패키지](https://www.npmjs.com/package/create-turbo)를 사용하여 새 모노레포를 생성한다.

```bash
pnpm dlx create-turbo@latest
```

## 전체 튜토리얼 {#full-tutorial}

이 튜토리얼에서는 기본 예제를 설정하는 과정을 안내한다. 이 튜토리얼이 끝나면 터보 사용에 자신감을 갖게 되고 모든 기본 기능을 숙지하게 될 것이다.

### 1. create-turbo 실행하기 {#running-create-turbo}

```bash
pnpm dlx create-turbo@latest
```

위의 코드를 실행하면 `create-turbo` CLI가 설치 및 실행된다.

다음과 같은 몇 가지 질문이 표시 된다:

- **Where would you like to create your turborepo?**
  - 원하는 위치를 선택한다. 기본값은 `./my-turborepo` 다.
- **Which package manager do you want to use?**
  - 터보레포는 패키지 설치 기능을 지원하지 않으므로 다음 중 하나를 선택해야 한다:
    - `bun` , `npm` , `pnpm` , `yarn`
  - `create-turbo` 는 시스템에서 사용 가능한 패키지 관리자를 감지한다. 어떤 것을 선택해야 할지 잘 모르겠다면 `pnpm` 을 권장한다.

패키지 관리자를 선택하면 `create-turbo` 가 선택한 폴더 이름 안에 여러 개의 새 파일을 만든다. 또한 기본 예제와 함께 제공되는 모든 종속성을 기본적으로 설치한다.

### 2. 생성된 래포지토리 살펴보기 {#exploring-your-new-repo}

터미널에서 여러 메시지를 볼 수 있다. `create-turbo` 는 추가되는 모든 항목에 대한 설명을 제공한다.

```bash
>>> Creating a new turborepo with the following:
 - apps/web: Next.js with TypeScript
 - apps/docs: Next.js with TypeScript
 - packages/ui: Shared React component library
 - packages/eslint-config: Shared configuration (ESLint)
 - packages/typescript-config: Shared TypeScript `tsconfig.json`
```

각 워크스페이스는 `package.json` 이 들어 있다. 각 워크스페이스는 자체 종속성을 선언하고, 자체 스크립트를 실행하고, 다른 워크스페이스에서 사용할 수 있도록 코드를 내보낼 수 있다.

코드 에디터에서 루트 폴더인 `./my-turborepo` 를 열어보자.

#### packages/ui 살펴보기 {#understanding-packages-ui}

먼저, `./packages/ui/package.json` 파일을 연다. 파일 상단에 `"name": "@repo/ui"` 에서 패키지의 이름을 확인할 수 있다.

다음으로, `./apps/web/package.json` 파일을 연다. 이 패키지의 이름은 `"name": "web"` 이다. 여기서 의존성을 살펴보자.

```json
// ./apps/web/package.json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

`web` 은 `@repo/ui` 패키지에 의존하고 있음을 확인할 수 있다.

`apps/docs/package.json` 내부를 살펴보면 동일한 내용을 볼 수 있다. `web` 과 `docs` 모두 공유 컴포넌트 라이브러리인 `@repo/ui` 에 의존한다.

애플리케이션 간에 코드를 공유하는 이러한 패턴은 모노레포에서 매우 일반적이며, 여러 앱이 하나의 디자인 시스템을 공유할 수 있음을 의미한다.

#### imports & exports 살펴보기 {#understanding-imports-and-exports}

`./apps/docs/app/page.tsx` 내부를 살펴보자. `docs` 와 `web` 은 모두 Next.js 애플리케이션이며, 둘 다 `@repo/ui` 라이브러리를 비슷한 방식으로 사용한다:

```jsx
// ./apps/docs/app/page.tsx
import { Button } from "@repo/ui/button";
//       ^^^^^^         ^^^^^^^^^^^^^^^

export default function Page() {
  return (
    <>
      <Button appName="web" className={styles.button}>
        Click me!
      </Button>
    <>
  );
}
```

`repo/ui/button` 이라는 종속성에서 직접 `Button` 을 가져오고 있다! 어떻게 작동하는 것일까? `Button` 의 출처는 어디일까?

`packages/ui/package.json` 을 열어보자. `exports` 필드가 보인다:

```json
{
  "exports": {
    "./button": "./src/button.tsx",
    "./card": "./src/card.tsx",
    "./code": "./src/code.tsx"
  }
}
```

워크스페이스 에서 `@repo/ui/button` 를 가져오면 `exports` 는 가져오려는 코드에 액세스할 수 있는 위치를 알려준다.

`packages/ui/src/button.tsx` 파일 내용을 살펴보자.

```tsx
// packages/ui/src/button.tsx
'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
```

button을 찾있다!

이 파일 안의 모든 내용은 `@repo/ui/button` 에 종속된 워크스페이스에서 사용할 수 있다.

이 파일에서 변경한 내용은 `web` 과 `docs` 에서 모두 공유된다.

#### tsconfig 살펴보기 {#understanding-tsconfig}

살펴볼 워크스페이스가 두 개 더 있는데, `typescript-config` 와 `eslint-config` 다. 이들 각각은 모노레포 전체에서 공유되는 구성 파일을 관리한다. `typescript-config` 를 살펴보자:

```json
{
  "name": "@repo/typescript-config"
}
```

여기서는 패키지 이름이 `@repo/typescript-config` 임을 알 수 있다.

이제 `web` 앱에 있는 `tsconfig.json` 파일을 살펴보자.

```json
{
  "extends": "@repo/typescript-config/nextjs.json"
}
```

보다시피, `@repo/typescript-config/nextjs.json` 을 `tsconfig.json` 파일로 직접 가져오고 있다.

이 패턴을 사용하면 모노레포의 모든 워크스페이스에서 단일 `tsconfig.json` 을 공유할 수 있으므로 코드 중복을 줄일 수 있다.

#### eslint-config 살펴보기 {#understanding-eslint-config}

마지막으로 살펴볼 워크스페이스는 `eslint-config` 다.

먼저 `packages/eslint-config/package.json` 을 살펴보자:

```json
// packages/eslint-config/package.json
{
  "name": "@repo/eslint-config",
  "files": ["library.js", "next.js", "react-internal.js"]
}
```

보다시피, 패키지의 이름은 `@repo/eslint-config` 이며, `library.js`, `next.js` 및 `react-internal.js` 의 세 가지 파일을 노출한다.

커스텀 ESLint 구성을 사용하는 방법을 이해하기 위해 `apps/docs/.eslintrc.js` 내부를 살펴보자:

```js
// apps/docs/.eslintrc.js
module.exports = {
  extends: ['@repo/eslint-config/next.js'],
};
```

여기서는 `@repo/eslint-config/next.js` 를 `.eslintrc.js` 파일로 직접 가져오는 것을 볼 수 있다.

`typescript-config` 와 마찬가지로 `eslint-config` 를 사용하면 전체 모노레포에서 ESLint 구성을 공유하여 어떤 프로젝트에서 작업하든 일관성을 유지할 수 있다.

#### 요약 {#exploring-repo-summary}

이러한 워크스페이스 간의 종속성을 이해하는 것이 중요하다.

정리해보면 다음과 같다.

- `web` - `ui`, `typescript-config` 및 `eslint-config` 에 종속되어 있다.
- `docs` - `ui`, `typescript-config` 및 `eslint-config` 에 종속되어 있다.
- `ui` - `typescript-config` 및 `eslint-config` 에 종속되어 있다.
- `typescript-config` - 종속성이 없다.
- `eslint-config` - 종속성이 없다.

중요한 것은 터보레포 CLI는 이러한 종속성을 관리하지 않는다. 위의 모든 작업은 사용자가 선택한 패키지 관리자( `npm`, `pnpm` 또는 `yarn` )에서 처리한다.

### 3. turbo.json 이해하기 {#understanding-turbo-json}

이제 리포지토리와 그 종속성을 이해하게 되었다. 터보레포는 여기에 어떤 도움을 줄수 있을까?

터보레포는 작업을 더 간단하고 효율적으로 실행할 수 있도록 도와준다.

루트의 `turbo.json` 내부를 살펴보자:

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

여기서는 `lint`, `dev`, `build` 라는 세 가지 작업을 `turbo` 에 등록한 것을 볼 수 있다. `turbo.json` 에 등록된 모든 작업은 `turbo run <task>` (또는 줄여서 `turbo <task>` )로 실행할 수 있다.

:::warning
계속 진행하기 전에 `turbo.json` 에 등록되지 않은 `hello` 라는 작업을 실행해 보자:

```bash
turbo hello
```

터미널에 오류가 표시된다.

```bash
# Could not find the following tasks in project: hello
```

`turbo` 가 작업을 실행하려면 해당 작업이 `turbo.json` 에 등록되어 있어야 한다는 점을 기억하라.
:::

계속해서 스크립트를 조사해 보자.

### 4. 터보레포에서 린트 실행하기 {#linting-with-turborepo}

`lint` 스크립트를 실행해 보자:

```bash
turbo lint
```

터미널에서 여러 가지 일이 일어나는 것을 알 수 있다.

1. 여러 개의 스크립트가 동시에 실행되며, 각 스크립트 앞에 `docs:lint`, `@repo/ui:lint` 또는 `web:lint` 접두사가 붙는다.
2. 각 스크립트가 성공하면 터미널에 `3 successful` 이 표시된다.
3. `0 cached, 3 total` 이 표시된다. 이것이 무엇을 의미하는지 나중에 설명한다.

각각 실행되는 스크립트는 각 워크스페이스의 `package.json` 에서 가져온다. 각 워크스페이스는 선택적으로 자체 `lint` 스크립트를 지정할 수 있다:

```json
{
  "scripts": {
    "lint": "next lint"
  }
}
```

```json
{
  "scripts": {
    "lint": "next lint"
  }
}
```

```json
{
  "scripts": {
    "lint": "eslint \"**/*.ts*\""
  }
}
```

`turbo lint` 를 실행하면 터보레포는 각 워크스페이스의 각 `lint` 스크립트를 살펴보고 실행한다.

#### 캐시 사용하기 {#using-the-cahce}

`lint` 스크립트를 다시 한 번 실행해 보자. 터미널에 몇 가지 새로운 항목이 나타나는 것을 볼 수 있다:

1. `cache hit, replaying logs` 가 발생하면 `docs:lint` , `web:lint` 및 `@repo/ui:lint` 에 대한 로그가 나타난다.
2. `3 cached, 3 total` 메시지를 볼 수 있다.
3. 총 런타임은 `100ms` 미만이어야 하며 `>>> FULL TURBO` 가 표시된다.

방금 흥미로운 일이 일어났다. 터보레포는 lint 스크립트를 마지막으로 실행한 이후 코드가 변경되지 않았다는 사실을 인지한다.

이전 실행의 로그를 저장해 두었기 때문에 그냥 재생한 것이다.

몇 가지 코드를 변경하여 어떤 일이 발생하는지 확인해 보자. `app/docs` 내부의 파일을 변경한다:

```diff-jsx
import { Button } from "@repo/ui/button";
//       ^^^^^^         ^^^^^^^^^^^^^^^

export default function Page() {
  return (
    <>
      <Button appName="web" className={styles.button}>
-        Click me!
+        Click me now!
      </Button>
    <>
  );
}
```

이제 `lint` 스크립트를 다시 실행하면 다음을 알 수 있다:

1. `docs:lint` 에 `cache miss, executing` 이라는 내용이 나타난다. 이는 `docs` 가 린트를 실행 중이라는 뜻이다.
2. `2 cached, 3 total` 이 하단에 표시됩니다.

즉, 이전 작업의 결과가 여전히 캐시되어 있다는 뜻이다. `docs` 내부의 `lint` 스크립트만 실제로 실행되어 속도가 빨라졌다.

### 5. 터보레포에서 빌드 하기 {#building-with-turborepo}

`build` 스크립트를 실행해 보자:

```bash
turbo build
```

`lint` 스크립트를 실행했을 때와 비슷한 결과를 볼 수 있다. `apps/docs` 및 `apps/web` 만 `package.json` 에 `build` 스크립트를 지정하므로 해당 스크립트만 실행된다.

`turbo.json` 의 `build` 내부를 살펴보자. 흥미로운 구성이 있다.

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

일부 `outputs` 지정되어 있는 것을 볼 수 있다. outputs을 선언하면 `turbo`가 작업 실행을 완료하면 지정한 출력을 캐시에 저장한다.

`apps/docs` 와 `apps/web` 은 모두 Next.js 앱이며 빌드를 `./.next` 폴더에 출력힌다.

한 번 해보자. `apps/docs/.next` 빌드 폴더를 삭제한다.

`build` 스크립트를 다시 실행한다. 다음을 볼 수 있을 것이다:

1. `FULL TURBO` 가 표시되고 `100ms` 이내에 빌드가 완료된다.
2. `.next` 폴더가 다시 나타난다!

터보레포가 이전 빌드 결과를 캐시했다. `build` 명령을 다시 실행하자 캐시에서 전체 `.next/**` 폴더가 복원되었다.

### 6. dev 스크립트 실행하기 {#running-dev-scripts}

이제 `dev` 를 실행해 보자.

```bash
turbo dev
```

터미널에서 몇 가지 정보를 확인할 수 있다:

1. `docs:dev` 와 `web:dev` 라는 두 개의 스크립트만 실행된다. 이 두 개의 워크스페이스는 `dev` 를 지정하는 유일한 두 개의 워크스페이스다.
2. 두 `dev` 스크립트가 동시에 실행되어 포트 `3000` 및 `3001` 에서 Next.js 앱을 시작한다.
3. 터미널에서 `cache bypass, force executing` 을 볼 수 있다.

스크립트를 종료했다가 다시 실행해 보자. `FULL TURBO` 가 표시되지 않는 것을 알 수 있다. 왜 그럴까?

`turbo.json` 을 살펴보자:

```json
// turbo.json
{
  "pipeline": {
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

`dev` 내에서 `"cache": false` 를 지정했다. 즉, `dev` 스크립트의 결과를 캐시하지 않도록 터보레포에 지시하고 있다. `dev` 는 영구적인 개발 서버를 실행하고 출력을 생성하지 않으므로 캐시할 것이 없다.

추가로 `"persistent": true` 로 설정하여 터보에게 이것이 장기간 실행되는 개발 서버임을 알린다. 이렇게 함으로써 터보는 다른 작업들이 이에 의존하지 않도록 보장할 수 있다.

#### dev 스크립트를 하나의 워크스페이스에서만 실행하기 {#running-dev-on-only-one-workspace-at-a-time}

기본적으로 `turbo dev` 는 모든 워크스페이스에서 한 번에 `dev` 를 실행한다. 하지만 때로는 하나의 워크스페이스만 선택해야 할 수도 있다.

이를 처리하기 위해 명령에 `--filter` 플래그를 추가하면 된다.

```bash
turbo dev --filter docs
```

이제 `docs:dev` 만 실행되는 것을 볼 수 있다.
