---
title: 데이터 모델링
description:
date: 2024-03-22
tags: []
references:
  [
    {
      key: 'Prisma 공식 문서',
      value: 'https://www.prisma.io/docs/orm/overview/introduction/data-modeling',
    },
  ]
---

데이터 모델링이라는 용어는 **애플리케이션에서 객체의 모양과 구조를 정의하는 프로세스**를 말하며, 이러한 객체를 흔히 "애플리케이션 모델"이라고 한다. 관계형 데이터베이스(예: PostgreSQL)에서는 테이블에 저장된다. 문서 데이터베이스(예: MongoDB)를 사용하는 경우에는 컬렉션에 저장된다.

애플리케이션의 도메인에 따라 모델이 달라진다. 예를 들어 블로그 애플리케이션을 작성하는 경우 블로그, 작성자, 기사 등의 모델이 있을 수 있다. 차량 공유 앱을 작성할 때는 운전자, 차량, 경로와 같은 모델이 있을 수 있다. 애플리케이션 모델을 사용하면 각각의 데이터 구조를 생성하여 코드에서 이러한 다양한 엔티티를 나타낼 수 있다.

데이터를 모델링할 때 일반적으로 다음과 같은 질문을 하게 된다:

- 애플리케이션의 주요 엔티티/개념은 무엇인가?
- 서로 어떻게 관련되어 있나?
- 주요 특징/속성은 무엇인가?
- 내 기술 스택으로 어떻게 표현할 수 있는가?

## Prisma ORM을 사용하지 않고 데이터 모델링하기 {#data-modeling-without-prisma-orm}

데이터 모델링은 일반적으로 (최소한) 두 가지 수준에서 이루어져야 한다:

- **데이터베이스** 수준
- **애플리케이션** 수준(즉, 프로그래밍 언어)

애플리케이션 모델이 두 수준에서 표현되는 방식은 몇 가지 이유로 인해 다를 수 있다:

- 데이터베이스와 프로그래밍 언어는 서로 다른 데이터 유형을 사용한다.
- 데이터베이스에서 관계는 프로그래밍 언어와 다르게 표현된다.
- 데이터베이스에는 일반적으로 인덱스, 계단식 삭제 또는 다양한 추가 제약 조건(예: unique, not null...)과 같은 더 강력한 데이터 모델링 기능이 있다.
- 데이터베이스와 프로그래밍 언어에는 서로 다른 기술적 제약이 있다.

### 데이터베이스 수준에서의 데이터 모델링 {#data-modeling-on-the-database-level}

#### 관계형 데이터베이스 {#relational-database}

관계형 데이터베이스에서 모델은 테이블로 표현된다. 예를 들어, 애플리케이션의 사용자에 대한 정보를 저장하기 위해 사용자 테이블을 정의할 수 있다. PostgreSQL을 사용하면 다음과 같이 정의할 수 있다:

```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  isAdmin BOOLEAN NOT NULL DEFAULT false
);
```

임의의 데이터가 포함된 사용자 테이블의 시각적으로 표현하면 다음과 같다:

| `user_id` | `name`  | `email`           | `isAdmin` |
| --------- | ------- | ----------------- | --------- |
| `1`       | `Alice` | `alice@prisma.io` | `false`   |
| `2`       | `Bob`   | `bob@prisma.io`   | `false`   |
| `3`       | `Sarah` | `sarah@prisma.io` | `true`    |

여기에는 다음과 같은 열이 있다:

- `user_id` : 사용자 테이블에 새 레코드가 생길 때마다 증가하는 정수다. 또한 각 레코드의 기본 키를 나타낸다.
- `name` : 최대 255자의 문자열이다.
- `email` : 최대 255자의 문자열이다. 또한 추가된 제약 조건은 두 레코드가 `email` 열에 대해 중복된 값을 가질 수 없으며 모든 레코드에 해당 값이 있어야 함을 나타낸다.
- `isAdmin` : 사용자에게 관리자 권한이 있는지 여부를 나타내는 부울이다(기본값: `false`).

#### MongoDB {#mongodb}

MongoDB 데이터베이스에서 모델은 컬렉션으로 표현되며 어떤 구조든 가질 수 있는 문서를 포함한다:

```json
{
  "_id": "607ee94800bbe41f001fd568",
  "slug": "prisma-loves-mongodb",
  "title": "Prisma <3 MongoDB",
  "body": "This is my first post. Isn't MongoDB + Prisma awesome?!"
}
```

