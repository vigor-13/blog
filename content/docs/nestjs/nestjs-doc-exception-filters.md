---
title: 예외 필터
description:
date: 2024-03-09
tags: [exception_filter, error_handling]
references:
  [
    {
      key: 'NestJS 공식 문서',
      value: 'https://docs.nestjs.com/exception-filters',
    },
  ]
---

Nest에는 애플리케이션 전체에서 처리되지 않은 모든 예외를 처리하는 **예외 계층**이 내장되어 있다.

애플리케이션 코드에서 처리되지 않은 예외가 발생하면 이 계층에서 포착하여 적절한 응답을 자동으로 전송한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nestjs-doc-exception-filters/1.png)

기본적으로 이 작업은 내장된 **전역 예외 필터**에 의해 수행되며, 이 필터는 `HttpException` 타입(및 그 하위 클래스)의 예외를 처리한다. 예외가 인식되지 않는 경우(`HttpException` 도 아니고 `HttpException` 을 상속하는 클래스도 아닌 경우) 빌트인 예외 필터는 다음과 같은 기본 JSON 응답을 생성한다:

```ts
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

:::note
전역 예외 필터는 부분적으로 `http-errors` 라이브러리를 지원한다. 인삭할 수 없는 예외의 경우 기본값인 `InternalServerErrorException` 대신 `statusCode` 및 `message` 프로퍼티를 포함하여 올바르게 응답으로 전송된다.
:::

## 표준 예외 발생시키기 {#throwing-standard-exceptions}

Nest는 `@nestjs/common` 에서 `HttpException` 클래스를 제공한다.

일반적인 HTTP REST/GraphQL API 기반 애플리케이션의 경우 특정 오류 조건이 발생할 때 표준 HTTP 응답 객체를 전송하는 것이 가장 좋다.

예를 들어, `CatsController` 에는 `findAll()` 메서드( `GET` 라우트 핸들러)가 있다. 이 라우트 핸들러가 어떤 이유로 예외를 던진다고 가정해 보자:

```ts
// cats.controller.ts
@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```

:::note
여기서는 `@nestjs/common` 패키지에서 가져온 헬퍼 열거형 `HttpStatus` 를 사용한다.
:::

클라이언트가 이 엔드포인트를 호출하면 다음과 같은 응답이 표시된다:

```ts
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

`HttpException` 생성자는 응답을 결정하는 두 개의 필수 인자를 받는다:

- `response` 인자는 JSON 응답 본문을 정의한다. 아래 설명된 대로 `string` 또는 `object` 다.
- `status` 인자는 [HTTP 상태 코드](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)를 정의한다.

기본적으로 JSON 응답 본문에는 두 가지 속성이 포함되어 있다:

- `statusCode` : 기본값은 `status` 인자에 제공된 HTTP 상태 코드다.
- `message` : HTTP 오류에 대한 간단한 설명

JSON 응답 본문의 message 부분만 재정의하려면 `response` 인자에 문자열을 입력한다. 전체 JSON 응답 본문을 재정의하려면 `response` 인자에 객체를 전달한다. Nest는 객체를 직렬화하여 JSON 응답 본문으로 반환한다.

두 번째 생성자 인자인 `status` 는 유효한 HTTP 상태 코드여야 한다. 가장 좋은 방법은 `@nestjs/common` 에서 `HttpStatus` 열거형을 사용하는 것이다.

