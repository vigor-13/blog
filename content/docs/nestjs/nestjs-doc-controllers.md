---
title: 컨트롤러
description:
date: 2024-03-07
tags: [controller, routing]
references:
  [{ key: 'NestJS 공식 문서', value: 'https://docs.nestjs.com/controllers' }]
---

**컨트롤러**는 수신된 요청을 처리하고 클라이언트에 응답을 반환한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nestjs-doc-controllers/1.png)

컨트롤러의 목적은 애플리케이션에 대한 특정 요청을 수신하는 것이다. 라우팅 메커니즘은 어떤 컨트롤러가 어떤 요청을 수신할지 제어한다. 각 컨트롤러에는 둘 이상의 라우트가 있는 경우가 많으며, 각 라우트마다 다른 작업을 수행할 수 있다.

기본 컨트롤러를 생성하기 위해 **클래스**와 **데코레이터**를 사용한다. 데코레이터는 클래스를 필수 메타데이터와 연결하고 NestJS가 라우팅 맵을 생성(요청을 해당 컨트롤러에 연결)할 수 있도록 한다.

:::tip
유효성 검사 기능이 내장된 CRUD 컨트롤러를 빠르게 만들려면 CLI의 CRUD 생성기(`nest g resource [name]`)를 사용한다.
:::

## 라우팅 {#routing}

다음 예제에서는 기본 컨트롤러를 정의하는 데 필요한 `@Controller()` 데코레이터를 사용한다. (선택사항) 라우트 경로 접두사 `cats` 를 지정한다. `@controller()` 데코레이터에 경로 접두사를 사용하면 관련 라우트 집합을 쉽게 그룹화하여 반복되는 코드를 최소화할 수 있다.

예를 들어 cat 엔티티와의 상호 작용을 관리하는 일련의 라우트를 `/cats` 라우트로 그룹화할 수 있다. 이 경우 `@Controller()` 데코레이터에 경로 접두사 `cats` 를 지정하면 파일의 각 라우트에서 해당 부분을 반복적으로 지정할 필요가 없다.

