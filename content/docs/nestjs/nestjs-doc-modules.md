---
title: 모듈
description:
date: 2024-03-08
tags: [module]
references:
  [{ key: 'NestJS 공식 문서', value: 'https://docs.nestjs.com/modules' }]
---

모듈은 `@Module()` 데코레이터를 사용한 클래스다.

`@Module()` 데코레이터는 Nest가 애플리케이션 구조를 구성하는 데 사용할 메타데이터를 제공한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nestjs-doc-modules/1.png)

각 애플리케이션에는 하나 이상의 모듈, 즉 **루트 모듈**이 있다. 루트 모듈은 Nest가 **애플리케이션 그래프**를 구축하는 데 사용하는 시작점이며, 모듈과 프로바이더 관계 및 종속성을 리졸브하는 데 사용하는 내부 데이터 구조다.

아주 작은 애플리케이션에는 이론적으로 루트 모듈만 있을 수 있지만 대부분의 애플리케이션의 경우 여러 개의 모듈을 사용하며, 각 모듈은 **연관된 기능들을 캡슐화**한다.

`@Module()` 데코레이터는 인자로 모듈을 설명하는 프로퍼티를 갖는 단일 객체를 받는다:

| 프로퍼티      | 설명                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `providers`   | Nest에 의해 인스턴스화되고 적어도 이 모듈 전체에서 공유될 수 있는 프로바이더 리스트                                                        |
| `controllers` | 이 모듈에 정의된 인스턴스화해야 하는 컨트롤러 리스트                                                                                       |
| `imports`     | 이 모듈에서 필요한 프로바이더를 제공하는 모듈의 리스트                                                                                     |
| `exports`     | 이 모듈에서 다른 모듈에 제공할 프로바이더 리스트로 `providers` 의 하위 집합이다. 프로바이더 자체 또는 토큰(`provide` 값)만 사용할 수 있다. |

모듈은 기본적으로 프로바이더를 **캡슐화**한다. 이는 현재 모듈의 직접적인 일부가 아니거나 가져온 모듈에서 내보내지 않은 프로바이더를 주입하는 것이 불가능하다는 것을 의미한다. 따라서 모듈에서 내보낸 프로바이더는 모듈의 공용 인터페이스 또는 API로 간주할 수 있다.

## 기능 모듈 {#feature-modules}

`CatsController` 와 `CatsService` 는 동일한 애플리케이션 도메인에 속한다. 서로 밀접하게 관련되어 있으므로 기능 모듈로 이동하는 것이 좋다. 기능 모듈은 특정 기능과 관련된 코드를 간단히 정리하여 코드를 체계적으로 유지하고 명확한 경계를 설정한다. 이는 특히 애플리케이션, 팀의 규모가 커짐에 따라 복잡성을 관리하고 **SOLID** 원칙에 따라 개발하는 데 도움이 된다.

이해를 돕기위해 `CatsModule` 을 만들어 보자.

```ts
// cats/cats.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

:::note
CLI를 사용하여 모듈을 만들려면 `nest g module cats` 명령을 실행한다.
:::

위에서는 `cats.module.ts` 파일에 `CatsModule` 을 정의하고 이 모듈과 관련된 모든 것을 `cats` 디렉토리로 옮겼다. 마지막으로 해야 할 일은 이 모듈을 루트 모듈(`app.module.ts` 파일에 정의된 `AppModule` )로 가져오는 것이다.

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

현재 디렉터리 구조는 다음과 같다:

```text
src
 ├─ cats
 │   ├─ dto
 │   │   └─ create-cat.dto.ts
 │   ├─ interfaces
 │   │   └─ cat.interface.ts
 │   ├─ cats.controller.ts
 │   ├─ cats.module.ts
 │   └─ cats.service.ts
 ├─ app.module.ts
 └─ main.ts
```

## 공용 모듈 {#shared-modules}

Nest에서 모듈은 기본적으로 **싱글톤**이므로 여러 모듈 간에 동일한 프로바이더의 인스턴스를 손쉽게 공유할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nestjs-doc-modules/2.png)

모든 모듈은 자동으로 **공유 모듈**이 된다. 일단 생성되면 모든 모듈에서 재사용할 수 있다.

여러 다른 모듈 간에 `CatsService` 인스턴스를 공유하고자 한다고 가정해 보자. 이를 위해서는 먼저 아래와 같이 모듈의 `exports` 배열에 `CatsService` 프로바이더를 추가하여 내보내야 한다:

```ts
// cats.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

이제 `CatsModule` 을 가져오는 모든 모듈은 `CatsService` 에 액세스할 수 있으며 이를 임포트하는 다른 모든 모듈과도 동일한 인스턴스를 공유하게 된다.

## 모듈 다시 내보내기 {#module-re-exporting}