오류의 [원인](https://nodejs.org/en/blog/release/v16.9.0/#error-cause)을 제공하는 데 사용할 수 있는 **세 번째** 생성자 인자(선택 사항)인 `options` 가 있다. 이 `cause` 객체는 응답 객체로 직렬화되지는 않지만 로깅 목적으로 유용할 수 있으며, `HttpException` 을 발생시킨 내부 오류에 대한 중요한 정보를 제공한다.

다음은 전체 응답 본문을 재정의하고 오류 원인을 제공하는 예제다:

```ts
// cats.controller.ts
@Get()
async findAll() {
  try {
    await this.service.findAll()
  } catch (error) {
    throw new HttpException({
      statusCode: HttpStatus.FORBIDDEN,
      error: 'This is a custom message',
    }, HttpStatus.FORBIDDEN, {
      cause: error
    });
  }
}
```

위의 내용을 사용하면 다음과 같이 응답이 표시된다:

```ts
{
  "status": 403,
  "error": "This is a custom message"
}
```

## 커스텀 예외 {#custom-exceptions}

대부분의 경우 커스텀 예외를 작성할 필요가 없으며, 본 제공 Nest HTTP 예외를 사용할 수 있다.

커스텀 예외를 작성해야 하는 경우에는 커스텀 예외가 기본 `HttpException` 클래스에서 상속되는 자체 예외 계층 구조를 만드는 것이 좋다. 이 접근 방식을 사용하면 Nest가 예외를 인식하고 오류 응답을 자동으로 처리한다.

다음은 커스텀 예외를 구현한 예제다:

```ts
// forbidden.exception.ts
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```

`ForbiddenException` 은 기본 `HttpException` 을 확장하기 때문에 빌트인 예외 처리기와 원활하게 작동하므로 `findAll()` 메서드 내에서 사용할 수 있다.

```ts
// cats.controller.ts
@Get()
async findAll() {
  throw new ForbiddenException();
}

```

## 빌트인 HTTP 예외 {#built-in-http-exceptions}

Nest는 기본 `HttpException` 을 상속하는 일련의 표준 예외를 제공한다.

이러한 예외는 `@nestjs/common` 패키지에서 가져올 수 있으며, 다수의 가장 일반적인 HTTP 예외를 나타낸다.

- `BadRequestException`
- `UnauthorizedException`
- `NotFoundException`
- `ForbiddenException`
- `NotAcceptableException`
- `RequestTimeoutException`
- `ConflictException`
- `GoneException`
- `HttpVersionNotSupportedException`
- `PayloadTooLargeException`
- `UnsupportedMediaTypeException`
- `UnprocessableEntityException`
- `InternalServerErrorException`
- `NotImplementedException`
- `ImATeapotException`
- `MethodNotAllowedException`
- `BadGatewayException`
- `ServiceUnavailableException`
- `GatewayTimeoutException`
- `PreconditionFailedException`

모든 빌트인 예외는 `options` 파라미터를 사용하여 오류 원인( `cause` ) 과 오류 설명( `description` )을 모두 제공할 수 있다:

```ts
throw new BadRequestException('Something bad happened', {
  cause: new Error(),
  description: 'Some error description',
});
```

위의 코드를 사용하면 다음과 같이 응답이 표시된다:

```ts
{
  "message": "Something bad happened",
  "error": "Some error description",
  "statusCode": 400,
}
```

## 예외 필터 {#exception-filters}

기본(빌트인) 예외 필터가 대부분의 에러를 자동으로 처리할 수 있지만 예외 계층을 **완전히 제어**하고 싶을 수도 있다. 예를 들어 로깅을 추가하거나 일부 동적 요인에 따라 다른 JSON 스키마를 사용하고 싶을 수 있다. **예외 필터**는 바로 이러한 목적을 위해 설계되었다. 예외 필터를 사용하면 정확한 제어 흐름과 클라이언트에 전송되는 응답의 내용을 제어할 수 있다.

`HttpException` 클래스의 인스턴스를 포착하여 이에 대한 커스텀 응답 로직을 구현하는 예외 필터를 만들어 보자.

이를 위해서는 기본 플랫폼의 `Request` 및 `Response` 객체에 액세스해야 한다. `Request` 객체에 액세스하여 원본 `url` 을 가져와 로깅 정보에 포함시킬 수 있다. `Response` 객체를 사용하여 `response.json()` 메서드를 사용하여 전송된 응답을 직접 제어할 수 있다.

```ts
// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

:::note
모든 예외 필터는 일반 `ExceptionFilter<T>` 인터페이스를 구현해야 한다. 이를 위해서는 `catch(exception: T, host: ArgumentsHost)` 메서드에 지정된 시그니처를 제공해야 한다. `T` 는 예외의 타입을 나타낸다.
:::

:::warning
`nestjs/platform-fastify` 를 사용하는 경우 `response.json()` 대신 `response.send()` 를 사용한다. `fastify` 에서 올바른 타입을 가져오는 것을 잊지 않아야 한다.
:::

`Catch(HttpException)` 데코레이터는 필요한 메타데이터를 예외 필터에 바인딩하여 이 필터가 `HttpException` 타입의 예외만 찾고 있음을 Nest에 알려준다. `Catch()` 데코레이터는 단일 파라미터 또는 쉼표로 구분된 리스트를 사용할 수 있다. 이를 통해 한 번에 여러 타입의 예외에 대한 필터를 설정할 수 있다.

## ArgumentsHost {#arguments-host}

`catch()` 메서드의 파라미터를 살펴보자.

- `exception` : 현재 처리 중인 예외 객체다.
- `host` : `ArgumentsHost` 객체다.
  - `ArgumentsHost` 는 [실행 컨텍스트 챕터](https://docs.nestjs.com/fundamentals/execution-context)에서 자세히 살펴볼 강력한 유틸리티 객체다.

이 코드 샘플에서는 `ArgumentsHost` 객체를 사용하여 기존 요청 핸들러(예외가 발생한 컨트롤러)로 전달되는 `Request` 및 `Response` 객체에 대한 참조를 가져온다.

`ArgumentsHost` 에 대해 자세히 내용은 [여기](https://docs.nestjs.com/fundamentals/execution-context)를 참조한다.

:::note
ArgumentsHost와 같은 추상화가 필요한 이유는 `ArgumentsHost` 가 모든 컨텍스트(예: 지금 작업 중인 HTTP 서버 컨텍스트뿐만 아니라 마이크로서비스와 웹소켓 등)에서 작동하기 때문이다. 실행 컨텍스트 챕터에서는 `ArgumentsHost` 와 그 헬퍼 함수를 사용하여 **모든** 실행 컨텍스트에 적합한 기본 인자를 사용하는 방법을 살펴볼 것이다. 이를 통해 모든 컨텍스트에서 작동하는 일반 예외 필터를 작성할 수 있다.
:::

## 필터 바인딩 {#binding-filters}

새로운 `HttpExceptionFilter` 를 `CatsController` 의 `create()` 메서드에 연결해 보자.

```ts
// cats.controller.ts
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

:::note
`UseFilters()` 데코레이터는 `@nestjs/common` 패키지에서 가져올 수 있다.
:::

여기서는 `@UseFilters()` 데코레이터를 사용했다. `Catch()` 데코레이터와 마찬가지로 단일 필터 인스턴스 또는 쉼표로 구분된 필터 인스턴스 목록을 받을 수 있다. 여기서는 `HttpExceptionFilter` 인스턴스를 직접 생성했지만, 인스턴스 대신 클래스를 전달하여 인스턴스화를 프레임워크에게 맡길 수 있다.

```ts
// cats.controller.ts
@Post()
@UseFilters(HttpExceptionFilter)
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

:::tip
가능하면 인스턴스 대신 클래스를 사용하여 필터를 적용하는 것이 좋다. Nest는 전체 모듈에서 동일한 클래스의 인스턴스를 쉽게 재사용할 수 있으므로 **메모리 사용량**을 줄일 수 있다.
:::

위 예제에서 `HttpExceptionFilter` 는 단일 `create()` 라우트 핸들러에만 적용되어 메서드-범위로 한정된다. 예외 필터는 controller / resolver / gateway, 컨트롤러-범위 또는 전역-범위 등 다양한 수준에서 범위를 지정할 수 있다.

예를 들어 컨트롤러-범위로 필터를 설정하려면 다음과 같이 하면 된다:

```ts
// cats.controller.ts
@UseFilters(new HttpExceptionFilter())
export class CatsController {}
```

위의 코드는 `CatsController` 내부에 정의된 모든 라우트 핸들러에 대해 `HttpExceptionFilter` 를 설정한다.

전역 범위 필터를 만들려면 다음과 같이 코드를 작성한다:

```ts
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

:::warning
`useGlobalFilters()` 메서드는 게이트웨이 또는 하이브리드 애플리케이션에 대한 필터를 설정하지 않는다.
:::

전역 범위 필터는 모든 컨트롤러와 모든 라우트 핸들러에 대해 즉 전체 애플리케이션에서 사용된다. 종속성 주입과 관련하여, 모듈 외부에서 등록된 전역 필터는 모든 모듈의 컨텍스트 외부에서 수행되므로 종속성을 주입할 수 없다. 이 문제를 해결하기 위해 다음 구성을 사용하여 모든 모듈에서 직접 전역 범위 필터를 등록할 수 있다:

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

:::note
이 접근 방식을 사용하여 필터에 종속성 주입을 수행할 때 사용되는 모듈에 관계없이 필터는 실제로 전역이라는 점을 유의한다. 이 작업은 어디에서 수행해야 할까? 필터가 정의된 모듈(위 예제에서는 `HttpExceptionFilter`)을 선택한다. 또한 `useClass` 만이 사용자 정의 프로바이더 등록을 처리하는 유일한 방법은 아니다. 자세한 내용은 [여기](https://docs.nestjs.com/fundamentals/custom-providers)를 참조한다.
:::

이 방법을 사용하여 필요한 만큼 필터를 추가할 수 있으며, `providers` 배열에 각각을 추가하기만 하면 된다.

## 모두 캐치하기 {#catch-everything}

처리되지 않은 모든 예외를 잡으려면(예외 타입에 관계없이) `@Catch()` 데코레이터의 파라미터 목록을 비워 둔다(예: `@Catch()` ).

아래 예시에서는 직접적으로 플랫폼별 객체( `Request` 및 `Response` )를 사용하지 않고 [HTTP 어댑터](https://docs.nestjs.com/faq/http-adapter)를 사용하여 응답을 전달하므로 플랫폼에 구애받지 않는 코드를 만들 수 있다.

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // 특정 상황에서는 생성자 메서드에서 `httpAdapter`를 사용할 수 없으므로 여기서 리졸브해야 한다.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
```

:::warning
모든 것을 캐치하는 필터와 특정 타입에 바인딩된 필터를 결합하는 경우, 특정 필터가 바인딩된 타입을 올바르게 처리할 수 있도록 '모든 것을 캐치하는' 필터를 먼저 선언해야 한다.
:::

## 상속 {#inheritance}

일반적으로 애플리케이션 요구 사항을 충족하기 위해 완전히 커스터마이징된 예외 필터를 만들게 된다. 그러나 기본 제공되는 기본 전역 예외 필터를 단순히 확장하고 특정 요인에 따라 동작을 재정의하려는 사용 사례가 있을 수 있다.

기본 필터에 예외 처리를 위임하려면 `BaseExceptionFilter` 를 확장하고 상속된 `catch()` 메서드를 호출해야 한다.

```ts
// all-exceptions.filter.ts
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
```

:::warning
`BaseExceptinFilter` 로 확장된 메서드-범위 및 컨트롤러-범위 필터는 `new` 키워드로 인스턴스화해서는 안 된다. 대신 프레임워크가 자동으로 인스턴스화하도록 한다.
:::

위의 구현은 접근 방식을 보여주는 예시일 뿐이다. 실제 구현에는 맞춤형 비즈니스 로직(예: 다양한 조건 처리)이 포함된다.

전역 필터는 기본 필터를 확장할 수 있다. 이는 두 가지 방법 중 하나로 수행할 수 있다.

첫 번째 방법은 커스텀 전역 필터를 인스턴스화할 때 `HttpAdapter` 참조를 삽입하는 것이다:

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(3000);
}
bootstrap();
```

두 번째 방법은 [여기](https://docs.nestjs.com/exception-filters#binding-filters)에 표시된 것처럼 `APP_FILTER` 토큰을 사용하는 것이다.
