---
title: 초기 쿼리 데이터
description:
date: 2024-03-23
tags: []
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/initial-query-data',
    },
  ]
---

쿼리에 필요한 초기 데이터를 미리 캐시에 제공하는 방법에는 여러 가지가 있다:

- 선언적 방식:
  - 쿼리에 `initialData` 를 제공하여 캐시가 비어 있을 경우 미리 채워둔다.
- 명령적 방식:
  - `queryClient.prefetchQuery` 를 사용하여 데이터를 미리 가져온다.
  - `queryClient.setQueryData` 를 사용하여 데이터를 수동으로 캐시에 배치한다.

선언적 방식은 쿼리 정의 시점에 초기 데이터를 지정하는 간단한 방법이다. 쿼리 옵션에 `initialData` 속성을 설정하면 쿼리가 처음 실행될 때 해당 데이터로 캐시를 채운다.

명령적 방식 중 `prefetchQuery` 는 쿼리가 실제로 사용되기 전에 데이터를 미리 fetch하여 캐시에 저장한다. 이는 초기 로딩 시간을 줄이는 데 유용하다.

`setQueryData` 는 데이터를 수동으로 캐시에 직접 배치하는 방법이다. 이미 데이터를 가지고 있거나 다른 출처에서 가져온 경우 이 함수를 사용하여 캐시를 업데이트할 수 있다.

## initialData 를 사용하여 쿼리에 초기 데이터 제공하기 {#using-initialData-to-prepopulate-a-query}

때로는 앱에서 쿼리에 필요한 초기 데이터를 이미 가지고 있어서 쿼리에 직접 제공할 수 있는 경우가 있다. 이러한 경우라면 `config.initialData` 옵션을 사용하여 쿼리의 초기 데이터를 설정하고 초기 로딩 상태를 건너뛸 수 있다!

:::important
`initialData` 는 캐시에 유지되므로, 이 옵션에 플레이스홀더, 부분적이거나 불완전한 데이터를 제공하는 것은 권장되지 않는다. 대신 `placeholderData` 를 사용한다.
:::

```tsx
const result = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/todos'),
  initialData: initialTodos,
});
```

### staleTime 과 initialDataUpdatedAt {#staleTime-and-initialDataUpdatedAt}

기본적으로 `initialData` 는 방금 fetch한 것처럼 완전히 새로운 것으로 취급된다. 이는 `staleTime` 옵션에 의해 해석되는 방식에도 영향을 미친다.

:::note
`staleTime` 옵션은 데이터가 오래되었다고 판단하는 기준 시간을 설정한다. 예를 들어 `staleTime` 이 5분으로 설정되어 있다면, 데이터가 가져온 지 5분이 지나면 오래된 것으로 간주한다.

그런데 `initialData` 를 사용하면 해당 데이터는 방금 fetch한 것처럼 취급되므로, `staleTime` 이 경과하기 전까지는 계속 새로운 상태로 유지된다.

만약 `initialData` 가 실제로는 오래전에 가져온 데이터라면, `initialDataUpdatedAt` 옵션을 사용하여 해당 데이터가 마지막으로 업데이트된 시간을 명시할 수 있다. 이렇게 하면 `staleTime` 이 경과했는지를 판단할 때 `initialData` 의 실제 업데이트 시간을 기준으로 삼게 된다.
:::

- 쿼리 옵저버를 `initialData` 와 함께 구성하고 `staleTime` 을 설정하지 않으면 (기본값 `staleTime: 0`), 쿼리가 마운트될 때 즉시 다시 fetch를 수행한다.

```tsx
// 초기 할일을 즉시 표시할 뿐만 아니라 마운트 후 즉시 할일을 다시 가져온다.
const result = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/todos'),
  initialData: initialTodos,
});
```

- 쿼리 옵저버를 `initialData` 와 `1000`ms의 `staleTime` 으로 구성하면, 해당 데이터는 마치 쿼리 함수에서 방금 fetch한 것처럼 동일한 시간 동안 신선한 것으로 간주된다.

```tsx
// 초기 할일을 즉시 표시하지만 1000ms 후에 다른 상호작용 이벤트가 발생할 때까지 다시 fetch하지 않는다.
const result = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/todos'),
  initialData: initialTodos,
  staleTime: 1000,
});
```

- 그렇다면 `initialData` 가 완전히 새로운 것이 아니라면 어떻게 해야 할까? 이 경우 가장 정확한 방법은 `initialDataUpdatedAt` 옵션을 사용하는 것이다. 이 옵션을 사용하면 `initialData` 가 마지막으로 업데이트된 시간을 JS 타임스탬프로 전달할 수 있다. 예를 들어 `Date.now()` 가 제공하는 값과 같은 형태다. 유닉스 타임스탬프가 있는 경우 1000을 곱하여 JS 타임스탬프로 변환해야 한다.

```tsx
// 초기 할일을 즉시 표시하지만 1000ms 후에 다른 상호작용 이벤트가 발생할 때까지 다시 fetch하지 않는다.
const result = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/todos'),
  initialData: initialTodos,
  staleTime: 60 * 1000, // 1 minute
  // 10초 전 또는 10분 전일 수 있다.
  initialDataUpdatedAt: initialTodosUpdatedTimestamp, // eg. 1608412420052
});
```

