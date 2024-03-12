---
title: SWC - 빠른 컴파일러
description:
date: 2024-03-11
tags: [swc]
references:
  [{ key: 'NestJS 공식 문서', value: 'https://docs.nestjs.com/recipes/swc' }]
---

[SWC](https://swc.rs/)(Speedy Web Compiler)는 컴파일과 번들링에 모두 사용할 수 있는 확장 가능한 Rust 기반 플랫폼이다. Nest CLI와 함께 SWC를 사용하면 개발 프로세스의 속도를 크게 높일 수 있다.

:::note
SWC는 기본 타입스크립트 컴파일러보다 약 20배 빠르다.
:::

## SWC

### 설치 {#installation}

시작하려면 먼저 몇 가지 패키지를 설치한다:

```bash
npm i --save-dev @swc/cli @swc/core
```

### 시작하기 {#getting-started}

설치 프로세스가 완료되면 다음과 같이 Nest CLI와 함께 `swc` 빌더를 사용할 수 있다:

```bash
nest start -b swc
```

`b` 플래그를 전달하는 대신 다음과 같이 `nest-cli.json` 파일에서 `compilerOptions.builder` 속성을 `"swc"` 로 설정할 수도 있다:

```json
{
  "compilerOptions": {
    "builder": "swc"
  }
}
```

빌더의 동작을 사용자 지정하려면 다음과 같이 두 가지 속성, `type` ( `"swc"` )과 `options` 이 포함된 객체를 전달할 수 있다:

```json
"compilerOptions": {
  "builder": {
    "type": "swc",
    "options": {
      "swcrcPath": "infrastructure/.swcrc",
    }
  }
}
```

감시 모드에서 애플리케이션을 실행하려면 다음 명령을 사용한다:

```bash
nest start -b swc -w
# OR nest start --builder swc --watch
```

### 타입 검사 {#type-checking}

SWC는 기본 타입스크립트 컴파일러와 달리 자체적으로 타입 검사를 수행하지 않으므로 이를 활성화하려면 `--type-check` 플래그를 사용해야 한다:

```bash
nest start -b swc --type-check
```

이 명령은 Nest CLI가 타입 검사를 비동기적으로 수행하는 SWC와 함께 `noEmit` 모드에서 `tsc` 를 실행하도록 지시한다. 다시 말하지만, `--type-check` 플래그를 전달하는 대신 다음과 같이 `nest-cli.json` 파일에서 `compilerOptions.typeCheck` 속성을 `true` 로 설정할 수도 있다:

```json
{
  "compilerOptions": {
    "builder": "swc",
    "typeCheck": true
  }
}
```

### CLI 플러그인 (SWC) {#cli-plugins-swc}

`--type-check` 플래그는 **NestJS CLI 플러그인**을 자동으로 실행하고 직렬화된 메타데이터 파일을 생성하여 런타임에 애플리케이션에서 로드할 수 있도록 한다.

### SWC 구성 {#swc-configuration}

SWC 빌더는 NestJS 애플리케이션의 요구 사항에 맞게 사전 구성되어 있다. 그러나 루트 디렉터리에 `.swcrc` 파일을 만들고 원하는 대로 옵션을 조정하여 구성을 커스터마이징 할 수 있다.

```json
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "decorators": true,
      "dynamicImport": true
    },
    "baseUrl": "./"
  },
  "minify": false
}
```

### 모노레포 {#monorepo}

레포지토리가 모노레포인 경우 `swc` 빌더를 사용하는 대신 `swc-loader` 를 사용하도록 `webpack`을 구성해야 한다.

먼저 필요한 패키지를 설치한다:

```bash
npm i --save-dev swc-loader
```

설치가 완료되면 애플리케이션의 루트 디렉터리에 다음과 같이 `webpack.config.js` 파일을 만든다:

```js
const swcDefaultConfig =
  require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory()
    .swcOptions;

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: swcDefaultConfig,
        },
      },
    ],
  },
};
```

### 모노레포와 CLI 플러그인 {#monorepo-and-cli-plugins}

CLI 플러그인을 사용하는 경우 `swc-loader` 가 자동으로 로드하지 않는다. 대신 수동으로 로드할 별도의 파일을 만들어야 한다. 이렇게 하려면 `main.ts` 파일 근처에 다음 내용으로 `generate-metadata.ts` 파일을 선언한다:

```ts
import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins';
import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin';

const generator = new PluginMetadataGenerator();
generator.generate({
  visitors: [
    new ReadonlyVisitor({ introspectComments: true, pathToSource: __dirname }),
  ],
  outputDir: __dirname,
  watch: true,
  tsconfigPath: 'apps/<name>/tsconfig.app.json',
});
```

:::note
이 예제에서는 `@nestjs/swagger` 플러그인을 사용했지만 원하는 플러그인을 사용할 수 있다.
:::

`generate()` 메서드는 다음과 같은 옵션을 받을 수 있다.

| 옵션               | 설명                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------- |
| `watch`            | 프로젝트의 변경 사항을 감시할지 여부.                                                 |
| `tsconfigPath`     | `tsconfig.json` 파일의 경로다. 현재 작업 디렉터리( `process.cwd()` )를 기준으로 한다. |
| `outputDir`        | 메타데이터 파일이 저장될 디렉터리 경로다.                                             |
| `visitors`         | 메타데이터를 생성하는 데 사용되는 visitors 배열이다.                                  |
| `filename`         | 메타데이터 파일의 이름이다. 기본값은 `metadata.ts` 이다.                              |
| `printDiagnostics` | 진단을 콘솔에 인쇄할지 여부다. 기본값은 `true` 다.                                    |

마지막으로 다음 명령을 사용하여 별도의 터미널 창에서 `generate-metadata` 스크립트를 실행할 수 있다:

```bash
npx ts-node src/generate-metadata.ts
# OR npx ts-node apps/{YOUR_APP}/src/generate-metadata.ts
```

### 일반적인 함정 {#common-pitfall}

애플리케이션에서 TypeORM / MikroORM 또는 다른 ORM을 사용하는 경우 circular import 문제가 발생할 수 있다. SWC는 circular import 를 제대로 처리하지 못하므로 다음 해결 방법을 사용해야 한다:

```ts
@Entity()
export class User {
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Relation<Profile>; // <--- see "Relation<>" type here instead of just "Profile"
}
```
