---
title: 워크스페이스
description:
date: 2024-03-12
tags: [monorepo, workspace]
references:
  [{ key: 'NestJS 공식 문서', value: 'https://docs.nestjs.com/cli/monorepo' }]
---

Nest에는 코드 관리를 위한 두 가지 모드가 있다:

- **표준 모드** : 자체 종속성과 설정이 있고 모듈을 공유하거나 복잡한 빌드를 최적화할 필요가 없는 개별 프로젝트 중심의 애플리케이션을 빌드하는 데 유용하다. 기본 모드다.
- **모노레포 모드** : 이 모드는 코드 아티팩트를 경량 모노레포의 일부로 취급하며, 개발자 팀 및/또는 다중 프로젝트 환경에 더 적합할 수 있다. 이 모드는 빌드 프로세스의 일부를 자동화하여 모듈식 컴포넌트를 쉽게 만들고 구성할 수 있도록 하고, 코드 재사용을 촉진하며, 통합 테스트를 더 쉽게 하고, `eslint` 규칙 및 기타 구성 정책과 같은 프로젝트 전체 아티팩트를 쉽게 공유할 수 있으며, github submodules 과 같은 대안보다 사용하기가 더 쉽다. 모노레포 모드는 `nest-cli.json` 파일에 표시된 **워크스페이스** 개념을 사용하여 모노레포의 컴포넌트 간의 관계를 조정한다.

Nest의 대부분의 기능은 이러한 모드들과 무관하다는 점에 유의한다. 이 선택의 유일한 영향은 프로젝트 구성 방식과 빌드 아티팩트 생성 방식뿐이다. CLI부터 핵심 모듈, 애드온 모듈에 이르기까지 다른 모든 기능은 두 모드에서 동일하게 작동한다.

또한 언제든지 표준 모드에서 모노레포 모드로 쉽게 전환할 수 있으므로 두 가지 접근 방식의 이점이 더 명확해질 때까지 결정을 미룰 수 있다.

## 표준 모드 {#standard-mode}

`nest new` 를 실행하면 기본 프로젝트가 만들어진다. Nest는 다음을 수행한다:

