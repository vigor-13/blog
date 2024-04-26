---
title: Next.js에서 Supabase Auth 사용하기
description: Next.js App Router에서 Supabase Auth를 구성하는 방법을 알아본다.
date: 2024-04-26
tags: [auth, nextjs]
references:
  [
    {
      key: 'Supabase 공식 문서',
      value: 'https://supabase.com/docs/guides/auth/quickstarts/nextjs',
    },
  ]
---

## 1. 새로운 Supabase 프로젝트 생성하기 {#create-a-new-supabase-project}

[database.new](https://database.new/)로 이동하여 새로운 Supabase 프로젝트를 생성한다.

새로 생성된 데이터베이스에는 사용자를 저장할 수 있는 테이블이 있다. [SQL Editor](https://supabase.com/dashboard/project/_/sql/new)에서 SQL을 실행해보면 현재 이 테이블이 비어있음을 확인할 수 있다.

```sql
select * from auth.users;
```

## 2. Next.js 앱 생성하기 {#create-a-nextjs-app}

`create-next-app` 명령어와 `with-supabase` 템플릿을 사용하여 다음과 같이 사전 구성된 Next.js 앱을 생성한다:

- [Cookie-based Auth](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

```bash
npx create-next-app -e with-supabase
```

## 3. Supabase 환경 변수 설정하기 {#declare-supabase-environment-variables}

`.env.local.example` 파일의 이름을 `.env.local` 로 변경하고, 프로젝트의 URL과 Anon Key를 입력한다.

```text
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

프로젝트의 URL과 Anon Key는 Supabase 대시보드의 프로젝트 설정 섹션에서 확인할 수 있다. 이 환경 변수들은 Next.js 앱에서 Supabase 클라이언트를 초기화하는 데 사용된다.

## 앱 시작하기 {#start-the-app}

개발 서버를 시작하고, 브라우저에서 http://localhost:3000 으로 접속하면 `app/page.tsx` 의 내용을 확인할 수 있다.

새로운 사용자를 등록하려면 http://localhost:3000/login 으로 이동하여 `Sign Up Now`를 클릭한다.

다른 인증 방법에 대해서는 [Supabase Auth 문서](https://supabase.com/docs/guides/auth#authentication)를 참고한다.

```bash
npm run dev
```
