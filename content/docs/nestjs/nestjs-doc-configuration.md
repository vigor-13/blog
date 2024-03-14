---
title: 구성
description:
date: 2024-03-13
tags: [configuration]
references:
  [
    {
      key: 'NestJS 공식 문서',
      value: 'https://docs.nestjs.com/techniques/configuration',
    },
  ]
---

애플리케이션은 종종 서로 다른 환경에서 실행된다. 환경에 따라 다른 구성 설정을 사용해야 한다. 예를 들어, 일반적으로 로컬 환경에서는 로컬 데이터베이스 자격 증명을 사용한다. 프로덕션 환경에서는 별도의 DB 자격 증명 집합을 사용한다. 구성 변수가 변경되므로 환경(environment)에 [구성 변수를 저장](https://12factor.net/config)하는 것이 가장 좋다.

외부에서 정의된 환경 변수는 `process.env` 를 통해 Node.js 내부에서 전역으로 사용할 수 있다. 환경 변수를 각 환경에서 개별적으로 설정하여 다중-환경의 문제를 해결할 수 있다. 하지만 이러한 값을 쉽게 모킹하거나 변경해야 하는 개발 및 테스트 환경에서는 매우 번거로울 수 있다.

Node.js 애플리케이션에서는 `.env` 파일을 사용하는 것이 일반적이다. 다른 환경에서 앱을 실행하려면 올바른 `.env` 파일로 교체하기만 하면 된다.

Nest에서 이를 적용하기 위해 가장 좋은 방법은 필요한 `.env` 파일을 로드하는 `ConfigService` 를 제공하는 `ConfigModule` 을 만드는 것이다. 이러한 모듈을 직접 작성할 수도 있지만, 편의를 위해 Nest는 `@nestjs/config` 패키지를 기본으로 제공한다.

## 설치 {#installation}

먼저 필요한 종속성을 설치한다.

```bash
npm i --save @nestjs/config
```

:::note
`@nestjs/config` 패키지는 내부적으로 [dotenv](https://github.com/motdotla/dotenv)를 사용한다.
:::

:::warning
`@nestjs/config` 패키지는 타입스크립트 4.1 버전 이상이 필요하다.
:::

## 시작하기 {#getting-started}

설치 프로세스가 완료되면 `ConfigModule` 을 사용할 수 있다. 일반적으로 루트 `AppModule` 에서 .`forRoot()` 정적 메서드를 사용하여 동작을 제어한다. 이 단계에서는 환경 변수 키/값 쌍을 구문 분석하고 리졸브한다. 나중에 다른 기능 모듈에서 `ConfigModule` 의 `ConfigService` 클래스에 액세스하기 위한 몇 가지 옵션을 살펴볼 것이다.

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {}
```

위의 코드는 기본 위치인 프로젝트 루트 디렉토리에서 `.env` 파일을 로드하여 파싱하고, `.env` 파일에서 획득한 키/값 쌍을 `process.env` 에 할당된 환경 변수와 병합한 후, 이를 `ConfigService` 를 통해 액세스할 수 있는 비공개 구조에 저장한다.

`forRoot()` 메서드는 `ConfigService` 프로바이더를 등록하며, 이 프로바이더는 이렇게 파싱 / 병합된 구성 변수를 읽기 위한 `get()` 메서드를 제공한다.

`@nestjs/config` 는 [dotenv](https://github.com/motdotla/dotenv) 를 기반으로 하므로, 이 패키지의 규칙을 사용하여 환경 변수 이름의 충돌을 해결한다. 키가 런타임 환경 변수 (예: OS 쉘 익스포트를 통해 등록된 경우 `export DATABASE_USER=test`) 및 `.env` 파일 양쪽에 모두 존재하는 경우 런타임 환경 변수가 우선한다.

샘플 `.env` 파일은 다음과 같다:

```text
DATABASE_USER=test
DATABASE_PASSWORD=test
```

## 커스텀 env 파일 경로 {#custom-env-file-path}

기본적으로 패키지는 애플리케이션의 루트 디렉터리에서 `.env` 파일을 찾는다. `.env` 파일이 다른 경로에 존재하는 경우 다음과 같이 `forRoot()` 에 전달하는 옵션 객체에 `envFilePath` 프로퍼티를 설정한다:

```ts
ConfigModule.forRoot({
  envFilePath: '.development.env',
});
```

다음과 같이 `.env` 파일의 경로를 여러 개 지정할 수도 있다:

```ts
ConfigModule.forRoot({
  envFilePath: ['.env.development.local', '.env.development'],
});
```

동일한 변수가 여러 파일에 있는 경우 첫 번째 파일을 우선한다.

## 환경 변수 로딩 비활성화 {#disable-evn-variables-loading}

`.env` 파일을 로드하지 않고 대신 런타임 환경에서 환경 변수에 간단히 액세스하려면(예: OS 셸을 통한 `export DATABASE_USER=test` 와 같은 경우) 다음과 같이 옵션 개체의 `ignoreEnvFile` 프로퍼티를 `true` 로 설정한다:

```ts
ConfigModule.forRoot({
  ignoreEnvFile: true,
});
```

## 전역으로 모듈 사용하기 {#use-module-globally}

다른 모듈에서 `ConfigModule` 을 사용하려면 모든 Nest 모듈의 표준과 마찬가지로 이를 임포트해야 한다. 그리고 아래와 같이 옵션 객체의 `isGlobal` 프로퍼티를 `true` 로 설정하여 전역 모듈로 선언할 수도 있다. 이 경우 루트 모듈(예: `AppModule` )에 로드된 후에는 다른 모듈에서 `ConfigModule`을 임포트할 필요가 없다.

## 커스텀 구성 파일 {#custom-configuration-files}

좀 더 복잡한 프로젝트의 경우 커스텀 구성 파일을 활용하여 중첩된 구성 객체를 반환할 수 있다. 이렇게 하면 관련 구성 설정을 기능별로 그룹화하고(예: 데이터베이스 관련 설정), 관련 설정을 개별 파일에 저장하여 독립적으로 관리할 수 있다.

커스텀 구성 파일은 구성 객체를 반환하는 팩토리 함수를 내보낸다. 구성 객체는 중첩된 일반 자바스크립트 객체다. `process.env` 객체에는 완전히 리졸브된 환경 변수 키/값 쌍이 포함될 것이며 (`.env` 파일 및 위에서 설명한대로 외부에서 정의된 변수가 리졸브되고 병합됨), 반환된 구성 객체를 제어하기 때문에 값을 적절한 타입으로 변환하거나 기본 값을 설정하는 등 필요한 로직을 추가할 수 있다. 예를 들어:

```ts
// config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
```

이 파일은 `ConfigModule.forRoot()` 메서드에 전달하는 옵션 객체의 `load` 프로퍼티를 사용하여 로드한다:

```ts
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
})
export class AppModule {}
```

:::note
`load` 프로퍼티에 할당된 값은 배열이므로 여러 구성 파일을 로드할 수 있다(예: `load: [databaseConfig, authConfig]` ).
:::

커스텀 구성 파일을 사용하면 구성 파일을 YAML 형식으로 관리할 수도 있다. 다음은 YAML 형식을 사용한 구성의 예다:

```yaml
http:
  host: 'localhost'
  port: 8080

