---
title: 가드
description:
date: 2024-03-11
tags: [guard]
references:
  [{ key: 'NestJS 공식 문서', value: 'https://docs.nestjs.com/guards' }]
---

가드는 `@Injectable()` 데코레이터를 사용하는 클래스로, `CanActivate` 인터페이스를 구현한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nestjs-doc-guards/1.png)

가드는 **단일 책임**을 갖는다. 가드는 런타임에 특정 조건(권한, 역할, ACL 등)에 따라 특정 요청이 라우트 핸들러에 의해 처리될지 여부를 결정한다. 이를 **인가(authorization)** 라고도 한다. 인가(그리고 일반적으로 함께 사용되는 **인증(authentication)**)는 일반적으로 기존 Express 애플리케이션에서 **미들웨어**가 처리해 왔다. 토큰 유효성 검사 및 요청 객체에 프로퍼티 첨부 등의 작업은 특정 라우트 컨텍스트(및 해당 메타데이터)와 밀접하게 연결되어 있지 않으므로 인증을 구현하기 위해서 미들웨어를 사용하는 것은 가능하다.

하지만 미들웨어는 본질적으로 똑똑하지 않다. `next()` 함수를 호출한 후 어떤 핸들러가 실행될지 모르기 때문이다. 반면에 **가드**는 `ExecutionContext` 인스턴스에 액세스할 수 있으므로 다음에 실행될 내용을 정확히 알 수 있다. 예외 필터, 파이프, 인터셉터와 마찬가지로 요청/응답 라이프사이클의 정확한 지점에 처리 로직을 삽입할 수 있도록 설계되어 있으며 선언적으로 처리할 수 있다. 따라서 코드를 간결하고 선언적으로 유지하는 데 도움이 된다.

:::note
가드는 모든 미들웨어 이후에 실행되지만 인터셉터나 파이프보다 먼저 실행된다.
:::

## 인가 가드 {#authorization-guard}

앞서 언급했듯이 **인가**는 호출자(일반적으로 인증된 특정 사용자)에게 충분한 권한이 있는 경우에만 특정 라우트를 사용할 수 있어야 하므로 가드를 사용하는 것이 좋다. 지금부터 빌드할 `AuthGuard` 는 사용자가 인증되었다고(따라서 토큰이 요청 헤더에 첨부되어 있음) 가정한 상태에서 토큰을 추출하여 유효성을 검사하고 추출된 정보를 사용하여 요청을 진행할 수 있는지 여부를 결정한다.

