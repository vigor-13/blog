---
title: Prefetching & 라우터 통합
description:
date: 2024-03-30
tags: []
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/v5/docs/framework/react/guides/prefetching',
    },
  ]
---

사전에 필요한 데이터를 알고 있는 경우, 캐시에 해당 데이터를 채워 놓는 prefetch를 사용하여 더 빠른 사용자 경험을 제공할 수 있다.

prefetch에는 여러 가지 패턴이 있다:

1. 이벤트 핸들러에서
2. 컴포넌트에서
3. 라우터 통합을 통해
4. 서버 렌더링 중에(다른 형태의 라우터 통합)

이 가이드에서는 첫 세 가지를 살펴볼 것이며, 네 번째 방식은 **Server Rendering & Hydration 가이드**와 **Advanced Server Rendering 가이드**에서 심도 있게 다룰 것이다.

prefetch의 구체적인 사용 사례 중 하나는 요청 워터폴을 제거하는 것이다. 이에 대한 심층적인 배경과 설명은 **Performance & Request Waterfalls 가이드**를 참조한다.

## prefetchQuery & prefetchInfiniteQuery {#prefetchQuery-and-prefetchInfiniteQuery}

여러 가지 prefetch 패턴을 살펴보기 전에 `prefetchQuery` 와 `prefetchInfiniteQuery` 함수에 대해 알아보자. 기본 사항은 다음과 같다:

- 기본적으로 이 함수들은 `queryClient` 에 구성된 기본 `staleTime` 을 사용하여 캐시에 있는 기존 데이터가 신선한지 아니면 다시 fetch해야 하는지를 결정한다.
- 다음과 같이 특정 `staleTime` 을 전달할 수 있다: `prefetchQuery({ queryKey: ['todos'], queryFn: fn, staleTime: 5000 })`.
  - 이 `staleTime`은 프리페치에만 사용되며, `useQuery` 호출에도 별도로 설정해야 합니다.
  - `staleTime` 을 무시하고 캐시에 있는 데이터가 있으면 항상 반환하려면 `ensureQueryData` 함수를 사용한다.
  - 팁: 서버에서 prefetch하는 경우, 해당 `queryClient` 의 기본 `staleTime` 을 `0` 보다 높게 설정하면 각 prefetch 호출에 `staleTime` 을 전달할 필요가 없다.
- `useQuery` 에서 prefetch한 쿼리를 사용하지 않으면 `gcTime` 에 지정된 시간 후에 prefetch된 쿼리가 삭제되고 가비지 컬렉션된다.
- 이 함수들은 `Promise<void>` 를 반환하고 쿼리 데이터는 반환하지 않는다. 데이터가 필요하다면 `fetchQuery` / `fetchInfiniteQuery` 를 사용한다.
- prefetch 함수는 오류를 throw하지 않으므로 `useQuery` 에서 다시 fetch하는 것이 좋다. 오류를 캐치해야 한다면 `fetchQuery` / `fetchInfiniteQuery` 를 사용한다.

`prefetchQuery` 사용 방법:

```tsx
const prefetchTodos = async () => {
  // 이 쿼리의 결과는 일반 쿼리와 같이 캐시됩니다.
  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });
};
```

무한 쿼리도 일반 쿼리와 같은 방식으로 prefetch 할 수 있다. 기본적으로 첫 번째 페이지만 prefetch 되며 지정된 쿼리 키에 저장된다. 여러 페이지를 prefetch 하려면 `pages` 옵션을 사용하고 `getNextPageParam` 함수를 제공해야 한다:

```tsx
const prefetchProjects = async () => {
  // 이 쿼리의 결과는 일반 쿼리와 같이 캐시된다.
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    pages: 3, // 첫 3페이지를 prefetch 한다
  });
};
```

다음으로 다양한 상황에서의 prefetch 사용 방법을 살펴본다.

## 이벤트 핸들러에서 prefetch하기 {#prefetch-in-event-handler}

사용자 상호 작용에 따라 prefetch를 수행하는 매우 간단한 prefetch 방식이다. 이 예에서는 `onMouseEnter` 또는 `onFocus` 이벤트 시 `queryClient.prefetchQuery`를 사용하여 prefetch를 시작한다.

```tsx
function ShowDetailsButton() {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['details'],
      queryFn: getDetailsData,
      // 데이터가 staleTime보다 오래된 경우에만 프리페치가 실행되므로,
      // 이 경우 staleTime을 반드시 설정해야 합니다.
      staleTime: 60000,
    });
  };

  return (
    <button onMouseEnter={prefetch} onFocus={prefetch} onClick={...}>
      Show Details
    </button>
  );
}
```

