---
title: 고급 서버 렌더링
description:
date: 2024-03-30
tags: [nextjs, ssr, streaming]
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr',
    },
  ]
---

이 문서는 React Query를 사용하여 스트리밍, 서버 컴포넌트, Next.js 앱 라우터를 활용하는 방법을 소개하는 고급 서버 렌더링 가이드다.

이 가이드를 읽기 전에, 다음 문서들을 먼저 살펴보는 것이 좋다:

- **Server Rendering & Hydration guide**: React Query를 사용한 SSR 기본 사용법을 다룬다.
- **Performance & Request Waterfalls**: 성능 향상과 요청 워터폴 처리에 대해 설명한다.
- **Prefetching & Router Integration**: 데이터 prefetch와 라우터 통합에 대해 설명한다.

이 가이드에서는 SSR 가이드에서 다룬 `initialData` 접근법보다는 **하이드레이션(hydration) API**에 초점을 맞춘다.

## 서버 컴포넌트 및 Next.js 앱 라우터 {#server-components-and-nextjs-app-router}

여기서는 서버 컴포넌트에 대해 자세히 다루지는 않겠지만, 서버 컴포넌트를 간단히 설명하자면 초기 페이지 뷰와 **페이지 전환 시** 서버에서만 실행되는 것이 보장되는 컴포넌트다. 이는 Next.js의 `getServerSideProps` / `getStaticProps` 와 Remix의 `loader`가 작동하는 방식과 유사하다. 이들은 항상 서버에서 실행되지만 데이터만 반환할 수 있는 반면, 서버 컴포넌트는 훨씬 더 많은 작업을 수행할 수 있다. 그러나 데이터 부분이 React Query에서 더 중요하므로 이에 초점을 맞춘다.

**프레임워크 로더에서 프리페치된 데이터를 앱에 전달**하는 것에 대해 앞선 서버 렌더링 가이드에서 배운 내용을 어떻게 서버 컴포넌트와 Next.js 앱 라우터에 적용할 수 있을까? 이를 시작하는 가장 좋은 방법은 서버 컴포넌트를 또 다른 프레임워크 로더로 간주하는 것이다.

### 용어에 대한 간단한 설명 {#a-quick-note-on-terminology}

지금까지 이 가이드에서는 *서버*와 *클라이언트*에 대해 이야기해 왔다. 혼란스럽게도 이는 *서버 컴포넌트*와 *클라이언트 컴포넌트*와 1:1로 일치하지 않는다는 점에 주목하는 것이 중요하다. 서버 컴포넌트는 서버에서만 실행되는 것이 보장되지만, 클라이언트 컴포넌트는 실제로 두 곳 모두에서 실행될 수 있다. 그 이유는 클라이언트 컴포넌트는 초기 _서버 렌더링_ 단계에서도 렌더링될 수 있기 때문이다.

이를 생각하는 한 가지 방법은 서버 컴포넌트도 *렌더링*되지만, "로더 단계"(항상 서버에서 발생)에서 발생하는 반면, 클라이언트 컴포넌트는 "애플리케이션 단계"에서 실행된다는 것이다. 해당 애플리케이션은 SSR 중에 서버에서 실행될 수도 있고 브라우저에서 실행될 수도 있다. 애플리케이션이 정확히 어디에서 실행되는지, SSR 중에 실행되는지 여부는 프레임워크마다 다르다.

### 초기 설정 {#initial-setup}

모든 React Query 설정의 첫 번째 단계는 항상 `queryClient` 를 생성하고 `QueryClientProvider` 로 애플리케이션을 감싸는 것이다. 서버 컴포넌트를 사용할 때 이는 대부분의 프레임워크에서 비슷해 보이지만, 파일 이름 규칙에는 차이가 있다:

