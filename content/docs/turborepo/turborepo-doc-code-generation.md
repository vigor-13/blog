---
title: 코드 생성
description:
date: 2024-01-19
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/core-concepts/monorepos/code-generation',
    },
  ]
---

모노레포를 개별 워크스페이스로 분할하면 코드를 정리하고 작업 속도를 높이며 로컬 개발 환경을 개선할 수 있는 좋은 방법이다. 터보레포의 코드 생성 기능을 사용하면 패키지, 모듈, 심지어 개별 UI 컴포넌트에 대한 새 소스 코드를 나머지 저장소와 통합되는 구조화된 방식으로 쉽게 생성할 수 있다.

## 빈 워크스페이스 추가하기 {#add-empty-workspace}

모노레포에 새로운 빈 앱이나 패키지를 추가한다.

```bash
turbo gen workspace
```

`gen workspace`에 사용 가능한 모든 [옵션](https://turbo.build/repo/docs/reference/command-line-reference/gen#workspace) 보기

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo-doc-code-generation/1.png)

## 기존 워크스페이스 복사하기 {#copy-workspace}

기존 워크스페이스를 새 앱 또는 패키지의 템플릿으로 사용할 수 있다. 이는 기존 모노레포 내의 워크스페이스와 다른 레포지토리의 원격 워크스페이스(GitHub URL을 통해 지정)에서 모두 작동한다.

### 예제 {#example}

레포지토리의 기존 워크스페이스에서 복사하여 모노레포에 새 워크스페이스를 만든다.

```bash
turbo gen workspace --copy
```

원격 워크스페이스에서 복사하여 모노레포에 새 워크스페이스를 만든다.

```bash
turbo gen workspace --copy https://github.com/vercel/turbo/tree/main/examples/with-tailwind/packages/tailwind-config
```

:::warning
원격 소스에서 추가할 때 터보레포는 레포지토리에 필요한 모든 종속성이 있는지, 올바른 패키지 관리자를 사용하고 있는지 확인할 수 없다. 이 경우 새 워크스페이스가 레포지토리 내에서 예상대로 작동하도록 하기 위해 일부 수동 수정이 필요할 수 있다.
:::

