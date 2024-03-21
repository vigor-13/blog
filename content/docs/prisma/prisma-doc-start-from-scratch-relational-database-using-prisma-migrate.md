---
title: Prisma 마이그레이션 사용하기
description:
date: 2024-03-21
tags: [migration]
references:
  [
    {
      key: 'Prisma 공식 문서',
      value: 'https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-typescript-postgresql',
    },
  ]
---

## 데이터베이스 스키마 생성하기 {#creating-the-database-schema}

이 가이드에서는 Prisma 마이그레이션을 사용하여 데이터베이스에 테이블을 만든다.

`prisma/schema.prisma` 파일에 다음 데이터 모델을 추가한다:

```prisma
// prisma/schema.prisma
model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String   @db.VarChar(255)
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  user   User    @relation(fields: [userId], references: [id])
  userId Int     @unique
}

model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  posts   Post[]
  profile Profile?
}
```

데이터 모델을 데이터베이스 스키마에 매핑하려면 `prisma migrate` CLI 명령을 사용 한다:

```bash
npx prisma migrate dev --name init
```

이 명령은 두 가지 작업을 수행한다:

1. 새 SQL 마이그레이션 파일을 생성한다.
2. 데이터베이스에 SQL 마이그레이션 파일을 실행한다.

:::note
`generate` 은 기본적으로 `prisma migrate dev` 를 실행한 후 내부에서 호출된다. 스키마에 `prisma-client-js` 생성기가 정의되어 있는 경우 `@prisma/client` 가 설치되어 있는지 확인하고 누락된 경우 이를 설치한다.
:::

이제 Prisma 마이그레이션으로 데이터베이스에 3개의 테이블을 만들었다 🚀.

```sql
CREATE TABLE "Post" (
  "id" SERIAL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "content" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "authorId" INTEGER NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE "Profile" (
  "id" SERIAL,
  "bio" TEXT,
  "userId" INTEGER NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE "User" (
  "id" SERIAL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Profile.userId_unique" ON "Profile"("userId");
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
ALTER TABLE "Post" ADD FOREIGN KEY("authorId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Profile" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```
