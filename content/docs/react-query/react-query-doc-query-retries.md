---
title: 쿼리 재시도
description:
date: 2024-03-22
tags: []
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/query-retries',
    },
  ]
---

`useQuery` 쿼리가 실패하면, 해당 쿼리의 요청이 최대 연속 재시도 횟수(기본값은 `3`)에 도달하지 않았거나 재시도 허용 여부를 결정하는 함수가 제공된 경우 TanStack Query가 자동으로 쿼리를 재시도한다.

재시도는 전역 수준과 개별 쿼리 수준 모두에서 설정할 수 있다.

- 재시도를 `false` 로 설정하면 재시도가 비활성화된다.
- `retry = 6` 으로 설정하면 실패한 요청을 `6` 번 재시도한 후 함수가 던진 최종 오류를 표시한다.
- `retry = true` 로 설정하면 실패한 요청을 무한히 재시도한다.
- `retry = (failureCount, error) => ...` 로 설정하면 요청 실패 이유에 따라 사용자 지정 로직을 사용할 수 있다.

:::note
서버에서 재시도는 서버 렌더링을 최대한 빠르게 하기 위해 기본값이 `0` 으로 설정된다.
:::

```tsx
import { useQuery } from '@tanstack/react-query';

// 쿼리를 특정 횟수만큼 재시도하기
const result = useQuery({
  queryKey: ['todos', 1],
  queryFn: fetchTodoListPage,
  retry: 10, // 실패한 요청을 10회 재시도한 후 오류를 표시한다.
});
```

:::note
쿼리가 실패한 경우 처음에는 오류 내용이 `failureReason` 프로퍼티에 포함되며 이는 마지막 재시도 시도까지 계속된다. 예시에서는 최대 9번의 재시도가 있으므로(총 10번 시도) 처음 9번의 재시도 동안 오류 내용은 `failureReason` 에 포함된다. 모든 재시도 후에도 오류가 지속되면, 마지막에는 오류 내용은 `error` 프로퍼티에 포함된다.

즉, 오류가 발생하면 일정 횟수의 재시도가 이루어지고, 재시도 중에는 오류 정보가 `failureReason`에 포함되다가, 최종적으로 오류가 지속되면 `error` 에 포함된다.
:::

## 재시도 지연 {#retry-delay}

기본적으로 재시도는 요청이 실패한 직후에 바로 수행되지 않는다. 표준에 따라 각 재시도 시도에 백오프 지연이 점진적으로 적용된다.

기본 `retryDelay` 는 각 시도마다 두 배( `1000`ms부터 시작)로 설정되지만 30초를 초과할 수 없다:

```tsx
// Configure for all queries
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
}
```

권장되지는 않지만 프로바이더 및 개별 쿼리 옵션 모두에서 `retryDelay` 함수/정수를 재정의할 수 있다. 함수 대신 정수로 설정하면 지연 시간은 항상 일정한 시간이 된다:

```tsx
const result = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodoList,
  retryDelay: 1000, // 재시도 횟수에 관계없이 항상 1000ms를 기다렸다가 재시도한다.
});
```
