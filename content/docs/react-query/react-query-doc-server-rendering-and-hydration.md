---
title: 서버 렌더링 & 하이드레이션
description:
date: 2024-03-30
tags: [ssr, nextjs]
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/v5/docs/framework/react/guides/ssr',
    },
  ]
---

이 가이드에서는 React Query를 서버 렌더링과 함께 사용하는 방법을 배우게 된다.

**Prefetching & Router Integration** 가이드와 **Performance & Request Waterfalls** 가이드를 확인하는 것이 좋다.

스트리밍, 서버 컴포넌트, 새로운 Next.js 앱 라우터와 같은 고급 서버 렌더링 패턴에 대해서는 **Advanced Server Rendering** 가이드를 참고한다.

단순히 코드만 보고 싶다면 아래 [**Full Next.js pages 라우터 예제**](https://tanstack.com/query/v5/docs/framework/react/guides/ssr#full-nextjs-pages-router-example) 또는 [**Full Remix 예제**](https://tanstack.com/query/v5/docs/framework/react/guides/ssr#full-remix-example)로 바로 이동할 수 있다.

## 서버 렌더링과 React Query {#server-rendering-and-react-query}

서버 렌더링이란 무엇일까? 이 가이드의 나머지 부분에서는 이 개념에 익숙할 것이라고 가정하겠지만, 서버 렌더링이 React Query와 어떻게 관련되는지 살펴봐야한다. 서버 렌더링은 사용자가 페이지를 로드할 때 즉시 콘텐츠를 볼 수 있도록 서버에서 초기 HTML을 생성하는 것이다. 이는 페이지가 요청될 때 실시간으로 이루어질 수 있고(SSR), 이전 요청이 캐시되었거나 빌드 시점에 미리 이루어질 수도 있다(SSG).

요청 워터폴 가이드를 읽었다면 다음을 기억할 것이다:

```bash
1. |-> Markup (without content)
2.   |-> JS
3.     |-> Query
```

클라이언트 렌더링 애플리케이션에서는 사용자에게 콘텐츠를 표시하기 전에 최소 3번의 서버 왕복이 필요하다. 서버 렌더링의 관점에서 보면 다음과 같이 바뀐다:

```bash
1. |-> Markup (with content AND initial data)
2.   |-> JS
```

**1.** 이 완료되면 사용자가 즉시 콘텐츠를 볼 수 있고, **2.** 가 완료되면 페이지가 상호작용 가능해진다. 마크업에 이미 필요한 초기 데이터가 포함되어 있기 때문에 **3.** 은 클라이언트에서 실행되지 않아도 된다. 데이터를 다시 확인해야 하는 경우에만 실행된다.

위의 프로세스는 클라이언트 사이드에서 발생한다. 서버 사이드에서는 마크업을 생성/렌더링하기 전에 해당 데이터를 **prefetch**해야 하며, 직렬화 가능한 형식으로 **디하이드레이션**해야 한다. 그리고 클라이언트에서는 이 데이터를 React Query 캐시로 **하이드레이션**해야 하여 새로운 fetch를 할 필요가 없다.

이 세 단계를 React Query로 구현하는 방법을 계속 학습해 보자.

## Suspense에 대한 간단한 메모 {#a-quick-note-on-suspense}

이 가이드는 일반 `useQuery` API를 사용한다. 꼭 권장되는 것은 아니지만, `useSuspenseQuery`로 대체하는 것도 가능하다. 단, **모든 쿼리를 반드시 사전에 prefetch해야 한다**.

장점은 클라이언트에서 `<Suspense>`를 사용하여 로딩 상태를 처리할 수 있다는 것이다.

`useSuspenseQuery`를 사용할 때 prefetch를 잊으면 프레임워크에 따라 결과가 달라진다. 일부 경우 데이터가 중단되어 서버에서 fetch하지만 클라이언트에는 하이드레이션되지 않아 다시 fetch하게 된다. 이러한 경우 서버와 클라이언트가 서로 다른 것을 렌더링하려 하므로 마크업 하이드레이션 불일치가 발생할 수 있다.

## 초기 설정 {#initial-setup}

React Query를 사용하려면 항상 `queryClient` 를 생성하고 애플리케이션을 `<QueryClientProvider>` 로 래핑해야 한다. 서버 렌더링을 할 때는 `queryClient` 인스턴스를 **애플리케이션 내부의 React 상태(ref도 가능)에서 생성**해야 한다. **이렇게 하면 각 사용자와 요청마다 데이터가 공유되지 않으면서도 컴포넌트 생명 주기당 `queryClient`를 한 번만 생성할 수 있다**.

Next.js pages 라우터:

```tsx
// _app.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 절대 하면 안 된다:
// const queryClient = new QueryClient()
//
// 파일 루트 수준에서 queryClient를 생성하면 캐시가 모든 요청 간에 공유되어
// 모든 데이터가 모든 사용자에게 전달된다.
// 성능뿐만 아니라 민감한 데이터도 유출될 수 있다.

export default function MyApp({ Component, pageProps }) {
  // 대신 이렇게 하면 각 요청마다 고유의 캐시가 보장된다:
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // SSR에서는 일반적으로 0보다 높은 staleTime을 설정하여
            // 클라이언트에서 즉시 다시 fetch하는 것을 방지한다.
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
```

## initialData로 빠르게 시작하기 {#get-started-fast-with-initialData}

React Query에서 `dehydrate` / `hydrate` API를 사용하지 않고 데이터를 쉽고 빠르게 prefetch하는 방법은 `useQuery` 의 `initialData` 옵션에 초기 데이터를 직접 전달하는 것이다. Next.js의 `getServerSideProps` 를 사용한 예시를 살펴보자.

```tsx
export async function getServerSideProps() {
  const posts = await getPosts();
  return { props: { posts } };
}

function Posts(props) {
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    initialData: props.posts,
  });
  // ...
}
```

이 방식은 `getStaticProps`, `getInitialProps` 에서 동작하며, 유사한 함수를 가진 다른 프레임워크에서도 동일한 패턴을 적용할 수 있다.

설정이 간단하며 일부 사례에 빠른 해결책이 될 수 있지만, 다른 접근 방식과 비교했을 때 **고려해야 할 몇 가지 트레이드오프**가 있다:

- 트리의 더 깊은 곳에 있는 컴포넌트에서 `useQuery`를 호출하는 경우 `initialData`를 해당 지점까지 전달해야 한다.

- 여러 위치에서 동일한 쿼리로 `useQuery`를 호출하는 경우, 하나에만 `initialData`를 전달하는 것은 취약할 수 있으며 앱이 변경될 문제가될 수 있다. `initialData` 가 있는 `useQuery` 를 가진 컴포넌트를 제거하거나 이동하면 더 깊이 중첩된 `useQuery` 에는 더 이상 데이터가 존재하지 수 있다. 모든 쿼리에 `initialData` 를 전달하는 것도 번거롭다.

- 서버에서 쿼리가 언제 fetch 됐는지 알 수 없으므로 `dataUpdatedAt` 과 쿼리 refetch 여부는 페이지가 로드된 시점을 기준으로 한다.

- 쿼리에 대한 데이터가 이미 캐시에 있는 경우, **새 데이터가 기존 데이터보다 더 최신이더라도** `initialData` 는 이 데이터를 절대 덮어쓰지 않는다.
  - 왜 이것이 특히 안 좋은지 이해하려면 위의 `getServerSideProps` 예제를 보면 알 수 있다. 페이지를 여러 번 앞뒤로 이동하면 `getServerSideProps` 가 매번 호출되어 새 데이터를 fetch하지만, `initialData` 옵션을 사용하기 때문에 클라이언트 캐시와 데이터는 절대 업데이트되지 않는다.

전체 하이드레이션 솔루션을 사용하는 것은 간단하며 이러한 단점이 없다.

## 하이드레이션 API 사용하기 {#using-the-hydration-apis}

약간의 추가 설정만으로도 프리로드 단계에서 `queryClient`를 사용하여 쿼리를 prefetch하고, 직렬화된 버전의 `queryClient` 를 앱의 렌더링 부분에 전달하여 재사용할 수 있다. 이렇게 하면 위의 단점을 피할 수 있다. 하이드레이션 API는 일반적으로 다음과 같은 단계가 있다:

- 프레임워크 로더 함수에서 `const queryClient = new QueryClient(options)`를 생성한다.

- 로더 함수에서 prefetch하려는 각 쿼리에 대해 `await queryClient.prefetchQuery(...)`를 실행한다.

  - 가능한 경우 `await Promise.all(...)`을 사용하여 쿼리를 병렬로 fetch하는 것이 좋다.
  - prefetch 되지 않은 쿼리가 있어도 괜찮다. 이러한 쿼리는 서버에서 렌더링되지 않고 대신 애플리케이션이 대화형이 된 후 클라이언트에서 fetch한다. 이는 사용자 상호 작용 후에만 표시되거나 페이지 아래쪽에 있어 중요하지 않은 콘텐츠에 좋다.

- 로더에서 `dehydrate(queryClient)`를 반환한다. 이를 반환하는 정확한 구문은 프레임워크마다 다르다.

- `<HydrationBoundary state={dehydratedState}>` 로 트리를 감싸고, 여기서 `dehydratedState` 는 프레임워크 로더에서 가져온다. `dehydratedState` 를 가져오는 방법도 프레임워크마다 다르다.
  - 이는 각 경로에 대해 수행하거나 상용구를 피하기 위해 애플리케이션 상단에서 수행할 수 있다.

> **_흥미로운 세부사항은 실제로 세 개의_** `queryClient`가 관련되어 있다는 것이다. 프레임워크 로더는 렌더링 전에 발생하는 일종의 "프리로딩" 단계이며, 이 단계에는 prefetch를 수행하는 자체 `queryClient`가 있다. 이 단계의 dehydrated 결과는 서버 렌더링 프로세스와 클라이언트 렌더링 프로세스 **모두**에 전달되며, 각각 자체 `queryClient`를 가지고 있다. 이를 통해 둘 다 동일한 데이터로 시작하여 동일한 마크업을 반환할 수 있다.

> **_서버 컴포넌트는 React 컴포넌트 트리의 일부를 "프리로드"(사전 렌더링)할 수도 있는 또 다른 형태의 "프리로딩" 단계다. 자세한 내용은 [고급 서버 렌더링 가이드](https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr)를 참조한다._**

### 전체 Next.js 페이지 라우터 예제 {#full-nextjs-pages-router-example}

> 앱 라우터 문서는 고급 서버 렌더링 가이드를 참조한다.

초기 설정:

```tsx
// _app.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // SSR에서는 보통 클라이언트에서 즉시 리페칭하는 것을 피하기 위해
            // 0 이상의 staleTime을 설정하는 것이 좋다.
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
```

각 라우트에서:

```tsx
// pages/posts.jsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from '@tanstack/react-query';

// getServerSideProps도 가능하다.
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
  // 이 useQuery는 <PostsRoute>의 더 깊은 자식에서도
  // 동일하게 발생할 수 있으며, 어느 쪽이든 데이터는 즉시 사용 가능하다.
  const { data } = useQuery({ queryKey: ['posts'], queryFn: getPosts });

  // 이 쿼리는 서버에서 prefetch되지 않았으며 클라이언트에서
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

## 선택사항 - 보일러플레이트 제거하기 {#optional-remove-boilerplate}

모든 라우트에서 이 부분이 많은 보일러플레이트처럼 보일 수 있다:

```tsx
export default function PostsRoute({ dehydratedState }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Posts />
    </HydrationBoundary>
  );
}
```

이 접근 방식에 문제는 없지만, 이 보일러플레이트를 없애고 싶다면 Next.js에서 다음과 같이 설정을 수정할 수 있다:

```tsx
// _app.tsx
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