```tsx
// Next.js의 app/providers.jsx
'use client';

// 서버 컴포넌트에서는 useState나 useRef를 사용할 수 없기 때문에,
// 이 부분을 별도의 파일로 추출하고 맨 위에 'use client'를 추가한다.
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// QueryClient 인스턴스 생성
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR에서는 보통 클라이언트에서 즉시 refetch하는 것을 피하기 위해
        // 0 이상의 staleTime을 설정하는 것이 좋다.
        staleTime: 60 * 1000,
      },
    },
  });
}

// 브라우저에서 생성된 QueryClient 인스턴스 저장
let browserQueryClient: QueryClient | undefined = undefined;

// 서버 또는 클라이언트에 따라 QueryClient 인스턴스를 반환한다.
function getQueryClient() {
  if (typeof window === 'undefined') {
    // 서버: 항상 새 query client를 만든다.
    return makeQueryClient();
  } else {
    // 브라우저: 아직 없는 경우 새 query client를 만든다.
    // 초기 렌더링 중 React가 일시 중단되면 새 클라이언트를 다시 만들지 않도록 하는 것이 매우 중요하다.
    // query client 생성 아래에 suspense boundary가 있는 경우에는 필요하지 않을 수 있다.
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }) {
  // 참고: 일시 중단될 수 있는 코드와 이 코드 사이에 suspense boundary가 없는 경우
  // query client를 초기화할 때 useState를 피해야 한다.
  // 초기 렌더링에서 일시 중단되고 boundary가 없으면 React가 클라이언트를 "버린"다.
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

:::important
React는 컴포넌트 렌더링 중에 데이터 fetching과 같은 비동기 작업이 완료될 때까지 렌더링을 일시 중단할 수 있다. 이를 React의 "Suspense" 기능이라고 한다.

렌더링이 일시 중단됨으로 인해서 `getQueryClinet` 가 여러 번 호출될 수 있는데 이를 이해하기 위해서 먼저 React의 컴포넌트 렌더링 프로세스는 다음과 같다:

1. 컴포넌트 함수를 호출한다.
2. 컴포넌트 내부의 코드를 실행한다.
3. 컴포넌트가 반환한 JSX를 기반으로 실제 DOM 업데이트를 수행한다.

이 과정에서 컴포넌트 내부의 코드를 실행 중에 fetching과 같은 비동기 작업이 있다면, React는 해당 작업이 완료될 때까지 렌더링을 일시 중단한다. 이때 React는 컴포넌트 함수의 실행을 중단하고 비동기 작업이 완료되면 컴포넌트 함수를 다시 호출하여 렌더링한다.

`getQueryClient` 는 `Providers` 컴포넌트 내부에서 호출되므로, 렌더링 과정 중에 실행된다. 만약 `Providers` 컴포넌트의 자식 컴포넌트 중 하나에서 데이터 fetching 등의 이유로 렌더링이 일시 중단되면, React는 `Providers` 컴포넌트의 실행을 중단하고 나중에 다시 시작한다. 이 과정에서 `getQueryClient` 가 여러 번 호출될 수 있다.

따라서 `getQueryClient` 내부에서 `browserQueryClient` 의 존재 여부를 확인하고, 이미 존재하는 경우 새로운 `QueryClient` 를 생성하지 않도록 하는 것이 중요하다.
:::

:::important 사례 - browserQueryClient가 없을 때 발생하는 부작용
`QueryClient` 인스턴스는 캐시, 기본 옵션, 그리고 쿼리 및 뮤테이션의 상태를 관리한다. 만약 초기 렌더링 중에 React가 일시 중단될 때마다 새로운 `QueryClient` 인스턴스를 생성한다면, 각각의 인스턴스는 서로 다른 상태를 갖게된다.

예를 들어, 다음과 같은 컴포넌트 구조를 가정해보자.

```tsx
function App() {
  return (
    <Providers>
      <Suspense fallback={<Loading />}>
        <DataComponent />
      </Suspense>
    </Providers>
  );
}

