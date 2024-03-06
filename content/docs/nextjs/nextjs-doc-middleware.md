---
title: 미들웨어
description:
date: 2024-03-06
tags: [route]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/routing/middleware',
    },
  ]
---

미들웨어는 요청이 완료되기 전에 지정된 코드를 실행한다. 그런 다음 들어오는 요청을 기반으로 응답을 수정하거나, 리다이렉트하거나, 요청 또는 응답 헤더를 수정하거나, 직접 응답할 수 있다.

미들웨어는 캐시된 컨텐츠와 라우트가 일치하기 전에 실행된다. 자세한 내용은 아래에서 확인한다.

## 컨벤션 {#convention}

프로젝트의 루트에서 `middleware.ts`(또는 `.js`) 파일을 사용하여 미들웨어를 정의한다. 예를 들어 `pages` 나 `app` 과 같은 수준 또는 가능한 경우 `src` 안에 정의한다.

## 예제 {#example}

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 함수 내에서 await을 사용하는 경우 async를 붙여야 한다.
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url));
}

// 아래의 섹션을 확인한다.
export const config = {
  matcher: '/about/:path*',
};
```

## 일치하는 경로 {#matching-paths}

프로젝트의 모든 라우트에 대해 미들웨어가 호출된다. 실행 순서는 다음과 같다:

1. `next.config.js` 의 `headers`
2. `next.config.js` 의 `redirects`
3. Middleware ( `rewrites` , `redirects` , 등)
4. `next.config.js` 의 `beforeFiles` ( `rewrites` )
5. 파일시스템 라우트 ( `public/` , `_next/static/` , `pages/` , `app/` 등)
6. `next.config.js` 의 `afterFiles `( `rewrites` )
7. 동적 라우트 ( `/blog/[slug]` )
8. `next.config.js` 의 `fallback` ( `rewrites` )

미들웨어가 실행될 경로를 정의하는 방법은 두 가지가 있다:

- 커스텀 matcher 설정
- 조건문

### Matcher {#matcher}

`matcher` 를 사용하면 특정 경로에서 실행되도록 미들웨어를 필터링할 수 있다.

```js
// middleware.js
export const config = {
  matcher: '/about/:path*',
};
```

단일 경로 또는 여러 경로를 배열 구문으로 일치시킬 수 있다:

```js
// middleware.js
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
};
```

`matcher` 구성은 전체 정규식을 허용하므로 네거티브 룩헤드(negative lookhead) 또는 문자 매칭이 지원된다. 특정 경로를 제외한 모든 경로를 일치시키는 네거티브 룩헤드의 예는 다음과 같다:

```js
// middleware.js
export const config = {
  matcher: [
    /*
     * 다음과 같은 경로를 제외한 모든 요청 경로를 일치시킨다:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

`missing` 배열을 사용하여 미들웨어를 거칠 필요가 없는 프리페치(`next/link`)를 무시할 수도 있다:

```js
// middleware.js
export const config = {
  matcher: [
    /*
     * 다음과 같은 경로를 제외한 모든 요청 경로를 일치시킨다:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
```

:::note
`matcher` 값은 빌드 시 정적으로 분석할 수 있도록 상수여야 한다. 변수와 같은 동적 값은 무시된다.
:::

matcher는 다음과 같이 구성되어야 한다:

1. 반드시 `/` 로 시작해야 한다.
2. 명명된 파라미터를 포함할 수 있다: `/about/:path` 는 `/about/a` 및 `/about/b` 와 일치하지만 `/about/a/c` 는 일치하지 않는다.
3. 명명된 파라미터에 수정자(modifier)를 사용할 수 있다( `:` 로 시작): `about/:path*` 는 `*` 가 `0` 이상이기 때문에 `/about/a/b/c` 와 일치한다. `?` 는 `0` 또는 `1` 이고 `+` 는 1 이상이다.
4. 괄호로 묶은 정규식을 사용할 수 있다: `/about/(.*)` 은 `/about/:path*` 와 동일하다.

:::tip
이전 버전과의 호환성을 위해 Next.js는 항상 `/public` 을 `/public/index` 로 간주한다. 따라서 `/public/:path` 의 matcher가 일치한다.
:::

### 조건문 {#conditional-statements}

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url));
  }
}
```

## NextResponse {#next-response}

`NextResponse` API를 사용하면 다음을 할 수 있다:

- 들어오는 요청을 다른 URL로 `redirect` 한다.
- 지정된 URL을 표시하여 응답을 다시 `rewrite` 한다.
- API 라우트, `getServerSideProps` 및 `rewrite` 대상에 대한 요청 헤더 설정
- 응답 쿠키 설정
- 응답 헤더 설정

미들웨어에서 응답을 생성하려면 다음과 같이 할 수 있다:

1. 응답을 생성하는 라우트(페이지 또는 라우트 핸들러)로 `rewrite` 한다.
2. `NextResponse` 를 직접 반환한다.

## 쿠키 사용하기 {#using-cookies}

쿠키는 일반적인 헤더다. `Request` 에서는 쿠키가 `Cookie` 헤더에 저장되며, `Response` 에서는 `Set-Cookie` 헤더에 위치한다. Next.js는 `NextRequest` 와 `NextResponse` 의 `cookies` 를 통해 이러한 쿠키에 쉽게 액세스하고 조작할 수 있는 편리한 방법을 제공한다.

1. 들어오는 요청에 대한 `cookies` 는 다음과 같은 메서드를 가지고 있다: `get` , `getAll` , `set` , `delete` . `has` 메서드를 사용하여 쿠키의 존재 여부를 확인하거나, `clear` 메서드를 사용하여 모든 쿠키를 제거할 수 있다.

2. 나가는 응답에 대한 `cookies` 는 다음과 같은 메서드를 가지고 있다: `get` , `getAll` , `set` , `delete` 다.

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // `RequestCookies` API를 사용하여 요청에서 쿠키를 가져오는 경우
  // 요청에 "Cookie: nextjs=fast" 헤더가 있다고 가정한다.
  let cookie = request.cookies.get('nextjs');
  console.log(cookie); // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll();
  console.log(allCookies); // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has('nextjs'); // => true
  request.cookies.delete('nextjs');
  request.cookies.has('nextjs'); // => false

  // `ResponseCookies` API를 사용하여 응답에 쿠키 설정하기
  const response = NextResponse.next();
  response.cookies.set('vercel', 'fast');
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  });
  cookie = response.cookies.get('vercel');
  console.log(cookie); // => { name: 'vercel', value: 'fast', Path: '/' }
  // 나가는 응답에는 `Set-Cookie:vercel=fast;path=/` 헤더가 포함된다.

  return response;
}
```

## 헤더 설정 {#setting-headers}

`NextResponse` API를 사용하여 요청 및 응답 헤더를 설정할 수 있다(요청 헤더 설정은 Next.js v13.0.0부터 사용 가능).

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 요청 헤더를 복제하고 새 헤더 `x-hello-from-middleware1`을 설정한다.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-hello-from-middleware1', 'hello');

  // NextResponse.rewrite에서 요청 헤더를 설정할 수도 있다.
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });

  // 새 응답 헤더 `x-hello-from-middleware2`를 설정한다.
  response.headers.set('x-hello-from-middleware2', 'hello');
  return response;
}
```

:::tip
백엔드 웹 서버 구성에 따라 [431 Request Header Fields Too Large](https://developer.mozilla.org/docs/Web/HTTP/Status/431) 오류가 발생할 수 있으므로 큰 헤더를 설정하지 않는다.
:::

### CORS {#cors}

미들웨어에서 CORS 헤더를 설정하여 [simple](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests) 및 [preflighted](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests) 요청을 포함한 교차 출처 요청을 허용할 수 있다.

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = ['https://acme.com', 'https://my-app.org'];

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function middleware(request: NextRequest) {
  // 요청에서 origin을 확인한다.
  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // prefligted 요청을 처리한다.
  const isPreflight = request.method === 'OPTIONS';

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // simple 요청을 처리한다.
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

:::note
라우트 핸들러에서 개별 라우트에 대한 CORS 헤더를 구성할 수 있다.
:::

## 응답 생성하기 {#producing-a-reponse}

미들웨어에서 `Response` 또는 `NextResponse` 인스턴스를 반환하여 직접 응답할 수 있다. (이 기능은 Next.js v13.1.0부터 사용 가능).

```ts
// middleware.ts
import { NextRequest } from 'next/server';
import { isAuthenticated } from '@lib/auth';

// 미들웨어를 `/api/`로 시작하는 경로로 제한한다.
export const config = {
  matcher: '/api/:function*',
};

export function middleware(request: NextRequest) {
  // 인증 함수를 호출하여 요청을 확인한다.
  if (!isAuthenticated(request)) {
    // 오류 메시지를 나타내는 JSON으로 응답한다.
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 },
    );
  }
}
```

### waitUntil & NextFetchEvent {#wait-until-and-next-fetch}

`NextFetchEvent` 객체는 네이티브 [`FetchEvent`](https://developer.mozilla.org/docs/Web/API/FetchEvent) 객체를 확장하며 [`waitUntil()`](https://developer.mozilla.org/docs/Web/API/ExtendableEvent/waitUntil) 메서드를 포함한다.

`waitUntil()` 메서드는 프로미스를 인자로 받아 프로미스가 리졸브될 때까지 미들웨어의 수명을 연장한다. 이 메서드는 백그라운드에서 작업을 수행할 때 유용하다.

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

export function middleware(req: NextRequest, event: NextFetchEvent) {
  event.waitUntil(
    fetch('https://my-analytics-platform.com', {
      method: 'POST',
      body: JSON.stringify({ pathname: req.nextUrl.pathname }),
    }),
  );

  return NextResponse.next();
}
```

## 고급 미들웨어 플래그 {#advanced-middleware-flags}

Next.js `v13.1` 에서는 고급 사용 사례를 처리하기 위해 미들웨어를 위한 두 개의 추가 플래그인 `skipMiddlewareUrlNormalize` 및 `skipTrailingSlashRedirect` 가 도입되었다.

`skipTrailingSlashRedirect` 는 후행 슬래시를 추가하거나 제거하기 위한 Next.js 리디렉션을 비활성화한다. 이렇게 하면 미들웨어 내부에서 사용자 정의 처리를 통해 일부 경로에는 후행 슬래시를 유지하지만 다른 경로에는 유지하지 않도록 할 수 있으므로 증분 마이그레이션이 더 쉬워진다.

```js
// next.config.js;
module.exports = {
  skipTrailingSlashRedirect: true,
};
```

```js
// middleware.js
const legacyPrefixes = ['/docs', '/blog'];

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // apply trailing slash handling
  if (
    !pathname.endsWith('/') &&
    !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/)
  ) {
    req.nextUrl.pathname += '/';
    return NextResponse.redirect(req.nextUrl);
  }
}
```

`skipMiddlewareUrlNormalize` 를 사용하면 Next.js에서 URL 정규화를 비활성화하여 직접 방문과 클라이언트 전환을 동일하게 처리할 수 있다. 일부 고급의 경우 이 옵션은 원본 URL을 사용하여 완전한 제어를 제공한다.

```js
// next.config.js
module.exports = {
  skipMiddlewareUrlNormalize: true,
};
```

```js
// middleware.js
export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  // GET /_next/data/build-id/hello.json

  console.log(pathname);
  // 이 플래그를 사용하면 이제 /_next/data/build-id/hello.json이 된다.
  // 플래그를 사용하지 않으면 /hello 로 정규화된다.
}
```

## 런타임 {#runtime}

미들웨어는 현재 [Edge 런타임](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)만 지원한다. Node.js 런타임은 사용할 수 없다.
