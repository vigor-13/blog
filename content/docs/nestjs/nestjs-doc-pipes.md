---
title: 파이프
description:
date: 2024-03-10
tags: [pipe]
references:
  [{ key: 'NestJS 공식 문서', value: 'https://docs.nestjs.com/pipes' }]
---

파이프는 `@Injectable()` 데코레이터를 사용하는 클래스로, `PipeTransform` 인터페이스를 구현한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nestjs-doc-pipes/1.png)

파이프에는 일반적으로 두 가지 사용 사례가 있다:

- **변환** : 입력 데이터를 원하는 형식으로 변환한다(예: 문자열 => 정수).
- **유효성 검사** : 입력 데이터를 평가하여 유효하면 변경하지 않고 그대로 전달하고, 그렇지 않으면 예외를 발생시킨다.

두 경우 모두 파이프는 **컨트롤러 라우트 핸들러**가 처리 중인 `arguments` 를 대상으로 작동한다. Nest는 라우트 핸들러가 호출되기 직전에 파이프를 삽입하고, 파이프는 핸들러의 대상이 되는 인자를 받아 이를 대상으로 작동한다. 이때 모든 변환 또는 유효성 검사 작업이 수행되고, 그 후에 (잠재적으로) 변환된 인자를 사용하여 라우트 핸들러가 호출된다.

Nest에는 바로 사용할 수 있는 여러 가지 빌트인 파이프가 있다. 커스텀 파이프를 직접 만들 수도 있다. 여기서는 빌트인 파이프를 소개하고 이를 라우트 핸들러에 바인딩하는 방법을 알아본다. 그런 다음 몇 가지 커스텀 파이프를 살펴보고 처음부터 파이프를 구축하는 방법을 알아볼 것이다.

:::note
파이프는 예외 영역 내에서 실행된다. 즉, 파이프가 예외를 던지면 예외 계층(전역 및 현재 컨텍스트에 적용되는 모든 **예외 필터**)에서 처리된다. 위의 내용을 고려할 때, 파이프에서 예외가 발생하면 컨트롤러 메서드가 이후에 실행되지 않는다는 것을 분명히 알 수 있다. 이는 시스템 경계에서 외부 소스에서 애플리케이션으로 들어오는 데이터의 유효성을 검사하는 모범 사례다.
:::

## 빌트인 파이프 {#built-in-pipes}

Nest에는 9개의 빌트인 파이프가 있다.

- `ValidationPipe`
- `ParseIntPipe`
- `ParseFloatPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `ParseEnumPipe`
- `DefaultValuePipe`
- `ParseFilePipe`

빌트인 파이프는 `nestjs/common` 패키지에서 가져올 수 있다.

`ParseIntPipe` 사용에 대해 간단히 살펴보자. 이 파이프느 메서드 핸들러 파라미터가 자바스크립트 정수로 **변환**되도록 하는데 변환에 실패하면 예외를 발생시킨다. 이 장의 뒷부분에서 `ParseIntPipe` 에 대한 간단한 커스텀 구현을 알아본다.

아래의 예제는 다른 빌트인 변환 파이프(이 장에서 `Parse*` 파이프라고 부르는 `ParseBoolPipe` , `ParseFloatPipe` , `ParseEnumPipe` , `ParseArrayPipe` 및 `ParseUUIDPipe`)에도 적용된다.

## 파이프 바인딩 {#binding-pipes}

파이프를 사용하려면 파이프 클래스의 인스턴스를 적절한 컨텍스트에 바인딩해야 한다.

`ParseIntPipe` 예제에서는 파이프를 특정 라우트 핸들러 메서드와 연결하고 메서드가 호출되기 전에 파이프가 실행되도록 하려고 한다. 이를 위해 메서드 파라미터 수준에서 파이프를 바인딩 한다:

```ts
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

이렇게 하면 `findOne()` 메서드에서 받은 파라미터가 숫자(`this.catsService.findOne()` 호출에서 예상한 대로)인지 확인하고 아니라면 라우트 핸들러가 호출되기 전에 예외를 발생시킨다.