`gen workspace --copy`에 사용 가능한 모든 [옵션](https://turbo.build/repo/docs/reference/command-line-reference/gen#workspace) 보기.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo-doc-code-generation/2.png)

## 커스텀 생성기 {#custom-generator}

빌트인 생성기가 필요에 맞지 않는 경우 [Plop](https://plopjs.com/) 구성을 사용하여 커스텀 생성기를 만들 수 있다. 터보레포는 레포지토리 내의 모든 생성기 구성을 자동으로 감지하여 명령줄에서 실행할 수 있도록 한다.

:::note
터보레포 생성기는 Plop을 기반으로 구축되었지만, 레포지토리에 종속 요소로 Plop을 설치할 필요는 없다.
:::

터보레포는 모든 Plop 구성 옵션과 기능을 이해하지만, 터보레포로 구성된 레포지토리 내에서 생성기를 작성하는 환경을 개선하기 위해 몇 가지 추가 기능을 제공한다.

1. 생성기는 워크스페이스별로 자동으로 검색, 로드 및 구성된다(단일 구성 파일 내에서 수동으로 로드할 필요 없음).
2. 생성기가 정의된 워크스페이스의 루트에서 자동으로 실행된다.
3. 생성기는 레포지토리 내 어디에서나 호출할 수 있다(또는 `--root` 플래그를 통해 리포지토리 외부에서 호출).
4. 타입스크립트는 별도의 설정 없이 기본적으로 지원된다.
5. plop을 레포지토리의 종속 요소로 설치할 필요가 없다.

:::warning
현재 커스텀 생성기 내에서 ESM 종속성은 지원되지 않는다.
:::

### 시작하기 {#getting-started}

커스텀 생성기를 빌드하고 실행하려면 터보레포를 사용하여 모노레포 내 어디에서나 다음 명령을 실행한다.

```bash
turbo gen
```

기존 생성기를 선택하거나 아직 생성기가 없는 경우 생성하라는 메시지가 표시된다. 레포지토리의 루트 또는 모든 워크스페이스에 있는 `turbo/generators/config.ts`(또는 `config.js`)에서 수동으로 구성을 만들 수도 있다.

:::note
타입스크립트를 사용하는 경우, 필요한 TS 타입에 액세스하려면 `@turbo/gen` 패키지를 개발 종속성으로 설치해야 한다.
:::

예를 들어 다음은 세 개의 생성기 구성이 있는 모노레포의 예다:

```text
- root
- apps/web
- packages/ui
```

```text
├── package.json
├── turbo.json
├── README.md
├── apps
│   └── web
│       ├── package.json
│       └── turbo
│           └── generators
│               ├── config.ts
│               └── templates
├── packages
│   └── ui
│       ├── package.json
│       └── turbo
│           └── generators
│               ├── config.ts
│               └── templates
├── turbo
│   └── generators
│       ├── config.ts
│       └── templates
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

워크스페이스 내에서 생성된 생성기는 레포지토리 루트나 생성기 구성 위치가 아닌 워크스페이스 루트에서 자동으로 실행된다.

이렇게 하면 생성기를 더 간단하게 작성할 수 있다. `[workspace-root]`에서 파일을 만들 때는 `../../<file>`이 아닌 `<file>`로만 지정하면 된다.

### 생성기 작성하기 {#writing-generators}

생성기 구성 파일은 Plop 구성 객체를 반환하는 함수다. 구성 객체는 생성기의 프롬프트 및 액션을 정의하는 데 사용된다.

가장 간단한 형태의 생성기 구성 파일은 다음과 같다:

```ts
import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // 생성기 만들기
  plop.setGenerator("Generator name", {
    description: "Generator description",
    // 유저로부터 정보 모으기
    prompts: [
      ...
    ],
    // 프롬프트의 결과에 기반하여 액션 수행
    actions: [
      ...
    ],
  });
}
```

#### 프롬프트 {#prompts}

프롬프트는 [Plop 프롬프트](https://plopjs.com/documentation/#using-prompts)를 사용하여 작성되며 사용자로부터 정보를 수집하는 데 사용된다.

#### 액션 {#actions}

액션은 [빌트인 Plop 액션](https://plopjs.com/documentation/#built-in-actions)을 사용하거나 직접 정의한 [커스텀 액션 함수](https://plopjs.com/documentation/#functionsignature-custom-action)를 사용할 수 있다:

```ts
import type { PlopTypes } from "@turbo/gen";

const customAction: PlopTypes.CustomActionFunction = async (answers) => {
  // 원격 API를 사용하여 데이터 가져오기
  const results = await fetchRemoteData();
  // 응답을 answers에 추가하여 이 데이터를 액션에서 사용할 수 있도록 한다.
  answers.results = results;
  // 상태 문자열 리턴
  return 'Finished data fetching!';
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // 생성기를 만든다.
  plop.setGenerator("Generator name", {
    description: "Generator description",
    prompts: [
      ...
    ],
    actions: [
      customAction
      {/* 후속 액션들은 이제 `answers.results`에 접근할 수 있다. */}
      ...
    ],
  });
}
```

### 생성기 실행하기 {#running-generators}

생성기 구성 파일을 생성한 후에는 선택 프롬프트를 건너뛰고 지정된 생성기를 바로 실행할 수 있다:

```bash
turbo gen [generator-name]
```

인수는 `--args`를 사용하여 생성기 프롬프트에 직접 전달할 수도 있다.

```bash
turbo gen [generator-name] --args answer1 answer2 ...
```

`gen` 명령어에 사용 가능한 모든 [옵션](https://turbo.build/repo/docs/reference/command-line-reference#run-generator-name) 보기

## 예제 {#example2}

[vercel/turbo](https://github.com/vercel/turbo) 모노레포에는 자체 개발에 사용되는 몇 가지 사용자 지정 터보레포 생성기가 포함되어 있다.

- [새 블로그 게시물 만들기](https://github.com/vercel/turbo/blob/main/docs/turbo/generators/config.ts) - NPM 및 Github API에서 가져온 실시간 통계가 포함된 새 릴리스 블로그 게시물을 작성한다.
- [새 코드 트랜스폼 만들기](https://github.com/vercel/turbo/blob/main/packages/turbo-codemod/turbo/generators/config.ts) - 모든 상용구와 테스트가 포함된 `@turbo/codemod`에 대한 새 코드 트랜스폼을 만든다.

터보레포 예제

- [examples/basic](https://github.com/vercel/turbo/blob/main/examples/basic/packages/ui/turbo/generators/config.ts)
