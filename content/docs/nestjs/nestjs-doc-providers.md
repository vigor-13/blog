---
title: 프로바이더
description:
date: 2024-03-08
tags: [provider, service]
references:
  [{ key: 'NestJS 공식 문서', value: 'https://docs.nestjs.com/providers' }]
---

프로바이더는 Nest의 기본 개념이다. 서비스, 레포지토리, 팩토리, 헬퍼 등 많은 기본 Nest 클래스가 프로바이더로 취급될 수 있다. 프로바이더의 핵심은 종속성으로 **주입**할 수 있다는 것이다. 즉, 객체가 서로 다양한 관계를 형성할 수 있으며 이러한 객체들을 "연결"하는 기능은 대부분 Nest 런타임 시스템에 위임할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nestjs-doc-providers/1.png)

이전 장에서는 간단한 `CatsController` 를 구축했다. 컨트롤러는 HTTP 요청을 처리하고 더 복잡한 작업을 **프로바이더**에 위임해야 한다. 프로바이더는 모듈에서 `providers` 로 선언되는 일반 자바스크립트 클래스다.

:::note
Nest를 사용하면 종속성을 보다 OO한 방식으로 설계하고 구성할 수 있으므로 [SOLID](https://en.wikipedia.org/wiki/SOLID) 원칙을 따르는 것을 적극 권장한다.
:::

## 서비스 {#services}

간단한 `CatsService` 를 만들어 보자.

이 서비스는 데이터 저장 및 검색을 담당하며 `CatsController` 에서 사용할 것이므로 프로바이더로 정의하기에 좋은 케이스다.

```ts
// cats.service.ts
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

:::note
CLI를 사용하여 서비스를 만들려면 `nest g service cats` 명령을 실행하면 된다.
:::

`CatsService` 는 하나의 프로퍼티와 두 개의 메서드가 있는 기본 클래스다. 유일한 새로운 기능은 `@Injectable()` 데코레이터를 사용한다는 것이다.

`Injectable()` 데코레이터는 메타데이터를 첨부하여 `CatsService`가 Nest [IoC](https://en.wikipedia.org/wiki/Inversion_of_control) 컨테이너에서 관리할 수 있는 클래스임을 선언한다.

참고로 이 예제에서는 다음과 같이 보이는 `Cat` 인터페이스도 사용한다:

```ts
// interfaces/cat.interface.ts
export interface Cat {
  name: string;
  age: number;
  breed: string;
}
```

이제 cats 을 검색하는 서비스 클래스가 생겼으니 `CatsController` 내에서 사용해 보자:

```ts
// cats.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

`CatsService` 는 클래스 생성자를 통해 **주입된다**. `private` 구문이 사용되는 것에 주목해보자. 이렇게 하면 `catsService` 멤버를 선언하고 동시에 초기화할 수 있다.

## 의존성 주입 {#dependency-injection}

Nest는 일반적으로 **의존성 주입**이라고 알려진 강력한 디자인 패턴을 기반으로 구축되었다. (이 개념에 대한 자세한 내용은 [Angular](https://angular.dev/guide/di) 공식 문서를 참조한다.)

Nest에서는 타입스크립트를 사용하여 종속성을 타입으로만 리졸브하기 때문에 종속성을 관리하기가 매우 쉽다.

아래 예제에서 Nest는 `CatsService` 의 인스턴스를 생성하고 반환함으로써(또는 싱글톤의 일반적인 경우 다른 곳에서 이미 요청된 경우 기존 인스턴스를 반환함으로써) `catsService` 를 리졸브한다. 이 종속성은 리졸브되어 컨트롤러의 생성자에게 전달되거나 지정된 프로퍼티에 할당된다:

```ts
constructor(private catsService: CatsService) {}
```

## 스코프 {#scopes}

프로바이더는 일반적으로 애플리케이션의 라이프사이클과 동기화된 수명("스코프")을 갖는다. 애플리케이션이 부트스트랩되면 모든 종속성이 리졻브되어야 하므로 모든 프로바이더가 인스턴스화되어야 한다. 마찬가지로 애플리케이션이 종료되면 각 프로바이더는 제거된다. 하지만 프로바이더의 라이프사이클을 **요청-스코프**로 설정하는 방법도 있다. (자세한 내용은 [여기](https://docs.nestjs.com/fundamentals/injection-scopes)에서 확인한다)

## 커스텀 프로바이더 {#custom-providers}

Nest에는 프로바이더 간의 관계를 리졸브하는 제어의 역전("IoC") 컨테이너가 내장되어 있다. 이 기능은 위에서 설명한 의존성 주입 기능의 기반이 되지만, 사실 지금까지 설명한 것보다 훨씬 더 강력하다.

프로바이더를 정의하는 여러 가지 방법이 있다: 일반 값, 클래스, 그리고 비동기 또는 동기 팩토리를 사용할 수 있다. ([예제](https://docs.nestjs.com/fundamentals/dependency-injection) 참조)

## 선택적 프로바이더 {#optional-providers}

때로는 반드시 리졸브해야 할 필요가 없는 종속성이 있을 수 있다. 예를 들어 클래스의 종속성으로 **구성 객체**가 있지만 아무 것도 전달되지 않으면 기본값을 사용해야 하는 경우다. 이러한 경우 구성 객체 프로바이더가 없어도 오류가 발생하지 않으므로 종속성은 선택 사항이 된다.

프로바이더가 선택 사항임을 나타내려면 생성자 시그니처에서 `@Optional()` 데코레이터를 사용한다.

```ts
import { Injectable, Optional, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
}
```

이전 예제에서는 생성자 기반 의존성 주입을 사용했지만, 위의 예시에서는 `HTTP_OPTIONS` 사용자 정의 **토큰**을 통해서 커스텀 프로바이더를 주입하고 있다. (커스텀 프로바이더 및 관련 토큰 [참조](https://docs.nestjs.com/fundamentals/custom-providers))

## 프로퍼티 기반 주입 {#property-based-injection}

지금까지 사용한 기술은 생성자를 통해 프로바이더를 주입하기 때문에 생성자 기반 주입이라고 한다. 하지만 때로는 **프로퍼티 기반 주입**이 유용할 수 있다.

예를 들어 최상위 클래스가 하나 또는 여러 개의 프로바이더에 의존하는 경우 하위 클래스의 생성자에서 `super()` 를 호출하여 이를 전달하는 것은 번거로울 수 있다. 이를 방지하기 위해 프로퍼티 수준에서 `@Inject()` 데코레이터를 사용할 수 있다.

```ts
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  @Inject('HTTP_OPTIONS')
  private readonly httpClient: T;
}
```

:::warning
클래스가 다른 클래스로 확장하는 경우가 아니라면 항상 **생성자 기반 주입**을 사용하는 것이 좋다.
:::

## 프로바이더 등록 {#provider-registration}

이제 프로바이더( `CatsService` )를 정의했고 해당 서비스의 소비자( `CatsController` )가 있으므로 서비스를 Nest에 등록하여 인젝션을 수행할 수 있도록 해야 한다.

`app.module.ts` 파일에서 `@Module()` 데코레이터의 `providers` 배열에 서비스를 추가하여 프로바이더를 등록한다.

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

이제 Nest는 `CatsController` 클래스의 종속성을 리졸브할 수 있다.

여기까지 디렉터리 구조는 다음과 같다:

```text
src
 ├─ cats
 │   ├─ dto
 │   │   └─ create-cat.dto.ts
 │   ├─ interfaces
 │   │   └─ cat.interface.ts
 │   ├─ cats.controller.ts
 │   └─ cats.service.ts
 ├─ app.module.ts
 └─ main.ts
```

## 수동 인스턴스화 {#manual-instantiation}

지금까지 Nest가 종속성 리졸브를 위한 대부분의 세부 사항을 자동으로 처리하는 방법에 대해 알아보았다. 특정 상황에서는 빌트인 종속성 주입 시스템에서 벗어나 수동으로 프로바이더를 검색하거나 인스턴스화해야 할 수도 있다. 아래에서 이러한 두 가지 주제에 대해 간략하게 설명한다.

- 기존 인스턴스를 가져오거나 프로바이더를 동적으로 인스턴스화하려면 [모듈 참조](https://docs.nestjs.com/fundamentals/module-ref)를 사용할 수 있다.
- `bootstrap()` 함수 내에서 프로바이더를 가져오려면(예: 컨트롤러가 없는 독립형 애플리케이션 또는 부트스트랩 중 구성 서비스를 활용하려면) [독립형 애플리케이션](https://docs.nestjs.com/standalone-applications)을 참조한다.
