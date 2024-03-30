---
title: 성능 & 요청 워터폴
description:
date: 2024-03-30
tags: []
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/v5/docs/framework/react/guides/request-waterfalls',
    },
  ]
---

애플리케이션 성능은 광범위하고 복잡한 영역이다. React Query는 API를 더 빠르게 만들 수는 없지만, React Query를 어떻게 사용하느냐에 따라 성능을 최적화에 기여할 수 있는 방법이 있다.

React Query를 사용할 때 발생할 수 있는 가장 큰 성능 문제는 요청 워터폴(request waterfall)이다. 이 문서에서는 요청 워터폴이 무엇인지, 어떻게 발견할 수 있는지, 그리고 이를 어떻게 해결할 수 있는지 설명한다.

- **Prefetching & Router Integration 가이드**에서는 애플리케이션이나 API를 재구조화하기 어려운 경우 데이터를 prefetch는 방법을 설명한다.
- **Server Rendering & Hydration 가이드**에서는 서버에서 데이터를 fetch하여 클라이언트에 전달하는 방법을 설명한다.
- **Advanced Server Rendering 가이드**에서는 이러한 패턴을 서버 컴포넌트와 스트리밍 서버 렌더링에 적용하는 방법을 자세히 다룬다.

이러한 가이드를 통해 React Query를 효과적으로 활용하여 애플리케이션 성능을 최적화할 수 있다.

## 요청 워터폴이란 무엇인가? {#what-is-a-request-waterfall}

요청 워터폴은 리소스(코드, CSS, 이미지, 데이터)에 대한 요청이 다른 리소스에 대한 요청이 완료된 후에만 시작되는 현상을 말한다.

웹 페이지를 예로 들면, 브라우저는 먼저 마크업을 로드해야 CSS, JS 등을 로드할 수 있다. 이것이 요청 워터폴이다.

```bash
1. |-> Markup
2.   |-> CSS
2.   |-> JS
2.   |-> Image
```

JS 파일 내에서 CSS를 가져오면 이중 워터폴이 발생한다:

```bash
1. |-> Markup
2.   |-> JS
3.     |-> CSS
```

그리고 이 CSS가 배경 이미지를 사용한다면 삼중 워터폴이 발생한다:

```bash
1. |-> Markup
2.   |-> JS
3.     |-> CSS
4.       |-> Image
```

요청 워터폴을 발견하고 분석하는 가장 좋은 방법은 일반적으로 브라우저 개발자 도구의 "Network" 탭을 열어보는 것이다.

각 워터폴은 최소 한 번의 서버 왕복을 나타내며, 리소스가 로컬에 캐시되어 있지 않은 경우 더 많은 왕복이 필요할 수 있다(실제로는 브라우저가 연결을 설정하기 위해 여러 번의 왕복이 필요할 수 있지만, 여기서는 무시한다). 이로 인해 요청 워터폴의 부작용은 사용자 지연 시간에 크게 의존한다. 위의 삼중 워터폴 예를 보면 실제로는 4번의 서버 왕복이 이루어진다. 3G 네트워크나 나쁜 네트워크 환경에서 일반적인 250ms의 지연 시간을 고려하면, 이로 인한 총 시간은 **4\*250=1000ms**다. 반면, 이를 첫 번째 예와 같이 2번의 왕복으로 줄일 수 있다면 **500ms**로 해결될 수 있으며, 배경 이미지 로딩 시간을 절반으로 단축할 수 있다.

## React Query와 요청 워터폴 {#request-waterfall-and-react-query}

이제 React Query를 생각해보자. 먼저 서버 렌더링을 사용하지 않는 경우를 살펴본다. 쿼리를 시작하기 전에 JS를 로드해야 하므로, 화면에 데이터를 표시하기 전에 이중 워터폴이 발생한다:

```bash
1. |-> Markup
2.   |-> JS
3.     |-> Query
```

이를 기반으로 React Query에서 요청 워터폴을 유발할 수 있는 몇 가지 패턴과 이를 방지하는 방법을 살펴보자.

1. **단일 컴포넌트 워터폴 / 직렬 쿼리**
2. **중첩 컴포넌트 워터폴**
3. **코드 스플리팅**

### 단일 컴포넌트 워터폴 / 직렬 쿼리 {#single-component-warterfalls-serial-queries}

단일 컴포넌트에서 먼저 한 번의 쿼리를 수행하고, 그 다음 다른 쿼리를 수행하는 경우 요청 워터폴이 발생할 수 있다. 이는 두 번째 쿼리가 **종속 쿼리(Dependent Query)**인 경우, 즉 첫 번째 쿼리의 데이터에 의존하여 fetch하는 경우에 발생할 수 있다:

```tsx
// user 가져오기
const { data: user } = useQuery({
  queryKey: ['user', email],
  queryFn: getUserByEmail,
});

const userId = user?.id;

// 다음으로, user의 project 가져오기
const {
  status,
  fetchStatus,
  data: projects,
} = useQuery({
  queryKey: ['projects', userId],
  queryFn: getProjectsByUser,
  // 쿼리는 userId가 존재할 때까지 실행되지 않는다.
  enabled: !!userId,
});
```