```ts
// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

:::note
애플리케이션에서 인증 메커니즘을 구현하는 방법에 대한 실제 예시를 찾고 있다면 이 [챕터](https://docs.nestjs.com/security/authentication)를 참조한다. 마찬가지로 보다 정교한 인증 예제를 보려면 이 [페이지](https://docs.nestjs.com/security/authorization)를 확인한다.
:::

`validateRequest()` 함수 내부의 로직은 필요에 따라 복잡도가 다르다. 이 예제의 요점은 가드가 요청/응답 라이프사이클에 어떻게 들어맞는지 보여주는 것이다.

모든 가드는 `canActivate()` 함수를 구현해야 한다. 이 함수는 현재 요청이 허용되는지 여부를 나타내는 부울을 반환해야 한다. 이 함수는 응답을 동기 또는 비동기( `Promise` 또는 `Observable` 을 통해)로 반환할 수 있다.

Nest는 반환값을 사용하여 다음과 같이 작동한다:

- `true` 를 반환하면 요청이 처리된다.
- `false` 를 반환하면 Nest는 요청을 거부한다.

## 실행 컨텍스트 {#execution-context}

`canActivate()` 함수는 단일 인자, 즉 `ExecutionContext` 인스턴스를 받는다. `ExecutionContext` 는 `ArgumentsHost` 를 상속한다. 앞서 예외 필터 챕터에서 `ArgumentsHost` 를 살펴봤다. 위의 샘플에서는 예외 필터 챕터에서 사용한 것과 동일하게 `ArgumentsHost` 에 정의된 헬퍼 메서드를 사용하여 요청 객체에 대한 참조를 가져오고 있다. 이 주제에 대한 자세한 내용은 예외 필터 챕터의 [ArgumentsHost 섹션](https://www.vigorously.xyz/docs/nestjs/nestjs-doc-exception-filters/#arguments-host)을 다시 참조한다.

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

`ExecutionContext` 는 현재 실행 프로세스에 대한 추가 세부 정보를 제공하는 몇 가지 새로운 헬퍼 메서드도 추가하여 `ArgumentsHost` 를 확장한다. 이러한 세부 정보는 광범위한 컨트롤러, 메서드 및 실행 컨텍스트에서 작동할 수 있는 보다 범용적인 가드를 구축하는 데 유용할 수 있다 ([여기](https://docs.nestjs.com/fundamentals/execution-context)에서 `ExecutionContext` 에 대해 자세히 알아본다).

## 역할 기반 인증 {#role-based-authentication}

특정 역할을 가진 사용자에게만 액세스를 허용하는 보다 기능적인 가드를 구축해 보자. 먼저 기본 가드 템플릿으로 시작한 후에 다음 섹션에서 이를 기반으로 세부 기능을 구축할 것이다. 지금은 일단 모든 요청이 진행되도록 허용한다:

```ts
// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
```

## 가드 바인딩 {#binding-guards}

가드는 파이프 및 예외 필터와 마찬가지로 컨트롤러-범위, 메서드-범위 또는 전역-범위로 지정할 수 있다. 아래에서는 `@UseGuards()` 데코레이터를 사용하여 컨트롤러-범위 가드를 설정했다. 이 데코레이터는 단일 인자를 받거나 쉼표로 구분된 인자 리스트를 받을 수 있다. 이를 통해 하나의 선언으로 적절한 가드 집합을 쉽게 적용할 수 있다.

```ts
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}
```

:::note
`UseGuards()` 데코레이터는 `@nestjs/common` 패키지에서 가져온다.
:::

위에서는 인스턴스 대신 `RolesGuard` 클래스를 전달하여 인스턴스화에 대한 책임을 프레임워크에 맡기고 종속성 주입을 활성화했다. 파이프 및 예외 필터와 마찬가지로 인-플레이스 인스턴스를 전달할 수도 있다:

```ts
@Controller('cats')
@UseGuards(new RolesGuard())
export class CatsController {}
```

위의 구조는 `CatsController` 가 선언한 모든 핸들러에 가드를 첨부한다. 가드를 단일 메서드에만 적용하려면 메서드 수준에서 `@UseGuards()` 데코레이터를 적용하면 된다.

전역 가드를 설정하려면 Nest 애플리케이션 인스턴스의 `useGlobalGuards()` 메서드를 사용한다:

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

:::note
하이브리드 앱의 경우 `useGlobalGuards()` 메서드는 기본적으로 게이트웨이 및 마이크로 서비스에 대한 가드를 설정하지 않는다(이 동작을 변경하는 방법에 대한 자세한 내용은 [하이브리드 애플리케이션](https://docs.nestjs.com/faq/hybrid-application)을 참조한다). "표준"(비하이브리드) 마이크로서비스 앱의 경우, `useGlobalGuards()` 는 가드를 전역적으로 마운트한다.
:::

전역 가드는 모든 컨트롤러와 모든 라우트 핸들러에 대해 전체 애플리케이션에서 사용된다. 종속성 주입과 관련하여, 모듈 외부에서 등록된 전역 가드는 모든 모듈의 컨텍스트 외부에서 수행되므로 종속성을 주입할 수 없다. 이 문제를 해결하기 위해 다음 구성을 사용하여 모든 모듈에서 직접 가드를 설정할 수 있다:

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

:::note
이 접근 방식을 사용하여 가드에 대한 종속성 주입을 수행할 때 이 구조가 사용되는 모듈에 관계없이 가드는 실제로 전역이라는 점에 유의한다. 이 작업은 어디에서 수행해야 할까? 가드가 정의된 모듈(위 예제에서는 `RolesGuard`)를 선택한다. 또한 `useClass` 만이 커스텀 프로바이더 등록을 처리하는 유일한 방법은 아니다. [여기](https://docs.nestjs.com/fundamentals/custom-providers)에서 자세히 알아본다.
:::

## 개별 핸들러에 역할 세팅하기 {#setting-roles-per-handler}

`RolesGuard` 가 작동하고 있지만 아직은 그다지 똑똑하지는 않다. 가장 중요한 가드 기능인 실행 컨텍스트를 아직 활용하지 못하고 있다. 아직 역할이나 각 핸들러에 허용되는 역할에 대해 알지 못한다. 예를 들어, `CatsController` 는 라우트마다 다른 권한 체계를 가질 수 있다. 일부는 관리자만 사용할 수 있고 다른 일부는 모든 사용자에게 개방되어 있을 수 있다. 어떻게 하면 유연하고 재사용 가능한 방식으로 역할을 라우트에 일치시킬 수 있을까?

여기서 **커스텀 메타데이터**가 작동한다([여기](https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata)에서 자세히 알아본다). Nest는 `Reflector#createDecorator` 정적 메서드를 통해 생성된 데코레이터 또는 내장된 `@SetMetadata()` 데코레이터를 통해 라우트 핸들러에 커스텀 메타데이터를 첨부할 수 있는 기능을 제공한다.