예를 들어 라우트가 다음과 같이 호출된다면:

```text
GET localhost:3000/abc
```

Nest는 아래와 같은 예외를 발생시킨다:

```json
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

예외가 발생하면 `findOne()` 메서드의 본문은 실행되지 않는다.

위의 예에서는 인스턴스가 아닌 클래스( `ParseIntPipe` )를 전달하여 인스턴스화에 대한 책임을 프레임워크에 맡겨 의존성을 주입한다. 파이프 및 가드와 마찬가지로, 클래스 대신 인스턴스를 전달할 수 있다. 인스턴스 전달은 옵션을 전달하여 내장된 파이프의 동작을 사용자 정의하려는 경우에 유용하다:

```ts
@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.catsService.findOne(id);
}
```

다른 변환 파이프(모든 `Parse*` 파이프)도 비슷하게 작동한다. 이러한 파이프는 모두 라우트 파라미터, 쿼리 문자열 파라미터 및 요청 본문 값의 유효성을 검사하는 맥락에서 작동한다.

예를 들어 쿼리 문자열 파라미터가 있다:

```ts
@Get()
async findOne(@Query('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

다음은 문자열 파라미터를 파싱하여 UUID인지 확인하는 `ParseUUIDPipe` 의 예제다.

```ts
@Get(':uuid')
async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
  return this.catsService.findOne(uuid);
}
```

:::note
`ParseUUIDPipe()` 를 사용하면 UUID를 버전 3, 4 또는 5로 파싱한다. 특정 버전의 UUID만 필요한 경우 파이프 옵션에 버전을 전달할 수 있다.
:::

위에서 다양한 `Parse*` 파이프를 바인딩하는 예제를 살펴봤다. 유효성 검사 파이프는 조금 다르므로 다음 섹션에서 알아본다.

:::note
또한 유효성 검사 파이프에 대한 자세한 예는 [유효성 검사 기술](https://docs.nestjs.com/techniques/validation)을 참조한다.
:::

## 커스텀 파이프 {#custom-pipes}

앞서 언급했듯이 커스텀 파이프를 직접 만들 수 있다. Nest는 강력한 빌트인 `ParseIntPipe` 및 `ValidationPipe` 를 제공하지만, 커스텀 파이프가 어떻게 구성되는지 알아보기 위해 각각의 간단한 커스텀 버전을 처음부터 구축해 본다.

간단한 `ValidationPipe` 부터 시작한다. 처음에는 단순히 입력값을 받고 즉시 동일한 값을 반환하여 동일성 함수처럼 동작하도록 할 것이다.

```ts
// validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```

:::note
`PipeTransform<T, R>` 은 모든 파이프에서 구현해야 하는 일반 인터페이스다. 여기서 `T` 는 입력 값의 타입을 나타내고 `R` 은 `transform()` 메서드의 반환 타입을 나타낸다.
:::

모든 파이프는 `PipeTransform` 인터페이스를 만족시키기 위해서 `transform()` 메서드를 구현해야 한다.

`transform()` 메서드에는 두 개의 파라미터가 있다:

- `value`
- `metadata`

`value` 파라미터는 현재 처리 중인 메서드 인자다. `metadata` 는 현재 처리 중인 메서드 인자의 메타데이터다.

`metadata` 객체에는 다음과 같은 프로퍼티가 있다:

```ts
export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype?: Type<unknown>;
  data?: string;
}
```

이러한 프로퍼티는 현재 처리중인 인자를 설명한다.

| 프로퍼티   | 설명                                                                                                                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`     | 인자가 본문 `@Body()` , 쿼리 `@Query()` , 파라미터 `@Param()` 또는 커스텀 파라미터인지 여부를 나타낸다(자세한 내용은 [여기](https://docs.nestjs.com/custom-decorators)를 참조한다). |
| `metatype` | 인자의 메타타입(예: `String`)을 제공한다. (참고: 라우트 핸들러 메서드 시그니처에서 타입 선언을 생략하거나 바닐라 자바스크립트를 사용하는 경우 이 값은 `undefined` 다.)              |
| `data`     | 데코레이터에 전달된 문자열(예: `@Body('string')` ). 데코레이터 괄호를 비워두면 `undefined` 다.                                                                                      |

:::warning
타입스크립트 인터페이스는 트랜스파일링 중에 제거된다. 따라서 메서드 파라미터의 타입이 클래스 대신 인터페이스로 선언된 경우 `metatype` 값은 `Object` 가 된다.
:::

## 스키마 기반 유효성 검사 {#schema-based-validation}

유효성 검사 파이프를 좀 더 유용하게 만들어보자. `CatsController` 의 `create()` 메서드를 자세히 살펴볼 것이다. 여기서는 서비스 메서드를 실행하기 전에 포스트 본문 객체가 유효한지 확인하고자 한다.

```ts
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

`createCatDto` 파라미터를 집중적으로 살펴본다. 이 파라미터의 타입은 `CreateCatDto` 다:

```ts
// create-cat.dto.ts
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

`create` 메서드로 들어오는 모든 요청에 유효한 본문이 포함되어 있는지 확인하고자 한다. 따라서 `createCatDto` 객체의 세 멤버의 유효성을 검사해야 한다. 라우트 핸들러 메서드 내부에서 이 작업을 수행할 수 있지만 **단일 책임 원칙(SRP)** 을 위반하므로 이상적이지 않다.

또 다른 접근 방식은 **유효성 검사기 클래스(validator class)** 를 생성하고 거기로 작업을 위임하는 것이다. 이 방법은 각 메서드의 시작 부분에서 이 유효성 검사기를 호출하는 것을 기억해야 한다는 단점이 있다.

유효성 검사 미들웨어를 만드는 것은 어떨까? 이 방법은 작동할 수 있지만 안타깝게도 전체 애플리케이션의 모든 컨텍스트에서 사용할 수 있는 **일반 미들웨어**를 만드는 것은 불가능하다. 미들웨어는 호출될 핸들러와 그 매개변수 등 **실행 컨텍스트**를 인식하지 못하기 때문이다.

이것이 바로 파이프를 사용하는 이유다. 이제 유효성 검사 파이프를 구체화해 보자.

## 객체 스키마 유효성 검사 {#object-schema-validation}

깔끔한 방식으로 객체 유효성 검사를 수행하는 데 사용할 수 있는 몇 가지 접근 방식이 있다. 한 가지 일반적인 접근 방식은 **스키마 기반** 유효성 검사를 사용하는 것이다. 이 접근 방식을 사용해 보자.

[Zod](https://zod.dev/) 라이브러리를 사용하면 API를 사용하여 간단한 방식으로 스키마를 만들 수 있다. Zod 기반 스키마를 사용하는 유효성 검사 파이프를 구축해 보자.

먼저 필요한 패키지를 설치한다:

```bash
npm install --save zod
```

아래 코드 샘플에서는 스키마를 `constructor` 인자로 사용하는 간단한 클래스를 만든다. 그런 다음 제공된 스키마에 대해 들어오는 인자의 유효성을 검사하는 `schema.parse()` 메서드를 적용한다.

앞서 언급했듯이 **유효성 검사 파이프**는 값을 변경하지 않고 그대로 반환하거나 예외를 발생시킨다.

다음 섹션에서는 `@UsePipes()` 데코레이터를 사용하여 주어진 컨트롤러 메서드에 적절한 스키마를 제공하는 방법을 살펴본다. 이렇게 하면 우리가 의도한 대로 컨텍스트 간에 유효성 검사 파이프를 재사용할 수 있다.

```ts
import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }
  }
}
```

## 유효성 검사 파이프 바인딩 {#binding-validation-pipes}

앞서 변환 파이프를 바인딩하는 방법(예: `ParseIntPipe` 및 다른 `Parse*` 파이프)을 살펴봤다.

유효성 검사 파이프 바인딩도 매우 간단하다.

현재 경우 메서드 호출 수준에서 파이프를 바인딩해야 한다. 예제에서 `ZodValidationPipe` 를 사용하려면 다음을 수행해야 한다:

1. `ZodValidationPipe` 의 인스턴스를 생성한다.
2. 파이프의 클래스 생성자에서 컨텍스트별 Zod 스키마를 전달한다.
3. 파이프를 메서드에 바인딩한다.

```ts
import { z } from 'zod';

