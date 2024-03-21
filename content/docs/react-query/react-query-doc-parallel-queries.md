---
title: 병렬 쿼리
description:
date: 2024-03-22
tags: [parallel_query]
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/parallel-queries',
    },
  ]
---

'병렬' 쿼리는 fetch 동시성(concurrency)을 최대화하기 위해 병렬로 또는 동시에 실행되는 쿼리다.

## 수동 병렬 쿼리 {#manual-parallel-queries}

병렬 쿼리의 수가 일정한 경우, 병렬 쿼리를 사용하기 위해 추가적인 노력을 기울일 필요가 없다. Tanstack Query의 `useQuery` 와 `useInfiniteQuery` 훅을 나란히 몇 개든 사용하기만 하면 된다!

```tsx
function App () {
  // 다음 쿼리들은 병렬로 실행된다.
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const teamsQuery = useQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: fetchProjects })
  ...
}
```

:::note
서스펜스 모드에서 React Query를 사용하는 경우, 첫 번째 쿼리가 내부적으로 프로미스를 던지고 다른 쿼리가 실행되기 전에 컴포넌트를 일시 중단하기 때문에 이러한 병렬 처리 패턴이 작동하지 않는다. 이 문제를 해결하려면 (권장되는) `useSuspenseQueries` 훅을 사용하거나 각 `useSuspenseQuery` 인스턴스에 대해 별도의 컴포넌트를 사용하여 자체적으로 오케스트레이션해야 한다.
:::

## useQueries를 사용한 동적 병렬 쿼리 {#dynamic-parallel-queries-with-usequeries}

실행해야 하는 쿼리 수가 동적으로 변경되는 경우 수동 쿼리를 사용하면 훅 규칙을 위반하게 되어 사용할 수 없다. 대신, TanStack Query는 원하는 만큼의 쿼리를 동적으로 병렬로 실행하는 데 사용할 수 있는 `useQueries` 훅을 제공한다.

`useQueries` 함수는 `queries` 속성이 있는 옵션 객체를 받으며 `queries` 의 값은 쿼리 객체 배열이다.

`useQeuries` 함수는 쿼리 결과 배열을 반환한다.

```tsx
function App({ users }) {
  const userQueries = useQueries({
    queries: users.map((user) => {
      return {
        queryKey: ['user', user.id],
        queryFn: () => fetchUserById(user.id),
      };
    }),
  });
}
```