```ts
// cats.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

:::tip
CLI를 사용하여 컨트롤러를 만들려면 `$ nest g controller [name]` 명령을 실행한다.
:::

`findAll()` 메서드 앞에 `@Get()` HTTP 요청 메서드 데코레이터를 사용하면 Nest가 HTTP 요청의 특정 엔드포인트에 대한 핸들러를 생성하도록 지시한다. 엔드포인트는 HTTP 요청 메서드(이 경우 GET)와 라우트 경로에 해당한다.

라우트 경로란 무엇인가? 핸들러의 라우트 경로는 컨트롤러에 대해 선언된 (선택 사항) 접두사와 메서드의 데코레이터에 지정된 경로를 연결하여 결정된다.

모든 라우트에 접두사(`cats`)를 선언했고 데코레이터에 경로 정보를 추가하지 않았으므로 Nest는 `GET /cats` 요청을 이 핸들러에 매핑한다.

앞서 언급했듯이 경로에는 컨트롤러 경로 접두사와 요청 메서드 데코레이터에 선언된 경로 문자열이 모두 포함된다. 예를 들어, 경로 접두사 `cats` 와 데코레이터 `@Get('breed')` 를 결합하면 `GET /cats/breed` 에 대한 경로 매핑이 생성된다.

위의 예제에서 이 엔드포인트로 GET 요청이 이루어지면 Nest는 요청을 `findAll()` 메서드로 라우팅한다. 여기서 선택한 메서드 이름은 완전히 임의적이라는 점에 유의한다. 분명 경로에 바인딩할 메서드를 선언해야 하지만 Nest는 선택한 메서드 이름에 어떤 의미도 부여하지 않는다.

이 메서드는 200 상태 코드와 관련 응답을 반환하는데, 이 경우에는 문자열일 뿐이다. 왜 이런 일이 발생할까? 설명을 위해 먼저 Nest가 응답을 조작하는 데 두 가지 다른 옵션을 사용한다는 것을 이해해야 한다:

:::tabs

@tab:active 표준 옵션#standard

기본 제공 메서드를 사용하면 요청 핸들러가 자바스크립트 객체나 배열을 반환하면 **자동으로** JSON으로 직렬화된다. 그러나 자바스크립트 기본 유형(예: `string` , `number` , `boolean`)을 반환하는 경우 Nest는 직렬화를 시도하지 않고 값만 전송한다. 따라서 응답 처리가 간단해진다. 값만 반환하면 나머지는 Nest가 처리한다.

또한 응답의 **상태 코드**는 201을 사용하는 POST 요청을 제외하고는 기본적으로 항상 200이다. 핸들러 수준에서 `@HttpCode(...)` 데코레이터를 추가하여 이 동작을 쉽게 변경할 수 있다.

@tab 라이브러리별 옵션#library-specific

라이브러리별(예: Express) 응답 객체를 사용할 수 있으며, 메서드 핸들러 시그니처에 `@Res()` 데코레이터를 사용하여 삽입할 수 있다(예: `findAll(@Res() response)` ). 이 접근 방식을 사용하면 해당 객체에 의해 노출된 기본 응답 처리 메서드를 사용할 수 있다. 예를 들어 Express 에서는 `response.status(200).send()` 와 같은 코드를 사용하여 응답을 구성할 수 있다.

:::

:::warning
Nest는 핸들러가 `@Res()` 또는 `@Next()` 를 사용하는 경우 이를 감지하여 라이브러리별 옵션을 선택했음을 인지한다. 두 가지 접근 방식을 동시에 사용하면 해당 단일 경로에 대해 표준 접근 방식이 **자동으로 비활성화**되고 더 이상 예상대로 작동하지 않는다.

두 접근 방식을 동시에 사용하려면(예: 응답 객체를 삽입하여 cookies/headers 만 설정하고 나머지는 프레임워크에 맡기는 경우) `@Res({ passthrough: true })` 데코레이터에서 `passthrough` 옵션을 `true` 로 설정해야 한다.
:::

## 요청 객체 {#request-object}

핸들러는 종종 클라이언트 **요청** 세부 정보에 액세스해야 한다. Nest는 기본 플랫폼(기본적으로 Express)의 요청 객체에 대한 액세스를 제공한다. 핸들러의 시그니처에 `@Req()` 데코레이터를 추가하여 Nest에 요청 객체를 삽입하도록 지시하면 요청 객체에 액세스할 수 있다.

```ts
// cats.controller.ts
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all cats';
  }
}
```

:::tip
위의 `request: Request` 파라미터 예제에서와 같이 Express를 활용하려면 `@types/express` 패키지를 설치한다.
:::

요청 객체는 HTTP 요청을 나타내며 요청 query string, parameters, HTTP headers 및 body에 대한 속성이 있다([참조](https://expressjs.com/en/api.html#req)). 대부분의 경우 이러한 속성을 수동으로 가져올 필요는 없다. 대신 즉시 사용 가능한 `@Body()` 또는 `@Query()` 와 같은 전용 데코레이터를 사용할 수 있다. 아래는 제공되는 데코레이터와 이들이 나타내는 일반 플랫폼별 객체 목록이다.

| 데코레이터                | 객체                                |
| ------------------------- | ----------------------------------- |
| `@Request(), @Req()`      | `req`                               |
| `@Response(), @Res() *`   | `res`                               |
| `@Next()`                 | `next`                              |
| `@Session()`              | `req.session`                       |
| `@Param(key?: string)`    | `req.params` / `req.params[key]`    |
| `@Body(key?: string)`     | `req.body` / `req.body[key]`        |
| `@Query(key?: string)`    | `req.query` / `req.query[key]`      |
| `@Headers(name?: string)` | `req.headers` / `req.headers[name]` |
| `@Ip()`                   | `req.ip`                            |
| `@HostParam()`            | `req.hosts`                         |

`*` 기본 HTTP 플랫폼(예: Express 및 Fastify)에서의 타이핑과의 호환성을 위해 Nest는 `@Res()` 및 `@Response()` 데코레이터를 제공한다. `Res()` 는 `@Response()` 의 별칭일 뿐이다. 둘 다 기본 네이티브 플랫폼 응답 객체 인터페이스를 직접 노출한다. 이를 사용할 때는 기본 라이브러리의 타이핑(예: `@types/express`)도 임포트해야 최대한 활용할 수 있다.

메서드 핸들러에 `@Res()` 또는 `@Response()` 를 삽입하면 해당 핸들러에 대해 Nest는 라이브러리 전용 모드로 전환되며 개발자가 직접 응답을 관리해야 한다는 점에 유의한다. 이 경우 응답 객체(예: `res.json(...)` 또는 `res.send(...)` )를 호출하여 일종의 응답을 발행해야 하며, 그렇지 않으면 HTTP 서버가 중단된다.

## 리소스 {#resources}

앞서 cats 리소스를 가져오는 엔드포인트(**GET** 라우트)를 정의했다. 일반적으로 새 레코드를 생성하는 엔드포인트도 제공해야 한다. 이를 위해 **POST** 핸들러를 만들어 보자:

```ts
// cats.controller.ts
import { Controller, Get, Post } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Post()
  create(): string {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

Nest는 모든 표준 HTTP 메서드에 대한 데코레이터를 제공한다: `Get()` , `@Post()` , `@Put()` , `@Delete()` , `@Patch()` , `@Options()` , `@Head()`. 또한 `@All()` 은 이 모든 메서드를 처리하는 엔드포인트를 정의한다.

## 라우트 와일드카드 {#route-wildcards}

패턴 기반 라우트도 지원된다. 예를 들어 별표(asterisk)는 와일드카드로 사용되며 어떤 문자 조합과도 일치한다.

```ts
@Get('ab*cd')
findAll() {
  return 'This route uses a wildcard';
}
```

`'ab*cd'` 라우트 경로는 `abcd` , `ab_cd` , `abecd` 등과 일치한다. 문자 `?` , `+` , `*` 및 `()` 는 라우트 경로에 사용할 수 있으며 정규식 대응 문자의 하위 집합이다. 하이픈( `-` )과 점( `.` )은 문자열 기반 경로에서 문자 그대로 해석된다.

:::warning
라우트 중간의 와일드카드는 Express에서만 지원된다.
:::

## 상태 코드 {#status-code}

앞서 언급했듯이 응답 **상태 코드**는 **201**인 POST 요청을 제외하고 기본적으로 항상 **200**이다. 핸들러 수준에서 `@HttpCode(...)` 데코레이터를 추가하면 이 동작을 쉽게 변경할 수 있다.

```ts
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}
```

:::note
`HttpCode` 는 `nestjs/common` 패키지에서 가져올 수 있다.
:::

상태 코드는 정적이지 않고 다양한 요인에 따라 달라지는 경우가 많다. 이 경우 라이브러리별 응답(`@Res()`를 사용하여 삽입) 객체를 사용하거나 오류가 발생하면 예외를 던질 수 있다.

## 헤더 {#headers}

커스텀 응답 헤더를 지정하려면 `@Header()` 데코레이터 또는 라이브러리별 응답 객체를 사용한다(`res.header()`를 직접 호출하면 된다).

```ts
@Post()
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}
```

:::note
`Header` 는 `nestjs/common` 패키지에서 가져올 수 있다.
:::

## 리디렉션 {#redirection}

응답을 특정 URL로 리디렉션하려면 `@Redirect()` 데코레이터 또는 라이브러리별 응답 객체를 사용한다( `res.redirect()`를 직접 호출하면 된다).

`@Redirect()` 는 두 개의 인자, `url` 과 `statusCode` 를 받지만 둘 다 선택 사항이다. `statusCode` 의 기본값은 생략할 경우 `302`( `Found` )다.

```ts
@Get()
@Redirect('https://nestjs.com', 301)
```

:::tip
때로는 HTTP 상태 코드나 리디렉션 URL을 동적으로 결정하고 싶을 수 있다. 이를 위해서는 `@nestjs/common` 의 `HttpRedirectResponse` 인터페이스를 따르는 객체를 반환하면 된다.
:::

반환된 값은 `@Redirect()` 데코레이터에 전달된 모든 인자를 재정의한다.

```ts
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
```

## 라우트 파라미터 {#route-parameters}

정적 경로 라우트는 요청의 일부로 **동적 데이터**를 받아야 할 때 작동하지 않는다(예: ID가 `1` 인 cat을 가져오기 `/cats/1 GET` ).

파라미터가 있는 라우트를 정의하려면 라우트 경로에 라우트 파라미터 **토큰**을 추가하여 요청 URL의 해당 위치에서 동적 값을 캡처할 수 있다.

아래 `@Get()` 데코레이터 예제의 라우트 파라미터 토큰은 이 사용법을 보여준다. 이러한 방식으로 선언된 라우트 파라미터는 메서드 시그니처에 추가해야 하는 `@Param()` 데코레이터를 사용하여 액세스할 수 있다.

:::note
파라미터가 있는 라우트는 정적 경로 뒤에 선언해야 한다. 이렇게 하면 파라미터화된 경로가 정적 경로로 향하는 트래픽을 가로채는 것을 방지할 수 있다.
:::

```ts
@Get(':id')
findOne(@Param() params: any): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```

`Param()` 은 메서드 파라미터(위 예시에서는 `params`)를 데코레이트하는 데 사용되며, 메서드 본문 내에서 데코레이트된 메서드 파라미터의 속성으로 라우트 매개변수를 사용할 수 있게 한다. 위 코드에서 볼 수 있듯이 `params.id` 를 참조하여 `id` 파라미터에 액세스할 수 있다. 특정 파라미터 토큰을 데코레이터에 전달한 다음 메서드 본문에서 이름으로 직접 라우트 파라미터를 참조할 수도 있다.

:::note
`Param` 은 `@nestjs/common` 패키지에서 가져올 수 있다.
:::

```ts
@Get(':id')
findOne(@Param('id') id: string): string {
  return `This action returns a #${id} cat`;
}

