---
title: 쿼리 비활성화 / 일시중지
description:
date: 2024-03-22
tags: []
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries',
    },
  ]
---

쿼리가 자동으로 실행되지 않도록 하려면 `enabled = false` 옵션을 사용한다.

`enabled` 가 `false` 라면:

- 쿼리에 캐시된 데이터가 있는 경우 쿼리는 `status === 'success'` 또는 `isSuccess` 상태로 초기화된다.
- 쿼리에 캐시된 데이터가 없는 경우 쿼리는 `status === 'pending'` 및 `fetchStatus === 'idle'` 상태로 시작한다.
- 쿼리는 마운트 시 자동으로 fetch 하지 않는다.
- 쿼리는 백그라운드에서 자동으로 refetch 하지 않는다.
- 쿼리는 일반적으로 쿼리를 refetch 하는 쿼리 클라이언트 `invalidateQueries` 및 `refetchQueries` 호출을 무시한다.
- `useQuery` 에서 반환된 `refetch` 를 사용하여 쿼리를 수동으로 트리거하여 fetch 할 수 있다. 그러나 `skipToken` 에서는 작동하지 않는다.

:::note
TypeScript 사용자는 `enabled = false` 대신 `skipToken` 을 사용할 수 있다.
:::

```tsx
function Todos() {
  const { isLoading, isError, data, error, refetch, isFetching } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList,
    enabled: false,
  });

  return (
    <div>
      <button onClick={() => refetch()}>Fetch Todos</button>

      {data ? (
        <>
          <ul>
            {data.map((todo) => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ul>
        </>
      ) : isError ? (
        <span>Error: {error.message}</span>
      ) : isLoading ? (
        <span>Loading...</span>
      ) : (
        <span>Not ready ...</span>
      )}

      <div>{isFetching ? 'Fetching...' : null}</div>
    </div>
  );
}
```

쿼리를 영구적으로 비활성화하면 백그라운드 리프레시와 같은 TanStack Query가 제공하는 많은 훌륭한 기능을 사용할 수 없게 되며, 관용적인 방식도 아니다. 선언적 접근 방식(쿼리가 실행되어야 하는 종속성 정의)에서 명령형 모드(수동으로 클릭할 때마다 fetch)로 전환된다. 또한 `refetch` 에 파라미터를 전달할 수 없다. 종종 초기 fetch를 지연시키는 지연 쿼리만 원하는 경우가 많다:

## 지연 쿼리 {#lazy-queries}

`enabled` 옵션은 쿼리를 영구적으로 비활성화하는 데 사용할 수 있을 뿐만 아니라 쿼리를 나중에 활성/비활성화하는 경우에도 사용할 수 있다. 예를 들어 사용자가 필터 값을 입력한 후 첫 번째 요청을 전송하려는 경우가 대표적이다.

```tsx
function Todos() {
  const [filter, setFilter] = React.useState('');

  const { data } = useQuery({
    queryKey: ['todos', filter],
    queryFn: () => fetchTodos(filter),
    // ⬇️ 필터가 비어 있는 한 비활성화
    enabled: !!filter,
  });

  return (
    <div>
      // 🚀 applying the filter will enable and execute the query
      <FiltersForm onApply={setFilter} />
      {data && <TodosTable data={data} />}
    </div>
  );
}
```

### isLoading {#isloading}

지연 쿼리는 처음부터 `status: pending` 상태다. `pending` 은 아직 데이터가 없음을 의미한다. 기술적으로는 맞지만 현재 데이터를 fetch 하고 있지 않기 때문에 이 플래그를 사용하여 로딩 스피너를 표시할 수는 없다.

비활성화 또는 지연 쿼리를 사용하는 경우 대신 `isLoading` 플래그를 사용할 수 있다. 이 플래그는 다음에서 계산되는 파생 플래그다:

`isPending && isFetching`

즉 `isLoading` 플래그는 쿼리가 현재 처음으로 fetch 하는 경우에만 true가 된다.

## skipToken을 사용한 타입세이프 쿼리 비활성화 {#typesafe-disabling-of-queries-using-skiptoken}

TypeScript를 사용하는 경우 `skipToken` 을 사용하여 쿼리를 비활성화할 수 있다. 조건에 따라 쿼리를 비활성화하되 쿼리의 타입 안전성을 유지하려는 경우에 유용하다.

:::warning
`useQuery` 에서 `refetch` 는 `skipToken` 과 함께 작동하지 않는다. 그 외에 `skipToken` 은 `enabled: false` 와 동일하게 작동한다.
:::

```tsx
function Todos() {
  const [filter, setFilter] = React.useState<string | undefined>();

  const { data } = useQuery({
    queryKey: ['todos', filter],
    // ⬇️ disabled as long as the filter is undefined or empty
    queryFn: filter ? () => fetchTodos(filter) : skipToken,
  });

  return (
    <div>
      // 🚀 applying the filter will enable and execute the query
      <FiltersForm onApply={setFilter} />
      {data && <TodosTable data={data} />}
    </div>
  );
}
```