function DataComponent() {
  const { data } = useQuery('key', fetchData);
  return <div>{data}</div>;
}
```

만약 `Providers` 컴포넌트에서 `makeQueryClient()` 를 호출한다면, 다음과 같은 일이 발생할 수 있다.

1. `App` 컴포넌트가 렌더링을 시작한다.
2. `Providers` 컴포넌트가 새로운 `QueryClient` 인스턴스를 생성한다.
3. `DataComponent` 가 렌더링을 시작하고, `useQuery`를 사용하여 데이터 fetching을 시작한다.
4. 데이터 fetching이 완료되기 전에 React가 일시 중단된다.
5. React가 렌더링을 재개하면서 `Providers` 컴포넌트를 다시 실행한다.
6. `Providers` 컴포넌트가 새로운 `QueryClient` 인스턴스를 생성한다.
7. `DataComponet` 가 새로운 `QueryClient` 인스턴스를 받아 다시 렌더링된다.

이 과정에서 `DataComponent` 는 서로 다른 `QueryClient` 인스턴스를 받게 되므로, 첫 번째 인스턴스에서 시작된 데이터 fetching의 결과를 잃게 된다. 이는 불필요한 데이터 요청을 야기하고, 컴포넌트의 렌더링 결과과 예상과 다를 수 있다.

반면에 `getQueryClient`에서 `browserQueryClient`를 사용하면, 초기 렌더링 중에 일시 중단이 되어도 항상 동일한 QueryClient 인스턴스를 사용하게 된다. 이렇게 하면 데이터 fetching의 결과가 유지되고, 컴포넌트는 예상대로 작동하게 된다.
:::

:::important Suspense Boundary가 있는 경우
`Suspense` 는 React에서 제공하는 기능으로, 비동기 작업이 완료될 때까지 로딩 상태를 보여주고, 작업이 완료되면 실제로 컴포넌를 렌더링한다.

`QueryClient` 인스턴스를 생성하는 코드 아래에 `Suspense` 경계가 있다면, 초기 렌더링 중에 발생하는 일시 중단을 `Suspense` 가 처리할 수 있다. 이 경우에는 `browserQueryClient` 체크가 필요하지 않을 수 있다.

다음과 같은 컴포넌트 구조를 가정해보자.

```tsx
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loading />}>
        <DataComponent />
      </Suspense>
    </QueryClientProvider>
  );
}

function DataComponent() {
  const { data } = useQuery('key', fetchData);
  return <div>{data}</div>;
}
```

위의 코드에서 `QueryClientProvider` 는 `Suspense` 컴포넌트 위에 위치한다. `DataComponent` 에서 데이터 fetching이 일어나면, React는 `Suspense` 경계에 도달할 때까지 컴포넌트 트리를 거슬러 올라간다.

`Suspense` 경계를 만나면, React는 `DataComponent` 의 렌더링을 일시 중단하고 `Suspense` 의 `fallback` 에 지정된 `Loading` 컴포넌트를 렌더링한다. 데이터 fetching이 완료되면, React는 `DataComponent` 의 렌더링을 재개하고 `Loading` 컴포넌트를 실제 데이터로 대체한다.

이 과정에서 `QueryClientProvider` 는 한 번만 실행되므로, `queryClient` 도 한 번만 실행된다. 초기 렌더링 중에 일시 중단이 발생하더라도, `Suspense` 가 이를 처리하기 때문에 `QueryClientProvider` 가 다시 실행되지 않는다.

따라서 `QueryClient` 인스턴스 생성 코드 아래에 `Suspense` 경계가 있다면 `browserQueryClient` 체크를 하지 않아도 `QueryClient` 가 여러 번 생성되는 문제를 피할 수 있다.

그러나 `Suspense` 를 사용하지 않거나, `QueryClientProvider` 가 `Suspense` 경계 안에 있는 경우에는 여전히 `browserQueryClient` 체크가 필요하다.
:::

:::important queryClient를 상태에 저장하면 안되는 이유
React에서 컴포넌트를 "버린다"는 것은 해당 컴포넌트의 상태를 포기하고 처음부터 다시 렌더링을 시작한다는 의미다.

React는 컴포넌트를 렌더링할 때 해당 컴포넌트의 상태를 유지한다. 이 상태에는 props, state, context 등이 포함된다. 렌더링 과정에서 에러가 발생하거나 일시 중단(Suspense)이 발생하면 React는 해당 컴포넌트의 렌더링을 중단하고 나중에 다시 시도하다.

그러나 **`Suspense` 경계 없이 일시 중단이 발생하면, React는 해당 컴포넌트를 "버리고" 처음부터 다시 렌더링을 시작한다.** 이는 다음을 의미한다.

1. 컴포넌트의 상태가 초기화된다. `useState` 를 사용하여 초기화한 상태도 포함된다.
2. 컴포넌트의 렌더링 결과가 DOM에서 제거된다.
3. 컴포넌트의 effects(`useEffect`, `useLayoutEffect` 등)가 정리(clean-up)된다.
4. 컴포넌트가 처음부터 다시 렌더링된다.

`useState` 를 사용하여 `queryClient` 를 초기화한 경우, 일시 중단이 발생하면 해당 **컴포넌트가 "버려지고" `queryClient` 도 함께 사라진다.** 그리고 컴포넌트가 다시 렌더링될 때 `useState` 의 초기값을 설정하는 콜백 함수가 다시 호출되므로, 새로운 `queryClient` 가 생성된다.

이렇게 되면 이전에 생성된 `queryClient` 와 관련된 모든 상태와 캐시 데이터가 손실되며, React Query의 내부 상태와 React 컴포넌트의 상태 사이에 불일치가 발생할 수 있다.

따라서 `Suspense` 경계 없이 `useState` 를 사용하여 `queryClient` 를 초기화하는 것은 안전하지 않다. React가 해당 컴포넌트를 "버리고" 상태를 초기화할 수 있기 때문이다.

대신 `getQueryClient` 함수를 직접 호출하여 `queryClient` 를 초기화하는 것이 안전하다. `getQueryClient` 함수 내부의 `browserQueryClient` 체크로 인해 일시 중단이 발생하더라도 동일한 QueryClient 인스턴스가 유지되므로, 상태 손실이 발생하지 않는다.
:::

```tsx
// Next.js의 app/layout.jsx
import Providers from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