이 코드에서는 다음과 같은 방식으로 prefetch가 이루어진다:

1. 사용자가 버튼에 마우스를 올리거나 버튼에 포커스를 맞추면 `prefetch` 함수가 실행된다.
2. `prefetchQuery` 함수가 호출되어 `'details'` 쿼리를 prefetch한다.
3. `staleTime` 옵션을 설정하여 데이터가 1분 이상 경과된 경우에만 프리페치가 실행되도록 한다.

이렇게 하면 사용자가 버튼을 클릭할 때 데이터를 즉시 사용할 수 있어 더 빠른 응답 속도를 제공할 수 있다.

프리페치는 사용자 상호 작용 시 발생하는 이벤트와 긴밀하게 연결되어 있으므로, 이 방식은 매우 효과적이다. 단, `staleTime` 을 적절히 설정하여 불필요한 prefetch를 방지하는 것이 중요하다.

## 컴포넌트에서 prefetch하기 {#prefetch-in-components}

컴포넌트 라이프사이클 동안 prefetch하는 것은 자식이나 하위 컴포넌트에 특정 데이터가 필요하지만 다른 쿼리가 로드를 완료할 때까지 렌더링할 수 없는 경우 유용하다.

```tsx
function Article({ id }) {
  const { data: articleData, isPending } = useQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  });

  if (isPending) {
    return 'Loading article...';
  }

  return (
    <>
      <ArticleHeader articleData={articleData} />
      <ArticleBody articleData={articleData} />
      <Comments id={id} />
    </>
  );
}

function Comments({ id }) {
  const { data, isPending } = useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  });

  ...
}
```

이 코드는 다음과 같은 요청 워터폴을 유발한다:

```bash
1. |> getArticleById()
2.   |> getArticleCommentsById()
```

이전 가이드에서 언급한 바와 같이, 이 워터폴을 제거하는 한 가지 방법은 `getArticleCommentsById` 쿼리를 부모 컴포넌트로 옮기고 그 결과를 prop으로 전달하는 것이다. 그러나 컴포넌트가 관련이 없고 여러 수준의 계층 구조를 가지고 있다면 이것이 바람직하지 않을 수 있다.

이 경우 대신 부모 컴포넌트에서 쿼리를 prefetch할 수 있다. 이를 위한 가장 간단한 방법은 쿼리 결과를 무시하는 것이다:

```tsx
function Article({ id }) {
  const { data: articleData, isPending } = useQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  });

  // prefetch
  useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
    // 이 쿼리 변경 시 리렌더링을 방지하기 위한 선택적 최적화:
    notifyOnChangeProps: [],
  });

  if (isPending) {
    return 'Loading article...';
  }

  return (
    <>
      <ArticleHeader articleData={articleData} />
      <ArticleBody articleData={articleData} />
      <Comments id={id} />
    </>
  );
}

function Comments({ id }) {
  const { data, isPending } = useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  });

  ...
}
```

이렇게 하면 즉시 `article-comments` 쿼리를 fetch하기 시작하고 워터폴을 제거할 수 있다:

```bash
1. |> getArticleById()
2. |> getArticleCommentsById()
```

Suspense와 함께 prefetch하려면 다른 방식이 필요하다. prefetch가 컴포넌트 렌더링을 차단하기 때문에 `useSuspenseQueries` 를 사용하여 prefetch할 수 없다. `useQuery` 를 사용할 수도 없다. 중단된 쿼리가 리졸브된 후에야 prefetch가 시작되기 때문이다. 대신 작은 `usePrefetchQuery` 함수를 사용한다(향후 라이브러리에 추가될 수 있다):

```tsx
const usePrefetchQuery = (...args) => {
  const queryClient = useQueryClient();

  // 렌더링 중에 발생하지만, ensureQueryData는
  // 캐시에 데이터가 없는 경우에만 fetch하므로 안전하다.
  // 이는 데이터 관찰자가 없으므로 부작용이 관찰되지 않음을 의미한다.
  queryClient.ensureQueryData(...args);
};
```

이 접근 방식은 `useQuery` 와 `useSuspenseQuery` 에서 모두 작동한다. `useQuery({ ..., notifyOnChangeProps: [] })` 방식의 대안으로 사용할 수 있다. 위 방식의 유일한 단점은 위의 함수가 캐시에 있는 기존 데이터가 오래된 경우 이를 fetch하여 업데이트하지 않는다는 것이지만, 이는 대개 나중에 쿼리할 때 발생하게 된다.

