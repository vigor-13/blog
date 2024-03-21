---
title: 커스텀 데코레이터
description:
date: 2024-03-20
tags: [decorator]
references:
  [
    {
      key: 'NestJS 공식 문서',
      value: 'https://docs.nestjs.com/custom-decorators',
    },
  ]
---

Nest는 **데코레이터(decorators)** 기능을 중심으로 구축되었다. 데코레이터는 일반적으로 사용되는 많은 프로그래밍 언어에서 잘 알려진 개념이지만 자바스크립트 세계에서는 아직 비교적 생소한 개념이다. 데코레이터의 작동 방식을 더 잘 이해하려면 [이 글](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841)을 읽어보는 것을 추천한다.

다음은 간단한 정의다:

> ES2016 데코레이터는 함수를 반환하는 식(expression)으로, target, name 및 property descriptor를 인자로 받을 수 있다. `@` 문자로 접두사를 붙이고 데코레이팅하려는 대상 맨 위에 놓으면 적용된다. 데코레이터는 클래스 또는 프로퍼티에 사용할 수 있다.

## 파라미터 데코레이터 {#param-decorators}

Nest는 HTTP 라우트 핸들러와 함께 사용할 수 있는 유용한 **파라미터 데코레이터** 세트를 제공한다.

다음은 제공되는 데코레이터와 이들이 나타내는 일반 Express(또는 Fastify) 객체 목록이다.

| 데코레이터                 | 객체                                 |
| -------------------------- | ------------------------------------ |
| `@Request(), @Req()`       | `req`                                |
| `@Response(), @Res()`      | `res`                                |
| `@Next()`                  | `next`                               |
| `@Session()`               | `req.session`                        |
| `@Param(param?: string)`   | `req.param` / `req.params[param]`    |
| `@Body(param?: string)`    | `req.body` / `req.body[param]`       |
| `@Query(param?: string)`   | `req.query` / `req.query[param]`     |
| `@Headers(param?: string)` | `req.headers` / `req.headers[param]` |
| `@Ip()`                    | `req.ip`                             |
| `@HostParam()`             | `req.host`                           |

또한 나만의 커스텀 데코레이터를 만들 수도 있다.

데코레이터는 어디에 유용할까?

node.js 세계에서는 **request** 객체에 프로퍼티를 첨부하는 것이 일반적인 관행이다. 그런 다음 다음과 같은 코드를 사용하여 각 라우트 핸들러에서 프로퍼티를 수동으로 추출한다:

```ts
const user = req.user;
```

코드를 더 읽기 쉽고 투명하게 만들기 위해 `@User()` 데코레이터를 만들어 모든 컨트롤러에서 재사용할 수 있다.

```ts
// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

그런 다음 필요한 곳에서 간단히 사용할 수 있다.

```ts
@Get()
async findOne(@User() user: UserEntity) {
  console.log(user);
}
```

## 데이터 전달하기 {#passing-data}

데코레이터의 동작이 특정 조건에 따라 달라지는 경우 `data` 파라미터를 사용하여 데코레이터의 팩토리 함수에 인자를 전달할 수 있다. 이에 대한 한 가지 사용 사례는 키별로 요청 객체에서 프로퍼티를 추출하는 커스텀 데코레이터다. 예를 들어 인증 계층이 요청의 유효성을 검사하고 사용자 엔티티를 요청 객체에 첨부한다고 가정해 보자. 인증된 요청의 사용자 엔티티는 다음과 같다:

```json
{
  "id": 101,
  "firstName": "Alan",
  "lastName": "Turing",
  "email": "alan@email.com",
  "roles": ["admin"]
}
```

프로퍼티 이름을 키로 사용하고, 프로퍼티가 존재하면 관련 값을 반환하는 데코레이터를 정의해 본다(존재하지 않거나 `user` 객체가 생성되지 않은 경우 정의되지 않음).

```ts
// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
```

컨트롤러의 `@User()` 데코레이터를 통해 특정 프로퍼티에 액세스하는 방법은 다음과 같다:

```ts
@Get()
async findOne(@User('firstName') firstName: string) {
  console.log(`Hello ${firstName}`);
}
```

동일한 데코레이터를 다른 키와 함께 사용하여 다른 프로퍼티에 액세스할 수 있다. `user` 객체가 깊거나 복잡한 경우 요청 핸들러를 더 쉽고 가독성 있게 구현할 수 있다.

:::tip
타입스크립트 사용자의 경우 `createParamDecorator<T>()` 는 제네릭이라는 점에 유의한다. 즉, `createParamDecorator<string>((data, ctx) => ...)` 와 같이 명시적으로 타입 안전을 적용할 수 있다. 다른 방법으로 팩토리 함수에서 파라미터 타입을 지정할 수도 있다(예: `createParamDecorator((data: string, ctx) => ...)`. 둘 다 생략하면 `data` 타입은 `any` 타입이 된다.
:::

## 파이프와 함께 사용하기 {#working-with-pipes}

Nest는 커스텀 파라미터 데코레이터를 빌트인 데코레이터( `@Body()` , `@Param()` 및 `@Query()` )와 동일한 방식으로 처리한다. 즉, 커스텀 주석이 달린 파라미터(예제에서는 `user` 인자)에 대해서도 파이프가 실행된다. 또한 커스텀 데코레이터에 직접 파이프를 적용할 수도 있다:

```ts
@Get()
async findOne(
  @User(new ValidationPipe({ validateCustomDecorators: true }))
  user: UserEntity,
) {
  console.log(user);
}
```

:::tip
`validateCustomDecorators` 옵션은 참으로 설정해야 한다. `ValidationPipe` 는 기본적으로 커스텀 데코레이터로 주석이 달린 인자의 유효성을 검사하지 않는다.
:::

## 데코레이터 조합 {#decorator-composition}

Nest는 여러 데코레이터를 조합하는 헬퍼 메서드를 제공한다. 예를 들어 인증과 관련된 모든 데코레이터를 하나의 데코레이터로 결합하고 싶다고 가정해 보자.

다음과 같은 구성으로 이를 수행할 수 있다:

```ts
// auth.decorator.ts
import { applyDecorators } from '@nestjs/common';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
```

그런 다음 이 커스텀 `@Auth()` 데코레이터를 다음과 같이 사용할 수 있다:

```ts
@Get('users')
@Auth('admin')
findAllUsers() {}
```

이렇게 하면 한 번의 선언으로 네 가지 데코레이터를 모두 적용하는 효과가 있다.

:::warning
`@nestjs/swagger` 패키지의 `@ApiHideProperty()` 데코레이터는 컴포저블이 불가능하며 `applyDecorators` 함수와 함께 제대로 작동하지 않는다.
:::
