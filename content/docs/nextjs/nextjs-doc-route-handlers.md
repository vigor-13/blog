---
title: 라우트 핸들러
description:
date: 2024-03-05
tags: [route]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/routing/route-handlers',
    },
  ]
---

라우트 핸들러를 사용하면 웹 [Request](https://developer.mozilla.org/ko/docs/Web/API/Request) 및 [Response](https://developer.mozilla.org/docs/Web/API/Response) API를 사용하여 지정된 라우트에 대한 커스텀 요청 핸들러를 만들 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-route-handlers/1.png)

:::tip
라우트 핸들러는 `app` 디렉토리 내에서만 사용할 수 있다. 라우트 핸들러는 `pages` 디렉토리 내의 [API 라우트](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)와 동일하므로 API 라우트와 라우트 핸들러를 함께 사용할 필요가 없다.
:::

## 컨벤션 {#convention}

라우트 핸들러는 `app` 디렉터리 내의 `route.js|ts` 파일에 정의된다:

```ts
// app/api/route.ts
export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: Request) {}
```

라우트 핸들러는 `page.js` 및 `layout.js` 와 유사하게 `app` 디렉터리 내에 중첩될 수 있다. 그러나 `page.js` 와 동일한 라우트 세그먼트 수준에는 `route.js` 파일이 있을 수 없다.

### 지원되는 HTTP 메서드 {#supported-http-methods}

지원되는 [HTTP 메서드](https://developer.mozilla.org/docs/Web/HTTP/Methods)는 다음과 같다: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD` 및 `OPTIONS`. 지원되지 않는 메서드가 호출되면 Next.js는 `405 Method Not Allowed` 응답을 반환합니다.

### 확장된 NextRequest & NextResponse API {#extended-nextrequest-and-nextresponse-apis}

기본 Request 및 Response API를 지원할 뿐만 아니라 Next.js는 고급 사용 사례를 위한 편의 기능을 제공하기 위해 `NextRequest` 및 `NextResponse` 로 API를 확장한다.

## 기본 특성 {#behavior}

### 캐싱 {#caching}

`Response` 객체와 함께 `GET` 메서드를 사용할 때 기본적으로 라우트 핸들러는 캐시된다.

```ts
// app/items/route.ts
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  });
  const data = await res.json();

  return Response.json({ data });
}
```

:::warning
`Response.json()` 은 TypeScript 5.2부터 유효하다. 하위 버전의 TypeScript를 사용하는 경우 `NextResponse.json()` 을 대신 사용할 수 있다.
:::

### 캐싱 옵트아웃 {#caching-optout}

캐싱을 사용하지 않도록 다음과 같이 설정할 수 있다:

- `GET` 메서드와 함께 `Request` 객체 사용.
- 다른 HTTP 메서드 사용.
- `cookies` 및 `headers` 와 같은 동적 함수 사용.
- [세그먼트 구성 옵션]()에서 다이나믹 모드를 수동으로 지정한다.

예를 들면 다음과 같다:

```ts
// app/products/api/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const res = await fetch(`https://data.mongodb-api.com/product/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY!,
    },
  });
  const product = await res.json();

  return Response.json({ product });
}
```

마찬가지로 `POST` 메서드를 사용하면 라우트 핸들러가 동적으로 평가된다.

```ts
// app/items/route.ts
export async function POST() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY!,
    },
    body: JSON.stringify({ time: new Date().toISOString() }),
  });

  const data = await res.json();

  return Response.json(data);
}
```

:::tip
API 라우트와 마찬가지로, 라우트 핸들러는 폼 제출 처리와 같은 경우에 사용할 수 있다. React와 긴밀하게 통합되어 [폼 및 변형을 처리](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)하는 새로운 추상화 작업이 진행 중이다.
:::

### 라우트 resolution {#route-resolution}

`route` 를 가장 낮은 수준의 라우팅 프리미티브로 간주할 수 있다.

- `page` 와 같은 레이아웃이나 클라이언트 사이드 네비게이션에 참여하지 않는다.
- `page.js` 와 같은 라우트에 `route.js` 파일이 있을 수 없다.

| 페이지               | 라우트             | 결과 |
| -------------------- | ------------------ | ---- |
| `app/page.js`        | `app/route.js`     | 🚫   |
| `app/page.js`        | `app/api/route.js` | ✅   |
| `app/[user]/page.js` | `app/api/route.js` | ✅   |

각 `route.js` 또는 `page.js` 파일은 해당 경로의 모든 HTTP 동사(verb)를 처리한다.

```js
// app/page.js
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}