db:
  postgres:
    url: 'localhost'
    port: 5432
    database: 'yaml-db'

  sqlite:
    database: 'sqlite.db'
```

YAML 파일을 읽고 파싱하기 위해 `js-yaml` 패키지를 사용한다.

```bash
npm i js-yaml
npm i -D @types/js-yaml
```

패키지가 설치되면 `yaml#load` 함수를 사용하여 위에서 생성한 YAML 파일을 로드한다.

```ts
// config/configuration.ts
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'config.yaml';

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
};
```

:::note
Nest CLI는 빌드 프로세스 중에 "assets"(비-타입스크립트 파일)을 `dist` 폴더로 자동으로 이동시키지 않는다. YAML 파일이 복사되도록 하려면 `nest-cli.json` 파일의 `compilerOptions#assets` 객체에 이를 명시해야 한다. 예를 들어 `config` 폴더가 `src` 폴더와 같은 수준인 경우 `compilerOptions#assets` 에 다음과 같은 값을 추가한다: `"assets": [{"include": "../config/*.yaml", "outDir": "./dist/config"}]`. 자세한 내용은 [여기](https://docs.nestjs.com/cli/monorepo#assets)를 참조한다.
:::

## ConfigService 사용하기 {#using-the-configservice}

`ConfigService` 에서 구성 값에 접근하려면 먼저 `ConfigService` 를 주입해야 한다. 다른 프로바이더와 마찬가지로 (`ConfigModule.forRoot()` 메서드에 전달된 옵션 객체의 `isGlobal` 프로퍼티가 `true` 로 설정되지 않은 경우) 해당 프로바이더가 포함된 모듈인 `ConfigModule` 을 임포트해야 한다. 아래와 같이 feature 모듈에 임포트한다.

```ts
// feature.module.ts
@Module({
  imports: [ConfigModule],
  // ...
})
```

그런 다음 표준 생성자 주입을 사용하여 주입할 수 있다:

```ts
constructor(private configService: ConfigService) {}
```

:::note
`ConfigService` 는 `@nestjs/config` 패키지에서 임포트한다.
:::

그리고 클래스 내부에서 사용한다:

```ts
// 환경 변수 가져오기
const dbUser = this.configService.get<string>('DATABASE_USER');

// 커스텀 구성 값 가져오기
const dbHost = this.configService.get<string>('database.host');
```

위와 같이 `configService.get()` 메서드를 사용하여 변수 이름을 전달하여 간단히 환경 변수를 가져올 수 있다. 또한 위와 같이 타입을 전달하여 타입스크립트에 타입 힌트를 줄 수 있다(예: `get<string>(...)` ).

위의 두 번째 예에서와 같이 `get()` 메서드는 중첩된 커스텀 구성 객체(커스텀 구성 파일을 통해 생성됨)를 순회할 수도 있다.

인터페이스를 타입 힌트로 사용하여 중첩된 전체 커스텀 구성 객체를 가져올 수도 있다:

```ts
interface DatabaseConfig {
  host: string;
  port: number;
}

const dbConfig = this.configService.get<DatabaseConfig>('database');

// `dbConfig.port`와 `dbConfig.host`를 사용할 수 있다
const port = dbConfig.port;
```

또한 `get()` 메서드는 아래와 같이 키가 존재하지 않을 때 기본값을 정의하는 (선택적) 두 번째 인자를 받는다:

```ts
// "database.host"가 정의되지 않은 경우 "localhost" 사용
const dbHost = this.configService.get<string>('database.host', 'localhost');
```

`ConfigService` 에는 선택적으로 사용 가능한 두 가지 제네릭 (타입 인자)이 있다. 첫 번째는 존재하지 않는 프로퍼티에 액세스하는 것을 방지하기 위한 것이다. 아래와 같이 사용한다:

```ts
interface EnvironmentVariables {
  PORT: number;
  TIMEOUT: string;
}

constructor(private configService: ConfigService<EnvironmentVariables>) {
  const port = this.configService.get('PORT', { infer: true });

  // TypeScript Error: this is invalid as the URL property is not defined in EnvironmentVariables
  const url = this.configService.get('URL', { infer: true });
}
```

`infer` 프로퍼티를 `true` 로 설정하면 `ConfigService#get` 메서드가 자동으로 인터페이스를 기반으로 프로퍼티 타입을 추론한다. 예를 들어 (타입스크립트의 `strictNullChecks` 플래그를 사용하지 않는 경우) `EnvironmentVariables` 인터페이스에서 `PORT` 가 숫자 타입이기 때문에 `typeof port === "number"` 가 된다.

또한 `infer` 기능을 사용하면 점 표기법을 사용하는 경우에도 다음과 같이 중첩된 커스텀 구성 객체의 프로퍼티 타입을 추론할 수 있다:

```ts
constructor(private configService: ConfigService<{ database: { host: string } }>) {
  const dbHost = this.configService.get('database.host', { infer: true })!;
  // typeof dbHost === "string"                                          |
  //                                                                     +--> non-null assertion operator
}
```

두 번째 제네릭은 첫 번째 제네릭에 의존하여, `strictNullChecks` 가 켜져 있는 경우 `ConfigService` 의 메서드가 반환할 수 있는 모든 `undefined` 타입을 제거하는 타입 어설션 역할을 한다. 예를 들어:

```ts
// ...
constructor(private configService: ConfigService<{ PORT: number }, true>) {
  //                                                               ^^^^
  const port = this.configService.get('PORT', { infer: true });
  //    ^^^ port 유형은 'number'가 되므로 더 이상 TS 타입 어설션이 필요하지 않다.
}
```

## 구성 네임스페이스 {#configuration-namespaces}

`ConfigModule` 을 사용하면 위의 커스텀 구성 파일에서와 같이 여러 구성 파일을 정의하고 로드할 수 있다. 해당 섹션에서 보여진대로 중첩된 구성 객체로 복잡한 계층을 관리하거나 또는 `registerAs()` 함수를 사용하여 "네임스페이스" 구성 객체를 반환할 수도 있다.

```ts
// config/database.config.ts
export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 5432,
}));
```

커스텀 구성 파일과 마찬가지로, `registerAs()` 팩토리 함수 내부의 `process.env` 객체는 완전히 리졸브된 환경 변수 키/값 쌍이 포함된다.

:::note
`registerAs` 함수는 `@nestjs/config` 패키지에서 임포트한다.
:::

커스텀 구성 파일을 `load` 하는 것과 같은 방식으로 `forRoot()` 메서드의 옵션 객체의 `load` 프로퍼티를 사용하여 네임스페이스 구성을 로드한다:

```ts
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
  ],
})
export class AppModule {}
```

이제 `database` 네임스페이스에서 `host` 값을 가져오려면 점 표기법을 사용한다. 네임스페이스 이름에 해당하는 속성 이름의 접두사로 'database'를 사용합니다(registerAs() 함수의 첫 번째 인수로 전달됨):

이제 `database` 네임스페이스에서 `host` 값을 가져오려면 점 표기법(dot notation)을 사용한다. 프로퍼티 이름 앞에 네임스페이스에 해당하는 'database'를 접두사로 사용한다(`registerAs()` 함수의 첫 번째 인수로 전달된 이름):

```ts
const dbHost = this.configService.get<string>('database.host');
```

다른 방법은 `database` 네임스페이스를 직접 주입하는 것이다. 이렇게 하면 강력한 타이핑의 이점을 누릴 수 있다:

```ts
constructor(
  @Inject(databaseConfig.KEY)
  private dbConfig: ConfigType<typeof databaseConfig>,
) {}
```

:::note
`ConfigType` 은 `@nestjs/config` 패키지에서 임포트할 수 있다.
:::

## 캐시 환경 변수 {#cache-environment-variables}

`process.env` 에 액세스하는 속도가 느려질 수 있으므로, `ConfigModule.forRoot()` 에 전달되는 옵션 객체의 `cache` 프로퍼티를 설정하여 `process.env` 에 저장된 변수와 관련하여 `ConfigService#get` 메서드의 성능을 향상시킬 수 있다.

```ts
ConfigModule.forRoot({
  cache: true,
});
```

## 부분 등록 {#partial-registration}

지금까지는 `forRoot()` 메서드를 사용하여 루트 모듈(예: `AppModule` )에서 구성 파일을 처리했다. 기능별 구성 파일이 여러 다른 디렉터리에 있는 더 복잡한 프로젝트 구조를 가지고 있을 수도 있다. 이러한 파일을 모두 루트 모듈에 로드하는 대신 @nestjs/config 패키지는 각 기능 모듈과 관련된 구성 파일만 참조하는 부분 등록이라는 기능을 제공합니다. 이 부분 등록을 수행하려면 다음과 같이 기능 모듈 내에서 forFeature() 정적 메서드를 사용합니다:

지금까지는 루트 모듈 (예: `AppModule` )에서 `forRoot()` 메서드를 사용하여 구성 파일을 처리했다. 하지만 프로젝트 구조가 복잡한 경우, 서로 다른 디렉터리에 있는 특정 기능에 대한 구성 파일이 있을 수 있다. 모든 이러한 파일을 루트 모듈에서 로드하는 대신, `@nestjs/config` 패키지는 각 기능 모듈과 관련된 구성 파일만 참조하는 "부분 등록"이라는 기능을 제공한다. 이 부분 등록을 수행하려면 기능 모듈 내에서 `forFeature()` 정적 메서드를 사용한다.

```ts
import databaseConfig from './config/database.config';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
})
export class DatabaseModule {}
```

:::warning
경우에 따라 생성자가 아닌 `onModuleInit()` 훅을 사용하여 부분 등록을 해야할 수도 있다. 이는 모듈 초기화 순서가 불확실한 상태에서 `forFeature()` 메서드가 모듈 초기화 중에 실행 되기 떄문이다. 다른 모듈에서 이러한 방식으로 로드한 값을 생성자에서 액세스하는 경우 구성의 종속성 모듈이 아직 초기화되지 않았을 수 있다. `onModuleInit()` 메서드는 종속된 모든 모듈이 초기화된 후에만 실행되므로 이 방법은 안전하다.
:::

## 스키마 유효성 검사 {#schema-validation}

필요한 환경 변수가 제공되지 않았거나 특정 유효성 검사 규칙을 충족하지 않는 경우 애플리케이션 시작 중에 예외를 던지는 것이 표준 관행이다. `nestjs/config` 패키지를 사용하면 두 가지 방법으로 이를 수행할 수 있다:

- [Joi](https://github.com/sideway/joi)의 내장 유효성 검사기. Joi를 사용하면 객체 스키마를 정의하고 이에 대해 자바스크립트 객체의 유효성을 검사할 수 있다.
- 환경 변수를 입력으로 받는 커스텀 `validate()` 함수다.

먼저 Joi를 사용하기 위해서 패키지를 설치한다:

```bash
npm install --save joi
```

이제 아래와 같이 Joi 유효성 검사 스키마를 정의하고 `forRoot()` 메서드 옵션 객체의 `validationSchema` 프로퍼티를 통해 이를 전달할 수 있다:

```ts
// app.module.ts
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().port().default(3000),
      }),
    }),
  ],
})
export class AppModule {}
```

기본적으로 모든 스키마 키는 선택 사항으로 간주된다. 여기서는 환경(`.env` 파일 또는 프로세스 환경)에서 이러한 변수를 제공하지 않는 경우에 사용될 `NODE_ENV` 및 `PORT` 의 기본 값을 설정한다. 다른 방법으로, `required()` 검증 메서드를 사용하여 환경(`.env` 파일 또는 프로세스 환경)에 값이 정의되어야 함을 요구할 수도 있다. 이 경우, 검증 단계에서 환경에 변수를 제공하지 않으면 예외가 발생한다. 검증 스키마를 구성하는 방법에 대한 자세한 내용은 [Joi 검증 메서드](https://joi.dev/api/?v=17.3.0#example)를 참조한다.

기본적으로 스키마에 키가 없는 unknown 환경 변수는 허용되며 검증시 예외를 발생시키지 않는다. 기본적으로 모든 검증 오류가 보고된다. `forRoot()` 옵션 객체의 `validationOptions` 옵션 객체를 전달하여 이러한 동작을 변경할 수 있다. 이 옵션 객체에는 Joi 검증 옵션 프로퍼티를 사용할 수 있다. 예를 들어, 위의 두 설정을 반전하려면 다음과 같은 옵션을 전달한다:

```ts
// app.module.ts
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().port().default(3000),
      }),
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
  ],
})
export class AppModule {}
```

`@nestjs/config` 패키지는 기본 설정을 사용한다:

- `allowUnknown` : 환경 변수에 등록되지 않은 키를 허용할지 여부를 제어한다. 기본값은 `true` 다.
- `abortEarly` : `true` 면 첫 번째 오류에 대한 유효성 검사를 중지하고, `false` 면 모든 오류를 반환한다. 기본값은 `false` 다.

`validationOptions` 객체를 전달하기로 결정한 후에는 명시적으로 전달하지 않은 모든 설정은 `@nestjs/config` 기본값이 아닌 `Joi` 표준 기본값으로 설정된다. 예를 들어, 사용자 정의 `validationOptions` 객체에서 `allowUnknowns` 를 지정하지 않은 채로 두면 `Joi` 기본값인 `false` 가 된다. 따라서 사용자 정의 객체에서 이 두 가지 설정을 모두 지정하는 것이 가장 안전하다.

## 커스텀 유효성 검사 함수 {#custom-validate-functions}

환경 변수가 포함된 객체(env 파일 및 프로세스)를 가져와서 필요한 경우 변환/변형할 수 있도록 유효성이 검사된 환경 변수가 포함된 객체를 반환하는 `synchronousvalidate` 함수를 지정할 수 있다. 이 함수가 오류를 발생시키면 애플리케이션이 부트스트랩되지 않는다.

이 예제에서는 `class-transformer` 와 `class-validator` 패키지를 사용한다.

먼저 다음을 정의를 해야 한다:

- 유효성 검사 제약 조건이 있는 클래스
- `plainToInstance` 및 `validateSync` 함수를 사용하는 유효성 검사 함수

```ts
// env.validation.ts
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
```

이 설정이 완료되면 다음과 같이 `validate` 함수를 `ConfigModule` 의 구성 옵션으로 사용한다:

```ts
// app.module.ts
import { validate } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
  ],
})
export class AppModule {}
```

## 커스텀 게터 홤수 {#custom-getter-functions}

`ConfigService` 는 키별로 값을 검색하는 일반 `get()` 메서드를 정의한다. 좀 더 자연스러운 코딩 스타일을 구현하기 위해 `getter` 함수를 추가할 수도 있다:

```ts
@Injectable()
export class ApiConfigService {
  constructor(configService) {
    this.configService = configService;
  }

  get isAuthEnabled() {
    return this.configService.get('AUTH_ENABLED') === 'true';
  }
}
```

이제 다음과 같이 게터 함수를 사용할 수 있다:

```ts
// app.service.ts
@Injectable()
export class AppService {
  constructor(apiConfigService) {
    if (apiConfigService.isAuthEnabled) {
      // Authentication is enabled
    }
  }
}
```

## 환경 변수 로드 훅 {#environment-variables-loaded-hook}

모듈 구성이 환경 변수에 의존하고 이러한 변수가 `.env` 파일에서 로드되는 경우, 다음 예제를 참조하여 `ConfigModule.envVariablesLoaded` 훅을 사용하여 `process.env` 객체와 상호 작용하기 전에 파일이 로드되었는지 확인할 수 있다:

```ts
export async function getStorageModule() {
  await ConfigModule.envVariablesLoaded;
  return process.env.STORAGE === 'S3' ? S3StorageModule : DefaultStorageModule;
}
```

이 구조는 `ConfigModule.envVariablesLoaded` 프로미스가 리졸브된 후 모든 구성 변수가 로드되도록 보장한다.

## 조건부 모듈 구성 {#conditional-module-configuration}

모듈을 조건부로 로드하고 환경 변수에 조건을 지정하고 싶을 때가 있을 수 있다. 다행히도 `@nestjs/config` 는 이를 가능하게 하는 `ConditionalModule` 을 제공한다.

```ts
@Module({
  imports: [
    ConfigModule.forRoot(),
    ConditionalModule.registerWhen(FooModule, 'USE_FOO'),
  ],
})
export class AppModule {}
```

위의 모듈은 `.env` 환경 변수 `USE_FOO` 의 값이 `false` 가 아닌 경우에만 `FooModule` 을 로드된다. 또한 커스텀 조건을 직접 전달할 수도 있는데, 이 함수는 `process.env` 를 받아서 `ConditionalModule` 이 사용할 boolean 값을 반환해야 한다.

```ts
@Module({
  imports: [
    ConfigModule.forRoot(),
    ConditionalModule.registerWhen(
      FooBarModule,
      (env: NodeJS.ProcessEnv) => !!env['foo'] && !!env['bar'],
    ),
  ],
})
export class AppModule {}
```

`ConditionalModule` 을 사용할 때 `ConfigModule` 도 애플리케이션에 로드되어 있는지 확인하는 것이 중요하다. 이렇게 하면 `ConfigModule.envVariablesLoaded` 훅을 올바르게 참조하고 활용할 수 있다. `registerWhen` 메서드의 세 번째 옵션 파라미터에서 사용자가 설정한 시간 (5초 또는 밀리초로 설정 가능) 내에 훅이 true로 전환되지 않으면 `ConditionalModule` 이 오류를 발생시키고 Nest는 애플리케이션을 시작하지 않는다.

## 확장가능한 변수 {#expandable-variables}

`@nestjs/config` 패키지는 환경 변수 확장을 지원한다. 이 기술을 사용하면 한 변수가 다른 변수의 정의 내에서 참조되는 중첩된 환경 변수를 만들 수 있다. 예를 들어:

```text
APP_URL=mywebsite.com
SUPPORT_EMAIL=support@${APP_URL}
```

위의 구조를 사용하면 변수 `SUPPORT_EMAIL` 의 값은 `'support@mywebsite.com'` 이다. `SUPPORT_EMAIL` 정의 내에서 변수 `APP_URL` 의 값을 확인하기 위해 `${...}` 구문을 사용한다는 점에 유의한다.

:::note
이 기능의 경우 `@nestjs/config` 패키지는 내부적으로 [`dotenv-expand`](https://github.com/motdotla/dotenv-expand) 를 사용한다.
:::

아래 그림과 같이 `ConfigModule` 의 `forRoot()` 메서드의 옵션 객체에서 `expandVariables` 프로퍼티를 사용하여 환경 변수 확장을 활성화한다:

```ts
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      // ...
      expandVariables: true,
    }),
  ],
})
export class AppModule {}
```

## main.ts 파일에서 사용하기 {#using-in-the-maints}

구성이 서비스에 저장되어 있더라도 `main.ts` 파일에서도 사용할 수 있다. 이렇게 하면 애플리케이션 포트나 CORS 호스트와 같은 변수를 저장하는 데 사용할 수 있다.

이 파일에 액세스하려면 `app.get()` 메서드 뒤에 서비스 참조를 사용해야 합니다:

구성이 서비스에 저장되어 있더라도 `main.ts` 파일에서 사용할 수 있다. 이렇게하면 애플리케이션 포트나 CORS 호스트와 같은 변수를 저장하는 데 사용할 수 있다.

이를 위해 서비스를 참조하는 `app.get()` 메서드를 사용해야 한다.

```ts
const configService = app.get(ConfigService);
```

그런 다음 평소처럼 구성 키로 `get` 메서드를 호출하여 사용할 수 있다:

```ts
const port = configService.get('PORT');
```