이 부분은 SSR 가이드에서 했던 것과 매우 유사하지만, 두 개의 다른 파일로 나눌 필요가 있다.

### 데이터 프리페치 및 디/하이드레이션 {#prefetching-and-de-hydrating-data}

이제 실제로 데이터를 프리페치하고 하이드레이션 및 디하이드레이션하는 방법을 살펴보자. 다음은 **Next.js 페이지 라우터**를 사용할 때의 모습이다:

```tsx
// pages/posts.jsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from '@tanstack/react-query';

// getServerSideProps도 가능
export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

function Posts() {
  // 이 useQuery는 <PostsRoute>의 더 깊은 자식에서도 동일하게 사용할 수 있으며,
  // 어느 쪽이든 데이터는 즉시 사용 가능하다.
  //
  // 여기서 useSuspenseQuery 대신 useQuery를 사용하고 있음을 유의한다.
  // 이 데이터는 이미 프리페치되었으므로, 컴포넌트 자체에서 일시 중단될 필요가 없다.
  // 프리페치를 잊어버리거나 제거하면, 클라이언트에서 데이터를 fetch하게 되는 반면,
  // useSuspenseQuery를 사용하면 더 심각한 부작용이 있었을 것이다.
  const { data } = useQuery({ queryKey: ['posts'], queryFn: getPosts });

  // 이 쿼리는 서버에서 프리페치되지 않았으며 클라이언트에서
  // fetch하기 시작할 때까지 시작되지 않는다. 두 패턴 모두 혼합하여 사용할 수 있다.
  const { data: commentsData } = useQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments,
  });

  // ...
}

export default function PostsRoute({ dehydratedState }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Posts />
    </HydrationBoundary>
  );
}
```

이를 앱 라우터로 변환할 때 대부분은 비슷하지만 몇 가지 수정사항이 있다. 먼저, 프리페칭 부분을 수행할 서버 컴포넌트를 만든다:

```tsx
// app/posts/page.jsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Posts from './posts';

export default async function PostsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  return (
    // 깔끔하다! props로 초기 데이터를 전달하는 것만큼 쉬워졌다.
    // HydrationBoundary는 클라이언트 컴포넌트이므로, 하이드레이션은 여기서 이루어진다.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  );
}
```

다음으로, 클라이언트 컴포넌트 부분이 어떻게 생겼는지 살펴보자:

```tsx
// app/posts/posts.jsx
'use client';

export default function Posts() {
  // 이 useQuery는 <Posts>의 더 깊은 자식에서도
  // 동일하게 발생할 수 있으며, 어느 쪽이든 데이터는 즉시 사용 가능하다.
  const { data } = useQuery({ queryKey: ['posts'], queryFn: getPosts });

  // 이 쿼리는 서버에서 프리페치되지 않았으며 클라이언트에서
  // fetch하기 시작할 때까지 시작되지 않는다. 두 패턴 모두 혼합하여 사용할 수 있다.
  const { data: commentsData } = useQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments,
  });

  // ...
}
```