항상 실현 가능한 것은 아니지만, 최적의 성능을 위해서는 API를 재구조화하여 이 두 개의 쿼리를 단일 쿼리로 fetch할 수 있도록 하는 것이 좋다. 위의 예에서는 `getUserByEmail` 을 먼저 fetch한 후 `getProjectsByUser` 를 fetch 하는 대신, `getProjectsByUserEmail` 이라는 새로운 쿼리를 도입하면 워터폴을 최소화 할 수 있다.

> **_API를 재구조화하지 않고도 종속 쿼리를 완화할 수 있는 방법은 워터폴을 서버 사이드로 옮기는 것이다. 이는 Advanced Server Rendering 가이드에서 다루는 서버 컴포넌트의 아이디어다._**

Suspense와 함께 React Query를 사용할 때 직렬 쿼리의 또 다른 예는 다음과 같습니다:

```tsx
function App() {
  // 다음 쿼리들은 직렬로 실행되어 서버에 별도의 요청을 보낸다:
  const usersQuery = useSuspenseQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const teamsQuery = useSuspenseQuery({ queryKey: ['teams'], queryFn: fetchTeams });
  const projectsQuery = useSuspenseQuery({ queryKey: ['projects'], queryFn: fetchProjects });

  // 주의: 위의 쿼리들은 렌더링을 중단시키므로, 모든 쿼리가 완료될 때까지 데이터가 렌더링되지 않는다.
  ...
}
```

일반 `useQuery` 를 사용하면 위의 쿼리들은 병렬로 실행된다.

이를 해결하는 방법은 간단하다. 컴포넌트에 여러 개의 Suspense 쿼리가 있는 경우 `useSuspenseQueries` 훅을 사용하면 된다.

```tsx
const [usersQuery, teamsQuery, projectsQuery] = useSuspenseQueries({
  queries: [
    { queryKey: ['users'], queryFn: fetchUsers },
    { queryKey: ['teams'], queryFn: fetchTeams },
    { queryKey: ['projects'], queryFn: fetchProjects },
  ],
});
```

### 중첩 컴포넌트 워터폴 {#nested-component-waterfalls}

중첩 컴포넌트 워터폴은 부모와 자식 컴포넌트 모두에 쿼리가 포함되어 있고, 부모 컴포넌트가 자식 컴포넌트의 쿼리가 완료될 때까지 렌더링하지 않는 경우에 발생한다. 이는 `useQuery` 와 `useSuspenseQuery` 모두에서 발생할 수 있다.

자식 컴포넌트가 부모 컴포넌트의 데이터에 따라 조건부로 렌더링되거나, 자식 컴포넌트가 쿼리를 수행하기 위해 부모 컴포넌트에서 일부 결과를 props로 전달받아야 하는 경우에는 종속적인 중첩 컴포넌트 워터폴이 발생한다.

먼저 자식 컴포넌트가 부모 컴포넌트에 의존하지 않는 예를 살펴보자.

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

`<Comments>` 컴포넌트가 부모 컴포넌트에서 `id` prop을 받지만, `<Article>` 컴포넌트가 렌더링될 때 `id`를 이미 사용할 수 있으므로 댓글을 동시에 가져올 수 있다. 실제 애플리케이션에서는 자식 컴포넌트가 부모 컴포넌트 아래 깊이 중첩되어 있어 이러한 워터폴을 발견하고 해결하기가 더 어려울 수 있다. 하지만 이 예에서는 댓글 쿼리를 부모 컴포넌트로 옮기는 것이 한 가지 해결책이다.

```tsx
function Article({ id }) {
  const { data: articleData, isPending: articlePending } = useQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  });

  const { data: commentsData, isPending: commentsPending } = useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  });

  if (articlePending) {
    return 'Loading article...';
  }

  return (
    <>
      <ArticleHeader articleData={articleData} />
      <ArticleBody articleData={articleData} />
      {commentsPending ? (
        'Loading comments...'
      ) : (
        <Comments commentsData={commentsData} />
      )}
    </>
  );
}
```

이제 두 개의 쿼리가 병렬로 실행된다. Suspense를 사용하는 경우에는 이 두 쿼리를 단일 `useSuspenseQueries`로 결합하는 것이 좋다.

또 다른 방법은 `<Article>` 컴포넌트에서 댓글을 Prefetch하거나, 페이지 로드 또는 페이지 이동 시 이 두 쿼리를 라우터 수준에서 prefetch하는 것이다. 이에 대해서는 Prefetching & Router Integration 가이드에서 자세히 다룬다.

이제 종속적인 중첩 컴포넌트 워터폴의 예를 살펴보자.

```tsx
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

function GraphFeedItem({ feedItem }) {
  const { data, isPending } = useQuery({
    queryKey: ['graph', feedItem.id],
    queryFn: getGraphDataById,
  });

  ...
}
```

두 번째 쿼리 `getGraphDataById`는 두 가지 방식으로 부모 컴포넌트에 종속된다. 첫째, 피드 아이템이 그래프가 아니면 절대 실행되지 않는다. 둘째, 부모에서 `id`를 받아야 한다.