Prisma 클라이언트는 현재 일관된 모델과 [정규화된 모델 디자인](https://www.mongodb.com/docs/manual/data-modeling/#link-related-data)을 기대한다. 이는 곧

- 모델 또는 필드가 Prisma 스키마에 없는 경우 무시된다.
- 필드가 필수 항목이지만 MongoDB 데이터 세트에 없는 경우 오류가 발생한다.

### 애플리케이션 수준에서의 데이터 모델링 {#data-modeling-on-the-application-level}

애플리케이션 도메인의 엔티티를 나타내는 테이블을 만드는 것 외에도 프로그래밍 언어로 애플리케이션 모델을 만들어야 한다. 객체 지향 언어에서는 모델을 나타내는 클래스를 생성하여 이 작업을 수행하는 경우가 많다. 프로그래밍 언어에 따라 인터페이스나 구조체를 사용하여 이 작업을 수행할 수도 있다.

데이터베이스의 테이블과 코드에서 정의한 모델 사이에는 강한 상관관계가 있는 경우가 많다.

예를 들어 앞서 언급한 사용자 테이블의 레코드를 애플리케이션에서 표현하기 위해 다음과 유사한 JavaScript(ES6) 클래스를 정의할 수 있다:

```js
class User {
  constructor(user_id, name, email, isAdmin) {
    this.user_id = user_id;
    this.name = name;
    this.email = email;
    this.isAdmin = isAdmin;
  }
}
```

TypeScript를 사용하는 경우 인터페이스를 대신 정의할 수 있다:

```ts
interface User {
  user_id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}
```

두 경우 모두에서 사용자 모델이 이전 예제의 사용자 테이블과 동일한 속성을 가지고 있음을 알 수 있다. 데이터베이스 테이블과 애플리케이션 모델은 서로 1:1로 매핑되는 경우가 많지만, 데이터베이스와 애플리케이션에서 모델이 완전히 다르게 표현되는 경우도 있다.

위의 설정을 사용하면 `users` 테이블에서 레코드를 검색하여 `User` 타입의 인스턴스로 저장할 수 있다. 다음 예제 코드 스니펫은 PostgreSQL용 드라이버로 `pg` 를 사용하고 위에 정의된 JavaScript 클래스를 기반으로 `User` 인스턴스를 만든다:

```ts
const resultRows = await client.query('SELECT * FROM users WHERE user_id = 1');
const userData = resultRows[0];
const user = new User(
  userData.user_id,
  userData.name,
  userData.email,
  userData.isAdmin,
);
// user = {
//   user_id: 1,
//   name: "Alice",
//   email: "alice@prisma.io",
//   isAdmin: false
// }
```

> 이 예제에서 애플리케이션 모델은 로직을 구현하지 않고 데이터를 일반 자바스크립트 객체로 전달하는 것이 유일한 목적인 더미 모델이라는 점에 유의한다.

### 기존 ORM으로 데이터 모델링하기 {#data-modeling-with-orms}

ORM은 개발자가 데이터베이스로 더 쉽게 작업할 수 있도록 하기 위해 일반적으로 객체 지향 언어에서 사용된다. ORM의 주요 특징은 데이터베이스의 테이블에 매핑되는 클래스 측면에서 애플리케이션 데이터를 모델링할 수 있다는 점이다.

위에서 설명한 접근 방식과 가장 큰 차이점은 이러한 클래스가 데이터를 전달할 뿐만 아니라 상당한 양의 로직을 구현한다는 점이다. 대부분 저장, 검색, 직렬화 및 역직렬화를 위한 것이지만 때로는 애플리케이션에 특정한 비즈니스 로직을 구현하기도 한다.

즉, 데이터베이스에서 데이터를 읽고 쓰기 위해 SQL 문을 작성하지 않고 대신 모델 클래스의 인스턴스가 데이터를 저장하고 검색하는 API를 제공한다.

[Sequelize](https://sequelize.org/)는 Node.js 에코시스템에서 널리 사용되는 ORM이다. Sequelize의 모델링 접근 방식을 사용하여 이전 섹션과 동일한 `User` 모델을 정의하는 방법은 다음과 같다:

```ts
class User extends Model {}
User.init(
  {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING(255),
    email: {
      type: Sequelize.STRING(255),
      unique: true,
    },
    isAdmin: Sequelize.BOOLEAN,
  },
  { sequelize, modelName: 'user' },
);
```

이 `User` 클래스가 포함된 예제를 작동시키려면 데이터베이스에 해당 테이블을 만들어야 한다. Sequelize를 사용하면 두 가지 방법으로 이 작업을 수행할 수 있다:

- `User.sync()` 실행(일반적으로 프로덕션 환경에서는 권장하지 않음)
- Sequelize 마이그레이션을 사용하여 데이터베이스 스키마를 변경한다.

이전 섹션에서 설명한 것처럼 `User` 클래스를 수동으로 인스턴스화(`new User(...)`)하지 않고 `User` 클래스에서 정적 메서드를 호출한 다음 `User` 모델 인스턴스를 반환한다는 점에 유의한다:

```ts
const user = await User.findByPk(42);
```

`findByPk` 를 호출하면 ID 값 `42` 로 식별되는 `User` 레코드를 검색하는 SQL 문이 생성된다.

결과 `user` 객체는 Sequelize의 `Model` 클래스 인스턴스다(`User`는 `Model`에서 상속되므로). 이 객체는 POJO가 아니라 Sequelize의 추가 동작을 구현하는 객체다.

## Prisma ORM으로 데이터 모델링하기 {#data-modeling-with-prisma-orm}

애플리케이션에서 Prisma ORM의 어느 부분을 사용하느냐에 따라 데이터 모델링 흐름이 약간 달라진다. 다음 두 섹션에서는 Prisma 클라이언트만 사용하는 경우와 Prisma 클라이언트와 Prisma 마이그레이션을 사용하는 경우의 워크플로우를 설명한다.

하지만 어떤 접근 방식을 사용하든 Prisma ORM을 사용하면 프로그래밍 언어로 클래스, 인터페이스 또는 구조체를 수동으로 정의하여 애플리케이션 모델을 만들지 않는다. 대신 애플리케이션 모델은 [Prisma 스키마](https://www.prisma.io/docs/orm/prisma-schema)에 정의된다:

- **Prisma 클라이언트만 사용하는 경우**: Prisma 스키마의 애플리케이션 모델은 데이터베이스 스키마의 인트로스펙션을 기반으로 생성된다. 데이터 모델링은 주로 데이터베이스 수준에서 이루어진다.
- **Prisma 클라이언트 및 Prisma 마이그레이션**: 데이터 모델링은 애플리케이션 모델을 Prisma 스키마에 수동으로 추가하여 이루어진다. Prisma 마이그레이션은 이러한 애플리케이션 모델을 데이터베이스의 테이블에 매핑한다(현재는 관계형 데이터베이스에만 지원됨).

예를 들어, 이전 예제의 `User` 모델은 Prisma 스키마에서 다음과 같이 표현된다:

```prisma
model User {
  user_id Int     @id @default(autoincrement())
  name    String?
  email   String  @unique
  isAdmin Boolean @default(false)
}
```

애플리케이션 모델이 인트로스펙션을 통해 추가되었든 사용자가 수동으로 추가했든 관계없이 Prisma 스키마에 추가되면, 다음 단계는 일반적으로 애플리케이션 모델의 형태로 데이터를 읽고 쓸 수 있는 프로그래밍 방식 및 타입 안전 API를 제공하는 Prisma 클라이언트를 생성하는 것이다.

Prisma 클라이언트는 [타입스크립트 타입 별칭](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)을 사용하여 코드에서 애플리케이션 모델을 표현한다. 예를 들어, 생성된 Prisma 클라이언트 라이브러리에서 `User` 모델은 다음과 같이 표현된다:

```ts
export declare type User = {
  id: number;
  name: string | null;
  email: string;
  isAdmin: boolean;
};
```

생성된 타입 외에도 Prisma 클라이언트는 `@prisma/client` 패키지를 설치한 후 사용할 수 있는 데이터 액세스 API도 제공한다:

```ts
import { PrismaClient } from '@prisma/client'
// or
// const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// use inside an `async` function to `await` the result
await prisma.user.findUnique(...)
await prisma.user.findMany(...)
await prisma.user.create(...)
await prisma.user.update(...)
await prisma.user.delete(...)
await prisma.user.upsert(...)
```

### Prisma 클라이언트만 사용하는 경우 {#using-only-prisma-client}

애플리케이션에서 Prisma 마이그레이션을 사용하지 않고 Prisma 클라이언트만 사용하는 경우, 데이터 모델링은 SQL을 통해 데이터베이스 수준에서 이루어져야 한다. SQL 스키마가 준비되면 Prisma의 인트로스펙션 기능을 사용하여 애플리케이션 모델을 Prisma 스키마에 추가한다. 마지막으로, 데이터베이스에서 데이터를 읽고 쓸 수 있도록 타입과 프로그래밍 API를 생성하는 Prisma 클라이언트를 생성한다.

다음은 주요 워크플로우에 대한 개요다:

1. SQL을 사용하여 데이터베이스 스키마를 변경한다(예: `CREATE TABLE` , `ALTER TABLE` , ...).
2. `prisma db pull` 을 실행하여 데이터베이스를 인트로스펙트하고 애플리케이션 모델을 Prisma 스키마에 추가한다.
3. `prisma generate` 를 실행하여 Prisma 클라이언트 API 업데이트한다.

### Prisma 클라이언트와 Prisma 마이그레이션을 함께 사용하는 경우 {#using-prisma-client-and-prisma-migrate}

Prisma 마이그레이션을 사용할 때는 Prisma 스키마에서 애플리케이션을 정의하고 관계형 데이터베이스의 경우 `prisma migrate` 명령을 사용하여 일반 SQL 마이그레이션 파일을 생성한 다음 적용하기 전에 편집할 수 있다. MongoDB의 경우, 대신 `prisma db push` 를 사용하여 데이터베이스에 직접 변경 사항을 적용한다.

다음은 주요 워크플로우에 대한 개요다:

1. Prisma 스키마에서 애플리케이션 모델을 수동으로 변경한다(예: 새 모델 추가, 기존 모델 제거 등).
2. 마이그레이션을 생성 및 적용하려면 `prisma migrate dev` 를 실행하거나 변경 사항을 직접 적용하려면 `prisma db push` 를 실행한다(두 경우 모두 Prisma 클라이언트가 자동으로 생성됨).