위의 예제에서 멋진 점은 Next.js에 특화된 유일한 것이 파일 이름뿐이라는 것이다. 나머지는 서버 컴포넌트를 지원하는 다른 프레임워크에서도 동일하다.

앞서 SSR 가이드에서는 모든 라우트에 `<HydrationBoundary>` 를 제거할 수 있다고 언급했다. 이는 서버 컴포넌트에서는 불가능하다.

### 서버 컴포넌트 중첩 {#nesting-server-components}

서버 컴포넌트의 좋은 점은 중첩될 수 있고 React 트리의 여러 레벨에 존재할 수 있어서, 애플리케이션의 맨 위에서만이 아니라 실제로 사용되는 곳에 더 가까운 곳에서 데이터를 프리페치할 수 있다는 것이다. 이는 서버 컴포넌트가 다른 서버 컴포넌트를 렌더링하는 것만큼 간단하다(간결성을 위해 이 예제에서는 클라이언트 컴포넌트를 생략한다다):

```tsx
// app/posts/page.jsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Posts from './posts';
import CommentsServerComponent from './comments-server';

export default async function PostsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
      <CommentsServerComponent />
    </HydrationBoundary>
  );
}

// app/posts/comments-server.jsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Comments from './comments';

export default async function CommentsServerComponent() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Comments />
    </HydrationBoundary>
  );
}
```

보시다시피 `<HydrationBoundary>` 를 여러 곳에서 사용하고 프리페칭을 위해 여러 `queryClient` 를 생성하고 디하이드레이션할 수 있다.

다만 `CommentsServerComponent`를 렌더링하기 전에 `getPosts`를 기다리고 있기 때문에 이는 서버 사이드 워터폴을 유발한다:

```bash
1. |> getPosts()
2.   |> getComments()
```

데이터에 대한 서버 지연 시간이 짧다면 이는 큰 문제가 되지 않을 수 있지만, 여전히 개선의 여지가 있다.

Next.js에서는 `page.tsx` 에서 데이터를 프리페치하는 것 외에도 `layout.tsx` 와 **병렬 라우트**에서도 가능하다. 이들은 모두 라우팅의 일부이기 때문에 Next.js는 이들을 모두 병렬로 fetch할 수 있다. 따라서 위의 `CommentsServerComponent` 가 대신 병렬 라우트로 표현되었다면, 워터폴은 자동으로 제거될 것이다.

더 많은 프레임워크가 서버 컴포넌트를 지원하기 시작하면서, 그들은 각기 다른 라우팅 규칙을 사용한다. 자세한 내용은 해당 프레임워크 문서를 참조한다.

### 대안: 단일 queryClient를 사용하여 프리페칭 {#alternative-using-a-single-queryClient-for-prefetching}

위의 예제에서는 데이터를 fetch하는 각 서버 컴포넌트에 대해 새로운 `queryClient` 를 생성한다. 이는 권장되는 방법이지만, 원한다면 모든 서버 컴포넌트에서 재사용되는 단일 `queryClient`를 생성할 수도 있다:

```tsx
// app/getQueryClient.jsx
import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// cache()는 요청 단위로 범위가 지정되므로, 요청 간에 데이터가 유출되지 않는다.
const getQueryClient = cache(() => new QueryClient());

export default getQueryClient;
```

이렇게 하면 유틸리티 함수를 포함하여 서버 컴포넌트에서 호출되는 어디에서든 `getQueryClient()`를 호출하여 이 클라이언트를 가져올 수 있다는 장점이 있다. 단점은 `dehydrate(getQueryClient())`를 호출할 때마다 이미 직렬화되었거나 현재 서버 컴포넌트와 무관한 쿼리를 포함하여 _전체_ `queryClient` 를 불필요한 오버헤드로 직렬화한다는 것이다.

Next.js는 이미 `fetch()`를 활용하는 요청을 중복 제거하지만, `queryFn` 에서 다른 것을 사용하거나 이러한 요청을 자동으로 중복 제거하지 _않는_ 프레임워크를 사용하는 경우, 중복된 직렬화에도 불구하고 위에 설명된 대로 단일 `queryClient` 를 사용하는 것이 더 합리적일 수 있다.

> **_향후 개선사항으로, 마지막_** `dehydrateNew()` 호출 이후 _새로운_ 쿼리만 디하이드레이션 하는 `dehydrateNew()` 함수(이름은 미정)를 만드는 것을 고려하고 있다.

