---
title: 쿼리 키
description:
date: 2024-03-16
tags: [react_query, tanstack_query, query]
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/query-keys',
    },
  ]
---

TanStack Query의 핵심은 쿼리 키를 기반으로 쿼리 캐싱을 관리한다는 것이다. 쿼리 키는 최상위 레벨에서 배열이어야 하며, 단일 문자열이 있는 배열부터 여러 문자열과 중첩된 객체가 있는 배열과 같이 복잡할 수 있다. 쿼리 키가 직렬화 가능하고 **쿼리 데이터에 대해서 고유**하다면 사용할 수 있다!

## 간단한 쿼리 키 {#simple-query-keys}

가장 간단한 키 형식은 상수 값이 있는 배열이다. 이 형식은 다음과 같은 경우에 유용하다:

- 일반 목록/색인 리소스
- 비계층적 리소스

```tsx
// todos 리스트
useQuery({ queryKey: ['todos'], ... })

// 그 밖에 나머지!
useQuery({ queryKey: ['something', 'special'], ... })
```

## 변수를 포함하는 키 배열 {#array-keys-with-variables}

쿼리에 데이터를 고유하게 설명하기 위해 더 많은 정보가 필요한 경우 문자열과 직렬화 가능한 객체가 포함된 배열을 사용하여 데이터를 설명할 수 있다. 이는 다음과 같은 경우에 유용하다:

- 계층적 또는 중첩된 리소스
  - 항목을 고유하게 식별하기 위해 ID, 인덱스 또는 기타 프리미티브를 전달하는 것이 일반적이다.
- 추가 파라미터가 있는 쿼리
  - 추가 옵션의 객체를 전달하는 것이 일반적이다.

```tsx
// 개별 todo
useQuery({ queryKey: ['todo', 5], ... })

// "preview" 형태의 개별 todo
useQuery({ queryKey: ['todo', 5, { preview: true }], ...})

// "done" 상태의 todo 리스트
useQuery({ queryKey: ['todos', { type: 'done' }], ... })
```

## 쿼리 키는 결정론적으로 해시된다 {#query-keys-are-hashed-deterministically}

즉, 객체의 키 순서에 관계없이 아래 쿼리는 모두 동일한 것으로 간주된다:

```tsx
useQuery({ queryKey: ['todos', { status, page }], ... })
useQuery({ queryKey: ['todos', { page, status }], ...})
useQuery({ queryKey: ['todos', { page, status, other: undefined }], ... })
```

그러나 다음 쿼리 키는 동일하지 않다. 배열 항목 순서가 중요하다!

```tsx
useQuery({ queryKey: ['todos', status, page], ... })
useQuery({ queryKey: ['todos', page, status], ...})
useQuery({ queryKey: ['todos', undefined, page, status], ...})
```

## 쿼리 함수가 변수에 의존하는 경우 쿼리 키에 변수를 포함시켜야 한다 {#if-your-query-function-depends-on-a-variable-include-it-in-your-query-key}

쿼리 키는 가져오는 데이터를 고유하게 설명하므로 쿼리 함수에서 **변경**되는 모든 변수를 쿼리 키에 포함해야 한다. 예를 들어:

```tsx
function Todos({ todoId }) {
  const result = useQuery({
    queryKey: ['todos', todoId],
    queryFn: () => fetchTodoById(todoId),
  });
}
```

쿼리 키는 쿼리 함수에 대한 종속성 역할을 한다는 점에 유의한다. 쿼리 키에 종속 변수를 추가하면 쿼리가 독립적으로 캐시되고 변수가 변경될 때마다 쿼리가 자동으로 다시 가져오도록 할 수 있다(`staleTime` 설정에 따라 다름).
