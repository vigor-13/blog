---
title: 페이지네이션 / 지연된 쿼리
description:
date: 2024-03-23
tags: []
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries',
    },
  ]
---

TanStack Query에서는 페이지 정보를 쿼리 키에 포함시킴으로써 페이지네이션 데이터 렌더링을 쉽게 구현할 수 있다.

```tsx
const result = useQuery({
  queryKey: ['projects', page],
  queryFn: fetchProjects,
});
```

하지만 이 간단한 예제를 실행해 보면 이상한 점을 발견할 수 있다:

UI는 각 새 페이지가 완전히 새로운 쿼리로 취급되기 때문에 `success` 와 `pending` 상태를 오가며 점프한다.

이러한 경험은 최선이 아니며 불행히도 오늘날 많은 도구들이 고집하는 방식이다. 하지만 TanStack Query는 그렇지 않다! TanStack Query에는 `placeholderData` 라는 멋진 기능이 있어 이를 해결할 수 있다.

## placeholderData를 사용한 더 나은 페이지네이션 쿼리 {#better-paginated-queries-with-placeholderData}

아래의 예제는 쿼리에 대해 페이지 인덱스(또는 커서)를 증가시킨다. `useQuery` 를 사용한다면, **기술적으로는 여전히 잘 작동할 것**이지만, 각 페이지 또는 커서에 대해 서로 다른 쿼리가 생성되고 파괴되면서 UI가 `success` 와 `pending` 상태를 오가며 점프할 것이다. `placeholderData` 를 `(previousData) => previousData` 또는 TanStack Query에서 제공하는 `keepPreviousData` 함수로 설정하면, 몇 가지 새로운 이점을 얻을 수 있다:

- **쿼리 키가 변경되었더라도, 새 데이터가 요청되는 동안 마지막으로 성공한 fetch의 데이터를 사용할 수 있다**.
- 새 데이터가 도착하면, 이전 `data` 는 새 데이터를 보여주기 위해 매끄럽게 교체된다.
- `isPlaceholderData` 를 사용하여 쿼리가 현재 제공하고 있는 데이터가 무엇인지 알 수 있다.

```tsx
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React from 'react';

function Todos() {
  const [page, setPage] = React.useState(0);

  const fetchProjects = (page = 0) =>
    fetch('/api/projects?page=' + page).then((res) => res.json());

  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ['projects', page],
      queryFn: () => fetchProjects(page),
      placeholderData: keepPreviousData,
    });

  return (
    <div>
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {data.projects.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </div>
      )}
      <span>Current Page: {page + 1}</span>
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </button>{' '}
      <button
        onClick={() => {
          if (!isPlaceholderData && data.hasMore) {
            setPage((old) => old + 1);
          }
        }}
        // 다음 페이지가 표시될 때까지 Next Page 버튼을 비활성화한다.
        disabled={isPlaceholderData || !data?.hasMore}
      >
        Next Page
      </button>
      {isFetching ? <span> Loading...</span> : null}{' '}
    </div>
  );
}
```

## placeholderData를 사용한 지연된 무한 쿼리 결과 {#lagging-infinite-query-results-with-placeholderdata}

일반적이지는 않지만, `placeholderData` 옵션은 `useInfiniteQuery` 훅과도 완벽하게 작동하므로, 무한 쿼리 키가 시간이 지남에 따라 변경되는 동안에도 사용자가 계속해서 캐시된 데이터를 볼 수 있도록 매끄럽게 처리할 수 있다.
