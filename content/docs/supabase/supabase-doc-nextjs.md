---
title: Next.js에서 Supabase 사용하기
description: Supabase 프로젝트를 생성하고, 샘플 데이터를 추가하고, Next.js 앱에서 쿼리하는 방법을 알아본다.
date: 2024-04-26
tags: [nextjs]
references:
  [
    {
      key: 'Supabase 공식 문서',
      value: 'https://supabase.com/docs/guides/getting-started/quickstarts/nextjs',
    },
  ]
---

## 1. Supabase 프로젝트 설정하기 {#set-up-a-supabase-project}

[database.new](https://database.new/)로 이동하여 새로운 Supabase 프로젝트를 생성한다.

프로젝트가 실행되면, [Table Editor](https://supabase.com/dashboard/project/_/editor) 로 이동하여 새 테이블을 생성하고 데이터를 삽입한다.

또는, 프로젝트의 [SQL Editor](https://supabase.com/dashboard/project/_/sql/new)에서 다음 스니펫을 실행할 수 있다. 이렇게 하면 샘플 데이터가 포함된 `notes` 테이블이 생성된다.

```sql
 -- Create the table
 create table notes (
   id serial primary key,
   title text
 );

 -- Insert some sample data
 insert into notes (title)
 values
   ('Today I created a Supabase project.'),
   ('I added some data and queried it from Next.js.'),
   ('It was awesome!');
```

## 2. Next.js 앱 생성하기 {#create-a-nextjs-app}

`create-next-app` 명령어와 `with-supabase` 템플릿을 사용하여 다음과 같이 사전 구성된 Next.js 앱을 생성한다:

- [쿠키 기반 인증](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

```bash
npx create-next-app -e with-supabase
```

## 3. Supabase 환경 변수 선언하기 {#decalre-supabase-environment-variables}

`.env.example` 파일의 이름을 `.env.local` 로 변경하고 Supabase 연결 변수를 입력한다:

```env
NEXT_PUBLIC_SUPABASE_URL=<SUBSTITUTE_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUBSTITUTE_SUPABASE_ANON_KEY>
```

## 4. Next.js에서 Supabase 데이터 쿼리하기 {#query-supabase-data-from-nextjs}

`app/notes/page.tsx` 에 새 파일을 생성하고 다음 코드를 입력한다.

이렇게 하면 Supabase의 `notes` 테이블에서 모든 행을 선택하고 페이지에 렌더링한다.

:::tabs

@tab:active app/notes/page.tsx#page

```tsx
import { createClient } from '@/utils/supabase/server';

export default async function Notes() {
  const supabase = createClient();
  const { data: notes } = await supabase.from('notes').select();

  return <pre>{JSON.stringify(notes, null, 2)}</pre>;
}
```

@tab utils/supabase/server.ts#server

```ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
```

:::

## 5. 앱 시작하기

개발 서버를 실행하고, 브라우저에서 http://localhost:3000/notes로 이동하면 노트 목록을 볼 수 있다.

```bash
npm run dev
```
