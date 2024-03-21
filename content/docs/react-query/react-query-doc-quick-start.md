---
title: 빠른시작
description:
date: 2024-03-16
tags: []
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/quick-start',
    },
  ]
---

아래의 코드 스니펫은 React Query의 3가지 핵심 개념을 아주 간략하게 설명한다:

- [쿼리](https://tanstack.com/query/latest/docs/framework/react/guides/queries)
- [변형](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [쿼리 무효화](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)

```tsx
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { getTodos, postTodo } from '../my-api';

// 클라이언트 생성하기
const queryClient = new QueryClient();

function App() {
  return (
    // App에 클라이언트 제공하기
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
}

function Todos() {
  // 클라이언트에 접근하기
  const queryClient = useQueryClient();

  // 쿼리
  const query = useQuery({ queryKey: ['todos'], queryFn: getTodos });

  // 변형
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // 무효화 및 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <div>
      <ul>{query.data?.map((todo) => <li key={todo.id}>{todo.title}</li>)}</ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          });
        }}
      >
        Add Todo
      </button>
    </div>
  );
}

render(<App />, document.getElementById('root'));
```

React Query의 핵심 기능의 대부분은 이 세 가지 개념으로 구성된다.