### 데이터 소유권과 재검증 {#data-ownership-and-revalidation}

서버 컴포넌트를 사용할 때는 데이터 소유권과 재검증에 대해 생각하는 것이 중요하다. 그 이유를 설명하기 위해 위의 예제를 수정해 볼 것이다:

```tsx
// app/posts/page.jsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Posts from './posts';

export default async function PostsPage() {
  const queryClient = new QueryClient();

  // 이제 fetchQuery()를 사용하고 있다.
  const posts = await queryClient.fetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* 여기가 새로운 부분이다. */}
      <div>Nr of posts: {posts.length}</div>
      <Posts />
    </HydrationBoundary>
  );
}
```

이제 `getPosts` 쿼리에서 가져온 데이터를 서버 컴포넌트와 클라이언트 컴포넌트 모두에서 렌더링하고 있다. 초기 페이지 렌더링에는 문제가 없겠지만, `staleTime` 이 지난 후 어떤 이유로 클라이언트에서 쿼리가 재검증될 때 어떤 일이 일어날까?

React Query는 *서버 컴포넌트를 재검증*하는 방법을 모른다. 따라서 클라이언트에서 데이터를 다시 fetch하여 React가 게시물 목록을 다시 렌더링하면 `Nr of posts: {posts.length}`가 동기화되지 않게 된다.

`staleTime: Infinity`로 설정하여 React Query가 절대 재검증하지 않도록 하면 괜찮지만, 이것은 애초에 React Query를 사용하는 이유가 아니다.

서버 컴포넌트와 함께 React Query를 사용하는 것은 다음과 같은 경우에 가장 합리적이다:

- React Query를 사용하는 앱이 있고 모든 데이터 fetch를 다시 작성하지 않고 서버 컴포넌트로 마이그레이션하려는 경우
- 익숙한 프로그래밍 패러다임을 원하지만 가장 합리적인 곳에 서버 컴포넌트의 이점을 활용하고 싶은 경우
- React Query는 제공하지만 선택한 프레임워크에서 제공하지 않는 일부 기능이 있는 경우

React Query를 서버 컴포넌트와 함께 사용하는 것이 언제 합리적인지에 대한 일반적인 조언을 주기는 어렵다. **새로운 서버 컴포넌트 앱을 시작하는 경우, 실제로 필요할 때까지 React Query를 사용하지 않고 프레임워크에서 제공하는 데이터 fetch 도구로 시작하는 것이 좋다.** 작업에 적합한 도구를 사용하자!

React Query를 사용하는 경우, 오류를 잡아야 하는 경우가 아니라면 되도록 `queryClient.fetchQuery` 를 피하는 것이다. 사용하더라도 결과를 서버에서 렌더링하거나 결과를 다른 컴포넌트에 전달하지 않아야 한다. 클라이언트 컴포넌트라 할지라도 말이다.

React Query의 관점에서 서버 컴포넌트는 데이터를 Prefetch하는 곳 그 이상도 이하도 아니다.

물론 서버 컴포넌트가 일부 데이터를 소유하고 클라이언트 컴포넌트가 다른 데이터를 소유하는 것은 괜찮다. 다만 이 두 곳이 동기화되지 않도록 해야 한다.

## 서버 컴포넌트를 사용한 스트리밍 {#streaming-with-server-components}

서버 컴포넌트 스트리밍은 Next.js 앱 라우터의 주요 기능 중 하나다. 이를 통해 애플리케이션의 일부가 렌더링될 준비가 되면 해당 부분을 즉시 브라우저로 전송 할 수 있다. 따라서 사용자는 전체 페이지가 로드되기를 기다릴 필요 없이 콘텐츠의 일부를 빠르게 볼 수 있다.

**Next.js `<Suspense>` 경계를 기준으로 이 스트리밍을 수행한다.** `<Suspense>` 는 React의 기본 기능으로, 로딩 상태를 선언적으로 처리할 수 있다. **Next.js에서는 `loading.tsx` 파일을 생성하면 해당 경로에 대해 자동으로 `<Suspense>` 경계가 생성된다.**

React Query는 이 스트리밍 메커니즘과 잘 어울린다. 위에서 설명한 prefetch 패턴을 사용하면, 각 `<Suspense>` 경계에 필요한 데이터를 React Query를 통해서 prefetch할 수 있다. 데이터 prefetch가 완료되면 Next.js는 해당 부분을 렌더링하고 브라우저로 스트리밍 할 수 있다.

