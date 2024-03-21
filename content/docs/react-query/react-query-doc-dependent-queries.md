---
title: 종속 쿼리
description:
date: 2024-03-22
tags: [dependent_query]
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries',
    },
  ]
---

## useQuery 종속 쿼리

종속(또는 직렬) 쿼리는 이전 쿼리가 완료된 후에 실행되는 쿼리다. `enabled` 옵션을 쿼리에 알려주기만 하면 되기 때문에 굉장히 간편하다.

```tsx
// 유저를 가져온다.
const { data: user } = useQuery({
  queryKey: ['user', email],
  queryFn: getUserByEmail,
});

const userId = user?.id;

// 그런 다음 유저의 프로젝트를 가져온다.
const {
  status,
  fetchStatus,
  data: projects,
} = useQuery({
  queryKey: ['projects', userId],
  queryFn: getProjectsByUser,
  // 이 쿼리는 userId 값이 존재하기 전에는 실행되지 않는다.
  enabled: !!userId,
});
```

`projects` 쿼리는 다음과 같은 상태로 시작한다:

```tsx
status: 'pending';
isPending: true;
fetchStatus: 'idle';
```

`user` 를 사용할 수 있게 되면 `projects` 쿼리가 `enabled` 되고 다음과와 같은 상태로 전환된다:

```tsx
status: 'pending';
isPending: true;
fetchStatus: 'fetching';
```

쿼리가 완료되면 다음과 같은 상태가 된다.

```tsx
status: 'success';
isPending: false;
fetchStatus: 'idle';
```

## useQueries 종속 쿼리

동적 병렬 쿼리 - `useQueries` 는 다른 쿼리에 의존할 수 있으며, 다음과 같은 방식으로 이루어진다:

```tsx
// 유저들의 id를 가져온다.
const { data: userIds } = useQuery({
  queryKey: ['users'],
  queryFn: getUsersData,
  select: (users) => users.map((user) => user.id),
});

// 그리고 유저들의 메시지를 가져온다.
const usersMessages = useQueries({
  queries: userIds
    ? userIds.map((id) => {
        return {
          queryKey: ['messages', id],
          queryFn: () => getMessagesByUsers(id),
        };
      })
    : [], // 유저가 undefined라면, 빈 배열이 리턴된다.
});
```

`useQueries` 는 쿼리 결과 배열을 반환한다.

## 성능에 관한 참고 사항 {#a-note-about-performance}

종속 쿼리는 그 특성상 일종의 [요청 워터폴](https://tanstack.com/query/latest/docs/framework/react/guides/request-waterfalls)을 발생시켜 성능을 저하시킨다. 두 쿼리가 같은 시간이 걸린다고 가정할때 병렬이 아닌 직렬로 수행하면 항상 두 배의 시간이 걸리며, 특히 지연 시간이 긴 클라이언트에서 발생하면 더 큰 문제가 된다. 가능하다면 두 쿼리를 병렬로 가져올 수 있도록 백엔드 API를 재구성하는 것이 좋지만, 현실적으로 항상 가능한 것은 아니다.

위 예제에서는 `getProjectsByUser` 를 fetch하기 위해 먼저 `getUserByEmail` 을 fetch하는 대신 새로운 `getProjectsByUserEmail` 쿼리를 도입하면 워터폴을 방지할 수 있다.