위에서 보았듯이 모듈은 내부 프로바이더를 내보낼 수 있다. 또한 가져온 모듈을 다시 내보낼 수도 있다. 아래 예시에서는 `CommonModule` 을 `CoreModule` 에서 가져오고 내보내서 `CoreModule` 모듈을 가져오는 다른 모듈에서 사용할 수 있도록 한다.

```ts
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```

## 의존성 주입 {#dependency-injection}

모듈 클래스는 구성 목적으로 프로바이더를 **주입**할 수 있다:

```ts
// cats.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {
  constructor(private catsService: CatsService) {}
}
```

그러나 모듈 클래스 자체는 [순환 종속성](https://docs.nestjs.com/fundamentals/circular-dependency)으로 인해 프로바이더로 주입할 수 없다.

## 전역 모듈 {#global-modules}

모든 곳에서 동일한 모듈 세트를 가져와야 한다면 번거로울 수 있다. Nest와 달리 Angular `provider` 는 전역 스코프에 등록된다. 한번 정의하면 어디서나 사용할 수 있다. 그러나 Nest는 모듈 스코프 내에서 프로바이더를 캡슐화한다. 먼저 캡슐화 모듈을 가져오지 않으면 다른 곳에서 모듈의 프로바이더를 사용할 수 없다.

헬퍼, 데이터베이스 연결 등 모든 곳에서 즉시 사용할 수 있어야 하는 프로바이더 집합을 제공하려는 경우 `@Global()` 데코레이터를 사용하여 모듈을 **전역**으로 만들 수 있다.

```ts
import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

`Global()` 데코레이터는 모듈을 전역 스코프로 만든다. 전역 모듈은 일반적으로 루트 또는 코어 모듈에 의해 **한 번만** 등록되어야 한다. 위의 예제에서 `CatsService` 프로바이더는 유비쿼터스이며, 이 서비스를 주입하려는 모듈은 `imports` 배열에서 `CatsModule` 을 임포트할 필요가 없다.

:::note
모든 것을 글로벌하게 만드는 것은 좋은 디자인 결정이 아니다. 글로벌 모듈을 사용하면 필요한 상용구의 양을 줄일 수 있다. 일반적으로는 `imports` 배열이 소비자가 모듈의 API를 사용할 수 있도록 하는 데 선호되는 방법이다.
:::

## 동적 모듈 {#dynamic-modules}

Nest 모듈 시스템에는 **동적 모듈**이라는 강력한 기능이 포함되어 있다. 이 기능을 사용하면 프로바이더를 동적으로 등록하고 구성할 수 있는 커스터마이징 가능한 모듈을 쉽게 만들 수 있다. 동적 모듈에 대한 자세한 내용은 [여기](https://docs.nestjs.com/fundamentals/dynamic-modules)서 다룬다. 이 장에서는 모듈에 대한 소개를 완료하기 위해 간략한 개요를 제공한다.

다음은 `DatabaseModule` 에 대한 동적 모듈 정의의 예다:

```ts
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
```

:::note
`forRoot()` 메서드는 동적 모듈을 동기식 또는 비동기식(즉, `Promise` 를 통해)으로 반환할 수 있다.
:::

이 모듈은 기본적으로 `@Module()` 데코레이터에서 `Connection` 프로바이더를 정의한다. 그러나 추가적으로 `forRoot()` 메서드에 전달된 `entities` 및 `options` 객체에 따라 프로바이더 컬렉션을 노출한다.

동적 모듈에서 반환된 프로퍼티들은 `@Module()` 데코레이터에서 정의된 기본 모듈 메타데이터를 **확장**(override가 아닌)한다는 점에 유의한다. 이로인해 정적으로 선언된 `Connection` 프로바이더와 동적으로 생성된 리포지토리 프로바이더 모두가 모듈에서 내보내지는 것이 가능하다.

전역 범위에서 동적 모듈을 등록하려면 `global` 프로퍼티를 `true` 로 설정한다.

```ts
{
  global: true,
  module: DatabaseModule,
  providers: providers,
  exports: providers,
}
```

:::warning
위에서 언급했듯이 모든 것을 전역으로 만드는 것은 좋은 방법이 아니다.
:::

`DatabaseModule` 은 다음과 같은 방법으로 가져오고 구성할 수 있다:

```ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

동적 모듈을 차례로 다시 내보내려는 경우 `exports` 배열에서 `forRoot()` 메서드 호출을 생략할 수 있다:

```ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule],
})
export class AppModule {}
```

[동적 모듈](https://docs.nestjs.com/fundamentals/dynamic-modules) 챕터에서는 이 주제를 자세히 다루며 예제가 포함되어 있다.

:::tip
이 [챕터](https://docs.nestjs.com/fundamentals/dynamic-modules#configurable-module-builder)에서는 `ConfigurableModuleBuilder` 를 사용하여 고도로 커스터마이징 가능한 동적 모듈을 구축하는 방법을 알아본다.
:::