export default function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </HydrationBoundary>
    </QueryClientProvider>
  )
}

// pages/posts.tsx
// HydrationBoundary가 있는 PostsRoute를 제거하고 대신 Posts를 직접 내보낸다:
export default function Posts() { ... }
```

## 의존성 있는 쿼리 prefetch {#prefetching-dependent-queries}

Prefetch 가이드에서 **의존성 있는 쿼리를 prefetch**하는 방법을 배웠지만, 프레임워크 로더에서는 어떻게 해야 할까? 다음 코드를 살펴보자:

```tsx
// 사용자 가져오기
const { data: user } = useQuery({
  queryKey: ['user', email],
  queryFn: getUserByEmail,
});

const userId = user?.id;

// 그런 다음 사용자의 프로젝트 가져오기
const {
  status,
  fetchStatus,
  data: projects,
} = useQuery({
  queryKey: ['projects', userId],
  queryFn: getProjectsByUser,
  // userId가 존재할 때까지 쿼리가 실행되지 않는다.
  enabled: !!userId,
});
```

이를 서버 렌더링할 수 있도록 prefetch하려면 어떻게 해야 할까? 다음은 예시다:

```tsx
export async function getServerSideProps() {
  const queryClient = new QueryClient();

  const user = await queryClient.fetchQuery({
    queryKey: ['user', email],
    queryFn: getUserByEmail,
  });

  if (user?.userId) {
    await queryClient.prefetchQuery({
      queryKey: ['projects', userId],
      queryFn: getProjectsByUser,
    });
  }

  return { props: { dehydratedState: dehydrate(queryClient) } };
}
```

물론 이는 더 복잡해질 수 있지만, 이러한 로더 함수는 단순한 JavaScript이기 때문에 언어의 모든 기능을 사용하여 로직을 구축할 수 있다. 서버 렌더링하려는 모든 쿼리를 prefetch해야 한다.

## 에러 핸들링 {#error-handling}

React Query는 기본적으로 우아한 성능 저하 전략을 사용한다. 이는 다음을 의미한다:

- `queryClient.prefetchQuery(...)`는 절대 오류를 발생시키지 않는다.
- `dehydrate(...)`는 성공한 쿼리만 포함하고 실패한 쿼리는 포함하지 않는다.

이로 인해 실패한 모든 쿼리는 클라이언트에서 재시도되며 서버 렌더링된 출력에는 전체 내용 대신 로딩 상태가 포함된다.

이는 좋은 기본값이지만 때로는 원하는 바가 아닐 수 있다. 중요한 내용이 누락된 경우 상황에 따라 404 또는 500 상태 코드로 응답하고 싶을 수 있다. 이러한 경우 `queryClient.fetchQuery(...)`를 대신 사용하면 실패 시 오류를 발생시켜 적절한 방식으로 처리할 수 있다.

```tsx
let result
try {
  result = await queryClient.fetchQuery(...)
} catch (error) {
  // 프레임워크 문서를 참조하여 오류를 핸들링한다.
}