중요한 점은, prefetch를 `await` 할 때 일시 중단이 발생한다는 것이다. 따라서 `useQeury` 를 사용하여 데이터를 fetch하는 경우에도, prefetch를 `await` 하면 스트리밍이 예상대로 작동한다.

현재는 모든 prefetch를 await 해야 스트리밍이 제대로 작동한다. 이는 모든 프리페치가 해당 `<Suspense>` 경계에서 중요한 콘텐츠로 취급되며, prefetch가 완료될 때까지 경계가 차단되는 것을 의미한다.

그러나 향후에는 `<Suspense>` 경계에 필수적이지 않은 "선택적" prefetch의 경우 `await` 을 건너뛰는 것이 가능해질 수 있다. 이렇게 하면 전체 `<Suspense>` 경계를 차단하지 않고도 가능한 한 빨리 prefetch를 시작할 수 있으며, 쿼리가 완료되는 즉시 데이터를 클라이언트로 스트리밍할 수 있다.

이는 사용자 상호작용 후에만 표시되는 콘텐츠를 prefetch 하거나, 무한 스크롤 쿼리의 첫 페이지는 `await` 하고 렌더링하지만 두 번째 페이지는 렌더링을 차단하지 않고 prefetch하는 등의 시나리오에서 유용할 수 있다.

## Next.js에서 Prefetch 없이 스트리밍하기 (실험적) {#experimental-streaming-without-prefetching-in-nextjs}

초기 페이지 로드 및 이후의 모든 페이지 탐색 시 요청 워터폴을 방지하기 위해서 앞서 자세히 설명한 Prefetch 솔루션을 추천하지만, prefetch를 완전히 건너뛰고 스트리밍 SSR이 작동하도록 하는 실험적인 방법이 있다: `@tanstack/react-query-next-experimental`

이 패키지를 사용하면 컴포넌트에서 `useSuspenseQuery`를 호출하는 것만으로 서버(클라이언트 컴포넌트)에서 데이터를 가져올 수 있다. 그러면 SuspenseBoundaries가 해결될 때 결과가 서버에서 클라이언트로 스트리밍된다. `<Suspense>` 경계로 감싸지 않고 `useSuspenseQuery`를 호출하면 가져오기가 해결될 때까지 HTML 응답이 시작되지 않는다. 상황에 따라 이것이 원하는 바일 수 있지만, 이것이 TTFB에 해를 끼칠 수 있다는 점을 기억해 두자.

이를 위해 앱을 `ReactQueryStreamedHydration` 컴포넌트로 감싼다:

```tsx
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
}
```

더 자세한 정보는 [NextJs Suspense 스트리밍 예제](https://tanstack.com/query/v5/docs/framework/react/examples/nextjs-suspense-streaming)를 확인한다.

가장 큰 장점은 더 이상 SSR이 작동하도록 쿼리를 수동으로 prefetch할 필요가 없으며, 결과를 스트리밍하는 것까지 여전히 가능하다는 것이다! 이는 훌륭한 DX와 낮은 코드 복잡성을 제공한다.

단점으로, prefetch을 사용하는 서버 컴포넌트는 초기 페이지 로드및 이후의 모든 탐색에 대해 요청 워터폴을 효과적으로 제거 하지만 이 접근 방식은 초기 페이지 로드 시에만 워터폴을 제거하고 페이지 탐색 시에는 워터폴을 제거할 수 없다.

bash

```bash
1. |> JS for <Feed>
2.   |> getFeed()
3.     |> JS for <GraphFeedItem>
4.       |> getGraphDataById()
```

이는 `getServerSideProps`/`getStaticProps`를 사용할 때보다 더 안좋다. 왜냐하면 그들과 함께라면 적어도 데이터와 코드 fetch를 병렬화할 수 있기 때문이다.

DX/반복/배포 속도를 낮은 코드 복잡성으로 성능보다 중요하게 여기거나, 깊게 중첩된 쿼리가 없거나, `useSuspenseQueries`와 같은 도구를 사용하여 병렬 fetch로 요청 워터폴을 잘 처리하고 있다면, 이는 좋은 절충안이 될 수 있다.
