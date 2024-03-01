---
title: 모노레포 개발 태스크
description:
date: 2024-03-01
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/handbook/dev',
    },
  ]
---

대부분의 개발 워크플로는 이와 같은 형태다:

1. 레포지토리 열기
2. `dev` 태스크를 실행한다.
3. `dev` 태스크를 종료하고 레포지토리를 닫는다.

`dev` 태스크는 레포지토리에서 가장 자주 실행되는 작업일 가능성이 높으므로 올바르게 실행하는 것이 중요하다.

## dev 태스크의 유형 {#types-of-dev-tasks}

`dev` 태스크는 다양한 형태와 규모로 이루어진다:

- 웹 앱용 로컬 개발 서버 실행
- 코드가 변경될 때마다 백엔드 프로세스를 다시 실행하는 `nodemon` 실행하기
- `--watch` 모드에서 테스트 실행

## 터보레포 설정 {#setup-with-turborepo}

`turbo.json` 에 다음과 같이 `dev` 태스크를 지정해야 한다.

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

`dev` 태스크는 출력을 생성하지 않으므로 `outputs`은 비어둔다. 또한 `dev` 태스크는 캐시를 거의 사용하지 않는다는 점에서 독특하므로 `cache` 를 `false` 로 설정한다. 또한 `dev` 태스크는 오래 실행되는 작업이므로 다른 태스크의 실행을 차단하지 않도록 하기 위해 `persistent` 를 `true` 로 설정한다.

### package.json 설정 {#setting-up-package-json}

또한 루트 `package.json` 에 `dev` 스크립트를 제공한다:

```json
// package.json
{
  "scripts": {
    "dev": "turbo run dev"
  }
}
```

이를 통해 개발자는 일반 태스크 러너에서 직접 태스크를 실행할 수 있다.

## dev 전에 실행하는 태스크 {#running-tasks-before-dev}

일부 워크플로에서는 `dev` 태스크를 실행하기 전에 다른 태스크를 실행하고 싶을 수 있다. 예를 들어 `codegen` 또는 `db:migrate` 태스크를 실행하는 경우가 있다.

이러한 경우 `dependsOn` 을 사용하여 `codegen` 또는 `db:migrate` 태스크를 `dev` 태스크를 실행하기 전에 실행해야 한다고 지정한다.

```json
// turbo.json
{
  "pipeline": {
    "dev": {
      "dependsOn": ["codegen", "db:migrate"],
      "cache": false
    },
    "codegen": {
      "outputs": ["./codegen-outputs/**"]
    },
    "db:migrate": {
      "cache": false
    }
  }
}
```

`package.json` 은 다음과 같다.

```json
{
  "scripts": {
    // For example, starting the Next.js dev server
    "dev": "next",
    // For example, running a custom code generation task
    "codegen": "node ./my-codegen-script.js",
    // For example, using Prisma
    "db:migrate": "prisma db push"
  }
}
```

즉, 개발 서버가 시작되기도 전에 `codegen` 이나 `db:migrate` 에 대해 걱정할 필요가 없으며, 개발 작업의 사용자가 이를 처리할 수 있다.

## 특정 워크스페이스에서 dev 태스크 실행하기 {#running-dev-only-in-certain-workspaces}

`<root>/apps/docs` 에 있는 `docs` 워크스페이스에서 `dev` 태스크를 실행한다고 가정해 보자. 터보는 디렉터리에서 워크스페이스를 유추할 수 있으므로 다음을 실행하면 된다:

```bash
cd <root>/apps/docs
turbo run dev
```

터보가 자동으로 사용자가 `docs` 워크스페이스에 있음을 인식하고 `dev` 태스크를 실행한다.

레포지토리의 다른 위치에서 동일한 작업을 실행하려면 `--filter` 구문을 사용한다.

```bash
turbo run dev --filter docs
```

## 셋업 태스크 실행하기 {#running-setup-tasks}

지속적이고 오래 실행되는 개발 태스크를 실행하기 전에 실행해야 하는 태스크가 몇 가지 있을 수 있다. 설정 단계의 몇 가지 예는 다음과 같다:

- 패키지 사전 빌드하기
- Docker 컨테이너 설정하기
- 노드 또는 패키지 관리자 버전 확인

이러한 설정 작업의 이름을 `dev` 로 지정하면 `turbo.json` 에서 영구 작업과 이름 충돌이 발생한다. 대신 이러한 설정 작업의 이름을 `setup-dev` 로 변경하고 `dev` 태스크에 대해 이러한 `setup-dev` 태스크에 의존할 수 있다:

```json
// turbo.json
{
  "pipeline": {
    "dev": {
      "dependsOn": [
        // Wait for tasks in dependencies
        "^setup-dev"
        // Wait for tasks in same package
        "setup-dev"
        // Wait for `setup-dev` in a specific package
        "my-package#setup-dev"
        ],
    },
    "setup-dev": {},
  }
}
```

:::tip

- 태스크에서 캐시 가능한 아티팩트를 생성하는 경우 `setup-dev` 의 `output` 키에 캐시 가능한 아티팩트를 포함해야 한다.
- 태스크에서 캐시 가능한 아티팩트를 생성하지 않는 경우 `cache` 키를 `false` 로 설정하여 항상 먼저 실행되도록 하는 것이 좋다.

:::

## 환경 변수 사용하기 {#using-environment-variables}

개발 중에는 환경 변수를 사용해야 하는 경우가 많다. 예를 들어 개발과 프로덕션에서 서로 다른 `DATABASE_URL` 을 가리키는 등 프로그램의 동작을 사용자 지정할 수 있다.

이 문제를 해결하려면 [`dotenv-cli`](https://www.npmjs.com/package/dotenv-cli) 라는 라이브러리를 사용하는 것이 좋다.

### 튜토리얼 {#tutorial}

1. 루트 워크스페이스에 `dotenv-cli` 를 설치한다.

```bash
pnpm add dotenv-cli --ignore-workspace-root-check
```

2. 루트 워크스페이스에 `.env` 파일을 추가한다.

```diff-text
  ├── apps/
  ├── packages/
+ ├── .env
  ├── package.json
  └── turbo.json
```

주입해야 하는 환경 변수를 추가한다:

```text
DATABASE_URL=my-database-url
```

3. 루트 `package.json` 에 `dev` 스크립트를 추가한다. 앞에 `dotenv `와 `--` 인수 구분 기호를 붙인다:

```json
{
  "scripts": {
    "dev": "dotenv -- turbo run dev"
  }
}
```

이렇게 하면 `turbo run dev` 을 실행하기 전에 `.env` 에서 환경 변수를 추출한다.

4. dev 스크립트를 실행한다.

```bash
pnpm dev
```

그리고 환경 변수가 채워진다. Node.js에서는 `process.env.DATABASE_URL` 을 대신 사용할 수 있다.

:::warning
또한 환경 변수를 사용하여 앱을 빌드하는 경우 `turbo.json` 에 환경 변수를 추가해야 한다.
:::
