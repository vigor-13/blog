---
title: 백그라운드 fetch 표시기
description:
date: 2024-03-22
tags: []
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/background-fetching-indicators',
    },
  ]
---

쿼리의 `status === 'pending'` 상태는 쿼리의 초기 하드 로딩 상태를 표시하기에 충분하지만 때로는 쿼리가 백그라운드에서 리프레시되고 있다는 추가 표시기를 표시하고 싶을 수 있다. 이를 위해 쿼리는 `status` 변수의 상태와 관계없이 쿼리가 fetching 상태임을 표시하는 데 사용할 수 있는 `isFetching` 부울도 제공한다:

```tsx
function Todos() {
  const {
    status,
    data: todos,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  return status === 'pending' ? (
    <span>Loading...</span>
  ) : status === 'error' ? (
    <span>Error: {error.message}</span>
  ) : (
    <>
      {isFetching ? <div>Refreshing...</div> : null}

      <div>
        {todos.map((todo) => (
          <Todo todo={todo} />
        ))}
      </div>
    </>
  );
}
```

## 전역 백그라운드 fetch 로딩 상태 표시하기 {#displaying-global-background-fetching-loading-state}

개별 쿼리 로딩 상태 외에도 쿼리를 fetch할 때(백그라운드 포함) 전역 로딩 표시기를 표시하려면 `useIsFetching` 훅을 사용할 수 있다:

```tsx
import { useIsFetching } from '@tanstack/react-query';

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();

  return isFetching ? (
    <div>Queries are fetching in the background...</div>
  ) : null;
}
```