예를 들어, 핸들러에 메타데이터를 첨부하는 `Reflector#createDecorator` 메서드를 사용하여 `@Roles()` 데코레이터를 생성해 보자. `Reflector` 는 프레임워크에서 기본 제공되며 `@nestjs/core` 패키지에서 가져올 수 있다.

```ts
// roles.decorator.ts
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<string[]>();
```

여기서 `Roles` 데코레이터는 `string[]` 타입의 단일 인자를 받는 함수다.

이제 이 데코레이터를 핸들러에 달기만 하면 된다:

```ts
// cats.controller.ts
@Post()
@Roles(['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

여기에서는 `admin` 역할이 있는 사용자만 이 라우트에 액세스할 수 있도록 하기 위해 `create()` 메서드에 `Roles` 데코레이터 메타데이터를 첨부했다.

또는 `Reflector#createDecorator` 메서드를 사용하는 대신 내장된 `@SetMetadata()` 데코레이터를 사용할 수 있다 ([여기](https://docs.nestjs.com/fundamentals/execution-context#low-level-approach)에서 자세히 알아본다).

## 모아보기 {#putting-it-all-together}

이제 돌아가서 이를 `RolesGuard` 와 연결해 보자. 현재는 단순히 모든 경우에 `true` 를 반환하여 모든 요청이 진행되도록 허용되고 있다. 현재 사용자에게 할당된 역할과 현재 처리 중인 라우트에 필요한 실제 역할을 비교하여 반환 값을 조건부로 만들고 싶다. 라우트의 역할(커스텀 메타데이터)에 액세스하기 위해 다음과 같이 `Reflector` 헬퍼 클래스를 사용한다:

```ts
// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles);
  }
}
```

:::note
node.js 세계에서는 권한이 부여된 사용자를 `request` 객체에 첨부하는 것이 일반적이다. 따라서 위의 샘플 코드에서는 `request.user` 에 사용자 인스턴스와 허용된 역할이 포함되어 있다고 가정한다. 앱에서는 커스텀 인증 가드(또는 미들웨어)에서 이러한 연결을 만들 것이다. 이 주제에 대한 자세한 내용은 이 [챕터](https://docs.nestjs.com/security/authentication)를 확인한다.
:::

:::warning
`matchRoles()` 함수 내부의 로직은 필요에 따라 복잡도가 결정된다. 이 예제의 요점은 가드가 요청/응답 라이프사이클에 어떻게 들어맞는지 보여주는 것이다.
:::

여루 `Reflector` 활용 방법에 대한 자세한 내용은 실행 컨텍스트 챕터의 [리플렉션 및 메타데이터](https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata) 섹션을 참조한다

권한이 부족한 사용자가 엔드포인트를 요청하면 Nest는 자동으로 다음과 같은 응답을 반환한다:

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

이면에서 가드가 `false` 를 반환하면 프레임워크는 `ForbiddenException` 을 던진다. 다른 오류을 반환하려면 고유한 예외를 던져야 한다.

예를 들어:

```ts
throw new UnauthorizedException();
```

가드에서 던지는 모든 예외는 예외 계층(전역 예외 필터 및 현재 컨텍스트에 적용되는 모든 예외 필터)에서 처리된다.

:::note
인증을 구현하는 방법에 대한 실제 사례를 찾고 있다면 이 [챕터](https://docs.nestjs.com/security/authorization)를 확인한다.
:::
