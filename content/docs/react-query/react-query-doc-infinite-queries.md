---
title: 무한 쿼리
description:
date: 2024-03-16
tags: [infinite_query]
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries',
    },
  ]
---

기존 데이터 세트에 데이터를 추가적으로 "더 보기" 하거나 "무한 스크롤"할 수 있는 목록을 렌더링하는 것도 매우 일반적인 UI 패턴이다. TanStack Query는 이러한 유형의 목록을 쿼리하는 데 유용한 `useInfiniteQuery` 라는 `useQuery` 버전을 지원한다.

무한 쿼리를 사용할 때 몇 가지 달라진 점을 발견할 수 있다:

- `data` 는 이제 무한한 쿼리 데이터를 포함하는 객체다:
- 가져온 페이지를 포함하는 `data.pages` 배열
- 페이지를 불러오는 데 사용된 페이지 파라미터가 포함된 `data.pageParams` 배열
- 이제 `fetchNextPage` 및 `fetchPreviousPage` 함수를 사용할 수 있다( `fetchNextPage`는 필수).
- 이제 초기 페이지 파라미터를 지정하기 위해 `initialPageParam` 옵션을 사용할 수 있다(필수).
- 로드할 데이터가 더 있는지 여부와 가져올 정보를 결정하는 데 `getNextPageParam` 및 `getPreviousPageParam` 옵션을 사용할 수 있다. 이 정보는 쿼리 함수에 추가 파라미터로 제공된다.
- 이제 `hasNextPage` 부울을 사용할 수 있으며 `getNextPageParam` 이 `null` 또는 `undefined` 값 이외의 값을 반환하면 `true` 가 된다.
- 이제 `hasPreviousPage` 부울을 사용할 수 있으며 `getPreviousPageParam` 이 `null` 또는 `undefined` 값 이외의 값을 반환하면 `true` 다.
- 이제 백그라운드 "새로 고침" 상태와 "더 보기" 상태를 구분하기 위해 `isFetchingNextPage` 및 `isFetchingPreviousPage` 부울을 사용할 수 있다.

:::note
`initialData` 또는 `placeholderData` 옵션은 `data.pages` 및 `data.pageParams` 프로퍼티가 있는 객체 구조와 일치해야 한다.
:::

## 예제 {#example}

우리가 `projects` 의 페이지를 `cursor` 인덱스를 기반으로 한 번에 3개씩 반환하는 API가 있다고 가정해 보자. 또한 다음 그룹의 프로젝트를 가져오는 데 사용할 수 있는 커서도 제공된다.

```tsx
fetch('/api/projects?cursor=0');
// { data: [...], nextCursor: 3}
fetch('/api/projects?cursor=3');
// { data: [...], nextCursor: 6}
fetch('/api/projects?cursor=6');
// { data: [...], nextCursor: 9}
fetch('/api/projects?cursor=9');
// { data: [...] }
```

이 정보를 사용하여 다음과 같이 '더 보기' UI를 만들 수 있다:

- 기본적으로 `useInfiniteQuery` 가 첫 번째 데이터 그룹을 요청할 때까지 기다리는 중이다.
- `getNextPageParam` 에서 다음 쿼리에 대한 정보를 반환한다.
- `fetchNextPage` 함수를 호출한다.

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

