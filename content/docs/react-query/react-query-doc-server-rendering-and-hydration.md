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

이 가이드에서는 서버 렌더링 환경에서 React Query를 활용하는 방법을 알아본다.

시작하기 전에 다음을 먼저 읽어보는 것을 추천한다.

- [성능 & 요청 워터폴](https://www.vigorously.xyz/docs/react-query/react-query-doc-performance-and-request-waterfalls/)
- [프리페칭 & 라우터 통합](https://www.vigorously.xyz/docs/react-query/react-query-doc-prefetching-and-router-integration/)

스트리밍, 서버 컴포넌트, Next.js 앱 라우터와 같은 고급 서버 렌더링 기법이 궁금하다면 다음을 참조한다.

- [고급 서버 렌더링](https://www.vigorously.xyz/docs/react-query/react-query-doc-advanced-server-rendering/)

코드 예제만 바로 확인하고 싶다면 다음을 참조한다.

- [Next.js pages 라우터 예제](https://tanstack.com/query/v5/docs/framework/react/guides/ssr#full-nextjs-pages-router-example)
- [Remix 예제](https://tanstack.com/query/v5/docs/framework/react/guides/ssr#full-remix-example)

## 서버 렌더링과 React Query {#server-rendering-and-react-query}

서버 렌더링은 사용자가 웹 페이지를 요청했을 때, 서버에서 미리 HTML을 생성하여 보내주는 것을 말한다. 이렇게 하면 사용자는 페이지를 로드하자마자 바로 콘텐츠를 볼 수 있다.

서버 렌더링은 사용자가 요청할 때마다 실시간으로 HTML을 만들 수도 있고(SSR), 이전에 만들어 둔 HTML을 캐시에서 가져오거나 웹 사이트를 빌드할 때 미리 만들어 둘 수도 있다(SSG).

이전에 요청 워터폴 가이드를 읽었다면, 클라이언트 렌더링 애플리케이션은 사용자에게 콘텐츠를 보여주기 위해 최소 3번의 왕복이 필요하다는 걸 기억할 것이다.

```text
1. |-> Markup (without content)
2.   |-> JS
3.     |-> Query
```

하지만 서버 렌더링을 사용하면 다음과 같이 달라진다.

```text
1. |-> Markup (with content AND initial data)
2.   |-> JS
```

- 1번이 완료되면 사용자는 바로 콘텐츠를 볼 수 있고,
- 2번이 완료되면 페이지와 상호작용할 수 있게 된다.
- 필요한 초기 데이터가 이미 마크업에 포함되어 있기 때문에, 3번 과정에서의 데이터 요청은 꼭 필요한 경우에만 일어난다.

위의 과정은 클라이언트에서 일어나는 일이다. 서버에서는 마크업을 만들기 전에 필요한 데이터를 미리 가져와야 한다(**prefetch**).

그리고 이 데이터를 클라이언트로 보낼 수 있는 형태로 가공해야 하는데, 이걸 디하이드레이션(**dehydration**)이라고 한다.

클라이언트는 받은 데이터를 React Query 캐시에 넣어서(**hydration**), 새로 데이터를 요청할 필요가 없게 만든다.

이제 React Query로 이 prefetch, dehydration, hydration 과정을 어떻게 구현하는지 계속 알아보자!

## Suspense에 대한 주의사항 {#a-quick-note-on-suspense}

이 가이드에서는 `useQuery` API를 주로 사용한다. 물론 `useSuspenseQuery` 를 대신 사용할 수도 있다. 그런데 `useSuspenseQuery` 를 쓸 때는 꼭 기억해야 할 점이 있다. 바로 **모든 쿼리 데이터를 미리 가져와야 한다**는 것이다.

`useSuspenseQuery` 를 쓰면 좋은 점은 클라이언트에서 `<Suspense>` 를 사용해서 로딩 상태를 처리할 수 있다는 것이다.

그런데 `useSuspenseQuery` 를 쓸 때 데이터를 미리 가져오지 않으면, 어떤 일이 일어날지는 사용하는 프레임워크에 따라 달라진다.

어떤 경우에는 데이터를 가져오기가 중단되어서, 서버에서는 데이터를 가져오지만 클라이언트에는 그 데이터가 전달되지 않는다. 이 경우 클라이언트는 다시 데이터를 요청하게 된다.

이런 상황이 일어나면 서버와 클라이언트가 서로 다른 내용을 보여주려고 하기 때문에, 화면이 깨지는 현상이 일어날 수 있다. 우리는 이걸 "마크업 하이드레이션 불일치"라고 부른다.

## 초기 설정 {#initial-setup}

React Query에서 `queryClient` 는 모든 쿼리와 뮤테이션의 상태를 관리하는 중심 허브다.

`queryClient` 는 애플리케이션 전체를 `QueryClientProvider` 로 감싸서 제공된다.

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 나머지 애플리케이션 */}
    </QueryClientProvider>
  );
}
```

그런데 SSR 환경에서는 이 `queryClient` 를 설정할 때 주의해야 할 점이 있다.

먼저, `queryClient` 를 파일의 최상단이나 컴포넌트 밖에서 생성하면 안 된다. 그렇게 하면 모든 요청이 같은 `queryClient` 인스턴스를 공유하게 되는데, 이는 모든 사용자가 같은 쿼리 캐시를 공유한다는 것을 의미한다. 이는 성능 문제를 일으킬 뿐만 아니라, 한 사용자의 데이터가 다른 사용자에게 노출되는 심각한 보안 문제를 야기할 수 있다.

대신, `queryClient` 는 각 요청마다 새로 생성되어야 한다. 이를 위해 React의 `useState` 훅을 사용할 수 있다. ( `ref` 도 가능하다)

```jsx
export default function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
```

`useState` 훅의 초기값으로 `queryClient` 를 생성하는 함수를 전달하면, 컴포넌트가 마운트될 때마다(즉, 각 요청마다) 새로운 `queryClient` 인스턴스가 생성된다. 이렇게 하면 각 사용자가 자신만의 독립적인 쿼리 캐시를 가질 수 있다.

또한, SSR 환경에서는 `staleTime` 옵션을 설정하는 것이 일반적이다. `staleTime` 은 데이터가 오래된 것으로 간주되기 전까지의 시간을 말한다. SSR에서는 이 값을 0보다 크게 설정하는 것이 좋은데, 그렇게 하면 서버에서 렌더링된 초기 데이터를 클라이언트에서 즉시 다시 fetch하는 것을 방지할 수 있다.

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

이렇게 `staleTime` 을 설정하면, 서버에서 렌더링된 데이터는 1분 동안 신선한 것으로 간주되어 클라이언트에서 불필요한 refetch를 하지 않게 된다.

## initialData로 빠르게 시작하기 {#get-started-fast-with-initialData}

`initialData` 는 `useQuery` 로 데이터를 fetch하기 전에 초기 데이터를 제공하는 옵션이다.

SSR 시나리오에서는 서버에서 데이터를 fetch한 후 이 데이터를 `initialData` 로 전달하는 방식으로 사용할 수 있다.

Next.js의 페이지 라우터를 예로 들면, `getServerSideProps` 또는 `getStaticProps` 에서 데이터를 fetch하고, 이를 페이지 컴포넌트의 props로 전달한다. 그리고 페이지 컴포넌트에서는 `useQuery` 의 `initialData` 옵션에 이 props를 전달하는 방식이다.

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

이 방식은 설정이 간단하고 직관적이라는 장점이 있다. 하지만 몇 가지 한계와 트레이드오프가 있다.

1. **데이터 전달의 문제**:
   - 만약 페이지의 깊은 곳에 있는 컴포넌트에서 `useQuery` 를 사용한다면, `initialData` 를 해당 컴포넌트까지 계속 전달해 주어야 한다. 이는 컴포넌트 구조가 변경되면 데이터 전달 로직도 함께 변경해야 함을 의미한다.
2. **중복 쿼리의 문제**:
   - 같은 쿼리를 여러 컴포넌트에서 사용한다면, 모든 컴포넌트에 `initialData` 를 전달해야 한다. 그렇지 않으면 일부 컴포넌트는 초기 데이터 없이 렌더링될 수 있다. 이는 유지보수 측면에서 취약점이 될 수 있다.
3. **데이터 신선도 판단의 문제**:
   - `initialData` 를 사용하면, 서버에서 데이터를 fetch한 정확한 시점을 알 수 없다. 따라서 React Query는 데이터의 신선도를 페이지 로드 시점을 기준으로 판단할 수밖에 없다. 이는 실제 데이터의 업데이트 시점과 차이가 있을 수 있다.
4. **캐시 데이터 업데이트의 문제**:
   - 가장 중요한 문제는, 쿼리 키에 해당하는 데이터가 이미 캐시에 존재할 때다. `initialData` 는 캐시의 데이터를 절대 덮어쓰지 않는다.
   - 예를 들어, `getServerSideProps` 를 사용하면 페이지를 이동할 때마다 서버에서 새 데이터를 fetch한다. 하지만 `initialData` 를 사용하면, 클라이언트의 캐시 데이터는 절대 업데이트되지 않는다. 서버에서 가져온 최신 데이터가 있어도, 캐시의 오래된 데이터를 계속 사용하게 된다.

이러한 한계 때문에, React Query는 `initialData` 대신 `hydrate` 와 `dehydrate` 를 사용하는 전체 하이드레이션 방식을 권장한다.

전체 하이드레이션 방식에서는 서버에서 fetch한 데이터를 `dehydrate` 를 통해 직렬화하고, 이를 클라이언트에 전달한다. 클라이언트에서는 `hydrate` 를 통해 이 데이터를 쿼리 캐시에 복원한다. 이 방식은 데이터 전달, 중복 쿼리, 데이터 신선도, 캐시 업데이트 등의 문제를 모두 해결할 수 있다.

물론 `initialData` 가 유용한 경우도 있다. 간단한 시나리오에서 빠르게 적용할 수 있다는 장점이 있다. 하지만 애플리케이션의 규모가 커지고 복잡해질수록, 전체 하이드레이션 방식이 더 안정적이고 유지보수하기 좋은 선택이다.

## 하이드레이션 API 사용하기 {#using-the-hydration-apis}

하이드레이션 API는 크게 세 단계로 이루어진다:

1. **프레임워크 로더 함수에서 QueryClient 생성 및 쿼리 prefetch**

   프레임워크 로더 함수는 서버 사이드 렌더링 전에 실행되는 일종의 "프리로딩" 단계다. 이 단계에서는 새로운 `QueryClient` 를 생성한다.

   ```javascript
   const queryClient = new QueryClient(options);
   ```

   그리고 이 `queryClient`를 사용하여 필요한 쿼리를 prefetch한다.

   ```javascript
   await queryClient.prefetchQuery(['posts'], fetchPosts);
   await queryClient.prefetchQuery(['users'], fetchUsers);
   ```

   가능하다면 `Promise.all` 을 사용하여 여러 쿼리를 병렬로 fetch하는 것이 좋다. 이는 성능 향상에 도움이 된다.

   ```javascript
   await Promise.all([
     queryClient.prefetchQuery(['posts'], fetchPosts),
     queryClient.prefetchQuery(['users'], fetchUsers),
   ]);
   ```

   모든 쿼리를 prefetch할 필요는 없다. 사용자 상호작용 후에만 필요한 데이터나 페이지 하단의 중요하지 않은 데이터는 클라이언트에서 fetch해도 된다.

2. **Dehydrate QueryClient 및 dehydrated state 반환**

   쿼리 prefetch가 완료되면, `queryClient` 를 dehydrate한다.

   ```javascript
   const dehydratedState = dehydrate(queryClient);
   ```

   이 `dehydratedState` 는 직렬화된 형태의 쿼리 캐시다. 이를 프레임워크 로더 함수에서 반환한다. 정확한 반환 구문은 사용하는 프레임워크에 따라 다르다.

3. **HydrationBoundary로 애플리케이션 감싸기**

   클라이언트에서는 `dehydratedState` 를 받아 `<HydrationBoundary>` 컴포넌트의 `state` prop으로 전달한다.

   ```jsx
   <HydrationBoundary state={dehydratedState}>
     {/* 애플리케이션 */}
   </HydrationBoundary>
   ```

   `<HydrationBoundary>` 는 dehydrated state를 받아 새로운 `QueryClient` 를 생성하고, 이 state를 hydrate한다. 이렇게 생성된 `QueryClient` 는 `<QueryClientProvider>` 를 통해 애플리케이션에 제공된다.

   `<HydrationBoundary>` 는 각 경로마다 사용할 수도 있고, 코드 중복을 피하기 위해 애플리케이션의 최상단에 한 번만 사용할 수도 있다.

**세 개의 QueryClient**

하이드레이션 과정에는 실제로 세 개의 `QueryClient` 가 관련되어 있다.

1. 프레임워크 로더 함수에서 생성되는 `QueryClient`. 이 `QueryClient` 는 쿼리 prefetch를 수행한다.
2. 서버 렌더링 과정에서 생성되는 `QueryClient`. 이 `QueryClient` 는 dehydrated state를 hydrate하여 초기 상태를 복원한다.
3. 클라이언트 렌더링 과정에서 생성되는 `QueryClient`. 이 `QueryClient` 역시 dehydrated state를 hydrate하여 초기 상태를 복원한다.

서버와 클라이언트가 동일한 dehydrated state로 시작하기 때문에, 두 환경에서 동일한 쿼리 캐시를 공유하게 되고, 결과적으로 동일한 마크업을 생성할 수 있다.

이러한 하이드레이션 과정을 통해 React Query는 서버 사이드 렌더링과 클라이언트 사이드 렌더링 간의 상태 불일치 문제를 해결하고, 초기 로딩 성능을 향상시킨다.

**서버 컴포넌트와의 관계**

_React의 서버 컴포넌트는 또 다른 형태의 "프리로딩" 단계를 제공한다._ 서버 컴포넌트는 React 컴포넌트 트리의 일부를 서버 사이드에서 미리 렌더링할 수 있다.

서버 컴포넌트와 React Query를 함께 사용하면 더욱 강력한 서버 사이드 렌더링 전략을 구사할 수 있다. 자세한 내용은 [고급 서버 렌더링 가이드](https://www.vigorously.xyz/docs/react-query/react-query-doc-advanced-server-rendering/)에서 확인할 수 있다.

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

의존성이 있는 쿼리를 서버에서 prefetch하는 것은 조금 까다로울 수 있다.

클라이언트에서는 React의 상태와 Effect를 사용해서 쿼리 간 의존성을 처리할 수 있다. 하지만 서버에서는 React가 아닌 일반 JavaScript 코드로 이를 처리해야 한다.

예를 들어, 클라이언트에서는 다음과 같이 쿼리를 작성할 수 있다:

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

여기서는 `projects` 쿼리가 `userId` 에 의존하고 있다. `userId` 가 없으면 `projects` 쿼리는 실행되지 않는다.

이를 서버에서 처리하려면, 다음과 같이 할 수 있다:

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

여기서 중요한 부분은 이렇다:

1. 먼저 `user` 쿼리를 `fetchQuery` 를 사용해 fetch한다. 그리고 쿼리 결과를 기다린다.
2. 만약 `user` 가 존재하고 `userId` 가 있다면, `projects` 쿼리를 `prefetchQuery` 를 사용해 prefetch한다.
3. 마지막으로 `queryClient` 를 dehydrate해서 props로 전달한다.

이렇게 하면 서버에서도 쿼리 간 의존성을 처리할 수 있다. `user` 쿼리의 결과에 따라 `projects` 쿼리를 조건부로 실행하는 것이다.

물론 실제 상황에서는 이보다 더 복잡할 수 있다. 하지만 서버의 코드는 일반 JavaScript이기 때문에, JavaScript의 모든 기능을 사용해서 필요한 로직을 구현할 수 있다.

중요한 것은 서버에서 렌더링하려는 모든 쿼리를 prefetch해야 한다는 것이다. 그래야 서버에서 렌더링한 HTML에 필요한 모든 데이터가 포함될 수 있다.

## 에러 핸들링 {#error-handling}

React Query는 서버 사이드 렌더링에서 쿼리 실패를 우아하게 처리한다.

기본적으로 `queryClient.prefetchQuery` 는 쿼리가 실패해도 에러를 던지지 않는다. 그리고 `dehydrate` 는 성공한 쿼리의 데이터만 포함하고, 실패한 쿼리의 데이터는 포함하지 않는다.

그 결과, 실패한 쿼리는 클라이언트에서 다시 시도되고, 서버에서 렌더링된 HTML에는 해당 부분이 로딩 상태로 나타난다.

이런 방식은 대부분의 경우 잘 작동한다. 하지만 가끔은 이게 문제가 될 수 있다.

예를 들어, 중요한 데이터를 가져오는 데 실패했다면, 404나 500 같은 에러 페이지를 보여주고 싶을 수 있다.

이런 경우에는 `queryClient.fetchQuery` 를 사용할 수 있다. 이 함수는 쿼리가 실패하면 에러를 던지기 때문에, 이 에러를 잡아서 적절히 처리할 수 있다.

```tsx
let result;
try {
  result = await queryClient.fetchQuery(...);
} catch (error) {
  // 프레임워크 문서를 참조하여 오류를 핸들링한다.
}

// 여기서 잘못된 `result`도 확인하고 핸들링할 수 있다.
```

또 다른 경우는, 어떤 이유로든 실패한 쿼리를 dehydrated 상태에 포함시키고 싶은 경우다. 이럴 때는 `shouldDehydrateQuery` 옵션을 사용해서 `dehydrate` 의 기본 동작을 바꿀 수 있다.

```tsx
dehydrate(queryClient, {
  shouldDehydrateQuery: (query) => {
    // 이렇게 하면 실패한 쿼리를 포함한 모든 쿼리가 포함되지만,
    // `query`를 검사하여 자체 로직을 구현할 수도 있다.
    return true;
  },
});
```

이 옵션에 전달하는 함수에서 `query` 객체를 검사해서, 어떤 쿼리를 포함할지 결정할 수 있다.

## 직렬화 {#serialization}

Next.js에서 `dehydrate(queryClient)` 를 사용하면, React Query의 상태를 특별한 형식으로 변환한다. 이렇게 변환된 상태를 dehydratedState라고 부른다.

이 dehydratedState는 직력화되어 서버에서 만든 HTML에 포함되고 클라이언트(브라우저)로 전송된다. 클라이언트에서는 이 상태를 사용해 React Query를 초기화한다. 이렇게 하면 서버와 클라이언트의 상태가 동일해진다.

그런데 이 과정에서 주의할 점이 있다. dehydratedState로 만들 때 일부 데이터 타입(`undefined`, `Error`, `Date`, `Map`, `Set`, `BigInt`, `Infinity`, `NaN`, `-0`, 정규식 등)은 지원되지 않는다. 만약 꼭 이런 데이터를 사용해야 한다면, [superjson](https://github.com/blitz-js/superjson)과 같은 별도의 라이브러리를 사용할 수 있다.

또한 Next.js를 사용하지 않고 서버 사이드 렌더링을 직접 구현한다면, dehydratedState를 안전하게 처리해야 한다. 이 때 `JSON.stringify` 를 직접 사용하면 보안 문제가 생길 수 있으니, Serialize JavaScript나 devalue 같은 라이브러리를 사용하는 게 좋다.

:::note 직렬화와 보안

dehydratedState는 클라이언트로 전송되어 HTML에 삽입되므로, 이 데이터에 악성 스크립트가 포함되어 있다면 크로스 사이트 스크립팅(XSS) 공격에 취약해질 수 있다.

예를 들어, 만약 dehydratedState에 `<script>alert('Oh no..')</script>` 와 같은 스크립트 태그가 포함되어 있다면, 이를 그대로 JSON.stringify로 직렬화하여 HTML에 삽입하면 해당 스크립트가 실행될 수 있다. 이는 XSS 취약점으로 이어질 수 있다.

superjson과 같은 커스텀 직렬화 라이브러리를 사용하더라도, 기본적으로는 이런 악성 스크립트를 이스케이프 처리하지 않는다. 따라서 추가적인 보안 조치 없이 사용자 정의 SSR에서 단독으로 사용하기에는 안전하지 않다.

이러한 보안 이슈를 방지하기 위해, Serialize JavaScript나 devalue와 같은 전용 라이브러리를 사용하는 것이 좋다. 이 라이브러리들은 dehydratedState를 직렬화할 때 잠재적인 악성 스크립트를 자동으로 이스케이프 처리해주므로, XSS 공격을 예방할 수 있다.

:::

## 요청 워터폴에 대한 참고사항 {#a-note-about-request-warterfalls}

[성능 및 요청 워터폴 가이드](https://www.vigorously.xyz/docs/react-query/react-query-doc-performance-and-request-waterfalls/)에서는 서버 렌더링이 복잡한 중첩 워터폴을 어떻게 개선할 수 있는지 살펴보겠다고 했다. 예를 들어, `<Feed>` 컴포넌트 안에 코드 스플리팅된 `<GraphFeedItem>` 컴포넌트가 있다고 해보자. 이 컴포넌트들은 피드에 그래프 항목이 포함된 경우에만 렌더링되며, 각자 필요한 데이터를 가져와야 한다. 클라이언트 렌더링을 사용하면 아래와 같은 요청 워터폴이 발생한다:

```text
1. |> Markup (without content)
2.   |> JS for <Feed>
3.     |> getFeed()
4.       |> JS for <GraphFeedItem>
5.         |> getGraphDataById()
```

서버 렌더링의 장점은 위의 워터폴을 다음과 같이 개선할 수 있다는 것이다:

```text
1. |> Markup (with content AND initial data)
2.   |> JS for <Feed>
2.   |> JS for <GraphFeedItem>
```

쿼리가 더 이상 클라이언트에서 데이터를 가져오지 않고, 대신 마크업에 데이터가 포함되어 있다는 점이 중요하다. JS를 병렬로 로드할 수 있는 이유는 `<GraphFeedItem>` 이 서버에서 렌더링되었기 때문에, 클라이언트에서도 해당 JS가 필요할 것임을 알 수 있고, 마크업에 해당 청크의 script 태그를 삽입할 수 있기 때문이다. 다만 서버에서는 여전히 아래와 같은 요청 워터폴이 발생한다:

```text
1. |> getFeed()
2.   |> getGraphDataById()
```

피드를 가져오기 전에는 그래프 데이터가 필요한지 알 수 없기 때문에, 이러한 의존성이 있는 쿼리들은 순차적으로 실행된다. 하지만 이는 지연 시간이 낮고 안정적인 서버에서 실행되므로 보통 큰 문제가 되지 않는다.

놀랍게도 우리는 워터폴의 대부분을 제거했다! 그러나 한 가지 문제가 있다. 이 페이지가 `/feed` 페이지이고 `/posts` 와 같은 다른 페이지도 있다고 가정해 보자. URL에 `www.example.com/feed` 를 직접 입력하고 Enter를 누르면 서버 렌더링의 장점을 모두 누릴 수 있지만, `www.example.com/posts` 를 입력한 뒤 `/feed` 링크를 클릭하면 다음과 같은 상황으로 돌아간다:

```text
1. |> JS for <Feed>
2.   |> getFeed()
3.     |> JS for <GraphFeedItem>
4.       |> getGraphDataById()
```

SPA에서 서버 렌더링은 초기 페이지 로드 시에만 작동하고, 이후 페이지 탐색에는 적용되지 않기 때문이다.

최신 프레임워크는 종종 초기 코드와 데이터를 병렬로 가져와 이 문제를 해결하려 한다. 따라서 의존 쿼리를 미리 가져오는 방법을 포함하여 이 가이드에서 설명한 패턴을 Next.js나 Remix에 적용하면 실제로는 다음과 같이 보일 것이다:

```text
1. |> JS for <Feed>
1. |> getFeed() + getGraphDataById()
2.   |> JS for <GraphFeedItem>
```

이는 이전보다 훨씬 나아졌지만, 서버 컴포넌트를 사용하면 단일 왕복으로 더 개선할 수 있다. [고급 서버 렌더링 가이드](https://www.vigorously.xyz/docs/react-query/react-query-doc-advanced-server-rendering/)를 참조한다.

## 팁, 트릭 및 주의사항 {#tips-tricks-and-caveats}

### stale 시간은 서버에서 쿼리를 fetch한 시점부터 측정된다 {#staleness-is-measured-from-when-the-query-was-fetched-on-the-server}

React Query는 각 쿼리 결과에 `dataUpdatedAt` 속성을 추가한다. 이 속성은 서버에서 데이터를 가져온 시간을 나타낸다. `staleTime` 은 이 `dataUpdatedAt` 을 기준으로 계산된다.

즉, 현재 시간과 `dataUpdatedAt` 사이의 차이가 `staleTime` 보다 크면 해당 데이터는 오래된(stale) 것으로 간주된다.

이 메커니즘이 제대로 작동하려면 서버의 시간이 정확해야 한다. 다행히 UTC 시간이 사용되므로 서버와 클라이언트의 시간대 차이는 문제가 되지 않는다.

기본적으로 `staleTime` 은 `0` 으로 설정되어 있다. 이는 페이지 로드 시 쿼리가 항상 백그라운드에서 다시 fetch 된다는 것을 의미한다. 만약 마크업을 캐시하지 않는다면 이러한 중복 fetch를 피하기 위해 `staleTime` 을 더 높게 설정할 수 있다.

하지만 CDN에서 마크업을 캐싱할 때는 이러한 만료된 쿼리의 refetch 기능이 매우 유용하다. 페이지 자체의 캐시 시간을 충분히 높게 설정하여 서버에서 페이지를 자주 렌더링하지 않도록 하면서도, 쿼리의 `staleTime` 은 상대적으로 낮게 설정하여 사용자가 페이지를 방문했을 때 오래된 데이터의 경우 백그라운드에서 자동으로 다시 fetch되도록 할 수 있다.

예를 들어, 페이지는 일주일 동안 캐시하지만 페이지 로드 시 데이터가 하루 이상 오래된 경우에는 자동으로 다시 fetch하도록 설정할 수 있다.

이렇게 `staleTime` 을 활용하면 캐싱의 이점을 최대한 누리면서도 사용자에게는 항상 최신 데이터를 제공할 수 있게 된다. 서버의 부하를 줄이면서도 사용자 경험을 향상시킬 수 있는 강력한 기능이라고 할 수 있다.

### 서버의 높은 메모리 사용량 {#high-memory-consumption-on-server}

`QueryClient` 를 생성할 때마다 React Query는 해당 클라이언트에 대해 독립적인 캐시를 생성한다. 이 캐시는 `gcTime` 옵션으로 지정된 기간 동안 메모리에 유지된다. 요청 수가 많은 경우, 이로 인해 서버의 메모리 사용량이 증가할 수 있다.

서버에서 `gcTime` 의 기본값은 `Infinity` 다. 이는 수동 가비지 컬렉션이 비활성화되어 있으며, 요청이 완료되면 자동으로 메모리가 해제됨을 의미한다. 그러나 `Infinity` 가 아닌 `gcTime` 을 명시적으로 설정하면, 캐시가 더 빨리 제거되도록 할 수 있다.

하이드레이션 오류를 발생시킬 수 있기 때문에 `gcTime` 을 `0` 으로 설정하는 것은 권장되지 않는다. **하이드레이션 경계**는 렌더링에 필요한 데이터를 캐시에 저장하지만, 렌더링이 완료되기 전에 가비지 컬렉터가 해당 데이터를 제거하면 문제가 발생할 수 있다. 더 짧은 `gcTime` 이 필요한 경우, 애플리케이션이 데이터를 참조할 수 있는 충분한 시간을 제공하기 위해 `2 * 1000` (2초)로 설정하는 것이 좋다.

캐시가 더 이상 필요하지 않을 때 메모리 사용량을 줄이기 위해 캐시를 비울 수 있다. 이를 위해서는 요청이 처리되고 dehydrated 상태가 클라이언트로 전송된 후에 `queryClient.clear()` 를 호출하면 된다.

또 다른 방법은 더 작은 `gcTime` 값을 설정하는 것이다. 이렇게 하면 캐시가 더 빨리 제거되므로 메모리 사용량을 줄일 수 있다.

요약하면, React Query에서 `QueryClient` 를 생성할 때마다 독립적인 캐시가 생성되며, 이는 `gcTime` 동안 메모리에 유지된다. 서버의 메모리 사용량을 최적화하기 위해서는 `gcTime` 을 적절히 설정하거나 `queryClient.clear()` 를 사용하여 불필요한 캐시를 제거하는 것이 좋다.

### Next.js rewrites에 대한 주의사항 {#caveat-for-nextjs-rewrite}

[**Automatic Static Optimization**](https://nextjs.org/docs/advanced-features/automatic-static-optimization) 또는 `getStaticProps`와 함께 [**Next.js의 rewrites 기능**](https://nextjs.org/docs/api-reference/next.config.js/rewrites)을 사용하는 경우 주의할 점이 있다. React Query에 의해 두 번째 하이드레이션이 발생한다. 그 이유는 **[Next.js가 클라이언트에서 rewrites 구문 파싱](https://nextjs.org/docs/api-reference/next.config.js/rewrites#rewrite-parameters)하고 하이드레이션 후에 모든 매개변수를 수집하여 `router.query`에 제공할 수 있도록 해야 하기 때문이다.**

그 결과 모든 하이드레이션 데이터에 대한 참조 동등성이 누락되며, 예를 들어 데이터가 컴포넌트의 props로 사용되거나 `useEffect` / `useMemo` 의 종속성 배열에 사용되는 곳에서 트리거된다.
