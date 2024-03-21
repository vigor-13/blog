---
title: 쿼리
description:
date: 2024-03-16
tags: [query]
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/queries',
    },
  ]
---

## 쿼리 기초 {#query-basics}

컴포넌트나 커스텀 훅(Hook)에서 쿼리를 구독하려면, `useQuery` 등의 훅을 사용한다.

쿼리는 **고유 키**에 연결된 비동기 데이터 소스에 대한 선언적 종속성이다. 쿼리는 서버에서 데이터를 가져오기 위해 모든 프로미스 기반 메서드(GET 및 POST 메서드 포함)와 함께 사용할 수 있다. 메서드가 서버의 데이터를 수정하는 경우 대신 [변형(Mutations)](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)을 사용하는 것이 좋다.

컴포넌트 또는 커스텀 훅에서 쿼리를 구독하려면 `useQuery` 훅을 호출한다:

- 쿼리에 대한 고유 키
- 프로미스를 반환하는 함수다:
  - 데이터를 리졸브 하거나
  - 오류를 발생시킨다

```tsx
import { useQuery } from '@tanstack/react-query';

function App() {
  const info = useQuery({ queryKey: ['todos'], queryFn: fetchTodoList });
}
```

제공한 **고유 키**는 애플리케이션 전체에서 쿼리를 다시 가져오고, 캐싱하고, 공유하는 데 내부적으로 사용된다.

`useQuery` 가 반환하는 쿼리 결과에는 템플릿 작성 및 기타 데이터 사용에 필요한 쿼리에 대한 모든 정보가 포함되어 있다:

```tsx
const result = useQuery({ queryKey: ['todos'], queryFn: fetchTodoList });
```

`result` 객체에는 생산성을 높이기 위해 알아야 할 몇 가지 매우 중요한 **상태**가 포함되어 있다. 쿼리는 주어진 순간에 다음 상태 중 하나다:

- `isPending` 또는 `status === 'pending'` - 쿼리에 아직 데이터가 없는 경우.
- `isError` 또는 `status === 'error'` - 쿼리에서 오류가 발생한 경우.
- `isSuccess` 또는 `status === 'success'` - 쿼리가 성공했으며 데이터를 사용할 수 있는 경우.

이러한 기본 상태 외에도 쿼리 상태에 따라 더 많은 정보를 확인할 수 있다:

- `error` - 쿼리가 `isError` 상태인 경우 `error` 프로퍼티를 통해 오류를 사용할 수 있다.
- `data` - 쿼리가 `isSuccess` 상태인 경우 `data` 프로퍼티 통해 데이터를 사용할 수 있다.
- `isFetching` - 어떤 상태에서든 쿼리가 언제든지 불러오는 중이면(백그라운드 리프레시 포함) `isFetching` 이 `true` 가 된다.

대부분의 쿼리에서는 일반적으로 `isPending` 상태를 확인한 다음 `isError` 상태를 확인한 다음 마지막으로 데이터를 사용할 수 있다고 가정하고 성공 상태를 렌더링하는 것으로 충분하다:

```tsx
function Todos() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  // 이 시점에서 `isSuccess === true`라고 가정할 수 있다.
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

부울이 익숙하지 않다면 `status` 상태도 언제든지 사용할 수 있다:

```tsx
function Todos() {
  const { status, data, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList,
  });

  if (status === 'pending') {
    return <span>Loading...</span>;
  }

  if (status === 'error') {
    return <span>Error: {error.message}</span>;
  }

  // 또한 status === 'success', 'else' 로직도 작동한다.
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

또한 데이터에 액세스하기 전에 `pending` 중 및 `error` 를 확인한 경우 타입스크립트는 `data` 타입을 올바르게 좁혀준다.

### FetchStatus {#fetchstatus}

`status` 필드 외에도 다음과 같은 옵션이 있는 추가 `fetchStatus` 프로퍼티가 제공된다:

- `fetchStatus === 'fetching'` - 쿼리가 현재 가져오는 중이다.
- `fetchStatus === 'paused'` - 쿼리가 가져오려고 했지만 일시 중지되었다.
- `fetchStatus === 'idle'` - 쿼리가 현재 아무 작업도 수행하지 않고 있다.

### 왜 2가지 종류의 상태가 있을까? {#why-two-diffrent-states}

백그라운드 리프레시 및 stale-while-revalidate 로직은 `status` 및 `fetchStatus` 에 대한 모든 조합을 가능하게 한다. 예를 들어:

- `success` 상태의 쿼리는 일반적으로 `idle` fetchStatus에 있지만 백그라운드 리페칭이 발생하면 `fetching` 일 수도 있다.
- 마운트되고 데이터가 없는 쿼리는 일반적으로 `pending` 중 상태이며 fetchStatus에 있지만 네트워크 연결이 없는 경우 `paused` 될 수도 있다.

따라서 쿼리는 실제로 데이터를 가져오지 않고도 `pending` 중 상태가 될 수 있다는 점에 유의한다.

정리해보면 다음과 같다:

- `status` 는 `data` 에 대한 정보를 제공한다: 데이터가 있는가, 없는가?
- `fetchStatus` 는 `queryFn` 에 대한 정보를 제공한다: 실행 중인가, 아닌가?