```bash
1. |> getFeed()
2.   |> getGraphDataById()
```

이 예에서는 단순히 쿼리를 부모 컴포넌트로 올리거나 prefetch를 추가해서는 폭포를 제거할 수 없다. 이 가이드 초반의 종속 쿼리 예와 마찬가지로, 옵션은 `getFeed` 쿼리에 그래프 데이터를 포함하도록 API를 재구성하는 것이다. 또 다른 고급 솔루션은 서버 컴포넌트를 활용하여 워터폴을 서버로 옮기는 것이다(Advanced Server Rendering 가이드 참고). 하지만 이는 상당한 아키텍처 변경이 필요할 수 있다.

여기저기 쿼리 워터폴이 있더라도 여전히 원활한 성능으로 작동할 수 있다. 다만 이것들이 일반적인 성능 문제라는 것을 인식하고 주의해야 한다. 특히 코드 스플리팅이 관련된 경우에는 더 주의해야 한다.

### 코드 스플리팅 {#code-splitting}

애플리케이션의 JavaScript 코드를 더 작은 청크로 분리하고 필요한 부분만 로드하는 것은 일반적으로 좋은 성능 달성을 위한 중요한 단계다. 그러나 이것은 요청 워터폴을 유발하는 단점이 있다. 이 코드 스플리팅 코드 내에 쿼리가 포함되어 있다면 문제가 더 악화된다.

Feed 예제의 약간 수정된 버전을 살펴보자.

```tsx
// 이것은 GraphFeedItem 컴포넌트를 지연 로드하므로,
// 이 컴포넌트를 렌더링될 때까지 로드되지 않는다.
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

이 예제에는 이중 워터폴이 있다:

```bash
1. |> getFeed()
2.   |> JS for <GraphFeedItem>
3.     |> getGraphDataById()
```

그러나 이것은 예제 코드만 고려한 것이다. 이 페이지의 첫 페이지 로드를 고려하면 그래프를 렌더링하기 위해 실제로 5번의 서버 왕복을 완료해야 한다.

```bash
1. |> Markup
2.   |> JS for <Feed>
3.     |> getFeed()
4.       |> JS for <GraphFeedItem>
5.         |> getGraphDataById()
```

서버 렌더링을 하면 상황은 달라진다. 이에 대해서는 **Server Rendering & Hydration 가이드**에서 자세히 다룰 것이다. 또한 `<Feed>` 컴포넌트를 포함하는 라우트가 코드 스플리킹되어 있는 것도 일반적이므로 추가적인 단계가 필요할 수 있다.

코드 스플리팅 사례에서는 `getGraphDataById` 쿼리를 `<Feed>` 컴포넌트로 올리고 조건부로 만들거나 조건부 prefetch를 추가하는 것이 도움이 될 수 있다. 그렇게 하면 이 쿼리를 코드와 병렬로 fetch할 수 있다:

```bash
1. |> getFeed()
2.   |> getGraphDataById()
2.   |> JS for <GraphFeedItem>
```

그러나 여기에는 트레이드오프가 있다. 이제 `getGraphDataById` 데이터 fetch 코드가 `<Feed>` 번들과 함께 포함되므로 사례에 따라 어떤 것이 가장 좋은지 평가해야 한다. 이 방법에 대해서는 **Prefetching & Router Integration 가이드**에서 자세히 다룬다.

> **_다음과 같은 트레이드오프는 좋지 않다:_**
>
> - **_자주 사용하지 않더라도 모든 데이터 fetch 코드를 메인 번들에 포함하기_**
> - **_데이터 fetch 코드를 코드 스플리팅 번들에 포함시키고 요청 워터폴 발생하기_**
>
> **_이는 서버 컴포넌트를 도입하게 된 동기 중 하나다. 서버 컴포넌트를 사용하면 이 두 가지를 모두 피할 수 있다. 이것이 React Query에 어떻게 적용되는지는 Advanced Server Rendering 가이드에서 자세히 다룬다._**

## 요약 및 정리 {#summary-and-takeways}

요청 워터폴은 다양한 트레이드오프가 있는 매우 일반적이고 복잡한 성능 문제다. 애플리케이션에 이를 의도치 않게 유발할 수 있는 상황은 다음과 같다:

- 자식 컴포넌트에 쿼리를 추가하는데, 부모 컴포넌트에 이미 쿼리가 있음을 인식하지 못하는 경우
- 부모 컴포넌트에 쿼리를 추가하는데, 자식 컴포넌트에 이미 쿼리가 있음을 인식하지 못하는 경우
- 쿼리가 있는 하위 컴포넌트를 새로운 쿼리가 있는 상위 컴포넌트로 이동하는 경우
- 기타 등등

이러한 우연한 복잡성 때문에 워터폴에 주의를 기울이고 정기적으로 애플리케이션을 검사하는 것이 중요하다(Network 탭을 주기적으로 살펴보는 것이 좋은 방법이다!). 모든 워터폴을 제거할 필요는 없지만, 크게 영향을 미치는 것들은 주목할 필요가 있다.
