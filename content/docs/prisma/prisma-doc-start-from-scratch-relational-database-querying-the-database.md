---
title: 데이터베이스 쿼리하기
description:
date: 2024-03-21
tags: [query]
references:
  [
    {
      key: 'Prisma 공식 문서',
      value: 'https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/querying-the-database-typescript-postgresql',
    },
  ]
---

## Prisma 클라이언트로 첫 쿼리 작성하기 {#write-your-first-query-with-prisma-client}

이제 Prisma 클라이언트를 생성했으니 데이터베이스에서 데이터를 읽고 쓰기 위한 쿼리 작성을 시작할 수 있다. 이 가이드에서는 일반 Node.js 스크립트를 사용하여 Prisma 클라이언트의 몇 가지 기본 기능을 살펴본다.

`index.ts` 파일을 만들고 다음 코드를 추가한다:

```ts
// index.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ... 여기에 프리즈마 클라이언트 쿼리를 작성한다.
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

다음은 코드 스니펫의 각 부분에 대한 간략한 개요다:

1. `@prisma/client` 모듈에서 `PrismaClient` 생성자를 임포트한다.
2. `PrismaClient` 를 인스턴스화 한다.
3. 데이터베이스에 쿼리를 전송하는 `main` 이라는 이름의 `async` 함수를 정의한다.
4. `main` 함수를 호출한다.
5. 스크립트가 종료되면 데이터베이스 연결을 닫는다.

`main` 함수 안에 다음 쿼리를 추가하여 데이터베이스에서 모든 `User` 레코드를 읽고 결과를 프린트한다:

```diff-ts
// index.ts
async function main() {
+  const allUsers = await prisma.user.findMany();
+  console.log(allUsers);
}
```

이제 다음 명령으로 코드를 실행한다:

```bash
npx ts-node index.ts
```

데이터베이스에 아직 `User` 레코드가 없으므로 빈 배열이 프린트되어야 한다:

```bash
[]
```

## 데이터베이스에 데이터 작성하기 {#write-data-into-the-database}

이전 섹션에서 사용한 `findMany` 쿼리는 데이터베이스에서 데이터를 읽기만 한다. 이 섹션에서는 `Post` 및 `User` 테이블에 새 레코드를 작성하는 쿼리를 작성하는 방법을 배운다.

`main` 함수를 수정하여 데이터베이스에 `create` 쿼리를 전송한다:

```diff-ts
// index.ts
async function main() {
+  await prisma.user.create({
+    data: {
+      name: 'Alice',
+      email: 'alice@prisma.io',
+      posts: {
+        create: { title: 'Hello World' },
+      },
+      profile: {
+        create: { bio: 'I like turtles' },
+      },
+    },
+  });
+
+  const allUsers = await prisma.user.findMany({
+    include: {
+      posts: true,
+      profile: true,
+    },
+  });
+  console.dir(allUsers, { depth: null });
}
```

이 코드는 [중첩된 쓰기 쿼리](https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes)를 사용하여 새 `Post` 및 `Profile` 레코드와 함께 새 `User` 레코드를 만든다. `User` 레코드는 각각 `Post.author` ↔ `User.posts` 및 `Profile.user` ↔ `User.profile` [관계 필드](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations#relation-fields)를 통해 다른 두 레코드에 연결된다.

반환된 `User` 객체에 `Post` 및 `Profile` 관계를 포함하도록 Prisma 클라이언트에 지시하는 `include` 옵션을 `findMany` 에 전달하고 있다는 점에 유의한다.

아래의 명령으로 코드를 실행한다:

```bash
npx ts-node index.ts
```

출력은 다음과 같다:

```json
[
  {
    email: 'alice@prisma.io',
    id: 1,
    name: 'Alice',
    posts: [
      {
        content: null,
        createdAt: 2020-03-21T16:45:01.246Z,
        updatedAt: 2020-03-21T16:45:01.246Z,
        id: 1,
        published: false,
        title: 'Hello World',
        authorId: 1,
      }
    ],
    profile: {
      bio: 'I like turtles',
      id: 1,
      userId: 1,
    }
  }
]
```

앞선 쿼리는 `User` 및 `Post` 테이블에 새 레코드를 추가한다:

**User**

| id  | email             | name    |
| --- | ----------------- | ------- |
| `1` | `alice@prisma.io` | `Alice` |

**Post**

| id  | createdAt                  | updatedAt                  | title         | content | published | authorId |
| --- | -------------------------- | -------------------------- | ------------- | ------- | --------- | -------- |
| `1` | `2020-03-21T16:45:01.246Z` | `2020-03-21T16:45:01.246Z` | `Hello World` | `null`  | `false`   | `1`      |

**Profile**

| id  | bio              | userId |
| --- | ---------------- | ------ |
| `1` | `I like turtles` | `1`    |

:::note
`Post` 의 `authorId` 열과 `Profile` 의 `userId` 열의 숫자는 모두 `User` 테이블의 `id` 열을 참조하므로 `id` 값 `1` 열은 데이터베이스의 첫 번째(그리고 유일한) `User` 레코드를 참조한다.
:::

다음 섹션으로 넘어가기 전에 업데이트 쿼리를 사용하여 방금 만든 `Post` 레코드를 '게시' 해보자.

다음과 같이 `main` 함수를 수정한다:

```ts
// index.ts
async function main() {
  const post = await prisma.post.update({
    where: { id: 1 },
    data: { published: true },
  });
  console.log(post);
}
```

이제 이전과 동일한 명령을 사용하여 코드를 실행한다:

```bash
npx ts-node index.ts
```

다음과 같은 출력이 표시된다:

```json
{
  "id": 1,
  "title": "Hello World",
  "content": null,
  "published": true,
  "authorId": 1
}
```

이제 `id` 가 `1` 인 `Post` 레코드가 데이터베이스에서 업데이트되었다:

| id  | title         | content | published | authorId |
| --- | ------------- | ------- | --------- | -------- |
| `1` | `Hello World` | `null`  | `true`    | `1`      |

좋다, Prisma 클라이언트를 사용하여 처음으로 데이터베이스에 새 데이터를 작성했다 🚀.