```

## 서브 도메인 라우팅 {#sub-domain-routing}

`@Controller` 데코레이터는 `host` 옵션을 사용하여 들어오는 요청의 HTTP 호스트가 특정 값과 일치하도록 요구할 수 있다.

```ts
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}
```

:::warning
Fastify는 중첩 라우터를 지원하지 않으므로 하위 도메인 라우팅을 사용할 때는 Express 어댑터를 대신 사용해야 한다.
:::

라우트 `path` 와 마찬가지로 `host` 옵션은 토큰을 사용하여 호스트 이름에서 해당 위치의 동적 값을 캡처할 수 있다.

아래 예시의 `host` 파라미터 토큰은 이 사용법을 보여준다. 이러한 방식으로 선언된 `host` 파라미터는 메서드 시그니처에 추가해야 하는 `@HostParam()` 데코레이터를 사용하여 액세스할 수 있다.

```ts
@Controller({ host: ':account.example.com' })
export class AccountController {
  @Get()
  getInfo(@HostParam('account') account: string) {
    return account;
  }
}
```

## 스코프 {#scopes}

다른 프로그래밍 언어 배경을 가진 사람들에게는 Nest에서 데이터베이스에 대한 연결 풀, 전역 상태를 가진 싱글톤 서비스 등 거의 모든 것이 수신되는 요청에서 공유된다는 사실이 의외로 느껴질 수 있다. Node.js는 모든 요청이 별도의 스레드에서 처리되는 request/response Multi-Thread Stateless 모델을 따르지 않는다는 점을 알아야 한다. 따라서 애플리케이션에서 싱글톤 인스턴스를 사용해도 안전하다.

그러나 GraphQL 애플리케이션의 요청별 캐싱, 요청 추적 또는 멀티테넌시와 같이 컨트롤러의 요청 기반 라이프사이클이 필요한 엣지 케이스가 있다. 스코프를 제어하는 자세한 방법은 [여기](https://docs.nestjs.com/fundamentals/injection-scopes)를 참조한다.

## 비동기성 {#asynchronicity}

Nest는 `async` 함수를 지원한다.

:::note
`ansync / await` 함수에 대해 [자세히 알아보기](https://kamilmysliwiec.com/typescript-2-1-introduction-async-await)
:::

모든 비동기 함수는 `Promise` 를 반환해야 한다. 즉, Nest가 자체적으로 리졸브 수 있는 지연된 값을 반환할 수 있다. 이에 대한 예를 살펴보자:

```ts
// cats.controller.ts
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```

위의 코드는 완전히 유효하다. 또한 Nest 라우트 핸들러는 RxJS [observable streams](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html)을 반환할 수 있어 훨씬 더 강력하다. Nest는 자동으로 소스를 구독하고 스트림이 완료되면 마지막으로 발생한 값을 취한다.

```ts
// cats.controller.ts
@Get()
findAll(): Observable<any[]> {
  return of([]);
}
```

위의 두 가지 방법 모두 효과가 있으며 요구 사항에 맞는 방법을 사용할 수 있다.

## 요청 페이로드 {#request-payload}

이전 POST 라우트 핸들러 예제에서는 클라이언트 파라미터를 받지 않았다. 여기에 `@Body()` 데코레이터를 추가하여 이 문제를 해결해 보자.

하지만 먼저 (타입스크립트를 사용하는 경우) **DTO**(Data Transfer Object) 스키마를 결정해야 한다. DTO는 데이터가 네트워크를 통해 전송되는 방식을 정의하는 객체다. **타입스크립트 인터페이스**를 사용하거나 간단한 클래스를 사용하여 DTO 스키마를 결정할 수 있다. 흥미롭게도 여기서는 **클래스**를 사용하는 것이 좋다. 그 이유는 무엇일까? 클래스는 자바스크립트 ES6 표준의 일부이므로 컴파일된 자바스크립트에서 실제 엔티티로 보존된다. 반면에 타입스크립트 인터페이스는 트랜스파일링 과정에서 제거되기 때문에 런타임에 Nest에서 참조할 수 없다. 이는 **파이프**와 같은 기능이 런타임에 변수의 메타타입에 액세스할 때 추가적인 작업을 가능하게 하기 때문에 중요하다.

`CreateCatDto` 클래스를 만들어 보자:

```ts
// create-cat.dto.ts
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