이 옵션을 사용하면 `staleTime` 을 본래의 목적대로 데이터의 신선도를 결정하는 데 사용할 수 있으며, 동시에 `initialData` 가 `staleTime` 보다 오래된 경우에는 마운트 시 데이터를 다시 fetch할 수 있다. 위의 예시에서 데이터는 1분 이내까지만 신선한 것으로 판단되며, `initialData` 가 마지막으로 업데이트된 시점을 쿼리에 알려줌으로써 쿼리가 스스로 데이터를 다시 fetch해야 하는지 여부를 결정할 수 있다.

:::note
데이터를 미리 fetch한 데이터로 취급하고 싶다면 `prefetchQuery` 또는 `fetchQuery` API를 사용하여 캐시를 미리 채우는 것이 좋다. 이렇게 하면 `initialData` 와 독립적으로 `staleTime` 을 구성할 수 있다.
:::

### 초기 데이터 함수 {#initial-data-function}

쿼리의 초기 데이터에 액세스하는 과정이 부담되거나 단순히 매 렌더링마다 수행하고 싶지 않은 경우, `initialData` 값으로 함수를 전달할 수 있다. 이 함수는 쿼리가 초기화될 때 한 번만 실행되므로 소중한 메모리와 CPU를 절약할 수 있다.

```tsx
const result = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/todos'),
  initialData: () => getExpensiveTodos(),
});
```

### 캐시에서 초기 데이터 가져오기 {#initial-data-from-cache}

경우에 따라 다른 쿼리의 캐시된 결과에서 초기 데이터를 제공할 수 있다. 이에 대한 좋은 예시는 할 일 목록 쿼리에서 개별 할 일 항목을 검색하여 해당 항목을 개별 할 일 쿼리의 초기 데이터로 사용하는 것이다.

```tsx
const result = useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetch('/todos'),
  initialData: () => {
    // 이 todo 쿼리의 초기 데이터로 'todos' 쿼리의 데이터를 사용한다.
    return queryClient.getQueryData(['todos'])?.find((d) => d.id === todoId);
  },
});
```

:::warning
다만 주의할 점은 캐시된 데이터가 최신 상태가 아닐 수 있다는 것이다. 따라서 필요에 따라 `staleTime` 이나 `refetchOnMount` 와 같은 옵션을 사용하여 데이터의 신선도를 관리해야 한다.

또한 캐시된 데이터를 초기 데이터로 사용할 때는 해당 데이터가 실제로 존재하는지 확인해야 한다.
:::

### initialDataUpdatedAt을 사용하여 캐시에서 초기 데이터 가져오기 {#initial-data-from-the-cache-with-initialDataUpdatedAt}

캐시에서 초기 데이터를 가져온다는 것은 초기 데이터를 찾기 위해 사용 중인 소스 쿼리가 오래되었을 가능성이 높다는 것을 의미한다. 쿼리가 즉시 다시 fetch하는 것을 방지하기 위해 인위적인 `staleTime` 을 사용하는 대신, 소스 쿼리의 `dataUpdatedAt` 을 `initialDataUpdatedAt` 에 전달하는 것이 좋다. 이렇게 하면 초기 데이터가 제공되는지 여부에 관계없이 쿼리 인스턴스에 쿼리를 다시 fetch 해야 하는지 여부와 시기를 결정하는 데 필요한 모든 정보를 제공할 수 있다.

```tsx
const result = useQuery({
  queryKey: ['todos', todoId],
  queryFn: () => fetch(`/todos/${todoId}`),
  initialData: () =>
    queryClient.getQueryData(['todos'])?.find((d) => d.id === todoId),
  initialDataUpdatedAt: () =>
    queryClient.getQueryState(['todos'])?.dataUpdatedAt,
});
```

### 캐시에서 조건부 초기 데이터 가져오기 {#conditional-initial-data-from-cache}

초기 데이터를 조회하는 데 사용 중인 소스 쿼리가 오래된 경우, 캐시된 데이터를 전혀 사용하지 않고 서버에서 직접 가져오는 것이 좋을 수 있다. 이 결정을 더 쉽게 내리기 위해 `queryClient.getQueryState` 메서드를 대신 사용하여 소스 쿼리에 대한 더 많은 정보를 얻을 수 있다. 여기에는 쿼리가 필요에 따라 충분히 "신선한지" 판단하는 데 사용할 수 있는 `state.dataUpdatedAt` 타임스탬프가 포함된다.

```tsx
const result = useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetch(`/todos/${todoId}`),
  initialData: () => {
    // 쿼리 상태를 가져온다.
    const state = queryClient.getQueryState(['todos']);

    //  쿼리가 존재하고 10초 이내의 데이터가 있는 경우...
    if (state && Date.now() - state.dataUpdatedAt <= 10 * 1000) {
      // 데이터를 리턴한다.
      return state.data.find((d) => d.id === todoId);
    }

    // 그렇지 않은 경우, undefined를 리턴하고 하드 로딩 상태에서 fetch 한다!
  },
});
```
