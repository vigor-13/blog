---
title: 리다이렉팅
description:
date: 2024-02-23
tags: [route]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/routing/redirecting',
    },
  ]
---

Next.js에서 리디렉션을 처리할 수 있는 몇 가지 방법이 있다. 이 페이지에서는 사용 가능한 각 옵션, 사용 사례 및 대량의 리디렉션을 관리하는 방법을 살펴본다.

| API                             | 목적                                         | 위치                                    | 상태 코드                              |
| ------------------------------- | -------------------------------------------- | --------------------------------------- | -------------------------------------- |
| `redirect`                      | 뮤테이션 또는 이벤트 발생 후 사용자 리디렉션 | 서버 컴포넌트, 서버 액션, 라우트 핸들러 | 307 (Temporary) or 303 (Server Action) |
| `permanentRedirect`             | 뮤테이션 또는 이벤트 발생 후 사용자 리디렉션 | 서버 컴포넌트, 서버 액션, 라우트 핸들러 | 308 (Permanent)                        |
| `useRouter`                     | 클라이언트 사이드 네비게이션 수행            | 클라이언트 컴포넌트 내 이벤트 핸들러    | N/A                                    |
| `redirects` in `next.config.js` | 경로를 기반으로 들어오는 요청 리디렉션       | `next.config.js` 파일                   | 307 (Temporary) or 308 (Permanent)     |
| `NextResponse.redirect`         | 조건에 따라 들어오는 request 리디렉션하기    | 미들웨어                                | Any                                    |

## redirect 함수 {#redirect-function}

`redirect` 함수를 사용하면 사용자를 다른 URL로 리디렉션할 수 있다. 서버 컴포넌트, 라우트 핸들러, 서버 액션에서 `redirect` 를 호출할 수 있다.

`redirect` 는 종종 뮤테이션이나 이벤트 이후에 사용된다. 예를 들어 글을 작성하는 경우다:

```tsx
// app/actions.tsx

'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createPost(id: string) {
  try {
    // 데이터베이스 호출
  } catch (error) {
    // 에러 핸들링
  }

  revalidatePath('/posts'); // 캐시된 posts 업데이트
  redirect(`/post/${id}`); // 새 포스트 페이지로 이동
}
```

:::tip

