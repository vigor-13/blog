---
title: Prisma 클라이언트 설치하기
description:
date: 2024-03-21
tags: [prisma_client]
references:
  [
    {
      key: 'Prisma 공식 문서',
      value: 'https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/install-prisma-client-typescript-postgresql',
    },
  ]
---

## Prisma 클라이언트 설치 및 생성하기 {#install-and-generate-prisma-client}

Prisma 클라이언트를 시작하려면 `@prisma/client` 패키지를 설치한다:

```bash
pnpm add @prisma/client
```

설치 명령은 Prisma 스키마를 읽고 모델에 맞는 Prisma 클라이언트 버전을 생성하는 `prisma generate` 를 호출한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/prisma-doc-start-from-scratch-relational-datablse-install-prisma-client/1.png)

Prisma 스키마를 업데이트할 때마다 `prisma migrate dev` 또는 `prisma db push` 중 하나를 사용하여 데이터베이스 스키마를 업데이트해야 한다. 이렇게 하면 데이터베이스 스키마가 Prisma 스키마와 동기화된 상태로 유지된다. 이 명령은 Prisma 클라이언트도 다시 생성한다.
