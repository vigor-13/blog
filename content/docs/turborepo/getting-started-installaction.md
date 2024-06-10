---
title: 설치
description:
date: 2024-06-09
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/getting-started/installation',
    },
  ]
---

다음 명령을 사용하여 Turboprepo를 빠르게 시작할 수 있다:

```bash
npx create-turbo@latest
```

- 자세한 내용은 GitHub의 [기본 시작 템플릿 README](https://github.com/vercel/turbo/tree/main/examples/basic)를 참조한다.
- 다른 예제 템플릿을 사용할 수도 있다. (아래 내용 참조)

## turbo 설치하기

`turbo` 는 두 가지 방법으로 설치할 수 있다.

- **전역 설치**: 터미널에서 바로 `turbo` 명령어를 쓸 수 있어서 편리하다.
- **로컬로 설치**: 팀원들이 모두 같은 버전의 `turbo` 를 사용할 수 있다.

두 가지 방법 모두 써보길 추천한다. 전역 설치로 편의성을 얻고, 로컬 설치로 안정성을 확보할 수 있다.

### 전역 설치

`turbo` 를 전역으로 설치하면 명령을 좀 더 쉽고 빠르게 사용할 수 있다.

```bash
npm install turbo --global
```

전역으로 설치하고 나면 터미널 어디에서든 `turbo` 명령을 바로 실행할 수 있다.

프로젝트 폴더로 일일이 이동하지 않아도 되므로 일회성 명령을 빠르게 실행하기에 좋다.

- 예를 들면:
  - `turbo build`: 저장소의 의존성 그래프에 따라 `build` 스크립트를 실행한다.
  - `turbo build --filter=docs --dry`: `docs` 패키지의 `build` 작업 개요를 빠르게 출력한다(실제로 실행하지는 않음).
  - `turbo generate`: 제너레이터를 실행하여 저장소에 새 코드를 추가한다.
  - `cd apps/docs && turbo build`: `docs` 패키지와 그 의존성에서 `build` 스크립트를 실행한다.

:::tip
`turbo` 는 `turbo run` 의 별칭이다.
:::

:::caution 다중 전역 설치 피하기

- 이전에 `turbo` 를 전역으로 설치한 적이 있다면, 같은 패키지 관리자로 설치하는 게 안전하다.
- `turbo bin` 명령을 사용하면 이전 설치에 사용된 패키지 관리자를 알 수 있다.

:::

#### CI에서 전역 turbo 사용하기

CI 파이프라인을 만들 때도 전역 `turbo` 를 활용할 수 있다.

자세한 내용은 [CI 구성 가이드](https://turbo.build/repo/docs/crafting-your-repository/constructing-ci#global-turbo-in-ci)를 참조한다.

### 로컬 설치

다른 개발자들과 협업할 때는 서로 동일한 버전을 사용하는 것이 좋다.

프로젝트 루트에 `turbo` 를 `devDependency` 로 추가하면 된다.

```bash
npm install turbo --save-dev
```

이렇게 해도 여전히 전역으로 설치된 `turbo` 를 사용해 명령을 실행할 수 있다.

전역 `turbo` 는 저장소에 로컬 버전이 있으면 해당 버전을 우선적으로 사용한다.

이런 식으로 두 가지 설치 방식의 장점을 모두 누릴 수 있다.

## 예제로 시작하기

커뮤니티에서는 Turborepo를 사용하는 여러 예제들을 제공한다.

일반적인 도구나 라이브러리를 어떻게 Turborepo와 함께 사용하는지 알 수 있다.

예제를 사용하여 프로젝트를 부트스랩하는 방법은 다음과 같다.

```bash
npx create-turbo@latest --example [example-name]
```

| 이름                                                                                              | 설명                                                                                                   |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [basic](https://github.com/vercel/turbo/tree/main/examples/basic)                                 | 기본 사항을 배우기 위한 최소한의 Turborepo 예제다.                                                     |
| [design-system](https://github.com/vercel/turbo/tree/main/examples/design-system)                 | 여러 앱에서 디자인 시스템을 공유한다.                                                                  |
| [kitchen-sink](https://github.com/vercel/turbo/tree/main/examples/kitchen-sink)                   | 더 자세한 예제를 보고 싶다면? 프론트엔드 및 백엔드 포괄하여 여러 프레임워크가 포함되어 있다.           |
| [non-monorepo](https://github.com/vercel/turbo/tree/main/examples/non-monorepo)                   | 워크스페이스 없이 단일 프로젝트에서 Turborepo를 사용하는 예제다.                                       |
| [with-changesets](https://github.com/vercel/turbo/tree/main/examples/with-changesets)             | Changesets을 통해 패키지를 배포하도록 미리 구성된 간단한 Next.js 모노레포다.                           |
| [with-docker](https://github.com/vercel/turbo/tree/main/examples/with-docker)                     | turbo prune을 활용하여 Docker로 배포된 Express API와 Next.js 앱이 있는 모노레포다.                     |
| [with-gatsby](https://github.com/vercel/turbo/tree/main/examples/with-gatsby)                     | UI 라이브러리를 공유하는 Gatsby.js와 Next.js 앱이 있는 모노레포다.                                     |
| [with-prisma](https://github.com/vercel/turbo/tree/main/examples/with-prisma)                     | Prisma와 완전히 통합된 Next.js 앱이 있는 모노레포다.                                                   |
| [with-react-native-web](https://github.com/vercel/turbo/tree/main/examples/with-react-native-web) | 공유 UI 라이브러리가 있는 간단한 React Native & Next.js 모노레포다.                                    |
| [with-rollup](https://github.com/vercel/turbo/tree/main/examples/with-rollup)                     | Rollup으로 번들된 UI 라이브러리를 공유하는 단일 Next.js 앱이 있는 모노레포다.                          |
| [with-svelte](https://github.com/vercel/turbo/tree/main/examples/with-svelte)                     | UI 라이브러리를 공유하는 여러 SvelteKit 앱이 있는 모노레포다.                                          |
| [with-tailwind](https://github.com/vercel/turbo/tree/main/examples/with-tailwind)                 | 공유 구성으로 Tailwind CSS를 모두 사용하는 UI 라이브러리를 공유하는 여러 Next.js 앱이 있는 모노레포다. |
| [with-vite](https://github.com/vercel/turbo/tree/main/examples/with-vite)                         | Vite 로 번들링된 UI 라이브러리를 공유하는 여러 Vanilla JS 앱이 있는 모노레포다.                        |
| [with-vue-nuxt](https://github.com/vercel/turbo/tree/main/examples/with-vue-nuxt)                 | UI 라이브러리를 공유하는 Vue 및 Nuxt가 있는 모노레포다.                                                |
