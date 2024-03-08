---
title: 첫 걸음
description:
date: 2024-03-07
tags: []
references:
  [{ key: 'NestJS 공식 문서', value: 'https://docs.nestjs.com/first-steps' }]
---

이 글에서는 NestJS의 핵심 기본 사항을 알아본다.

NestJS 애플리케이션의 필수 구성 요소에 익숙해지기 위해 입문 수준에서 기본 CRUD 애플리케이션을 구축해 본다.

## 언어 {#language}

NestJS는 타입스크립트와 순수 자바스크립트 모두와 호환된다. 다만 NestJS는 최신 언어 기능을 활용하므로 바닐라 자바스크립트와 함께 사용하려면 [Babel](https://babeljs.io/) 컴파일러가 필요하다.

## 전제 조건 {#prerequisites}

[Node.js](https://nodejs.org/) 16 버전 이상이 필요하다.

## 셋업 {#setup}

[Nest CLI](https://docs.nestjs.com/cli/overview)를 사용하여 새 프로젝트를 시작할 수 있다.

```bash
npm i -g @nestjs/cli
nest new project-name
```

:::tip
타입스크립트의 [엄격 모드](https://www.typescriptlang.org/tsconfig#strict)를 사용하여 프로젝트를 생성하려면 `nest new` 명령에 `--strict` 플래그를 전달한다.
:::

`project-name` 디렉토리가 생성되고, 노드 모듈과 몇 가지 다른 상용구 파일이 설치되며, `src/` 디렉토리가 생성되어 몇 가지 핵심 파일로 채워진다.

```text
src
 ├─ app.controller.spec.ts
 ├─ app.controller.ts
 ├─ app.module.ts
 ├─ app.service.ts
 └─ main.ts
```

다음은 위의 핵심 파일들에 대한 간략한 개요다:

| 파일                     | 설명                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `app.controller.ts`      | 단일 라우트를 갖는 기본 컨트롤러다.                                                |
| `app.controller.spec.ts` | 컨트롤러에 대한 단위 테스트다.                                                     |
| `app.module.ts`          | 애플리케이션의 루트 모듈이다.                                                      |
| `app.service.ts`         | 기본 서비스 객체다.                                                                |
| `main.ts`                | `NestFactory` 를 사용하여 NestJS 애플리케이션 인스턴스를 생성하는 엔트리 파일이다. |

`main.ts` 에는 애플리케이션을 부트스트랩하는 비동기 함수가 포함되어 있다:

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
```

NestJS 애플리케이션 인스턴스를 생성하기 위해 핵심 `NestFactory` 클래스를 사용한다. `NestFactory` 는 애플리케이션 인스턴스를 생성할 수 있는 몇 가지 정적 메서드를 제공한다. `create()` 메서드는 `INestApplication` 인터페이스를 구현하는 애플리케이션 객체를 반환한다. 위의 `main.ts` 예제에서는 애플리케이션이 인바운드 HTTP 요청을 기다릴 수 있도록 HTTP 리스너를 시작하기만 하면 된다.

Nest CLI로 스캐폴드된 프로젝트는 개발자가 각 모듈을 자체 전용 디렉토리에 보관하는 관례를 따르도록 권장하는 초기 프로젝트 구조를 생성한다.

:::tip
기본적으로 애플리케이션을 만드는 동안 오류가 발생하면 앱은 코드 `1` 과 함께 종료된다. 대신 오류를 발생시키려면 `abortOnError` 옵션을 비활성화한다(예: `NestFactory.create(AppModule, { abortOnError: false })` ).
:::

## 플랫폼 {#platform}

NestJS는 플랫폼에 구애받지 않는 프레임워크를 지향한다. 플랫폼 독립성은 개발자가 여러 유형의 애플리케이션에서 활용할 수 있는 재사용 가능한 논리적 기능을 만들 수 있게 해준다.

기술적으로 NestJS는 어댑터를 생성하면 모든 노드 HTTP 프레임워크와 함께 작동할 수 있다. 기본적으로 [Express](https://expressjs.com/)와 [Fastify](https://www.fastify.io/) 두 HTTP 플랫폼이 지원된다.

| 플랫폼             | 설명                                                                                                                                                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platform-express` | Express는 잘 알려진 미니멀리즘 NodeJS 웹 프레임워크다. 커뮤니티에서 구현한 많은 리소스가 포함된 실전 테스트를 거친 프로덕션에 사용 가능한 라이브러리다. 기본적으로 `@nestjs/platform-express` 패키지가 사용된다. 이 플랫폼을 활성화하기 위해 별도의 조치를 취할 필요가 없다. |
| `platform-fastify` | Fastify는 최대의 효율성과 속도를 제공하는 데 중점을 둔 고성능의 낮은 오버헤드를 지향하는 프레임워크다.                                                                                                                                                                       |

어떤 플랫폼을 사용하든 자체 애플리케이션 인터페이스에 접근할 수 있다. 이는 각각 `NestExpressApplication` 및 `NestFastifyApplication` 으로 표시된다.

아래 예시에서처럼 `NestFactory.create()` 메서드에 타입을 전달하면 `app` 객체에는 해당 특정 플랫폼에서만 사용할 수 있는 메서드가 있다. 그러나 해당 플랫폼 API에 액세스하려는 경우가 아니라면 타입을 지정할 필요는 없다.

```ts
const app = await NestFactory.create<NestExpressApplication>(AppModule);
```

## 애플리케이션 실행하기 {#running-the-application}

설치 프로세스가 완료되면 명령 프롬프트에서 다음 명령을 실행하여 인바운드 HTTP 요청을 수신 대기하는 애플리케이션을 시작할 수 있다:

```bash
npm run start
```

:::tip
개발 프로세스 속도를 높이려면(빌드 속도가 20배 빨라짐) 다음과 같이 시작 스크립트에 `-b swc` 플래그를 전달하여 [SWC 빌더](https://docs.nestjs.com/recipes/swc)를 사용할 수 있다(예: `npm run start -- -b swc`).
:::

위의 명령은 `src/main.ts` 파일에 정의된 포트에서 수신 대기 중인 HTTP 서버로 앱을 시작한다. 애플리케이션이 실행되면 브라우저를 열고 `http://localhost:3000/` 페이지에서 `Hello World!` 메시지를 볼 수 있다.

파일의 변경 사항을 지속적으로 확인하려면 다음 명령을 실행하여 애플리케이션을 시작한다.

```bash
npm run start:dev
```

이 명령은 파일을 감시하여 자동으로 컴파일하고 서버를 로드한다.

## 린팅 & 포매팅 {#linting-and-formatting}

[CLI](https://docs.nestjs.com/cli/overview)는 대규모의 안정적인 개발 워크플로우를 위한 최선의 노력을 제공한다. 따라서 생성된 NestJS 프로젝트에는 코드 린터와 포맷터가 모두 사전 설치되어 있다(각각 `eslint` 와 `prettier` ).

헤드리스 환경(CI, Git Hooks 등)에서 사용하는 경우 프로젝트에 바로 사용할 수 있는 `npm` 스크립트가 함께 제공된다.

```bash
# eslint로 린트 및 자동 수정
npm run lint

# prettier로 포맷팅
npm run format
```