export const createCatSchema = z
  .object({
    name: z.string(),
    age: z.number(),
    breed: z.string(),
  })
  .required();

export type CreateCatDto = z.infer<typeof createCatSchema>;
```

아래와 같이 `@UsePipes()` 데코레이터를 사용하여 메서드에 바인딩한다:

```ts
// cats.controller.ts
@Post()
@UsePipes(new ZodValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

:::note
`@UsePipes()` 데코레이터는 `@nestjs/common` 패키지에서 가져올 수 있다.
:::

:::warning
`zod` 라이브러리를 사용하려면 `tsconfig.json` 파일에서 `strictNullChecks` 옵션을 활성화해야 한다.
:::

## 클래스 유효성 검사기 {#class-validator}

:::warning
이 섹션의 기술은 타입스크립트가 필요하며 바닐라 자바스크립트를 사용하여 앱을 작성하는 경우 사용할 수 없다.
:::

유효성 검사 기술에 대한 다른 구현 방법을 살펴보자.

Nest는 [class-validator](https://github.com/typestack/class-validator) 라이브러리와 잘 작동한다. 이 강력한 라이브러리를 사용하면 데코레이터 기반 유효성 검사를 사용할 수 있다. 데코레이터 기반 유효성 검사는 특히 처리된 프로퍼티의 메타타입에 액세스할 수 있기 때문에 Nest의 **파이프** 기능과 결합하면 매우 강력하다.

시작하기 전에 필요한 패키지를 설치해야 한다:

```bash
npm i --save class-validator class-transformer
```

패키지가 설치되면 `CreateCatDto` 클래스에 몇 가지 데코레이터를 추가할 수 있다. 이 기법의 주요 장점은 별도의 유효성 검사 클래스를 만들 필요 없이 `CreateCatDto` 클래스가 포스트 본문 객체에 대한 단일 소스로 유지된다는 점이다.

```ts
// create-cat.dto.ts
import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
```

:::note
[여기](https://github.com/typestack/class-validator#usage)에서 class-validator 데코레이터에 대해 자세히 알아본다.
:::

이제 이러한 어노테이션을 사용하는 `ValidationPipe` 클래스를 만들 수 있다.

```ts
// validation.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

:::note
`ValidationPipe` 는 Nest에서 기본으로 제공되므로 일반적인 유효성 검사 파이프를 직접 구축할 필요가 없다. 기본 제공 `ValidationPipe` 는 이 장에서 빌드한 샘플보다 더 많은 옵션을 제공하지만, 여기서는 커스텀 파이프의 메커니즘을 설명하기 위해 기본적인 수준으로 유지했다. [여기](https://docs.nestjs.com/techniques/validation)에서 많은 예제와 함께 자세한 내용을 확인할 수 있다.
:::

:::note
위의 [class-transformer](https://github.com/typestack/class-transformer) 라이브러리는 class-validator 라이브러리와 같은 작성자가 만든 것으로, 두 라이브러리는 매우 잘 맞는다.
:::

코드를 살펴보자. 먼저 `transform()` 메서드가 `async` 로 표시되어 있다는 점에 주목한다. 이는 Nest가 동기 및 비동기 파이프를 모두 지원하기 때문에 가능하다. 이 메서드를 비동기로 만든 이유는 class-validator 유효성 검사 중 일부가 비동기적일 수 있기 때문이다.

다음으로 metatype 필드에서 `metatype` 파라미터를 추출하기 위해 구조 분해 할당을 사용하고 있다( `ArgumentMetadata` 에서 `metatype` 멤버만 추출).

다음으로 헬퍼 함수 `toValidate()` 를 주목한다. 이 함수는 현재 처리 중인 인자가 네이티브 자바스크립트 타입일 때 유효성 검사 단계를 우회하는 역할을 한다(이 경우 유효성 검사 데코레이터를 첨부할 수 없으므로 유효성 검사 단계를 거칠 이유가 없다).

다음으로, 유효성 검사를 적용할 수 있도록 class-transformer 함수인 `plainToInstance()` 를 사용하여 일반 자바스크립트 인자 객체를 타입이 지정된 객체로 변환한다. 이 작업을 수행해야 하는 이유는 네트워크 요청에서 역직렬화된 본문 객체에는 **타입 정보가 없기 때문**이다(Express와 같은 기본 플랫폼이 작동하는 방식이다). class-validator 는 앞서 DTO에 대해 정의한 유효성 검사 데코레이터를 사용해야 하므로 이 변환을 수행하여 수신된 본문을 단순한 바닐라 객체가 아닌 적절하게 데코레이션된 객체로 처리해야 한다.

마지막으로 앞서 언급했듯이 이것은 **유효성 검사 파이프**이므로 값을 변경하지 않고 반환하거나 예외를 발생시켜야 한다.

마지막 단계는 `ValidationPipe` 를 바인딩하는 것이다. 파이프는 파라미터-범위, 메서드-범위, 컨트롤러-범위 또는 전역-범위가 될 수 있다. 앞서 Zod 기반 유효성 검사 파이프를 사용하여 메서드 수준에서 파이프를 바인딩하는 예제를 살펴봤다. 아래 예제에서는 파이프 인스턴스를 라우트 핸들러 `@Body()` 데코레이터에 바인딩하여 파이프가 호출되어 포스트 본문의 유효성을 검사하도록 한다.

```ts
// cats.controller.ts
@Post()
async create(
  @Body(new ValidationPipe()) createCatDto: CreateCatDto,
) {
  this.catsService.create(createCatDto);
}
```

파라미터-범위 지정 파이프는 유효성 검사 로직이 지정된 매개변수 하나에만 관련될 때 유용하다.

## 전역 범위 파이프 {#global-scoped-pipes}

`ValidationPipe` 는 최대한 범용적으로 만들어졌기 때문에 전체 애플리케이션의 모든 라우트 핸들러에 적용되도록 **전역 범위** 파이프로 설정하면 그 유용성을 최대한 발휘할 수 있다.

```ts
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

:::note
하이브리드 앱의 경우 `useGlobalPipes()` 메서드는 게이트웨이 및 마이크로 서비스에 파이프를 설정하지 않는다. "표준"(비하이브리드) 마이크로서비스 앱의 경우, `useGlobalPipes()` 는 파이프를 전역적으로 마운트한다.
:::

전역 파이프는 전체 애플리케이션에서 모든 컨트롤러와 모든 라우트 핸들러에 사용된다.

종속성 주입과 관련하여 모듈 외부에서 등록된 전역 파이프(위 예제에서와 같이 `useGlobalPipes()` 를 사용하여)는 바인딩이 모듈의 컨텍스트 외부에서 이루어졌기 때문에 종속성을 주입할 수 없다는 점에 유의한다. 이 문제를 해결하기 위해 다음 구성을 사용하여 모든 **모듈에서 직접 전역 파이프를 설정**할 수 있다:

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
```

:::note
이 접근 방식을 사용하여 파이프에 대한 종속성 주입을 수행할 때 이 구조가 사용되는 모듈에 관계없이 파이프는 실제로 전역이라는 점에 유의한다. 이 작업을 어디에서 수행해야 할까? 파이프가 정의된 모듈(위 예제에서는 `ValidationPipe`)을 선택한다. 또한 `useClass` 만이 커스텀 프로바이더 등록을 처리하는 유일한 방법은 아니다. [여기](https://docs.nestjs.com/fundamentals/custom-providers)에서 자세히 알아본다.
:::

## 빌트인 유효성 검사 파이프 {#the-built-in-validation-pipe}

`ValidationPipe` 는 Nest에서 기본으로 제공되므로 일반적인 유효성 검사 파이프를 직접 구축할 필요가 없다. 빌트인 `ValidationPipe` 는 이 장에서 빌드한 샘플보다 더 많은 옵션을 제공하지만, 커스텀 파이프의 메커니즘을 설명하기 위해 기본적인 수준을 유지했다. [여기](https://docs.nestjs.com/techniques/validation)에서 많은 예제와 함께 자세한 내용을 확인할 수 있다.

## 변환 사용 사례 {#transformation-use-case}

유효성 검사만이 커스텀 파이프의 유일한 사용 사례는 아니다. 이 장의 서두에서 파이프로 입력 데이터를 원하는 형식으로 변환할 수도 있다고 언급했다. 이는 `transform` 함수에서 반환된 값이 인자의 이전 값을 완전히 재정의하기 때문에 가능하다.

언제 유용할까? 클라이언트에서 전달된 데이터가 라우트 핸들러 메서드에서 처리되기 전에 문자열을 정수로 변환하는 등 일부 변경을 거쳐야 하는 경우가 있다. 또한 일부 필수 데이터 필드가 누락되어 기본값을 적용하고자 할 수도 있다. **변환 파이프**는 클라이언트 요청과 요청 핸들러 사이에 처리 함수를 삽입하여 이러한 기능을 수행할 수 있다.

다음은 문자열을 정수 값으로 구문 분석하는 간단한 `ParseIntPipe` 다. (위에서 언급했듯이 Nest에는 더 정교한 `ParseIntPipe` 가 내장되어 있으며, 다음은 커스텀 변환 파이프를 위한 간단한 예제다.)

```ts
// parse-int.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
```

그런 다음 아래와 같이 이 파이프를 선택한 파라미터에 바인딩할 수 있다:

```ts
@Get(':id')
async findOne(@Param('id', new ParseIntPipe()) id) {
  return this.catsService.findOne(id);
}
```

또 다른 유용한 변환 사례는 요청에 제공된 ID를 사용하여 데이터베이스에서 **기존 사용자** 엔티티를 선택하는 것이다:

```ts
@Get(':id')
findOne(@Param('id', UserByIdPipe) userEntity: UserEntity) {
  return userEntity;
}
```

이 파이프의 구현은 독자에게 맡기지만 다른 모든 변환 파이프와 마찬가지로 입력 값( `id` )을 받고 출력 값( `UserEntity` 객체)을 반환한다는 점에 유의한다. 이렇게 하면 보일러플레이트 코드를 핸들러에서 공통 파이프로 추상화하여 코드를 보다 선언적이고 간결하게 만들 수 있다.

## 기본값 제공하기 {#providing-defaults}

`Parse*` 파이프는 파라미터 값이 정의되어 있을 것으로 기대한다. `null` 또는 `undefined` 값을 수신하면 예외를 발생시킨다. 엔드포인트에서 누락된 쿼리 문자열 매개변수 값을 처리할 수 있도록 하려면, `Parse*` 파이프가 이러한 값에 대해 작동하기 전에 주입할 기본값을 제공해야 한다. `DefaultValuePipe` 가 바로 그 역할을 한다. 아래 그림과 같이 관련 `Parse*` 파이프 앞에 `@Query()` 데코레이터에서 `DefaultValuePipe` 를 인스턴스화하기만 하면 된다:

```ts
@Get()
async findAll(
  @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
) {
  return this.catsService.findAll({ activeOnly, page });
}
```