// ❌ Conflict
// `app/route.js`
export async function POST(request) {}
```

## 예제 {#examples}

다음 예제에서는 라우트 핸들러를 다른 Next.js API 및 기능과 결합하는 방법을 보여준다.

### 캐시된 데이터 유효성 재검증하기 {#revalidating-cached-data}

`next.revalidate` 옵션을 사용하여 캐시된 데이터의 유효성을 재검증할 수 있다:

```ts
// app/items/route.ts
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    next: { revalidate: 60 }, // 60초마다 재검증
  });
  const data = await res.json();

  return Response.json(data);
}
```

또는 `revalidate` 세그먼트 구성 옵션을 사용할 수도 있다:

```ts
export const revalidate = 60;
```

### 동적 함수 {#dynamic-functions}

라우트 핸들러는 `cookies` 및 `headers` 와 같은 Next.js의 동적 함수와 함께 사용할 수 있다.

#### 쿠키 {#cookies}

`next/headers` 의 `cookies` 로 쿠키를 읽거나 설정할 수 있다. 이 서버 함수는 라우트 핸들러에서 직접 호출하거나 다른 함수 안에 중첩하여 호출할 수 있다.

또는 [`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie) 헤더를 사용하여 새 `Response` 를 반환할 수도 있다.

```ts
// app/api/route.ts
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token.value}` },
  });
}
```

기본 웹 API를 사용하여 request 에서 쿠키를 읽을 수도 있다( `NextRequest` ):

```ts
// app/api/route.ts
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token');
}
```

#### 헤더 {#headers}

`next/headers` 에서 `headers` 로 헤더를 읽을 수 있다. 이 서버 함수는 라우트 핸들러에서 직접 호출하거나 다른 함수 안에 중첩하여 호출할 수 있다.

이 `headers` 인스턴스는 읽기 전용이다. 헤더를 설정하려면 새 `headers` 가 포함된 새 `Response` 를 반환해야 한다.

```ts
// app/api/route.ts
import { headers } from 'next/headers';

export async function GET(request: Request) {
  const headersList = headers();
  const referer = headersList.get('referer');

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  });
}
```

기본 웹 API를 사용하여 request 의 헤더를 읽을 수도 있다( `NextRequest` ):

```ts
// app/api/route.ts
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
}
```

### 리다이렉트 {#redirects}

```ts
// app/api/route.ts
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  redirect('https://nextjs.org/');
}
```

### 동적 라우트 세그먼트 {#dynamic-route-segments}

라우트 핸들러는 동적 세그먼트를 사용하여 동적 데이터에서 요청 핸들러를 생성할 수 있다.

```ts
// app/items/[slug]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug; // 'a', 'b', or 'c'
}
```

| 라우트                      | 예시 URL   | 파라미터        |
| --------------------------- | ---------- | --------------- |
| `app/items/[slug]/route.js` | `/items/a` | `{ slug: 'a' }` |
| `app/items/[slug]/route.js` | `/items/b` | `{ slug: 'b' }` |
| `app/items/[slug]/route.js` | `/items/c` | `{ slug: 'c' }` |

### URL 쿼리 파라미터 {#url-query-parameters}

라우트 핸들러에 전달되는 요청 객체는 쿼리 파라미터를 보다 쉽게 처리하는 등 몇 가지 추가 편의 메서드가 있는 `NextRequest` 인스턴스다.

```ts
// app/api/search/route.ts
import { type NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  // "/api/search?query=hello" url의 경우 쿼리는 "hello"다
}
```

### 스트리밍 {#streaming}

스트리밍은 일반적으로 대형 언어 모델 (LLM)인 OpenAI와 같은 것들과 결합하여 AI로 생성된 콘텐츠에 사용된다. ([AI SDK](https://sdk.vercel.ai/docs) 참조)

```ts
// app/api/chat/route.ts
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
```

이러한 추상화는 웹 API를 사용하여 스트림을 생성한다. 기본 웹 API를 직접 사용할 수도 있다.

```ts
// app/api/route.ts
// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const encoder = new TextEncoder();

