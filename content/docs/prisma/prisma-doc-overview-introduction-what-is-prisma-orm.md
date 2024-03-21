---
title: Prisma ORM이란?
description:
date: 2024-03-21
tags: []
references:
  [
    {
      key: 'Prisma 공식 문서',
      value: 'https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma',
    },
  ]
---

## Prisma ORM이란 무엇인가? {#what-is-prisma-orm}

Prisma ORM은 차세대 오픈소스 ORM이다. 다음과 같은 부분으로 구성되어 있다:

- **Prisma 클라이언트** : Node.js 및 TypeScript를 위한 자동 생성 및 타입 안전 쿼리 빌더
- **Prisma 마이그레이션** : 마이그레이션 시스템
- **Prisma 스튜디오** : 데이터베이스의 데이터를 보고 편집할 수 있는 GUI.

:::note
**Prisma 스튜디오**는 Prisma ORM에서 유일하게 오픈 소스가 아니다. Prisma 스튜디오는 로컬에서만 실행할 수 있다.
:::

Prisma 클라이언트는 모든 Node.js(지원되는 버전) 또는 TypeScript 백엔드 애플리케이션(서버리스 애플리케이션 및 마이크로서비스 포함)에서 사용할 수 있다. 여기에는 REST API, GraphQL API, gRPC API 또는 데이터베이스가 필요한 모든 것이 포함된다.

https://youtu.be/EEDGwLB55bI

## Prisma ORM의 작동 방식 {#how-does-prisma-orm-work}

### Prisma 스키마 {#the-prisma-schema}

Prisma ORM 도구를 사용하는 모든 프로젝트는 [Prisma 스키마 파일](https://www.prisma.io/docs/orm/prisma-schema)에서 시작한다. Prisma 스키마를 통해 개발자는 직관적인 데이터 모델링 언어로 애플리케이션 모델을 정의할 수 있다. 또한 데이터베이스에 대한 연결이 포함되어 있으며 생성기(generator)를 정의한다:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int?
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}
```

:::note
Prisma 스키마에는 강력한 데이터 모델링 기능이 있다. 예를 들어, "Prisma-level" 에서 [관계 필드](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations)를 정의할 수 있어 Prisma 클라이언트 API에서 관계를 더 쉽게 작업할 수 있다. 위의 경우, `User` 의 `posts` 필드는 "Prisma-level" 에서만 정의되어 있다. 즉, 기본 데이터베이스에 외래 키로 나타나지 않는다.
:::

스키마에서는, 다음이 세 가지를 구성할 수 있다.

- **데이터 소스**: 데이터베이스 연결을 지정한다(환경 변수를 통해).
- **생성기**: Prisma 클라이언트를 생성할지 여부를 나타낸다.
- **데이터 모델**: 애플리케이션 모델을 정의한다.

### Prisma 스키마 데이터 모델 {#the-prisma-schema-data-model}

이 페이지에서는 **데이터 모델**에 초점을 맞추고 있다. [데이터 소스](https://www.prisma.io/docs/orm/prisma-schema/overview/data-sources)와 [생성기](https://www.prisma.io/docs/orm/prisma-schema/overview/generators)에 대한 자세한 내용은 각각의 문서 페이지에서 확인할 수 있다.

#### Prisma 스키마 데이터 모델의 기능 {#functions-of-prisma-schema-data-model}

데이터 모델은 모델들의 집합이다. 모델은 두 가지 주요 기능이 있다:

- 관계형 데이터베이스의 테이블 또는 MongoDB의 컬렉션을 나타낸다.
- Prisma 클라이언트 API의 쿼리를 위한 기초를 제공한다.

#### 데이터 모델 가져오기 {#getting-a-data-model}

데이터 모델을 Prisma 스키마에 "가져오기" 위한 두 가지 주요 워크플로우는 다음과 같다:

- 데이터 모델을 수동으로 작성하고 [Prisma 마이그레이션](https://www.prisma.io/docs/orm/prisma-migrate)으로 데이터베이스에 매핑
- 데이터베이스 [인트로스펙션](https://www.prisma.io/docs/orm/prisma-schema/introspection)을 통해 데이터 모델 생성

데이터 모델이 정의되면, 정의된 모델에 대한 CRUD 및 추가 쿼리를 노출하는 Prisma 클라이언트를 생성할 수 있다. 타입스크립트를 사용한다면 모든 쿼리에 대해 완전한 타입 안전성을 얻게 된다.

### Prisma 클라이언트로 데이터베이스에 접근하기 {#accessing-your-database-with-prisma-client}

#### Prisma 클라이언트 생성하기

Prisma 클라이언트를 사용할 때 첫 번째 단계는 `@prisma/client` npm 패키지를 설치하는 것이다:

```bash
npm install @prisma/client
```

`@prisma/client` 패키지를 설치하면 `prisma generate` 명령이 호출되어, Prisma 스키마를 읽고 Prisma 클라이언트 코드를 _생성_ 한다. 기본적으로 코드는 `node_modules/.prisma/client` 폴더에 생성된다.

데이터 모델을 변경하면 `node_modules/.prisma/client` 내부의 코드가 업데이트되도록 Prisma 클라이언트를 수동으로 다시 생성해야 한다.

```bash
prisma generate
```

#### Prisma 클라이언트를 사용하여 데이터베이스에 쿼리 보내기 {#using-prisma-client-to-send-queries-to-your-database}

Prisma 클라이언트가 생성되면 코드에 임포트하여 데이터베이스로 쿼리를 보낼 수 있다. 설정 코드는 다음과 같다:

##### Prisma 클라이언트 임포트 및 인스턴스화 하기 {#import-and-instantiate-prisma-client}

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
```