실제로 데이터가 필요한 컴포넌트에서는 `useSuspenseQuery` 를 사용할 수 있다. 이후 컴포넌트를 자체 `<Suspense>` 경계로 감싸면 prefetch된 "보조" 쿼리가 "기본" 데이터 렌더링을 차단하지 않는다.

```tsx
// prefetch
usePrefetchQuery({
  queryKey: ['article-comments', id],
  queryFn: getArticleCommentsById,
});

const { data: articleResult } = useSuspenseQuery({
  queryKey: ['article', id],
  queryFn: getArticleById,
});

// 중첩 컴포넌트에서:
const { data: commentsResult } = useSuspenseQuery({
  queryKey: ['article-comments', id],
  queryFn: getArticleCommentsById,
});
```

또 다른 방법은 쿼리 함수 내부에서 prefetch하는 것이다. 이 경우 article을 fetch할 때마다 article-comments도 필요할 가능성이 매우 높다는 것을 알고 있다면 이 방식이 적합하다. 이를 위해 `queryClient.prefetchQuery`를 사용한다:

```tsx
const queryClient = useQueryClient();
const { data: articleData, isPending } = useQuery({
  queryKey: ['article', id],
  queryFn: (...args) => {
    queryClient.prefetchQuery({
      queryKey: ['article-comments', id],
      queryFn: getArticleCommentsById,
    });

    return getArticleById(...args);
  },
});
```

effect에서 prefetch하는 것도 가능하지만, 같은 컴포넌트에서 `useSuspenseQuery` 를 사용하는 경우 이 effect는 쿼리 완료 후에야 실행되므로, 원하는 결과가 아닐 수 있다.

```tsx
const queryClient = useQueryClient();

useEffect(() => {
  queryClient.prefetchQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  });
}, [queryClient, id]);
```

요약하면, 컴포넌트 생명 주기 동안 쿼리를 prefetch하려면 다음과 같은 방법 중 상황에 가장 적합한 것을 선택하면 된다:

- `useQuery` 또는 `useSuspenseQueries`를 사용하고 결과를 무시하기
- 쿼리 함수 내부에서 prefetch하기
- effect에서 prefetch하기

이제 좀 더 고급 사례를 살펴보자.

## 종속 쿼리와 코드 스플리팅 {#dependent-queries-and-code-splitting}

때로는 다른 데이터 fetch의 결과에 따라 조건부로 prefetch하고 싶을 때가 있다. 다음 예제를 살펴보자:

```tsx
// 이것은 GraphFeedItem 컴포넌트를 지연 로드하므로,
// 무언가가 이 컴포넌트를 렌더링할 때까지 로드되지 않는다.
const GraphFeedItem = React.lazy(() => import('./GraphFeedItem'));

function Feed() {
  const { data, isPending } = useQuery({
    queryKey: ['feed'],
    queryFn: getFeed,
  });

  if (isPending) {
    return 'Loading feed...';
  }

  return (
    <>
      {data.map((feedItem) => {
        if (feedItem.type === 'GRAPH') {
          return <GraphFeedItem key={feedItem.id} feedItem={feedItem} />;
        }

        return <StandardFeedItem key={feedItem.id} feedItem={feedItem} />;
      })}
    </>
  );
}

// GraphFeedItem.tsx
function GraphFeedItem({ feedItem }) {
  const { data, isPending } = useQuery({
    queryKey: ['graph', feedItem.id],
    queryFn: getGraphDataById,
  });

  ...
}
```

이 예제는 다음과 같은 이중 요청 워터폴을 발생시킨다:

```bash
1. |> getFeed()
2.   |> JS for <GraphFeedItem>
3.     |> getGraphDataById()
```

API를 재구성하여 `getFeed()` 에서도 필요한 경우 `getGraphDataById()` 데이터를 함께 반환할 수 없다면, `getFeed->getGraphDataById` 워터폴을 제거할 방법이 없다. 하지만 조건부 prefetch를 활용하면 코드와 데이터를 병렬로 로드할 수 있다. 앞서 설명한 것처럼 여러 가지 방법이 있지만, 이 예에서는 쿼리 함수 내에서 구현한다:

```tsx
function Feed() {
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ['feed'],
    queryFn: async (...args) => {
      const feed = await getFeed(...args);
      for (const feedItem of feed) {
        if (feedItem.type === 'GRAPH') {
          queryClient.prefetchQuery({
            queryKey: ['graph', feedItem.id],
            queryFn: getGraphDataById,
          });
        }
      }
      return feed;
    },
  });

  ...
}
```

