---
title: 요청 라이프사이클
description:
date: 2024-03-10
tags: [lifecycle]
references:
  [
    {
      key: 'NestJS 공식 문서',
      value: 'https://docs.nestjs.com/faq/request-lifecycle',
    },
  ]
---

![https://syntactic-sugar.dev/blog/nested-route/nest-request-lifecycle](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nestjs/nest-request-lifecycle.png)

Nest 애플리케이션은 **요청 라이프사이클** 시퀀스에 따라 요청을 처리하고 응답을 생성한다.

미들웨어, 파이프, 가드, 인터셉터를 사용하면 요청 라이프사이클 동안 코드가 실행되는 위치를 추적하기가 어려울 수 있으며, 특히 컴포넌트마다 전역 수준, 컨트롤러 수준 및 라우트 수준 등 다양하게 작용하기 때문에 더욱 그렇다.

일반적으로 요청은 미들웨어 => 가드 => 인터셉터 => 파이프로 => 인터셉터 => 응답 순으로 진행된다.

## 미들웨어 {#middleware}

미들웨어는 특정 순서로 실행된다. 먼저 Nest는 전역으로 바인딩된 미들웨어(예: `app.use` 로 바인딩된 미들웨어)를 실행한 다음 경로별 모듈에 바인딩된 미들웨어를 실행한다. 미들웨어는 바인딩된 순서대로 순차적으로 실행되며, 이는 Express의 미들웨어가 작동하는 방식과 유사하다. 여러 모듈에 바인딩된 미들웨어의 경우 루트 모듈에 바인딩된 미들웨어가 먼저 실행되고, 그 다음 모듈이 `imports` 배열에 추가된 순서대로 미들웨어가 실행된다.

## 가드 {#guards}

가드는 글로벌 가드부터 시작하여 컨트롤러 가드, 라우팅 가드 순으로 실행된다.

미들웨어와 마찬가지로 가드는 바인딩된 순서대로 실행된다. 예를 들어:

```ts
@UseGuards(Guard1, Guard2)
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @UseGuards(Guard3)
  @Get()
  getCats(): Cats[] {
    return this.catsService.getCats();
  }
}
```

`Guard1` 은 `Guard2` 보다 먼저 실행되며, 둘 다 `Guard3` 보다 먼저 실행된다.

:::note
전역 바인딩과 컨트롤러 또는 로컬 바인딩의 차이점은 가드가 바인딩되는 위치에 있다. `app.useGlobalGuard()` 를 사용하거나 모듈을 통해 컴포넌트를 제공하는 경우 전역으로 바인딩된다. 그렇지 않으면 데코레이터가 컨트롤러 클래스 앞에 오는 경우 컨트롤러에 바인딩되고, 데코레이터가 라우트 선언 앞에 오는 경우 라우트에 바인딩된다.
:::

## 인터셉터 {#interceptors}

인터셉터는 대부분 가드와 동일한 패턴을 따르지만 한 가지 주의해야 할 점이 있다: 인터셉터가 [RxJS Observables](https://github.com/ReactiveX/rxjs)을 반환하기 때문에 옵저버블은 선입 후출 방식으로 리졸브된다.

즉, 들어오는 요청은 일반적인 전역 => 컨트롤러 => 라우트 수준의 리졸브를 거치지만 응답 측면의 요청(즉, 컨트롤러 메서드 핸들러에서 반환 후)은 라우트 => 컨트롤러 => 전역으로 리졸브된다. 또한, 파이프, 컨트롤러 또는 서비스에서 발생한 모든 오류는 인터셉터의 `catchError` 연산자에서 읽을 수 있다.

```text
전역 => 컨트롤러 => 라우트 => 컨트롤러 => 전역
```

## 파이프 {#pipes}

파이프는 표준적인 글로벌 => 컨트롤러 => 라우트 바인딩 순서를 따르며, `@UsePipes()` 파라미터와 관련하여 선입선출 방식을 따른다. 그러나 라우트 파라미터 수준에서 여러 개의 파이프를 실행하는 경우 마지막 파라미터에서 첫 번째 파라미터까지 파이프가 있는 순서대로 실행된다. 이는 경로 수준 및 컨트롤러 수준 파이프에도 적용됩니다. 예를 들어 다음과 같은 컨트롤러가 있다고 가정해 보겠습니다:

파이프는 표준적인 글로벌 => 컨트롤러 => 라우트 바인딩 순서를 따르며, `@UsePipes()` 파라미터는 선입 선출 방식을 따른다. 그러나 라우트 파라미터 수준에서 여러 파이프가 실행되는 경우, 마지막 파라미터에서 첫 번째 파라미터 순으로 실행된다. 이는 라우트 및 컨트롤러 수준의 파이프에도 적용된다.

예를 들어, 다음과 같은 컨트롤러가 있다면:

```ts
@UsePipes(GeneralValidationPipe)
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @UsePipes(RouteSpecificPipe)
  @Patch(':id')
  updateCat(
    @Body() body: UpdateCatDTO,
    @Param() params: UpdateCatParams,
    @Query() query: UpdateCatQuery,
  ) {
    return this.catsService.updateCat(body, params, query);
  }
}
```

`query` , `params` , `body` 객체에 대해 `GeneralValidationPipe` 가 실행된 다음 동일한 순서를 따르는 `RouteSpecificPipe`로 이동한다. 특정 파라미터에대해 파이프가 적용된 경우 컨트롤러 및 라우트 수준 파이프 다음에 파라미터별 파이프가 실행된다(다시 말해서 마지막 파라미터부터 첫 번째 파라미터까지).

## 필터 {#filters}

필터는 전역부터 리졸브되지 않는 유일한 컴포넌트다. 대신, 필터는 가능한 가장 낮은 수준부터 리졸브되므로 실행은 라우트 바인딩 필터에서 시작하여 컨트롤러 수준, 마지막으로 전역 필터로 진행된다. 예외는 필터 간에 전달될 수 없으며, 라우트 수준 필터가 예외를 잡으면 컨트롤러 또는 전역 수준 필터는 동일한 예외를 잡을 수 없다는 점에 유의한다. 필터간의 컨텍스트를 공유하는 유일한 방법은 필터 간에 상속을 사용하는 것이다.

:::note
필터는 요청 프로세스 중에 잡히지 않은 예외가 발생하는 경우에만 실행된다. `try / catch` 로 잡힌 예외와 같이 잡힌 예외는 예외 필터가 실행되지 않는다. 잡히지 않은 예외가 발생하면 나머지 라이프사이클은 무시되고 요청은 바로 필터로 건너뛰게 된다.
:::

## 요약 {#summary}

일반적으로 요청 라이프사이클은 다음과 같은 순으로 진행된다.

1. 인바운드 요청
2. 미들웨어
   1. 전역 미들웨어
   2. 모듈 미들웨어
3. 가드
   1. 전역 가드
   2. 컨트롤러 가드
   3. 라우트 가드
4. 인터셉터 (컨트롤러 이전)
   1. 전역 인터셉터
   2. 컨트롤러 인터셉터
   3. 라우트 인터셉터
5. 파이프
   1. 전역 파이프
   2. 컨트롤러 파이프
   3. 라우트 파이프
   4. 라우트 파라미터 파이프
6. 컨트롤러 (메서드 핸들러)
7. 서비스 (존재하는 경우)
8. 인터셉터 (요청후)
   1. 라우트 인터셉터
   2. 컨트롤러 인터셉터
   3. 전역 인터셉터
9. 예외 필터
   1. 라우트
   2. 컨트롤러
   3. 전역
10. 서버 응답