async function* makeIterator() {
  yield encoder.encode('<p>One</p>');
  await sleep(200);
  yield encoder.encode('<p>Two</p>');
  await sleep(200);
  yield encoder.encode('<p>Three</p>');
}

export async function GET() {
  const iterator = makeIterator();
  const stream = iteratorToStream(iterator);

  return new Response(stream);
}
```

### Request Body {#request-body}

표준 웹 API 메서드를 사용하여 `Request` 바디를 읽을 수 있다:

```ts
// app/items/route.ts
export async function POST(request: Request) {
  const res = await request.json();
  return Response.json({ res });
}
```

### Request Body FormData {#request-body-formdata}

`request.formData()` 함수를 사용하여 폼데이터를 읽을 수 있다:

```ts
// app/items/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  return Response.json({ name, email });
}
```

`formData` 데이터는 모두 문자열이므로 [`zod-form-data`](https://www.npmjs.com/zod-form-data) 를 사용하여 요청의 유효성을 검사하고 원하는 형식(예: `number`)으로 데이터를 받을 수 있다.

### CORS {#cors}

표준 웹 API 메서드를 사용하여 특정 라우트 핸들러에 대한 CORS 헤더를 설정할 수 있다:

```ts
// app/api/route.ts
export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: Request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

:::tip

- 여러 라우트 핸들러에 CORS 헤더를 추가하려면 미들웨어 또는 `next.config.js` 파일을 사용한다.
- 또는 [CORS 예제](https://github.com/vercel/examples/blob/main/edge-functions/cors/lib/cors.ts) 패키지를 참조한다.

:::

### Webhooks {#webhooks}

라우트 핸들러를 사용하여 타사 서비스에서 웹훅을 수신할 수 있다.

```ts
// app/api/route.ts
export async function POST(request: Request) {
  try {
    const text = await request.text();
    // webhook 페이로드 처리
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }

  return new Response('Success!', {
    status: 200,
  });
}
```

특히 페이지 라우터를 사용하는 API 라우트와 달리 추가 구성을 위해 `bodyParser` 를 사용할 필요가 없다.

### Edge & Node.js 런타임 {#edge-and-nodejs-runtime}

라우트 핸들러에는 스트리밍 지원을 포함하여 Edge 및 Node.js 런타임을 원활하게 지원하기 위한 동형 웹 API가 있다. 라우트 핸들러는 페이지 및 레이아웃과 동일한 [라우트 세그먼트 구성](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)을 사용하므로 정적으로 재생성된 범용 라우트 핸들러와 같은 오랫동안 기다려온 기능들을 지원한다.

`runtime` 세그먼트 구성 옵션을 사용하여 런타임을 지정할 수 있다:

```ts
export const runtime = 'edge'; // 디폴트 값은 'nodejs'
```

### 비-UI 응답 {#non-ui-response}

라우트 핸들러를 사용하여 UI가 아닌 콘텐츠를 반환할 수 있다. `sitemap.xml` , `robots.txt` , `app icons` , `oopen graph images`는 모두 기본 지원된다.

```ts
// app/rss.xml/route.ts
export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
 
<channel>
  <title>Next.js Documentation</title>
  <link>https://nextjs.org/docs</link>
  <description>The React Framework for the Web</description>
</channel>
 
</rss>`,
    {
      headers: {
        'Content-Type': 'text/xml',
      },
    },
  );
}
```

### 세그먼트 구성 옵션 {#segments-config-options}

라우트 핸들러는 페이지 및 레이아웃과 동일한 라우트 세그먼트 구성을 사용한다.

```ts
// app/items/route.ts
export const dynamic = 'auto';
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = 'auto';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
```

자세한 내용은 [API 레퍼런스](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)를 참조한다.
