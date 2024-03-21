---
title: 데이터베이스 연결하기
description:
date: 2024-03-21
tags: [relational_database]
references:
  [
    {
      key: 'Prisma 공식 문서',
      value: 'https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql',
    },
  ]
---

## 데이터베이스 연결하기 {#connect-your-database}

데이터베이스를 연결하려면 프리즈마 스키마에서 `datasource` 블록의 `url` 필드를 데이터베이스 [연결 URL](https://www.prisma.io/docs/orm/reference/connection-urls)로 설정해야 한다:

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

이 경우 `URL` 은 `.env` 에 정의된 [환경 변수](https://www.prisma.io/docs/orm/more/development-environment/environment-variables)를 통해 설정된다:

```text
// .env

DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

:::note
환경 변수가 커밋되는 것을 방지하려면 `.gitignore` 파일에 `.env` 를 추가한다.
:::

이제 자체 데이터베이스를 가리키도록 연결 URL을 조정해야 한다.

데이터베이스의 연결 URL 형식은 사용하는 데이터베이스에 따라 다르다.

PostgreSQL의 경우 다음과 같다(철자가 모두 대문자로 된 부분은 특정 연결 세부 정보를 위한 자리 표시자다).

```text
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

다음은 각 구성 요소에 대한 간단한 설명이다.

| 구성요소   | 설명                                                                     |
| ---------- | ------------------------------------------------------------------------ |
| `USER`     | 데이터베이스 사용자 이름                                                 |
| `PASSWORD` | 데이터베이스 사용자 비밀번호                                             |
| `HOST`     | 호스트 이름(로컬 환경의 경우 `localhost` )                               |
| `PORT`     | 데이터베이스 서버가 실행 중인 포트(일반적으로 PostgreSQL의 경우 `5432` ) |
| `DATABASE` | 데이터베이스 이름                                                        |
| `SCHEMA`   | 데이터베이스 내부의 스키마 이름                                          |

PostgreSQL 연결 URL의 `schema` 파라미터에 무엇을 제공해야 할지 잘 모르겠다면 생략할 수 있다. 이 경우 기본 스키마 이름인 `public` 이 사용된다.

예를 들어 Heroku에서 호스팅되는 PostgreSQL 데이터베이스의 경우 연결 URL은 다음과 같다:

```text
DATABASE_URL="postgresql://opnmyfngbknppm:XXX@ec2-46-137-91-216.eu-west-1.compute.amazonaws.com:5432/d50rgmkqi2ipus?schema=hello-prisma"
```

macOS에서 로컬로 PostgreSQL을 실행하는 경우 사용자 및 비밀번호와 데이터베이스 이름은 일반적으로 OS의 현재 사용자와 일한다(예: 사용자가 `janedoe` 라고 가정):

```text
DATABASE_URL="postgresql://janedoe:janedoe@localhost:5432/janedoe?schema=hello-prisma"
```