- `redirect` 는 기본적으로 307(Temporary Redirect) 상태 코드를 반환한다. 서버 액션에서 사용하면 303(See Other)을 반환하며, 이는 일반적으로 POST 요청의 결과로 성공 페이지로 리디렉션하는 데 사용된다.
- `redirect` 는 내부적으로 오류를 발생시키므로 `try/catch` 블록 외부에서 호출해야 한다.
- `redirect` 는 렌더링 프로세스 중 클라이언트 컴포넌트에서 호출할 수 있지만 이벤트 핸들러에서는 호출할 수 없다. 대신 [`useRouter` hook](https://nextjs.org/docs/app/building-your-application/routing/redirecting#userouter-hook)을 사용할 수 있다.
- `redirect` 는 절대 URL도 허용하며 외부 링크로 리디렉션하는 데 사용할 수 있다.
  렌더링 프로세스 전에 리디렉션하려면 `next.config.js` 또는 미들웨어를 사용한다.

:::

자세한 내용은 [`redirect` API](https://nextjs.org/docs/app/api-reference/functions/redirect) 를 참조한다.

## permanentRedirect 함수 {#permanent-redirect-function}

`permanentRedirect` 함수를 사용하면 사용자를 다른 URL로 영구적으로 리디렉션할 수 있다. 서버 컴포넌트, 라우트 핸들러, 서버 액션에서 영구 리디렉션을 호출할 수 있다.

`permanentRedirect`은 사용자 이름을 변경한 후 사용자의 프로필 URL을 업데이트하는 등 엔티티의 정식 URL을 변경하는 변경 또는 이벤트 후에 자주 사용된다:

```ts
// app/actions.ts

'use server';

import { permanentRedirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

export async function updateUsername(username: string, formData: FormData) {
  try {
    // 데이터베이스 호출
  } catch (error) {
    // 에러 핸들링
  }

  revalidateTag('username'); // 사용자 아이디에 대한 모든 참조를 업데이트한다.
  permanentRedirect(`/profile/${username}`); // 새 사용자 프로필로 이동한다.
}
```

:::tip

- 영구 리디렉션은 기본적으로 308(permanent redirect) 상태 코드를 반환한다.
- 영구 리디렉션은 절대 URL도 허용하며 외부 링크로 리디렉션하는 데 사용할 수 있다.
- 렌더링 프로세스 전에 리디렉션하려면 `next.config.js` 또는 미들웨어를 사용한다.

:::

자세한 내용은 [`permanentRedirect` API](https://nextjs.org/docs/app/api-reference/functions/permanentRedirect) 를 참조한다.

## useRouter() hook {#userouter-hook}

클라이언트 컴포넌트의 이벤트 핸들러 내부에서 리디렉션해야 하는 경우, `useRouter` hook의 `push` 메서드를 사용할 수 있다. 예를 들어:

```tsx
// app/page.tsx

'use client';

import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  );
}
```

:::tip

- 사용자를 프로그래밍 방식으로 네비게이션할 필요가 없는 경우 `<Link>` 컴포넌트를 사용한다.

:::

자세한 내용은 [`useRouter` API](https://nextjs.org/docs/app/api-reference/functions/use-router) 참조한다.

## next.config.js 파일의 redirects {#redirects-in-next-config-js}

`next.config.js` 파일의 `redirects` 옵션을 사용하면 들어오는 요청 경로를 다른 대상 경로로 리디렉션할 수 있다. 페이지의 URL 구조를 변경하거나 미리 알고 있는 리디렉션 목록이 있을 때 유용하다.

`redirects` 는 path, header, cookie, query matching을 지원하므로 들어오는 요청에 따라 유연하게 사용자를 리디렉션할 수 있다.

리디렉션을 사용하려면 `next.config.js` 파일에 옵션을 추가한다:

```js
// next.config.js

module.exports = {
  async redirects() {
    return [
      // 기본 리디렉션
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
      // 와일드카드 경로 매칭
      {
        source: '/blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
    ];
  },
};
```

자세한 내용은 [`redirects` API](https://nextjs.org/docs/app/api-reference/next-config-js/redirects)를 참조한다.

:::tip

- `redirects` 는 `permanent` 옵션과 함께 307(Temporary Redirect) 또는 308(Permanent Redirect) 상태 코드를 반환할 수 있다.
- `redirects` 는 플랫폼에 따라 제한이 있을 수 있다. 예를 들어, Vercel에서는 리디렉션 수가 1,024개로 제한되어 있다. 많은 수의 리디렉션(1000개 이상)을 관리하려면 미들웨어를 사용하여 사용자 지정 솔루션을 만드는 것을 고려해야 한다. 자세한 내용은 [대규모 리디렉션 관리하기](https://nextjs.org/docs/app/building-your-application/routing/redirecting#managing-redirects-at-scale-advanced)를 참조한다.
- `redirects` 은 미들웨어보다 먼저 실행된다.

:::

## 미들웨어에서 NextResponse.redirect {#nextresponse-redirect-in-middleware}

미들웨어를 사용하면 요청이 완료되기 전에 코드를 실행할 수 있다. 그런 다음 들어오는 요청에 따라 `NextResponse.redirect` 를 사용하여 다른 URL로 리디렉션 한다. 이는 조건(예: 인증, 세션 관리 등)에 따라 사용자를 리디렉션하거나 리디렉션 횟수가 많을 때 유용하다.

예를 들어 사용자가 인증되지 않은 경우 `/login` 페이지로 리디렉션하는 경우다:

```ts
// middleware.ts

import { NextResponse, NextRequest } from 'next/server';
import { authenticate } from 'auth-provider';

export function middleware(request: NextRequest) {
  const isAuthenticated = authenticate(request);

  // 사용자가 인증된 경우 정상적으로 계속 진행한다.
  if (isAuthenticated) {
    return NextResponse.next();
  }

  // 인증되지 않은 경우 로그인 페이지로 리디렉션 한다.
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: '/dashboard/:path*',
};
```

:::tip

- 미들웨어는 `next.config.js` 의 `redirects` 후 렌더링 전에 실행된다.

:::

자세한 내용은 [미들웨어 설명서](https://nextjs.org/docs/app/building-your-application/routing/middleware)를 참조한다.

## 리다이렉트 스케일 관리 (고급) {#managing-redirects-at-scale}

많은 수의 리디렉션(1000개 이상)을 관리하려면 미들웨어를 사용하여 사용자 지정 솔루션을 만들어야 한다. 이렇게 하면 애플리케이션을 다시 배포할 필요 없이 프로그래밍 방식으로 리디렉션을 처리할 수 있다.

이를 위해 다음을 고려해야 한다:

1. 리디렉션 map 만들기 및 저장하기.
2. 데이터 조회 성능 최적화.

### 1. 리디렉션 map 생성 및 저장 {#creating-and-storing-a-redirect-map}

리디렉션 map은 데이터베이스(일반적으로 키-값 저장소) 또는 JSON 파일에 저장할 수 있는 리디렉션 목록이다.

다음과 같은 데이터 구조다:

```json
{
  "/old": {
    "destination": "/new",
    "permanent": true
  },
  "/blog/post-old": {
    "destination": "/blog/post-new",
    "permanent": true
  }
}
```

미들웨어에서는 Vercel의 Edge Config 또는 Redis와 같은 데이터베이스에서 읽고 들어오는 요청에 따라 사용자를 리디렉션할 수 있다:

```ts
// middleware.ts

import { NextResponse, NextRequest } from 'next/server';
import { get } from '@vercel/edge-config';

type RedirectEntry = {
  destination: string;
  permanent: boolean;
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const redirectData = await get(pathname);

  if (redirectData && typeof redirectData === 'string') {
    const redirectEntry: RedirectEntry = JSON.parse(redirectData);
    const statusCode = redirectEntry.permanent ? 308 : 307;
    return NextResponse.redirect(redirectEntry.destination, statusCode);
  }

  // 리디렉션을 찾을 수 없는 경우 리디렉션하지 않고 계속 진행한다.
  return NextResponse.next();
}
```

### 2. 데이터 조회 성능 최적화 {#optimizing-data-lookup-performance}

들어오는 모든 요청에 대해 대규모 데이터 집합을 읽는 것은 느리고 비용이 많이 들 수 있다. 데이터 조회 성능을 최적화할 수 있는 두 가지 방법이 있다:

- 빠른 읽기에 최적화된 데이터베이스(예: Vercel Edge Config 또는 Redis)를 사용한다.
- [Bloom filter](https://en.wikipedia.org/wiki/Bloom_filter)와 같은 데이터 조회 전략을 사용하여 대용량 리디렉션 파일이나 데이터베이스를 읽기 전에 리디렉션이 존재하는지 효율적으로 확인한다.

앞의 예시를 고려하면 생성된 블룸 필터 파일을 미들웨어로 가져온 다음 들어오는 요청 경로명이 블룸 필터에 존재하는지 확인할 수 있다.

존재하는 경우 실제 파일을 확인하고 사용자를 적절한 URL로 리디렉션하는 라우트 핸들러로 요청을 전달한다. 이렇게 하면 모든 수신 요청의 속도를 저하시킬 수 있는 대용량 리디렉션 파일을 미들웨어로 가져오는 것을 방지할 수 있다.

```ts
// middleware.ts

import { NextResponse, NextRequest } from 'next/server';
import { ScalableBloomFilter } from 'bloom-filters';
import GeneratedBloomFilter from './redirects/bloom-filter.json';

type RedirectEntry = {
  destination: string;
  permanent: boolean;
};

// 생성된 JSON 파일로 블룸 필터 초기화하기
const bloomFilter = ScalableBloomFilter.fromJSON(GeneratedBloomFilter as any);

export async function middleware(request: NextRequest) {
  // 들어오는 요청에서 경로 가져오기
  const pathname = request.nextUrl.pathname;

  // 경로가 블룸 필터에 있는지 확인한다
  if (bloomFilter.has(pathname)) {
    // 경로 이름을 라우트 핸들러로 전달한다.
    const api = new URL(
      `/api/redirects?pathname=${encodeURIComponent(request.nextUrl.pathname)}`,
      request.nextUrl.origin,
    );

    try {
      // 라우트 핸들러에서 리디렉션 데이터 가져오기
      const redirectData = await fetch(api);

      if (redirectData.ok) {
        const redirectEntry: RedirectEntry | undefined =
          await redirectData.json();

        if (redirectEntry) {
          // 상태 코드 결정
          const statusCode = redirectEntry.permanent ? 308 : 307;

          // 목적지로 리디렉션
          return NextResponse.redirect(redirectEntry.destination, statusCode);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 리디렉션을 찾을 수 없는 경우 리디렉션하지 않고 요청을 계속 진행한다.
  return NextResponse.next();
}
```

라우트 핸들러 코드:

```ts
// app/redirects/route.ts

import { NextRequest, NextResponse } from 'next/server';
import redirects from '@/app/redirects/redirects.json';

type RedirectEntry = {
  destination: string;
  permanent: boolean;
};

export function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname');
  if (!pathname) {
    return new Response('Bad Request', { status: 400 });
  }

  // redirects.json 파일에서 리디렉션 항목 가져오기
  const redirect = (redirects as Record<string, RedirectEntry>)[pathname];

  // 블룸 필터 오류 처리
  if (!redirect) {
    return new Response('No redirect', { status: 400 });
  }

  // 리디렉션 항목 반환
  return NextResponse.json(redirect);
}
```

:::tip

- 블룸 필터를 생성하려면 [`bloom-filters`](https://www.npmjs.com/package/bloom-filters) 와 같은 라이브러리를 사용할 수 있다.
- 악의적인 요청을 방지하기 위해 라우트 핸들러에 대한 요청의 유효성을 검사해야 한다.

:::
