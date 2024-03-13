---
title: Prisma
description:
date: 2024-03-13
tags: [prisma, orm]
references:
  [{ key: 'NestJS 공식 문서', value: 'https://docs.nestjs.com/recipes/prisma' }]
---

[Primsa](https://docs.nestjs.com/recipes/prisma)는 Node.js 및 타입스크립트용 오픈소스 ORM이다. 일반 SQL이나 SQL 쿼리 빌더(예: knex.js) 또는 ORM(예: TypeORM 및 Sequelize)과 같은 다른 데이터베이스 액세스 도구의 대체제로 사용된다. Prisma는 현재 PostgreSQL, MySQL, SQL Server, SQLite, MongoDB 및 CockroachDB를 지원한다. ([지원 목록](https://www.prisma.io/docs/orm/reference/supported-databases))

Prisma는 일반 자바스크립트와 함께 사용할 수 있지만, 타입스크립트를 포용하며 다른 ORM이 보장하는 수준을 뛰어넘는 수준의 타입 안전성을 제공한다. Prisma와 TypeORM의 타입 안전 보장에 대한 자세한 비교는 [여기](https://www.prisma.io/docs/concepts/more/comparisons/prisma-and-typeorm#type-safety)에서 확인할 수 있다.

:::note
Prisma의 작동 방식에 대한 간략한 개요를 확인하려면 [빠른 시작](https://www.prisma.io/docs/getting-started/quickstart)을 따르거나 [소개](https://www.prisma.io/docs/understand-prisma/introduction) 문서를 참조한다. [prisma-examples](https://github.com/prisma/prisma-examples/) 리포지토리에 바로 실행할 수 있는 REST 및 GraphQL용 예제도 있다.
:::

## 시작하기 {#getting-started}

여기서는 NestJS와 Prisma를 처음부터 시작하는 방법을 배운다. 데이터베이스에서 데이터를 읽고 쓸 수 있는 REST API를 사용하여 샘플 NestJS 애플리케이션을 빌드할 것이다.

이 가이드에서는 데이터베이스 서버를 설정하는 데 드는 오버헤드를 줄이기 위해 [SQLite](https://sqlite.org/) 데이터베이스를 사용한다. PostgreSQL 또는 MySQL을 사용하더라도 이 가이드를 따라갈 수 있으며, 중간 중간에 이러한 데이터베이스를 사용하기 위한 추가 지침을 제공한다.

:::note
이미 기존 프로젝트가 있고 Prisma로 마이그레이션을 고려하고 있다면 [기존 프로젝트에 Prisma 추가](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project-typescript-postgres) 가이드를 참조한다. TypeORM에서 마이그레이션하는 경우 [TypeORM에서 Prisma로 마이그레이션하기](https://www.prisma.io/docs/guides/migrate-to-prisma/migrate-from-typeorm) 가이드를 참조한다.
:::

## NestJS 프로젝트 생성하기 {#create-your-nestjs-project}

먼저 NestJS CLI를 설치하고 다음 명령어를 사용하여 앱 스켈레톤을 생성한다:

```bash
npm install -g @nestjs/cli
nest new hello-prisma
```

이제 `npm start` 를 실행하여 애플리케이션을 시작할 수 있다.

현재 `http://localhost:3000/` 에서는 `src/app.controller.ts` 에 구현된 단일 라우트 REST API 만 사용할 수 있다. 이 가이드를 진행하면서 사용자 및 글에 대한 데이터를 저장하고 검색하는 추가 라우트 API를 구현할 것이다.

## Prisma 설정하기 {#set-up-prisma}

프로젝트에 개발 종속성으로 Prisma CLI를 설치한다:

```bash
cd hello-prisma
npm install prisma --save-dev
```

다음으로 Prisma CLI를 활용할 것이다. 모범 사례로, 접두사 `npx` 를 붙여 로컬에서 CLI를 호출하는 것이 좋다:

```bash
npx prisma
```

이제 Prisma CLI의 `init` 명령을 사용하여 Prisma 초기 설정을 생성한다.

```bash
npx prisma init
```

위의 명령은 다음을 포함하는 새 `prisma` 디렉터리를 생성한다:

- `schema.prisma` : 데이터베이스 연결을 지정하고 데이터베이스 스키마를 포함한다.
- `.env` : 일반적으로 데이터베이스 자격 증명을 환경 변수 그룹에 저장하는 데 사용되는 [dotenv](https://github.com/motdotla/dotenv) 파일이다.

## 데이터베이스 연결 설정하기 {#set-the-database-connection}

데이터베이스 연결은 `schema.prisma` 파일의 `datasource` 블록에 구성된다. 기본적으로 `postgresql` 로 설정되어 있지만 이 가이드에서는 SQLite를 사용하므로 `datasource` 블록의 `provider` 필드를 `sqlite` 로 변경해야 한다:

```text
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

이제 `.env` 를 열고 `DATABASE_URL` 환경 변수를 다음과 같이 수정한다:

```text
DATABASE_URL="file:./dev.db"
```

[`ConfigModule`](https://docs.nestjs.com/techniques/configuration) 이 구성되어 있지 않으면 `.env` 에서 `DATABASE_URL` 변수가 선택되지 않으므로 반드시 확인한다.

> SQLite 데이터베이스는 단순한 파일이므로 서버가 필요하지 않다. 따라서 host와 port로 연결 URL을 구성하는 대신 로컬 파일(이 경우 `dev.db`)을 가리키기만 하면 된다. 이 파일은 다음 단계에서 만들어진다.

### PostgreSQL {#postgresql}

PostgreSQL을 사용하는 경우 다음과 같이 `schema.prisma` 및 `.env` 파일을 조정해야 한다:

- `schema.prisma`

```text
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

- `.env`

```text
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
```

모든 대문자로 된 자리 표시자를 데이터베이스 자격 증명으로 바꾼다. `SCHEMA` 자리에 무엇을 입력해야 할지 잘 모르겠다면 기본값인 `public` 을 입력하는 것이 가장 좋다:

```text
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

PostgreSQL 데이터베이스를 설정하는 방법을 배우고 싶다면 [여기](https://dev.to/prisma/set-up-a-free-postgresql-database-on-supabase-to-use-with-prisma-3pk6)를 참조한다.

## Prisma Migrate로 두 개의 데이터베이스 테이블 생성하기 {#create-two-database-tables-with-prisma-migrate}

이 섹션에서는 [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)을 사용하여 데이터베이스에 두 개의 새 테이블을 만든다. Prisma Migrate는 Prisma 스키마에서 선언적 데이터 모델 정의에 대한 SQL 마이그레이션 파일을 생성한다. 이러한 마이그레이션 파일은 완전히 커스터마이징할 수 있으므로 기본 데이터베이스의 추가 기능을 구성하거나 seeding과 같은 추가 명령을 포함할 수 있다.

다음 두 모델을 `schema.prisma` 파일에 추가한다:

```text
model User {
  id    Int     @default(autoincrement()) @id
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int      @default(autoincrement()) @id
  title     String
  content   String?
  published Boolean? @default(false)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}
```

Prisma 모델이 준비되면 SQL 마이그레이션 파일을 생성하고 데이터베이스에 대해 실행할 수 있다. 터미널에서 다음 명령을 실행한다:

```bash
npx prisma migrate dev --name init
```

이 `prisma migrate dev` 명령은 SQL 파일을 생성하고 데이터베이스에 대해 직접 실행합니다. 이 경우 기존 prisma 디렉터리에 다음과 같은 마이그레이션 파일이 생성되었습니다:

이 `prisma migrate dev` 명령은 SQL 파일을 생성하고 해당 파일을 데이터베이스에 직접 실행한다. 현재 상황에서는 다음과 같은 마이그레이션 파일이 기존의 `prisma` 디렉토리에 생성되었다:

```text
$ tree prisma
prisma
├── dev.db
├── migrations
│   └── 20201207100915_init
│       └── migration.sql
└── schema.prisma
```

## Prisma 클라이언트 설치 및 생성하기 {#install-and-generate-prisma-client}

Prisma 클라이언트는 Prisma 모델 정의에서 생성되는 타입-세이프 데이터베이스 클라이언트다. 이러한 접근 방식 덕분에 Prisma 클라이언트는 모델에 맞게 특별히 맞춤화된 [CRUD](https://www.prisma.io/docs/concepts/components/prisma-client/crud) 작업을 제공할 수 있다.

프로젝트에 Prisma 클라이언트를 설치하려면 터미널에서 다음 명령을 실행한다:

```bash
npm install @prisma/client
```

설치하는 동안 Prisma는 자동으로 `prisma generate` 명령을 호출한다. 이후에는 Prisma 모델을 변경할 때마다 이 명령을 실행하여 생성된 Prisma 클라이언트를 업데이트해야 한다.

:::note
`prisma generate` 명령은 Prisma 스키마를 읽고 생성된 Prisma 클라이언트 라이브러리를 `node_modules/@prisma/client` 내에서 업데이트한다.
:::

## NestJS 서비스에서 Prisma 클라이언트 사용하기 {#use-prisma-client-in-your-nestjs-services}

이제 Prisma 클라이언트로 데이터베이스 쿼리를 보낼 수 있다. Prisma 클라이언트로 쿼리를 작성하는 방법에 대해 자세히 알아보려면 [API 문서](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/crud)를 확인한다.

NestJS 애플리케이션을 설정할 때 서비스 내에서 데이터베이스 쿼리를 위해 Prisma 클라이언트 API를 추상화할 수 있다. 시작하려면 `PrismaClient` 인스턴스화 및 데이터베이스 연결을 처리하는 새 `PrismaService` 를 만들면 된다.

`src` 디렉터리 내에 `prisma.service.ts` 라는 새 파일을 만들고 다음 코드를 추가한다:

```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

:::note
`onModuleInit` 은 선택 사항이며, 이를 생략하면 Prisma는 데이터베이스에 대한 첫 호출 시 지연 연결(lazy connection)을 수행한다.
:::

다음으로 Prisma 스키마의 `User` 및 `Post` 모델에 대한 데이터베이스 호출을 할 수 있는 서비스를 작성할 수 있다.

`src` 디렉터리 안에 `user.service.ts` 라는 새 파일을 만들고 다음 코드를 추가한다:

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
```

Prisma 클라이언트에서 생성된 타입을 사용하여 서비스에 노출되는 메서드가 올바르게 입력되었는지 확인할 수 있다. 따라서 모델을 입력하고 추가 인터페이스 또는 DTO 파일을 생성하는 번거로움을 줄일 수 있다.

이제 `Post` 모델에 대해서도 동일한 작업을 수행한다.

`src` 디렉터리 내에 `post.service.ts` 라는 새 파일을 만들고 다음 코드를 추가한다:

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async post(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
    });
  }

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async updatePost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { data, where } = params;
    return this.prisma.post.update({
      data,
      where,
    });
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
    });
  }
}
```

현재 `UserService` 와 `PostService` 는 Prisma 클라이언트에서 사용할 수 있는 CRUD 쿼리를 래핑한다. 실제 애플리케이션에서 서비스는 애플리케이션에 비즈니스 로직을 추가하는 장소가 되기도 한다. 예를 들어 사용자 비밀번호 업데이트를 담당하는 `updatePassword` 라는 메서드가 `UserService` 내에 있을 수 있다.

**메인 App 컨트롤러에서 REST API 라우트 구현하기**

마지막으로 이전 섹션에서 만든 서비스를 사용하여 앱의 다양한 라우트를 구현한다. 이 가이드에서는 모든 라우트를 이미 존재하는 `AppController` 클래스에 넣는다.

`app.controller.ts` 파일의 내용을 다음 코드로 변경한다:

```ts
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PostService } from './post.service';
import { User as UserModel, Post as PostModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.post({ id: Number(id) });
  }

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.posts({
      where: { published: true },
    });
  }

  @Get('filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
        ],
      },
    });
  }

  @Post('post')
  async createDraft(
    @Body() postData: { title: string; content?: string; authorEmail: string },
  ): Promise<PostModel> {
    const { title, content, authorEmail } = postData;
    return this.postService.createPost({
      title,
      content,
      author: {
        connect: { email: authorEmail },
      },
    });
  }

  @Post('user')
  async signupUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Put('publish/:id')
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @Delete('post/:id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({ id: Number(id) });
  }
}
```

이 컨트롤러는 다음 라우트를 구현한다:

`GET`

- `/post/:id` : `id` 로 단일 포스트를 가져온다.
- `/feed` : 모든 포스트를 가져온다.
- `/filter-posts/:searchString` : 타이틀이나 내용으로 포스트를 필터링하여 가져온다.

`POST`

- `/post` : 새로운 포스트를 생성한다.
  - Body:
    - `title: String` : (필수) 포스트 제목
    - `content: String` : (선택) 포스트 내용
    - `authorEmail: String` : (필수) 포스트를 생성한 사용자의 이메일
- `/user` : 새로운 사용자를 생성한다.
  - Body:
    - `email: String` : (필수) 사용자의 이메일 주소
    - `name: String` : (선택) 사용자의 이름

`PUT`

- `/publish/:id` : `id` 에 해당하는 포스트를 배포한다.

`DELETE`

- `/post/:id` : `id` 에 해당하는 포스트를 삭제한다.

## 요약 {#summary}

여기까지 NestJS와 함께 Prisma를 사용하여 REST API를 구현하는 방법을 배웠다. API의 라우트를 구현하는 컨트롤러는 `PrismaService` 를 호출하고, Prisma 클라이언트를 사용하여 들어오는 요청의 데이터 요구 사항을 충족하기 위해 데이터베이스에 쿼리를 보낸다.

Prisma와 함께 NestJS를 사용하는 방법에 대해 자세히 알아보려면 다음 리소스를 확인한다:

- [NestJS & Prisma](https://www.prisma.io/nestjs)
- [Ready-to-run example projects for REST & GraphQL](https://github.com/prisma/prisma-examples/)
- [Production-ready starter kit](https://github.com/notiz-dev/nestjs-prisma-starter#instructions)
- [Video: Accessing Databases using NestJS with Prisma (5min)](https://www.youtube.com/watch?v=UlVJ340UEuk&ab_channel=Prisma) by [Marc Stammerjohann](https://github.com/marcjulian)
