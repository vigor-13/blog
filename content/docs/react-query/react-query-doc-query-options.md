---
title: 쿼리 옵션
description:
date: 2024-03-16
tags: [query]
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/query-options',
    },
  ]
---

`queryKey` 와 `queryFn` 을 여러 곳에서 공유하면서도 서로 같은 위치에 유지하는 가장 좋은 방법 중 하나는 `queryOptions` 헬퍼를 사용하는 것이다. 런타임에는 이 헬퍼는 사용자가 전달한 모든 것을 반환하지만 타입스크립트와 함께 사용하면 많은 이점이 있다. 쿼리에 대해 가능한 모든 옵션을 한 곳에서 정의할 수 있으며, 모든 옵션에 대해 타입 추론 및 타입 안전성을 확보할 수 있다.

```ts
import { queryOptions } from '@tanstack/react-query';

function groupOptions(id: number) {
  return queryOptions({
    queryKey: ['groups', id],
    queryFn: () => fetchGroups(id),
    staleTime: 5 * 1000,
  });
}

// usage:

useQuery(groupOptions(1));
useSuspenseQuery(groupOptions(5));
useQueries({
  queries: [groupOptions(1), groupOptions(2)],
});
queryClient.prefetchQuery(groupOptions(23));
queryClient.setQueryData(groupOptions(42).queryKey, newGroups);
```

무한 쿼리의 경우 별도의 `infiniteQueryOptions` 헬퍼를 사용할 수 있다.
