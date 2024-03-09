---
title: 미들웨어
description:
date: 2024-03-09
tags: [middleware]
references:
  [{ key: 'NestJS 공식 문서', value: 'https://docs.nestjs.com/middleware' }]
---

미들웨어는 라우트 핸들러 **앞에** 호출되는 함수다.

미들웨어 함수는 애플리케이션의 요청-응답 주기에서 [request](https://expressjs.com/en/4x/api.html#req) 및 [response](https://expressjs.com/en/4x/api.html#res) 객체와 `next()` 미들웨어 함수에 액세스할 수 있다. **next** 미들웨어 함수는 일반적으로 `next` 라는 변수로 표시된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nestjs-doc-middleware/1.png)

Nest 미들웨어는 기본적으로 Express 미들웨어와 동일하다. Express 공식 문서에서는 미들웨어를 다음과 같이 설명한다.

:::note 미들웨어 함수는 다음 작업을 수행할 수 있다:

- 코드를 실행한다.
- 요청 및 응답 객체를 변경한다.
- 요청-응답 사이클을 종료한다.
- 스택에서 다음 미들웨어 함수를 호출한다.
- 현재 미들웨어 함수가 요청-응답 사이클을 종료하지 않으면 다음 미들웨어 함수로 제어권을 넘기기 위해 `next()`를 호출해야 한다. 그렇지 않으면 요청이 중단된 상태로 유지된다.

:::

:::warning
`Express` 와 `Fastify` 는 미들웨어를 다르게 처리하고 다른 메서드 시그니처를 제공한다. 자세한 내용은 [여기](https://docs.nestjs.com/techniques/performance#middleware)를 확인한다.
:::

```ts
// logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

## 의존성 주입 {#depndency-injection}

Nest 미들웨어는 의존성 주입을 완벽하게 지원한다.

프로바이더 및 컨트롤러와 마찬가지로 모듈 내에서 사용할 수 있는 종속성을 주입할 수 있으며 늘 그렇듯이 `contructor` 를 통해 수행된다.

## 미들웨어 적용하기 {#applying-middleware}

`@Module()` 데코레이터에는 미들웨어를 위한 자리가 없다. 대신 모듈 클래스의 `configure()` 메서드를 사용하여 설정한다. 미들웨어를 포함하는 모듈은 `NestModule` 인터페이스를 구현해야 한다.

`AppModule` 수준에서 `LoggerMiddleware` 를 설정해 보자.

```ts
// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}
```

위의 예제에서는 이전에 `CatsController` 내부에 정의된 `/cats` 라우트 핸들러에 `LoggerMiddleware` 를 설정했다. 또한 미들웨어를 구성할 때 라우트 경로와 요청 메서드가 포함된 객체를 `forRoutes()` 메서드에 전달하여 미들웨어를 특정 요청 메서드로 제한할 수도 있다.

아래 예제에서는 원하는 요청 메서드 유형을 참조하기 위해 `RequestMethod` 열거형(enum)을 가져온 것을 볼 수 있다.

```ts
// app.module.ts
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
```

:::note
`config()` 메서드는 `async / await` 을 사용하여 비동기화할 수 있다(예: `config()` 메서드 본문 내에서 비동기 연산이 완료될 때까지 `await` 할 수 있음).
:::

:::warning
`express` 어댑터를 사용할 때 NestJS 앱은 기본적으로 패키지 `body-parser` 에서 `json` 및 `urlencoded` 를 등록한다. 즉, `MiddlewareConsumer` 를 통해 해당 미들웨어를 커스터마이징 하려면 `NestFactory.create()` 로 애플리케이션을 생성할 때 `bodyParser` 플래그를 `false` 로 설정하여 전역 미들웨어를 비활성화해야 한다.
:::

## 라우트 와일드카드 {#route-wildcards}

미들웨어에는 패턴 기반 라우트도 지원된다.

예를 들어 별표(asterisk)는 **와일드카드**로 사용되며 어떤 문자 조합과도 일치한다:

```ts
forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
```

`'ab*cd'` 라우트 경로는 `abcd` , `ab_cd` , `abecd` 등과 일치한다.

문자 `?` , `+` , `*` 및 `()` 는 라우트 경로에 사용할 수 있으며 정규식 대응 문자의 하위 집합이다.

하이픈( `-` )과 점( `.` )은 문자열 기반 경로에서 문자 그대로 해석된다.

:::warning
`fastify` 패키지는 더 이상 와일드카드 `*` 를 지원하지 않는 최신 버전의 `path-to-regexp` 패키지를 사용한다. 대신 매개 변수(예: `(.*)` , `:splat*` )를 사용해야 한다.
:::

## 미들웨어 소비자 {#middlware-consumer}

`MiddlewareConsumer` 는 헬퍼 클래스다.

미들웨어를 관리하기 위한 몇 가지 내장 메서드를 제공한다. 이 모든 메서드는 [fluent style](https://en.wikipedia.org/wiki/Fluent_interface)로 간단히 연결할 수 있다.

`forRoutes()` 메서드는 단일 문자열, 다중 문자열, `RouteInfo` 객체, 컨트롤러 클래스, 컨트롤러 리스트를 받을 수 있다. 대부분의 경우 쉼표로 구분된 컨트롤러 리스트을 전달할 것이다.

아래는 단일 컨트롤러를 사용한 예제다:

```ts
// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
  }
}
```

:::note
`apply()` 메서드는 단일 미들웨어를 받거나 다중 미들웨어를 지정하기 위해 여러 인자를 받을 수 있다.
:::

## 라우트 제외하기 {#excluding-routes}

특정 라우트를 미들웨어 적용 대상에서 제외하고 싶을 때가 있다.

`exclude()` 메서드를 사용하면 특정 라우트를 쉽게 제외할 수 있다. 이 메서드는 아래와 같이 제외할 경로를 식별하는 단일 문자열, 다중 문자열 또는 `RouteInfo` 객체를 받을 수 있다:

```ts
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST },
    'cats/(.*)',
  )
  .forRoutes(CatsController);