1. 새 폴더를 만들 때 제공한 `name` 인자에 해당하는 새 폴더를 만든다.
2. 생성된 폴더에 애플리케이션에 필요한 기본 파일을 채운다. 이러한 파일은 [typescript-start](https://github.com/nestjs/typescript-starter)에서 살펴볼 수 있다.
3. 애플리케이션 컴파일, 테스트 및 제공을 위한 다양한 도구를 구성하고 활성화하는 `nest-cli.json` , `package.json` 및 `tsconfig.json` 등의 추가 파일을 제공할 수 있다.

이제 부터 파일을 수정하고, 새 컴포넌트를 추가하고, 종속성(예: `npm install` )을 추가하는 등 이 문서의 나머지 부분에서 설명하는 대로 애플리케이션을 개발할 수 있다.

## 모노레포 모드 {#monorepo-mode}

모노레포 모드를 사용하려면 표준 모드 구조로 시작하여 프로젝트를 추가한다. 프로젝트는 전체 애플리케이션( `nest generate app` 명령으로 워크스페이스에 추가) 또는 라이브러리( `nest generate library` 명령으로 추가)일 수 있다. 아래에서 이러한 특정 유형의 프로젝트 컴포넌트에 대해 자세히 설명한다. 여기서 주목해야 할 핵심 사항은 기존 표준 모드 구조에 프로젝트를 추가하여 모노레포 모드로 변환한다는 점이다. 한 가지 예를 살펴보자.

만약 다음을 실행하면:

```bash
nest new my-project
```

표준 모드 구조는 다음과 같은 폴더 구조로 구성된다:

```text
node_modules
src
 ├─ app.controller.ts
 ├─ app.module.ts
 ├─ app.service.ts
 └─ main.ts
nest-cli.json
package.json
tsconfig.json
.eslintrc.js
```

이를 다음과 같이 모노레포 모드 구조로 변환할 수 있다:

```bash
cd my-project
nest generate app my-app
```

이 시점에서 `nest` 는 기존 구조를 모노레포 모드 구조로 변환한다. 이로 인해 몇 가지 중요한 변경 사항이 생긴다. 이제 폴더 구조는 다음과 같다:

```text
apps
 ├─ my-app
 │   ├─ src
 │   │   ├─ app.controller.ts
 │   │   ├─ app.module.ts
 │   │   ├─ app.service.ts
 │   │   └─ main.ts
 │   └─ tsconfig.app.json
 └─ my-project
     ├─ src
     │   ├─ app.controller.ts
     │   ├─ app.module.ts
     │   ├─ app.service.ts
     │   └─ main.ts
     └─ tsconfig.app.json
nest-cli.json
package.json
tsconfig.json
.eslintrc.js
```

`generate app` 스키마는 각 애플리케이션 프로젝트를 `apps` 폴더 아래로 이동하고 각 프로젝트의 루트 폴더에 프로젝트별 `tsconfig.app.json` 파일을 추가하는 등 코드를 재구성했다. 원래의 `my-project` 앱이 모노레포의 **기본 프로젝트**가 되었으며, 이제 `apps` 폴더 아래에 있는 방금 추가된 `my-app` 과 동등한 위치가 되었다. 아래에서 기본 프로젝트에 대해 설명한다.

:::warning
표준 모드 구조를 모노레포로 변환하는 것은 표준 Nest 프로젝트 구조를 따르는 프로젝트에서만 작동한다. 특히 변환하는 동안 스키마는 루트의 `apps` 폴더 아래에 있는 프로젝트 폴더의 `src` 및 `test` 폴더를 재배치하려고 시도한다. 프로젝트가 이 구조를 사용하지 않으면 변환이 실패하거나 신뢰할 수 없는 결과를 생성한다.
:::

## 워크스페이스 프로젝트 {#workspace-projects}

모노레포는 워크스페이스라는 개념을 사용하여 멤버 엔티티를 관리한다. 워크스페이스는 **프로젝트**로 구성된다. 프로젝트는 다음의 둘 중 하나 있다:

- **애플리케이션** : 애플리케이션을 부트스트랩하기 위한 `main.ts` 파일을 포함한 전체 Nest 애플리케이션. 컴파일 및 빌드 고려 사항을 제외하면, 워크스페이스 내의 애플리케이션 타입 프로젝트는 표준 모드 구조 내의 애플리케이션과 기능적으로 동일하다.
- **라이브러리** : 라이브러리는 다른 프로젝트 내에서 사용할 수 있는 범용 기능 세트(모듈, 프로바이더, 컨트롤러 등)를 패키징하는 방법이다. 라이브러리는 자체적으로 실행할 수 없으며 `main.ts` 파일이 없다. 라이브러리에 대한 자세한 내용은 [여기](https://docs.nestjs.com/cli/libraries)에서 확인한다.

모든 워크스페이스에는 **기본 프로젝트**(애플리케이션 타입 프로젝트여야 함)가 있다. 이는 `nest-cli.json` 파일의 최상위 `"root"` 속성으로 정의되며, 기본 프로젝트의 루트를 가리킨다. 일반적으로 이것은 표준 모드 애플리케이션으로 시작하여 나중에 `nest generate app` 을 사용하여 모노레포로 변환하는 애플리케이션이다. 이 단계를 수행하면 이 속성이 자동으로 채워진다.

기본 프로젝트는 프로젝트 이름이 제공되지 않은 경우 `neest build` 및 `nest start` 와 같은 `nest` 명령의 대상이 된다.

예를 들어 위의 모노레포 구조에서 다음을 실행하면

```bash
nest start
```

`my-project` 앱이 시작된다. `my-app` 을 시작하려면 다음과 같이 한다:

```bash
nest start my-app
```

## 애플리케이션 {#applications}

애플리케이션 타입 프로젝트는 실행 및 배포할 수 있는 완전한 Nest 애플리케이션이다. `nest generate app` 으로 생성한다.

이 명령은 [typescript starter](https://github.com/nestjs/typescript-starter)에서 표준 `src` 및 `test` 폴더를 포함한 프로젝트 스켈레톤을 자동으로 생성한다. 표준 모드와 달리 모노레포의 애플리케이션 프로젝트에는 패키지 종속성( `package.json` )이나 `.prettierrc` 및 `.eslintrc.js` 와 같은 기타 프로젝트 구성 아티팩트가 없다. 대신 모노레포 전체 종속성 및 구성 파일이 사용된다.

그러나 스키마는 프로젝트의 루트 폴더에 프로젝트별 `tsconfig.app.json` 파일을 생성한다. 이 구성 파일은 컴파일 출력 폴더를 올바르게 설정하는 등 적절한 빌드 옵션을 자동으로 설정한다. 이 파일은 최상위(모노레포) `tsconfig.json` 파일을 확장하므로 모노레포 전체에서 전역 설정을 관리할 수 있지만 필요한 경우 프로젝트 수준에서 이를 재정의할 수 있다.

## 라이브러리 {#libraries}

앞서 언급했듯이 라이브러리 타입 프로젝트 또는 간단히 "라이브러리"는 실행하기 위해 애플리케이션으로 구성해야 하는 Nest 컴포넌트 패키지다. `nest generate library` 를 사용하여 생성한다. 라이브러리에 무엇이 포함될지 결정하는 것은 아키텍처 디자인에 따라 결정된다. 라이브러리에 대해서는 [라이브러리 챕터](https://docs.nestjs.com/cli/libraries)에서 자세히 설명한다.

## CLI 프로퍼티 {#cli-properties}

Nest는 표준 및 모노레포 구조의 프로젝트를 구성, 빌드 및 배포하는 데 필요한 메타데이터를 `nest-cli.json` 파일에 보관한다. Nest는 프로젝트를 추가할 때 이 파일을 자동으로 추가하고 업데이트하므로 일반적으로 이 파일에 대해 생각하거나 내용을 편집할 필요가 없다. 그러나 수동으로 변경해야 하는 설정이 몇 가지 있으므로 파일에 대한 개요를 파악하고 있으면 도움이 된다.

위의 단계를 실행하여 모노레포를 생성하면 `nest-cli.json` 파일은 다음과 같다:

```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "apps/my-project/src",
  "monorepo": true,
  "root": "apps/my-project",
  "compilerOptions": {
    "webpack": true,
    "tsConfigPath": "apps/my-project/tsconfig.app.json"
  },
  "projects": {
    "my-project": {
      "type": "application",
      "root": "apps/my-project",
      "entryFile": "main",
      "sourceRoot": "apps/my-project/src",
      "compilerOptions": {
        "tsConfigPath": "apps/my-project/tsconfig.app.json"
      }
    },
    "my-app": {
      "type": "application",
      "root": "apps/my-app",
      "entryFile": "main",
      "sourceRoot": "apps/my-app/src",
      "compilerOptions": {
        "tsConfigPath": "apps/my-app/tsconfig.app.json"
      }
    }
  }
}
```

파일은 섹션으로 나뉜다:

- 표준 및 모노레포 전체 설정을 제어하는 최상위 프로퍼티가 있는 전역 섹션
- 각 프로젝트에 대한 메타데이터가 있는 `"projects"` 프로퍼티 섹션. 이 섹션은 모노레포 모드에만 존재한다.

최상위 프로퍼티는 다음과 같다.

- `"collection"` : 컴포넌트를 생성하는 데 사용되는 스키마 컬렉션을 가리키며, 일반적으로 이 값을 변경해서는 안 된다.
- `"sourceRoot"` : 표준 모드 구조에서는 단일 프로젝트의 소스 코드 루트를 가리키고, 모노레포 모드 구조에서는 기본 프로젝트를 가리킨다.
- `"compilerOptions"` : 컴파일러 옵션을 지정하는 키와 옵션 설정을 지정하는 값이 있는 맵이다.
- `"generateOptions"` : 전역 생성 옵션을 지정하는 키와 옵션 설정을 지정하는 값이 있는 맵이다.
- `"monorepo"` : (모노레포 전용) 모노레포 모드 구조의 경우, 이 값은 항상 `true` 다.
- `"root"` : (모노레포만 해당) 기본 프로젝트의 프로젝트 루트를 가리킨다.

## 전역 컴파일러 옵션 {#global-compiler-options}

다음의 프로퍼티들은 사용할 컴파일러를 지정할 뿐만 아니라 `nest build` 또는 `nest start` 의 일부로, 그리고 컴파일러에 관계없이 `tsc` 또는 webpack 등 모든 컴파일 단계에 영향을 주는 다양한 옵션을 지정한다.

| 프로퍼티 이름       | 값 타입       | 설명                                                                                                                                                                                                                           |
| ------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `webpack`           | boolean       | `true` 면 webpack 컴파일러를 사용한다. `false` 이거나 없으면 `tsc` 를 사용한다. 모노레포 모드에서는 기본값이 `true` (웹팩 사용)이고, 표준 모드에서는 기본값이 `false` (`tsc` 사용)다. (deprecated: 대신 `builder` 사용)        |
| `tsConfigPath`      | string        | **(모노레포 전용)** `project` 옵션 없이 `nest build` 또는 `nest start` 명령을 사용할때(예: 기본 프로젝트가 빌드되거나 시작될 때) 사용되는 `tsconfig.json` 설정이 포함된 파일을 가리킨다.                                       |
| `webpackConfigPath` | string        | webpack 옵션 파일을 가리킨다. 지정하지 않으면 Nest는 `webpack.config.js` 파일을 찾는다.                                                                                                                                        |
| `deleteOutDir`      | boolean       | `true` 면 컴파일러가 호출될 때마다 컴파일러가 먼저 컴파일 출력 디렉터리를 제거한다(기본값은 `tsconfig.json` 에 구성된 대로 `./dist` 다 ).                                                                                      |
| `assets`            | array         | 컴파일 단계가 시작될 때마다 비-타입스크립트가 에셋을 자동으로 배포할 수 있다( `--watch` 모드의 증분 컴파일에서는 에셋 배포가 발생하지 않음).                                                                                   |
| `watchAssets`       | boolean       | `true` 면 감시 모드로 실행하여 모든 비-타입스크립트 에셋을 감시한다.                                                                                                                                                           |
| `manualRestart`     | boolean       | `true` 면 바로 가기 `rs` 를 사용하여 서버를 수동으로 다시 시작하도록 설정한다. 기본값은 `false` 다.                                                                                                                            |
| `builder`           | string/object | 프로젝트를 컴파일하는 데 사용할 빌더( `tsc`, `swc` 또는 `webpack`)를 CLI에 지시한다. 빌더의 동작을 커스터마이징 하려면 `type` (`tsc`, `swc` 또는 `webpack`)과 `options` 이라는 두 가지 프로퍼티가 포함된 객체를 전달하면 된다. |
| `typeCheck`         | boolean       | `true` 면 SWC 기반 프로젝트에 대해 타입 검사를 활성화한다(빌더가 `swc` 인 경우). 기본값은 `false` 다.                                                                                                                          |

## 전역 생성 옵션 {#global-generate-options}

다음의 프로퍼티들은 `nest generate` 명령에서 사용할 기본 생성 옵션을 지정한다.

| 프로퍼티 이름 | 값 타입          | 설명                                                                                                                                                                                                                                                                                                                 |
| ------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `spec`        | boolean / object | 값이 `true` 면 기본적으로 `spec` 생성이 활성화되고 `false` 면 비활성화된다. CLI 명령줄에서 전달된 플래그는 프로젝트별 `generateOptions` 설정과 마찬가지로 이 설정을 재정의한다. 값이 객체인 경우 각 키는 스키마 이름을 나타내며, 부울 값은 해당 특정 스키마에 대해 기본 spec 생성의 활성화/비활성화 여부를 결정한다. |
| `flat`        | boolean          | `true` 면 모든 생성 명령이 플랫 구조를 생성한다.                                                                                                                                                                                                                                                                     |

다음 예제는 부울 값을 사용하여 모든 프로젝트에서 기본적으로 spec 파일 생성을 비활성화하도록 지정하는 예제다:

```json
{
  "generateOptions": {
    "spec": false
  },
  ...
}
```

다음 예는 부울 값을 사용하여 모든 프로젝트에서 플랫 파일 생성을 기본값으로 지정하는 예제다:

```json
{
  "generateOptions": {
    "flat": true
  },
  ...
}
```

다음 예에서는 `service` 스키마(예: `nest generate service...` )에 대해서만 `spec` 파일 생성을 비활성화한다:

```json
{
  "generateOptions": {
    "spec": {
      "service": false
    }
  },
  ...
}
```

:::warning
`spec` 을 객체로 지정할 때 생성 스키마의 키는 현재 자동으로 별칭 처리를 지원하지 않는다.

즉, 예를 들어 `service: false` 와 같은 키를 지정하고 별칭 `s` 를 통해 서비스를 생성하려고 해도 여전히 spec 이 생성된다. 일반 스키마 이름과 별칭이 모두 의도한 대로 작동하는지 확인하려면 아래와 같이 일반 명령 이름과 별칭을 모두 지정한다.

```json
{
  "generateOptions": {
    "spec": {
      "service": false,
      "s": false
    }
  },
  ...
}
```

:::

## 프로젝트별 생성 옵션 {#project-specific-generate-options}

전역 생성 옵션을 제공하는 것 외에도 프로젝트별 생성 옵션을 지정할 수도 있다. 프로젝트별 생성 옵션은 전역 생성 옵션과 똑같은 형식을 따르지만 각 프로젝트에서 직접 지정한다.

프로젝트별 생성 옵션은 전역 생성 옵션보다 우선한다.

```json
{
  "projects": {
    "cats-project": {
      "generateOptions": {
        "spec": {
          "service": false
        }
      },
      ...
    }
  },
  ...
}
```

:::warning
생성 옵션의 우선 순위는 다음과 같다. CLI 옵션 > 프로젝트별 옵션 > 전역 옵션
:::

## 지정된 컴파일러 {#specified-compiler}

기본 컴파일러가 다른 이유는 대규모 프로젝트(예: 모노레포)의 경우 webapck이 빌드 시간과 모든 프로젝트 컴포넌트를 번들링한 단일 파일을 생성하는 데 상당한 이점이 있기 때문이다. 개별 파일을 생성할때 `"webpack"` 을 `false` 로 설정하면 빌드 프로세스에서 `tsc`(또는 `swc`)를 사용하게 된다.

## 웹팩 옵션 {#webpack-options}

웹팩 옵션 파일에는 표준 [웹팩 구성 옵션](https://webpack.js.org/configuration/)이 포함된다. 예를 들어 웹팩에 기본적으로 제외되는 `node_modules` 를 번들링하도록 하려면 `webpack.config.js` 에 다음을 추가한다:

```js
module.exports = {
  externals: [],
};
```

웹팩 구성 파일은 자바스크립트 파일이므로 기본 옵션을 받아 수정된 객체를 반환하는 함수를 사용할 수도 있다:

```js
module.exports = function (options) {
  return {
    ...options,
    externals: [],
  };
};
```

## 에셋 {#assets}

타입스크립트 컴파일은 컴파일러 출력( `.js` 및 `.d.ts` 파일)을 지정된 출력 디렉터리에 자동으로 배포한다. 또한 `.graphql` 파일, `images` , `.html` 파일 및 기타 에셋과 같은 타입스크립트 이외의 파일을 배포하는 데 편리할 수 있다. 이렇게 하면 `nest build`(및 모든 초기 컴파일 단계)를 경량 개발 빌드 단계로 취급하여 비-타입스크립트 파일을 편집하고 반복적으로 컴파일 및 테스트할 수 있다. 에셋은 `src` 폴더에 있어야 하며 그렇지 않으면 복사되지 않는다.

`assets` 키의 값은 배포할 파일을 지정하는 요소 배열이어야 한다. 요소는 예를 들어 글로브와 같은 파일 사양을 가진 단순한 문자열일 수 있다:

```json
"assets": ["**/*.graphql"],
"watchAssets": true,
```

세밀한 제어를 위해 요소는 다음 키를 가진 객체가 될 수 있다:

- `"include"` : 배포할 에셋에 대한 글로브 패턴
- `"exclude"` : `include` 목록에서 제외할 에셋에 대한 글로브 패턴
- `"outDir"` : 에셋을 배포할 경로(루트 폴더 기준)를 지정하는 문자열이다. 기본값은 컴파일러 출력에 구성된 것과 동일하다.
- `"watchAssets"` : `true` 면 지정된 에셋을 감시하는 감시 모드에서 실행한다.

예를 들어:

```json
"assets": [
  { "include": "**/*.graphql", "exclude": "**/omitted.graphql", "watchAssets": true },
]
```

:::warning
최상위 `compilerOptions` 프로퍼티에서 `watchAssets` 을 설정하면 `assets` 프로퍼티 내의 모든 `watchAssets` 설정이 재정의된다.
:::

## 프로젝트 프로퍼티 {#project-properties}

이 요소는 모노레포 모드 전용이다. 이러한 프로퍼티는 Nest 모노레포 내에서 프로젝트와 해당 구성 옵션을 찾는 데 사용되므로 일반적으로 편집해서는 안 된다.
