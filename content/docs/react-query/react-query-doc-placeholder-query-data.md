---
title: 플레이스홀더 쿼리 데이터
description:
date: 2024-03-23
tags: []
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/placeholder-query-data',
    },
  ]
---

## 플레이스홀더 데이터란? {#what-is-placeholder-data}

플레이스홀더 데이터를 사용하면 `initialData` 옵션과 유사하게 마치 쿼리에 이미 데이터가 있는 것처럼 동작할 수 있지만, **데이터가 캐시에 영구 저장되지는 않는다**. 이는 실제 데이터가 백그라운드에서 가져와지는 동안 쿼리를 성공적으로 렌더링하기에 충분한 부분적(또는 가짜) 데이터가 있는 상황에 유용하다.

> 예시: 개별 블로그 게시물 쿼리는 제목과 게시물 본문의 작은 일부분만 포함하는 블로그 게시물 목록의 부모에서 "미리보기" 데이터를 가져올 수 있다. 이 부분 데이터를 개별 쿼리의 쿼리 결과에 영구적으로 저장하고 싶지는 않겠지만, 실제 쿼리가 전체 객체를 가져오는 것을 완료하는 동안 가능한 한 빨리 콘텐츠 레이아웃을 보여주는 데 유용하다.

캐시에 쿼리에 필요한 플레이스홀더 데이터를 제공하는 몇 가지가 방법이 있다:

- 선언형 방식:
  - 쿼리에 `placeholderData` 를 제공하여 캐시가 비어있을 경우 미리 채워둔다.
- 명령형 방식:
  - `queryClient` 와 `placeholderData` 옵션을 사용하여 데이터를 **prefetch 하거나 fetch 한다**.

`placeholderData` 를 사용하면 쿼리는 `pending` 상태가 되지 않는다. 표시할 `data` 가 있기 때문에 쿼리는 `success` 상태로 시작되며, 이는 "실제" 데이터가 아닌 그저 "플레이스홀더" 데이터일 수도 있다. "실제" 데이터와 구분하기 위해 쿼리 결과에서 `isPlaceholderData` 플래그가 `true` 로 설정된다.

## 값으로서의 플레이스홀더 데이터 {#placeholder-data-as-a-value}

```tsx
function Todos() {
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/todos'),
    placeholderData: placeholderTodos,
  });
}
```

### 플레이스홀더 데이터 메모이제이션

쿼리의 플레이스홀더 데이터에 액세스하는 과정이 부담스럽거나 모든 렌더링마다 수행하고 싶지 않은 경우, 값을 메모이제이션할 수 있다:

```tsx
function Todos() {
  const placeholderData = useMemo(() => generateFakeTodos(), []);
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/todos'),
    placeholderData,
  });
}
```

## 함수로서의 플레이스홀더 데이터 {#placeholder-data-as-a-function}

`placeholderData` 에는 함수를 사용할 수도 있다. 이 함수에서는 "이전" 성공한 쿼리의 데이터와 쿼리 메타 정보에 접근할 수 있다. 이는 한 쿼리의 데이터를 다른 쿼리의 플레이스홀더 데이터로 사용하려는 상황에 유용하다. 예를 들어 QueryKey가 `['todos', 1]` 에서 `['todos', 2]` 로 변경될 때, 데이터가 한 쿼리에서 다음 쿼리로 _전환_ 되는 동안 로딩 스피너를 표시하는 대신 "이전" 데이터를 계속 표시할 수 있다. 자세한 내용은 **페이지네이션 쿼리**를 참조한다.

```tsx
const result = useQuery({
  queryKey: ['todos', id],
  queryFn: () => fetch(`/todos/${id}`),
  placeholderData: (previousData, previousQuery) => previousData,
});
```

### 캐시로부터의 플레이스홀더 데이터 {#placeholder-data-from-cache}

어떤 경우에는 다른 쿼리의 캐시된 결과에서 쿼리에 대한 플레이스홀더 데이터를 제공할 수 있다. 이에 대한 좋은 예는 블로그 게시물 목록 쿼리의 캐시된 데이터에서 게시물의 미리보기 버전을 검색한 다음, 이를 개별 게시물 쿼리의 플레이스홀더 데이터로 사용하는 것이다:

```tsx
function Todo({ blogPostId }) {
  const queryClient = useQueryClient();
  const result = useQuery({
    queryKey: ['blogPost', blogPostId],
    queryFn: () => fetch(`/blogPosts/${blogPostId}`),
    placeholderData: () => {
      // '블로그 게시물' 쿼리에서 블로그 게시물의 작은/미리보기 버전을 이 블로그 게시물 쿼리의 플레이스홀더 데이터로 사용한다.
      return queryClient
        .getQueryData(['blogPosts'])
        ?.find((d) => d.id === blogPostId);
    },
  });
}
```