```

:::note
`exclude()` 메서드는 [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp#parameters) 패키지를 사용하여 와일드카드 파라미터를 지원한다.
:::

위의 예제에서 `LoggerMiddleware` 는 `exclude()` 메서드에 전달된 세 개의 라우트를 **제외한** `CatsController` 내부에 정의된 모든 라우트에 바인딩된다.

## 함수형 미들웨어 {#functional-middleware}

우리가 사용한 `LoggerMiddleware` 클래스는 매우 간단하다. 멤버도 없고, 추가 메서드도 없으며, 종속성도 없다. 미들웨어를 클래스 대신 간단한 함수로 정의할 수 없는 이유는 무엇일까? 사실 가능하다. 이러한 유형의 미들웨어를 **함수형 미들웨어**라고 한다. 차이점을 설명하기 위해 LoggerMiddleware를 클래스 기반에서 함수형 미들웨어로 변환해 보자:

```ts
// logger.middleware.ts
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}
```

그리고 `AppModule` 내에서 사용한다:

```ts
// app.module.ts
consumer.apply(logger).forRoutes(CatsController);
```

:::note
미들웨어에 종속성이 필요하지 않은 경우 언제든지 더 간단한 **함수형 미들웨어**를 사용하는 것을 고려한다.
:::

## 다중 미들웨어 {#multiple-middlware}

위에서 언급했듯이 순차적으로 실행되는 여러 미들웨어를 바인딩하려면 `apply()` 메서드 안에 쉼표로 구분된 리스트를 제공하면 된다:

```ts
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

## 전역 미들웨어 {#global-middlware}

등록된 모든 라우트에 미들웨어를 한 번에 바인딩하려면 `INestApplication` 인스턴스에서 제공하는 `use()` 메서드를 사용할 수 있다:

```ts
// main.ts
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

:::note
전역 미들웨어에서 DI 컨테이너에 액세스할 수 없다. `app.use()` 를 사용할 때 함수형 미들웨어를 대신 사용할 수 있다. 다른 방법으로 클래스 미들웨어를 사용하고 `AppModule`(또는 다른 모듈) 내에서 `.forRoutes('*')` 를 사용할 수 있다.
:::
