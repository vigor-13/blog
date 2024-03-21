---
title: 쿼리 함수
description:
date: 2024-03-16
tags: [react_query, tanstack_query, query]
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/query-functions',
    },
  ]
---

쿼리 함수는 말 그대로 **프로미스를 반환**하는 모든 함수가 될 수 있다. 반환되는 프로미스는 **데이터를 리졸브**하거나 **오류를 발생**시켜야 한다.

다음은 모두 유효한 쿼리 함수 구성이다:

```tsx
useQuery({ queryKey: ['todos'], queryFn: fetchAllTodos });
useQuery({ queryKey: ['todos', todoId], queryFn: () => fetchTodoById(todoId) });
useQuery({
  queryKey: ['todos', todoId],
  queryFn: async () => {
    const data = await fetchTodoById(todoId);
    return data;
  },
});
useQuery({
  queryKey: ['todos', todoId],
  queryFn: ({ queryKey }) => fetchTodoById(queryKey[1]),
});
```

## 에러 핸들링 및 예외 발생시키기 {#handling-and-throwing-errors}

TanStack Query에서 쿼리에 오류가 발생했다고 판단하려면 쿼리 함수가 거부된 프로미스를를 던지거나 반환해야 한다. 쿼리 함수에서 발생하는 모든 오류는 쿼리의 `error` 상태에 유지된다.

```tsx
const { error } = useQuery({
  queryKey: ['todos', todoId],
  queryFn: async () => {
    if (somethingGoesWrong) {
      throw new Error('Oh no!');
    }
    if (somethingElseGoesWrong) {
      return Promise.reject(new Error('Oh no!'));
    }

    return data;
  },
});
```

## 기본적으로 예외를 발생시키지 않는 fetch와 다른 클라이어트 사용법 {#usage-the-fetch-and-other-clients-that-do-not-throw-by-default}

`axios` 나 `graphql-request` 와 같은 대부분의 유틸리티는 실패한 HTTP 호출에 대해 자동으로 오류를 발생시킨다. 그러나 `fetch` 와 같은 일부 유틸리티는 기본적으로 오류를 발생시키지 않는다. 그런 경우, 직접 오류를 발생시켜야 한다. 인기 있는 `fetch` API를 사용하여 간단하게 처리하는 방법은 다음과 같다:

```tsx
useQuery({
  queryKey: ['todos', todoId],
  queryFn: async () => {
    const response = await fetch('/todos/' + todoId);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },
});
```

## 쿼리 함수 변수 {#query-function-variables}

쿼리 키는 가져오는 데이터를 고유하게 식별하는 데 사용되는 것뿐만 아니라 QueryFunctionContext 의 일부로 쿼리 함수에 편리하게 전달된다. 항상 필요한 것은 아니지만 필요한 경우 쿼리 함수를 추출할 수 있도록 합니다.

```tsx
function Todos({ status, page }) {
  const result = useQuery({
    queryKey: ['todos', { status, page }],
    queryFn: fetchTodoList,
  });
}

// 쿼리 함수에서 키, 상태 및 페이지 변수에 액세스할 수 있다!
function fetchTodoList({ queryKey }) {
  const [_key, { status, page }] = queryKey;
  return new Promise();
}
```

### QueryFunctionContext {#queryfunctioncontext}

`QueryFunctionContext`는 각 쿼리 함수에 전달되는 객체다. 다음으로 구성된다:

- `queryKey: QueryKey` : 쿼리 키
- `signal?: AbortSignal`
  - TanStack Query에서 제공하는 [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 인스턴스
  - [쿼리 취소](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation)에 사용할 수 있다.
- `meta: Record<string, unkown> | undefined`
  - 쿼리에 대한 추가 정보로 채울 수 있는 선택 필드다.

또한 [무한 쿼리](https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries)에는 다음 옵션이 전달된다:

- `pageParam: TPageParam`
  - 현재 페이지를 가져오는 데 사용되는 페이지 파라미터다.
- `direction: 'forward' | 'backward'`
  - 현재 페이지 불러오기 방향