이렇게 하면 코드와 데이터가 병렬로 로드됩니다:

```bash
1. |> getFeed()
2.   |> JS for <GraphFeedItem>
2.   |> getGraphDataById()
```

그러나 이는 트레이드오프가 있다. `getGraphDataById` 코드가 이제 자식 번들 대신 부모 번들에 포함되므로, 사례별로 최적의 성능 트레이드오프를 결정해야 한다. `GraphFeedItem`이 빈번히 발생한다면 부모에 코드를 포함하는 것이 좋다. 그렇지 않다면 포함하지 않는 것이 좋다.

## 라우터 통합 {#router-integration}

컴포넌트 트리 내의 데이터 fetch는 요청 워터폴을 쉽게 초래할 수 있고, 이에 대한 다양한 해결책이 애플리케이션에 누적되면서 번거로워질 수 있다. 따라서 라우터 수준에서 prefetch하는 것이 매력적인 방법이다.

이 접근 방식에서는 각 *라우트*에 대해 해당 컴포넌트 트리에 필요한 데이터를 사전에 명시적으로 선언한다. 서버 렌더링은 전통적으로 렌더링이 시작되기 전에 모든 데이터가 로드되어야 했기 때문에, 이것이 오랫동안 SSR 앱의 지배적인 접근 방식이었다. 이는 여전히 일반적인 접근 방식이며, **Server Rendering & Hydration 가이드**에서 자세히 다루고 있다.

지금은 클라이언트 사이드 사례에 초점을 맞추고, [**Tanstack Router**](https://tanstack.com/router/latest)와 함께 이를 구현하는 방법을 살펴본다. 이 예제에서는 설정과 보일러플레이트를 생략하여 간단히 설명한다. [**전체 React Query 예제**](https://tanstack.com/router/v1/docs/examples/react/with-react-query?file=src%2Fmain.tsx)는 [**Tanstack Router 문서**](https://tanstack.com/router/v1/docs)에서 확인할 수 있다.

라우터 수준에서 통합할 때, 모든 데이터가 준비될 때까지 렌더링을 *차단*할지, 아니면 prefetch를 시작하되 결과를 기다리지 않을지 선택할 수 있다. 그러면 가능한 한 빨리 라우트 렌더링을 시작할 수 있다. 또한 이 두 접근 방식을 혼합하여 일부 중요한 데이터는 기다리고 나머지 보조 데이터는 로드가 완료되기 전에 렌더링을 시작할 수도 있다. 이 예제에서는 `/article` 라우트에서 article 데이터 로드가 완료될 때까지 렌더링하지 않지만, 가능한 한 빨리 comments 데이터 prefetch를 시작할 것이다.

```tsx
const queryClient = new QueryClient();
const routerContext = new RouterContext();

const rootRoute = routerContext.createRootRoute({
  component: () => { ... },
});

const articleRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'article',
  beforeLoad: () => {
    return {
      articleQueryOptions: { queryKey: ['article'], queryFn: fetchArticle },
      commentsQueryOptions: { queryKey: ['comments'], queryFn: fetchComments },
    };
  },
  loader: async ({
    context: { queryClient },
    routeContext: { articleQueryOptions, commentsQueryOptions },
  }) => {
    // 가능한 한 빨리 댓글 데이터 프리페치, 하지만 차단하지 않음
    queryClient.prefetchQuery(commentsQueryOptions);

    // article 데이터가 가져와지기 전까지 라우트 렌더링 안 함
    await queryClient.prefetchQuery(articleQueryOptions);
  },
  component: ({ useRouteContext }) => {
    const { articleQueryOptions, commentsQueryOptions } = useRouteContext();
    const articleQuery = useQuery(articleQueryOptions);
    const commentsQuery = useQuery(commentsQueryOptions);

    return (
      ...
    );
  },
  errorComponent: () => 'Oh crap!',
});
```

다른 라우터와의 통합도 가능하다. [**React Router 예제**](https://tanstack.com/query/v5/docs/framework/react/examples/react-router)를 참조한다.

## 쿼리 수동 프라이밍 {#manually-priming-a-query}

쿼리에 대한 데이터를 이미 동기적으로 사용할 수 있다면 prefetch할 필요가 없다. **쿼리 클라이언트**의 `setQueryData` 메서드를 사용하여 직접 쿼리의 캐시된 결과를 키로 추가하거나 업데이트할 수 있다.

```tsx
queryClient.setQueryData(['todos'], todos);
```
