---
title: 데이터 페칭, 캐싱, 재검증
description:
date: 2024-02-02
tags: [fetch]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating',
    },
  ]
---

데이터 페치는 모든 애플리케이션의 핵심 부분이다. 이 페이지에서는 React와 Next.js에서 데이터를 페치하고, 캐시하고, 재검증 하는 방법을 설명한다.

데이터를 페치하는 방법에는 네 가지가 있다:

1. 서버에서 `fetch` 사용하기
2. 서버에서 써드파티 라이브러리 사용하기
3. 클라이언트에서 라우트 핸들러 사용하기
4. 클라이언트에서 써드파티 라이브러리 사용하기

## 서버에서 fetch로 데이터 페치하기 {#fetching-data-on-the-server-with-fetch}

Next.js는 네이티브 [`fetch` API](https://developer.mozilla.org/docs/Web/API/Fetch_API)를 확장하여 서버에서 각 페치 요청에 대한 캐싱 및 재검증 동작을 구성할 수 있도록 한다. React는 컴포넌트 트리를 렌더링하는 동안 페치 요청을 자동으로 메모화하도록 `fetch` 를 확장한다.

서버 컴포넌트, 라우트 핸들러, 서버 액션에서 `async/await` 과 함께 `fetch`를 사용할 수 있다.

```tsx
// app/page.tsx

async function getData() {
  const res = await fetch('https://api.example.com/...');
  // 리턴값은 직렬화되지 않는다.
  // Date, Map, Set 등을 리턴할 수 있다.

  if (!res.ok) {
    // 이렇게 하면 가장 가까운 `error.js` 에러 바운더리가 활성화된다.
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Page() {
  const data = await getData();

  return <main></main>;
}
```

:::tip

- Next.js는 서버 컴포넌트에서 데이터를 페치할 때 `cookies` 및 `headers` 와 같은 유용한 함수를 제공한다. 이러한 함수들은 요청 시간(request time) 정보에 의존하므로 라우트가 동적으로 렌더링된다.
- 라우트 핸들러에서는 `fetch` 요청이 React 컴포넌트 트리의 일부가 아니기 때문에 메모이제이션되지 않는다.
- 타입스크립트로 서버 컴포넌트에서 `async/await` 을 사용하려면 타입스크립트 `5.1.3` 버전 이상과 `@types/react` `18.2.8` 버전 이상을 사용해야 한다.

:::

### 데이터 캐싱 {#cahing-data}

캐싱은 데이터를 저장하므로 요청할 때마다 데이터 소스에서 데이터를 다시 페치할 필요가 없다.

기본적으로 Next.js는 서버의 데이터 캐시(Data Cache)에 `fetch` 리턴값을 자동으로 캐시한다. 즉, 빌드 시간 또는 요청 시간에 데이터를 페치해서 캐시한 후 각 데이터 요청에서 재사용할 수 있다.

```ts
// 'force-cache'가 기본값이며 생략할 수 있다.
fetch('https://...', { cache: 'force-cache' });
```

`POST` 메서드를 사용하는 `fetch` 요청도 자동으로 캐시된다. `POST` 메서드를 사용하는 라우트 핸들러 내부에 있지 않으면 캐시되지 않는다.

:::tip 데이터 캐시(Data Cache)란?
데이터 캐시는 영구적인 [HTTP 캐시](https://developer.mozilla.org/docs/Web/HTTP/Caching)다. 플랫폼에 따라 캐시는 자동으로 확장되고 [여러 지역에 걸쳐 공유](https://vercel.com/docs/infrastructure/data-cache)될 수 있습니다.

[데이터 캐시 참조](https://nextjs.org/docs/app/building-your-application/caching#data-cache)
:::

### 데이터 재검증 {#revalidating-data}

재검증은 데이터 캐시를 지우고 최신 데이터를 다시 페치하는 프로세스다. 데이터가 변경되어 최신 정보를 표시하고 싶을 때 유용하다.

캐시된 데이터는 두 가지 방법으로 재검증할 수 있다:

| 방법                 | 설명                                                                                                                                                                                                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **시간 기반 재검증** | 일정 시간이 지나면 자동으로 데이터의 유효성을 재검증한다. 이 기능은 자주 변경되지 않고 최신성이 그다지 중요하지 않은 데이터에 유용하다.                                                                                                                                                    |
| **온디맨드 재검증**  | 이벤트(예: 폼 제출)를 기반으로 데이터를 수동으로 재검증한다. 온디맨드 재검증은 태그 기반 또는 경로 기반 접근 방식을 사용하여 데이터 그룹을 한 번에 재검증할 수 있다. 이 기능은 최신 데이터가 최대한 빨리 표시되도록 하려는 경우(예: 헤드리스 CMS의 콘텐츠가 업데이트되는 경우)에 유용하다. |

#### 시간 기반 재검증 {#time-based-revalidation}

시간 간격을 두고 데이터의 유효성을 재검증하려면 `fetch` 의 `next.revalidate` 옵션을 사용하여 리소스의 캐시 수명(초)을 설정하면 된다.

```js
fetch('https://...', { next: { revalidate: 3600 } });
```

또는 라우트 세그먼트의 모든 `fetch` 요청의 유효성을 재검증하려면 [세그먼트 구성 옵션](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)을 사용한다.

```js
// layout.js | page.js
export const revalidate = 3600; // 최대 1시간마다 재확인
```

정적으로 렌더링되는 라우트에 여러 개의 페치 요청이 있고 각 요청의 재검증 빈도가 다른 경우. 모든 요청 중에 가장 낮은 시간이 사용된다. 동적으로 렌더링되는 라우트의 경우, 각 `fetch` 요청은 독립적으로 재검증된다.

#### 온디맨드 재검증 {#on-demand-revalidation}

데이터는 [서버 액션](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 또는 [라우트 핸들러](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) 내부의 경로( `revalidatePath` ) 또는 캐시 태그( `revalidadteTag` )를 통해 온디맨드 방식으로 재검증할 수 있다.

Next.js에는 라우트 전반에서 `fetch` 요청을 무효화 하기 위한 캐시 태그 시스템이 있다.

1. `fetch` 를 사용할 때 캐시 항목에 태그를 지정하는 옵션이 있다.
2. 그런 다음 `revalidateTag` 태그를 호출하여 해당 태그와 연결된 모든 항목의 유효성을 재검증할 수 있다.

예를 들어, 다음 `fetch` 요청은 `collection` 캐시 태그를 추가한다:

```tsx
// app/page.tsx

export default async function Page() {
  const res = await fetch('https://...', { next: { tags: ['collection'] } });
  const data = await res.json();
  // ...
}
```

그런 다음 서버 액션에서 `revalidateTag` 를 호출하여 `collection` 으로 태그된 `fetch` 호출의 유효성을 재검증할 수 있다:

```ts
// app/actions.ts

'use server';

import { revalidateTag } from 'next/cache';

export default async function action() {
  revalidateTag('collection');
}
```

#### 에러 핸들링과 재검증 {#error-handling-and-revalidation}

데이터 재검증을 시도하는 동안 오류가 발생하면 마지막으로 성공한 데이터가 캐시에서 계속 제공된다. 다음 요청이 있을 때 Next.js는 데이터 재검증을 다시 시도한다.

### 데이터 캐싱 옵트아웃 {#opting-out-of-data-caching}

`fetch` 요청은 다음과 같은 경우 캐시되지 않는다.

- `fetch` 요청에 `cache: 'no-store'` 옵션이 추가된 경우.
- 개별 `fetch` 요청에 `revalidate: 0` 옵션이 추가된 경우.
- `fetch` 요청이 `POST` 메서드를 사용하는 라우트 핸들러 내에 있는 경우.
- `headers` 나 `cookies` 를 사용한 후에 `fetch` 요청을 한 경우
- `const dynamic = 'force-dynamic'` 라우트 세그먼트 옵션이 사용된 경우.
- `fetchCache` 라우트 세그먼트 옵션이 기본적으로 캐시를 건너뛰도록 구성된 경우.
- `fetch` 요청이 `Authorization` 이나 `Cookie` 헤더를 사용하고 해당 컴포넌트 트리에서 그 위에 캐시되지 않은 요청이 있는 경우.

#### 개별 페치 요청 {#individual-fetch-request}

개별 페치 요청에 대한 캐싱을 사용하지 않으려면 `fetch` 의 `cache` 옵션을 `'no-store'` 로 설정하면 된다. 이렇게 하면 모든 요청에 대해 데이터를 동적으로 가져오게 된다.

```js
// layout.js | page.js

fetch('https://...', { cache: 'no-store' });
```

[`fetch` API 레퍼런스](https://nextjs.org/docs/app/api-reference/functions/fetch)에서 사용 가능한 모든 `cache` 옵션을 확인할 수 있다.

#### 다중 페치 요청 {#multiple-fetch-request}

라우트 세그먼트(예: 레이아웃 또는 페이지)에 여러 개의 `fetch` 요청이 있는 경우 세그먼트 구성 옵션을 사용하여 세그먼트의 모든 데이터 요청에 대한 캐싱 동작을 구성할 수 있다.

하지만 각 `fetch` 요청의 캐싱 동작을 개별적으로 구성하는 것이 좋다. 이렇게 하면 캐싱 동작을 보다 세밀하게 제어할 수 있다.

## 서버에서 써드파티 라이브러리로 데이터 페치하기 {#fetching-data-on-the-server-with-third-party-libraries}

`fetch` 를 지원하지 않는 서드파티 라이브러리(예: 데이터베이스, CMS 또는 ORM 클라이언트)를 사용하는 경우, 라우트 세그먼트 구성 옵션과 React의 `cache` 함수를 사용하여 해당 요청의 캐싱 및 재검증 동작을 구성할 수 있다.

데이터가 캐시되는지 여부는 라우트 세그먼트가 정적으로 렌더링되는지 동적으로 렌더링되는지에 따라 달라진다. 세그먼트가 정적(기본값)인 경우, 요청의 출력은 캐시되고 랑우트 세그먼트의 일부로 재검증된다. 세그먼트가 동적인 경우 요청의 출력은 캐시되지 않으며 세그먼트가 렌더링될 때 다시 페치된다.

실험적인 [`unstable_cache` API](https://nextjs.org/docs/app/api-reference/functions/unstable_cache)를 사용할 수도 있다.

### 예제 {#example}

아래 예시에서:

- React `cache` 함수는 데이터 요청을 메모하는 데 사용된다.
- `revalidate` 옵션은 레이아웃 및 페이지 세그먼트에서 `3600` 으로 설정되어 있으며, 이는 데이터가 캐시되고 최대 1시간마다 재검증된다는 의미다.

```ts
// app/utils.ts

import { cache } from 'react';

export const getItem = cache(async (id: string) => {
  const item = await db.item.findUnique({ id });
  return item;
});
```

`getItem` 함수가 두 번 호출되더라도 데이터베이스에 대한 쿼리는 한 번만 수행된다.

```tsx
// app/item/[id]/layout.tsx

import { getItem } from '@/utils/get-item';

export const revalidate = 3600; // 최대 1시간마다 데이터를 재검증한다.

export default async function Layout({
  params: { id },
}: {
  params: { id: string };
}) {
  const item = await getItem(id);
  // ...
}
```

```tsx
// app/item/[id]/page.tsx

import { getItem } from '@/utils/get-item';

export const revalidate = 3600; // 최대 1시간마다 데이터를 재검증한다.

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const item = await getItem(id);
  // ...
}
```

## 클라이언트에서 라우트 핸들러로 데이터 페치하기 {#fetching-data-on-the-client-with-route-handler}

클라이언트 컴포넌트에서 데이터를 페치해야 하는 경우 클라이언트에서 [라우트 핸들러](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)를 호출할 수 있다. 라우트 핸들러는 서버에서 실행되어 데이터를 클라이언트로 반환한다. 이는 API 토큰과 같은 민감한 정보를 클라이언트에 노출하고 싶지 않을 때 유용하다.

예제는 라우트 [핸들러 문서](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)를 참조한다.

:::note 서버 컴포넌트와 라우트 핸들러
서버 컴포넌트는 서버에서 렌더링되므로 데이터를 페치하기 위해 서버 컴포넌트에서 라우트 핸들러를 호출할 필요가 없다. 대신 서버 컴포넌트 내에서 직접 데이터를 가져오면 된다.
:::

## 클라이언트에서 써드파티 라이브러리로 데이터 페치하기 {#fetching-data-on-the-client-with-third-party-libraries}

[SWR](https://swr.vercel.app/) 또는 [TanStack Query](https://tanstack.com/query/latest)와 같은 써드파티 라이브러리를 사용하여 클라이언트에서 데이터를 가져올 수도 있다. 이러한 라이브러리는 요청 메모화, 캐싱, 데이터 재검증 및 변경을 위한 자체 API를 제공한다.