이제 생성된 Prisma 클라이언트 API를 통해 쿼리를 보낼 수 있다. 다음은 몇 가지 샘플 쿼리다. 모든 Prisma 클라이언트 쿼리는 _일반 자바스크립트 객체_ 를 반환한다는 점에 유의한다.

더 자세한 내용은 [Prisma 클라이언트 API 참조](https://www.prisma.io/docs/orm/prisma-client) 문서를 이용한다.

##### 데이터베이스에서 모든 User 레코드 가져오기 {#retrieve-all-user-rocords-from-the-database}

```ts
const allUsers = await prisma.user.findMany();
```

##### 반환된 각 User 객체에 posts 포함시키기 {#include-the-posts-relation-on-each-returned-user-object}

```ts
const allUsers = await prisma.user.findMany({
  include: { posts: true },
});
```

##### "Prisma" 문자열을 포함하는 Post 레코드 필터링하기 {#filter-all-post-records-that-contain-prisma}

```ts
const filteredPosts = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: 'prisma' } },
      { content: { contains: 'prisma' } },
    ],
  },
});
```

##### 하나의 쿼리로 User 와 Post 레코드 생성하기 {#create-a-new-user-and-a-post-record-in-the-same-query}

```ts
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@prisma.io',
    posts: {
      create: { title: 'Join us for Prisma Day 2020' },
    },
  },
});
```

##### 기존 Post 레코드 업데이트하기

```ts
const post = await prisma.post.update({
  where: { id: 42 },
  data: { published: true },
});
```

#### 타입스크립트와 함께 사용하기

타입스크립트를 사용할 경우 이 쿼리의 결과는 정적으로 타입화되므로 실수로 존재하지 않는 프로퍼티에 액세스하는 것을 방지할 수 있다(오타가 컴파일 타임에 감지됨).

## Prisma ORM의 일반적인 워크플로우 {#typical-prisma-orm-workflow}

위에서 언급했듯이 데이터 모델을 Prisma 스키마로 '가져오기'하는 방법에는 두 가지가 있다. 어떤 접근 방식을 선택하느냐에 따라 기본 Prisma ORM 워크플로가 달라진다.

### Prisma 마이그레이션 {#prisma-migrate}

Prisma ORM의 통합 데이터베이스 마이그레이션 도구인 Prisma 마이그레이션을 사용하면 다음과 같은 워크플로우를 사용할 수 있다:

1. Prisma 스키마 데이터 모델을 수동으로 작성한다.
2. `prisma migrate dev` CLI 명령을 사용하여 개발 데이터베이스를 마이그레이션한다.
3. 애플리케이션 코드에서 Prisma 클라이언트를 사용하여 데이터베이스 액세스한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/prisma-doc-overview-introduction-what-is-prisma-orm/1.png)

### SQL 마이그레이션과 인트로스펙션 {#sql-migrations-and-introspection}

어떤 이유로 Prisma 마이그레이션을 사용할 수 없거나 원하지 않는 경우에도 인트로스펙션을 사용하여 데이터베이스 스키마에서 Prisma 스키마를 업데이트할 수 있다. SQL 마이그레이션과 인트로스펙션을 사용할 때의 일반적인 워크플로우는 약간 다르다:

1. SQL 또는 타사 마이그레이션 도구를 사용하여 데이터베이스 스키마를 수동으로 작성한다.
2. 데이터베이스 (리)인트로스펙트
3. 선택적으로 Prisma 클라이언트 API (재)구성
4. 프리즈마 클라이언트 (재)생성
5. 애플리케이션 코드에서 Prisma 클라이언트를 사용하여 데이터베이스에 액세스한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/prisma-doc-overview-introduction-what-is-prisma-orm/2.png)