// 여기서 잘못된 `result`도 확인하고 핸들링할 수 있다.
```

어떤 이유로 재시도를 피하기 위해 실패한 쿼리를 dehydrated 상태에 포함시키려면 `shouldDehydrateQuery` 옵션을 사용하여 기본 함수를 재정의하고 자체 로직을 구현할 수 있다:

```tsx
dehydrate(queryClient, {
  shouldDehydrateQuery: (query) => {
    // 이렇게 하면 실패한 쿼리를 포함한 모든 쿼리가 포함되지만,
    // `query`를 검사하여 자체 로직을 구현할 수도 있다.
    return true;
  },
});
```

## 직렬화 {#serialization}

Next.js에서 `return { props: { dehydratedState: dehydrate(queryClient) } }`를 할 때 일어나는 일은 `queryClient`의 `dehydratedState` 가 프레임워크에 의해 직렬화되어 마크업에 포함되고 클라이언트로 전송될 수 있다는 것이다.

기본적으로 이러한 프레임워크는 안전하게 직렬화/파싱할 수 있는 것들만 반환하는 것을 지원하므로 `undefined`, `Error`, `Date`, `Map`, `Set`, `BigInt`, `Infinity`, `NaN`, `-0`, 정규식 등은 지원하지 않는다. 이는 쿼리에서 이러한 값들을 반환할 수 없다는 것을 의미한다. 이러한 값들을 반환하는 것이 원하는 바라면 [**superjson**](https://github.com/blitz-js/superjson)이나 유사한 패키지를 확인해본다.

사용자 정의 SSR 설정을 사용하는 경우 이 단계를 직접 처리해야 한다. 처음에는 `JSON.stringify(dehydratedState)`를 사용하는 것이 좋을 수 있지만, 이는 기본적으로 `<script>alert('Oh no..')</script>`와 같은 것을 이스케이프하지 않기 때문에 애플리케이션에서 쉽게 **XSS 취약점**으로 이어질 수 있다. **superjson**도 값을 **이스케이프하지 않으며** 사용자 정의 SSR 설정에서 단독으로 사용하기에 안전하지 않다(출력을 이스케이프하는 추가 단계를 추가하지 않는 한). 대신 **Serialize JavaScript**나 **devalue**와 같은 라이브러리를 사용하는 것이 좋다. 이들은 기본적으로 XSS 인젝션에 안전하다.

## 요청 워터폴에 대한 참고사항 {#a-note-about-request-warterfalls}

**성능 및 요청 워터폴 가이드**에서 서버 렌더링이 좀 더 복잡한 중첩된 워터폴 중 하나를 어떻게 변경하는지 다시 살펴보겠다고 언급했다. 예제를 다시 확인해 보겠지만, 다시 한 번 살펴보면 `<Feed>` 컴포넌트 내에 코드 스플리팅된 `<GraphFeedItem>` 컴포넌트가 있다. 이는 피드에 그래프 항목이 포함된 경우에만 렌더링되며 이 두 컴포넌트는 각자 자신의 데이터를 fetch한다. 클라이언트 렌더링을 사용하면 다음과 같은 요청 워터폴이 발생한다:

```bash
1. |> Markup (without content)
2.   |> JS for <Feed>
3.     |> getFeed()
4.       |> JS for <GraphFeedItem>
5.         |> getGraphDataById()
```

서버 렌더링의 좋은 점은 위의 내용을 다음과 같이 변경할 수 있다는 것이다:

```bash
1. |> Markup (with content AND initial data)
2.   |> JS for <Feed>
2.   |> JS for <GraphFeedItem>
```

쿼리는 더 이상 클라이언트에서 fetch하지 않고 대신 마크업에 데이터가 포함되었음을 주목한다. 이제 JS를 병렬로 로드할 수 있는 이유는 `<GraphFeedItem>`이 서버에서 렌더링되었기 때문에 클라이언트에서도 이 JS가 필요할 것이라는 것을 알고 있으며 마크업에 이 청크에 대한 script 태그를 삽입할 수 있기 때문이다. 서버에서는 여전히 다음과 같은 요청 워터폴이 있을 것이다:

```bash
1. |> getFeed()
2.   |> getGraphDataById()
```

피드를 fetch하기 전에는 그래프 데이터도 fetch해야 하는지 알 수 없다. 이들은 의존적인 쿼리다. 이는 일반적으로 지연 시간이 더 낮고 안정적인 서버에서 발생하기 때문에 종종 큰 문제가 되지 않는다.

놀랍게도 우리는 워터폴 대부분을 제거했다! 그러나 한 가지 문제가 있다. 이 페이지를 `/feed` 페이지라고 하고 `/posts`와 같은 다른 페이지도 있다고 가정해 보자. URL 표시줄에 `www.example.com/feed`를 직접 입력하고 Enter 키를 누르면 이러한 훌륭한 서버 렌더링 이점을 모두 얻을 수 있지만, 대신 `www.example.com/posts`를 입력한 다음 `/feed` **링크를 클릭**하면 다음과 같이 되돌아간다:

```bash
1. |> JS for <Feed>
2.   |> getFeed()
3.     |> JS for <GraphFeedItem>
4.       |> getGraphDataById()
```

SPA에서는 서버 렌더링이 초기 페이지 로드에만 작동하고 이후 탐색에는 작동하지 않기 때문이다.

최신 프레임워크는 종종 초기 코드와 데이터를 병렬로 가져와 이 문제를 해결하려고 시도한다. 따라서 의존 쿼리를 prefetch하는 방법을 포함하여 이 가이드에서 설명한 prefetch 패턴을 사용하여 Next.js 또는 Remix를 사용하는 경우 실제로는 다음과 같이 보일 것이다:

```bash
1. |> JS for <Feed>
1. |> getFeed() + getGraphDataById()
2.   |> JS for <GraphFeedItem>
```

이것이 훨씬 낫지만, 이를 더 개선하려면 서버 컴포넌트를 사용하여 단일 왕복으로 이를 평탄화할 수 있다. **고급 서버 렌더링 가이드**에서 방법을 알아본다.

## 팁, 트릭 및 주의사항 {#tips-tricks-and-caveats}

### stale 시간은 서버에서 쿼리를 fetch한 시점부터 측정된다 {#staleness-is-measured-from-when-the-query-was-fetched-on-the-server}

쿼리는 `dataUpdatedAt`에 따라 오래된 것으로 간주된다. 여기서 주의할 점은 이것이 제대로 작동하려면 서버에 올바른 시간이 있어야 한다는 것이지만, UTC가 사용되므로 시간대는 이 문제에 영향을 미치지 않는다.

`staleTime` 의 기본값이 `0` 이기 때문에 페이지 로드 시 기본적으로 쿼리가 백그라운드에서 다시 fetch된다. 특히 마크업을 캐시하지 않는 경우 이 중복 fetch를 피하려면 더 높은 `staleTime`을 사용할 수 있다.

CDN에서 마크업을 캐싱할 때 이러한 만료된 쿼리의 refetch는 완벽하게 일치한다! 서버에서 페이지를 다시 렌더링하지 않도록 페이지 자체의 캐시 시간을 적절히 높게 설정할 수 있지만, 사용자가 페이지를 방문하자마자 백그라운드에서 데이터를 다시 fetch하도록 쿼리의 `staleTime`을 더 낮게 구성할 수 있다. 페이지를 일주일 동안 캐시하지만 페이지 로드 시 데이터가 하루 이상 오래된 경우 자동으로 데이터를 다시 fetch하고 싶을 수 있다.

### 서버의 높은 메모리 사용량 {#high-memory-consumption-on-server}

모든 요청에 대해 `QueryClient`를 생성하는 경우 React Query는 이 클라이언트에 대해 격리된 캐시를 생성하며, 이는 `gcTime` 기간 동안 메모리에 보존된다. 해당 기간 동안 요청 수가 많은 경우 서버에서 메모리 사용량이 높아질 수 있다.

서버에서 `gcTime` 의 기본값은 `Infinity` 이며, 이는 수동 가비지 컬렉션을 비활성화하고 요청이 완료되면 자동으로 메모리를 지운다. 명시적으로 `Infinity`가 아닌 `gcTime`을 설정하는 경우 조기에 캐시를 지워야 한다.

`gcTime`을 `0`으로 설정하면 하이드레이션 오류가 발생할 수 있으므로 피해야한다. 이는 **하이드레이션 경계**가 렌더링에 필요한 데이터를 캐시에 배치하지만, 렌더링이 완료되기 전에 가비지 컬렉터가 데이터를 제거하면 문제가 발생할 수 있기 때문이다. 더 짧은 `gcTime`이 필요한 경우 앱이 데이터를 참조할 수 있는 충분한 시간을 허용하기 위해 `2 * 1000`으로 설정하는 것이 좋다.

캐시가 더 이상 필요하지 않을 때 캐시를 지우고 메모리 사용량을 줄이려면 요청이 처리되고 dehydrated 상태가 클라이언트로 전송된 후 `queryClient.clear()` 호출을 추가한다.

또는 더 작은 `gcTime`을 설정한다.

### Next.js rewrites에 대한 주의사항 {#caveat-for-nextjs-rewrite}

[**Automatic Static Optimization**](https://nextjs.org/docs/advanced-features/automatic-static-optimization) 또는 `getStaticProps`와 함께 [**Next.js의 rewrites 기능**](https://nextjs.org/docs/api-reference/next.config.js/rewrites)을 사용하는 경우 주의할 점이 있다. React Query에 의해 두 번째 하이드레이션이 발생한다. 그 이유는 **[Next.js가 클라이언트에서 rewrites 구문 파싱](https://nextjs.org/docs/api-reference/next.config.js/rewrites#rewrite-parameters)하고 하이드레이션 후에 모든 매개변수를 수집하여 `router.query`에 제공할 수 있도록 해야 하기 때문이다.**

그 결과 모든 하이드레이션 데이터에 대한 참조 동등성이 누락되며, 예를 들어 데이터가 컴포넌트의 props로 사용되거나 `useEffect` / `useMemo` 의 종속성 배열에 사용되는 곳에서 트리거된다.