function Projects() {
  const fetchProjects = async ({ pageParam }) => {
    const res = await fetch('/api/projects?cursor=' + pageParam);
    return res.json();
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </React.Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </>
  );
}
```

페치가 진행 중일 때 `fetchNextPage` 를 호출하면 백그라운드에서 발생하는 데이터 갱신을 덮어쓰는 위험이 있다는 점을 이해해야 한다. 특히 리스트를 렌더링하고 동시에 `fetchNextPage` 를 트리거할 때 이 상황은 매우 중요하다.

기억하세요, 무한 쿼리에는 하나의 진행 중인 페치만이 있을 수 있다. 모든 페이지에 대해 공유되는 단일 캐시 항목이 있으며, 두 번의 동시 페치 시도는 데이터 덮어쓰기로 이어질 수 있다.

동시에 페치를 활성화하려면 `fetchNextPage` 내부에서 `{ cancelRefetch: false }` 옵션 (기본값: true)을 활용할 수 있다.

충돌 없이 원활한 쿼리 프로세스를 보장하기 위해 특히 사용자가 해당 호출을 직접 제어하지 않을 경우 쿼리가 `isFetching` 상태가 아닌지 확인하는 것이 좋다.

```tsx
<List onEndReached={() => !isFetching && fetchNextPage()} />
```

## 무한 쿼리를 다시 가져와야 하는 경우 어떻게 되나요? {#what-happens-when-an-infinite-query-needs-to-be-refetched}

무한 쿼리가 만료되어 다시 가져와야 할 때, 각 그룹은 첫 번째부터 순차적으로 가져온다. 이렇게 함으로써 기본 데이터가 변경되더라도 오래된 커서를 사용하지 않고 중복된 데이터를 받거나 레코드를 건너뛰지 않도록 보장한다. 무한 쿼리의 결과가 쿼리 캐시에서 제거되면 페이지네이션은 초기 상태에서 다시 시작되며 초기 그룹만 요청된다.

## 양방향 무한 리스트를 구현하려면 어떻게 해야 할까? {#what-if-i-wnat-to-implement-a-bi-directional-inline-list}

양방향 리스트는 `getPreviousPageParam` , `fetchPreviousPage` , `hasPreviousPage` 및 `isFetchingPreviousPage` 프로퍼티 및 함수를 사용하여 구현할 수 있다.

```tsx
useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
});
```

## 페이지를 역순으로 표시하려면 어떻게 해야 할까? {#what-if-i-want-to-show-the-pages-in-reversed-order}

때로는 페이지를 역순으로 표시하고 싶을 수도 있다. 이 경우 `select` 옵션을 사용할 수 있다:

```tsx
useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  select: (data) => ({
    pages: [...data.pages].reverse(),
    pageParams: [...data.pageParams].reverse(),
  }),
});
```

## 무한 쿼리를 수동으로 업데이트하려면 어떻게 해야 할까? {#what-if-i-want-to-manually-update-the-infinite-query}

### 첫 페이지를 수동으로 제거한다 {#manually-removing-first-page}

```tsx
queryClient.setQueryData(['projects'], (data) => ({
  pages: data.pages.slice(1),
  pageParams: data.pageParams.slice(1),
}));
```

### 개별 페이지에서 단일 값을 수동으로 제거한다 {#manually-removing-a-single-value-from-an-individual-page}

```tsx
const newPagesArray =
  oldPagesArray?.pages.map((page) =>
    page.filter((val) => val.id !== updatedId),
  ) ?? [];

queryClient.setQueryData(['projects'], (data) => ({
  pages: newPagesArray,
  pageParams: data.pageParams,
}));
```

### 첫 페이지만 유지한다 {#keep-only-first-page}

```tsx
queryClient.setQueryData(['projects'], (data) => ({
  pages: data.pages.slice(0, 1),
  pageParams: data.pageParams.slice(0, 1),
}));
```

pages 와 pageParams의 데이터 구조는 항상 동일하게 유지한다!

## 페이지 수를 제한하려면 어떻게 해야 할까? {#what-if-i-want-to-limit-the-number-of-pages}

일부 사용 사례에서는 성능과 UX를 개선하기 위해 쿼리 데이터에 저장되는 페이지 수를 제한하고 싶을 수 있다:

- 사용자가 많은 수의 페이지를 로드할 수 있는 경우(메모리 사용량)
- 수십 개의 페이지가 포함된 무한 쿼리를 다시 가져와야 할 때(네트워크 사용량: 모든 페이지를 순차적으로 가져옴)

해결책은 "제한된 무한 쿼리"를 사용하는 것이다. 이는 `maxPages` 옵션을 `getNextPageParam` 및 `getPreviousPageParam` 과 함께 사용하여 필요할 때 양방향으로 페이지를 가져올 수 있도록 함으로써 가능하다.

다음 예에서는 쿼리 데이터 페이지 배열에 3개 페이지만 유지된다. 다시 불러오기가 필요한 경우 3개의 페이지만 순차적으로 불러오게 된다.

```tsx
useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
  maxPages: 3,
});
```

## API가 커서를 반환하지 않으면 어떻게 할까? {#what-if-my-api-doesnt-return-a-cursor}

API가 커서를 반환하지 않는 경우 `pageParams` 를 커서로 사용할 수 있다. `getNextPageParam` 과 `getPreviousPageParam` 은 현재 페이지의 페이지 파라미터도 가져오기 때문에 이를 사용하여 다음/이전 페이지 파라미터를 계산할 수 있다.

```tsx
return useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages, lastPageParam) => {
    if (lastPage.length === 0) {
      return undefined;
    }
    return lastPageParam + 1;
  },
  getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
    if (firstPageParam <= 1) {
      return undefined;
    }
    return firstPageParam - 1;
  },
});
```