여기에는 세 가지 기본 프로퍼티가 있다. 그 후 새로 생성된 DTO를 `CatsController` 내에서 사용할 수 있다:

```ts
// cats.controller.ts
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  return 'This action adds a new cat';
}
```

:::note
`ValidationPipe` 는 메서드 핸들러가 수신해서는 안 되는 프로퍼티를 필터링할 수 있다. 이 경우 허용 가능한 프로퍼티를 화이트리스트에 추가할 수 있으며, 화이트리스트에 포함되지 않은 프로퍼티는 결과 객체에서 자동으로 제거된다. `CreateCatDto` 예제에서 화이트리스트는 `name` , `age` , `breed` 다.
:::

## 에러 핸들링 {#error-handling}

에러 핸들링은 별도의 [챕터](https://docs.nestjs.com/exception-filters)에서 확인한다.

## 전체 소스 샘플 {#full-source-sample}

아래는 몇 가지 데코레이터를 사용하여 기본 컨트롤러를 만드는 예제다. 이 컨트롤러는 데이터에 액세스하고 조작하는 몇 가지 메서드를 제공한다.

```ts
// cats.controller.ts
import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateCatDto, UpdateCatDto, ListAllEntities } from './dto';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
```

:::note
Nest CLI는 모든 상용구 코드를 자동으로 생성하는 생성기를 제공하여 개발자 환경을 훨씬 더 간단하게 만들 수 있도록 도와준다. 자세한 내용은 [여기](https://docs.nestjs.com/recipes/crud-generator)를 참조한다.
:::

## 시작 및 실행하기 {#getting-up-and-running}

앞서 컨트롤러를 정의했지만 Nest는 여전히 `CatsController` 가 존재한다는 것을 알지 못하므로 이 클래스의 인스턴스를 생성하지 않는다.

컨트롤러는 항상 모듈에 속하기 때문에 `@Module()` 데코레이터 안에는 컨트롤러를 추가할 수 있는 `controllers` 배열이 있다. 아직 루트 `AppModule` 을 제외한 다른 모듈을 정의하지 않았으므로 이를 사용하여 `CatsController` 를 추가할 것이다:

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
  controllers: [CatsController],
})
export class AppModule {}
```

`@Module()` 데코레이터를 사용하여 모듈 클래스에 메타데이터를 첨부하면, Nest는 어떤 컨트롤러를 마운트해야 하는지 인지할 수 있다.

## 라이브러리별 접근법 {#library-specific-approach}

지금까지 응답을 조작하는 Nest 표준 방법에 대해 설명했다. 응답을 조작하는 두 번째 방법은 라이브러리별 응답 객체를 사용하는 것이다. 특정 응답 객체를 삽입하려면 `@Res()` 데코레이터를 사용해야 한다. 차이점을 알아보기 위해 `CatsController`를 다음과 같이 다시 작성해 보자:

```ts
import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Res() res: Response) {
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  findAll(@Res() res: Response) {
    res.status(HttpStatus.OK).json([]);
  }
}
```

이 접근 방식은 효과가 있고 실제로 응답 객체에 대한 완전한 제어(헤더 조작, 라이브러리별 기능 등)를 제공함으로써 어떤 면에서는 더 많은 유연성을 허용하지만, 신중하게 사용해야 한다.

일반적으로 이 접근 방식은 몇 가지 단점이 있다. 가장 큰 단점은 코드가 플랫폼에 따라 달라지기에 테스트하기가 더 어려워진다는 것이다.

또한 위 예제에서는 인터셉터 및 `@HttpCode()` / `@Header()` 데코레이터와 같이 Nest 표준 응답 처리 방식과 호환성이 떨어진다. 이 문제를 해결하려면 다음과 같이 `passthrough` 옵션을 `true` 로 설정하면 된다:

```ts
@Get()
findAll(@Res({ passthrough: true }) res: Response) {
  res.status(HttpStatus.OK);
  return [];
}
```

이제 네이티브 응답 객체와 상호 작용할 수 있지만(예: 특정 조건에 따라 cookies 또는 headers 설정) 나머지는 프레임워크에 처리를 맡길 수 있다.
