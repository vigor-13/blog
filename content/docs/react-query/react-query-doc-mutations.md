---
title: 뮤테이션
description:
date: 2024-03-25
tags: []
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/mutations',
    },
  ]
---

쿼리와 달리, 뮤테이션(Mutation)은 일반적으로 데이터를 생성/수정/삭제하거나 서버 사이드 이펙트를 수행하는 데 사용된다. 이를 위해 TanStack Query는 `useMutation` 훅을 제공한다.

다음은 서버에 새로운 할 일(todo)을 추가하는 뮤테이션의 예시다:

```tsx
function App() {
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post('/todos', newTodo);
    },
  });

  return (
    <div>
      {mutation.isPending ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: 'Do Laundry' });
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  );
}
```

어느 시점에서 뮤테이션은의 상태는 다음 중 하나다:

- `isIdle` 또는 `status === 'idle'` - 뮤테이션이 현재 유휴 상태이거나 초기/리셋 상태다.
- `isPending` 또는 `status === 'pending'` - 뮤테이션이 현재 실행 중이다.
- `isError` 또는 `status === 'error'` - 뮤테이션에서 에러가 발생했다.
- `isSuccess` 또는 `status === 'success'` - 뮤테이션이 성공적으로 완료되었고 뮤테이션 데이터를 사용할 수 있다.

이러한 주요 상태 외에도 뮤테이션의 상태에 따라 더 많은 정보를 사용할 수 있다:

- `error` - 뮤테이션이 `error` 상태인 경우, `error` 속성을 통해 에러에 액세스할 수 있다.
- `data` - 뮤테이션이 `success` 상태인 경우, `data` 속성을 통해 데이터에 액세스할 수 있다.

위의 예시에서 `mutate` 함수를 호출할 때 **단일 변수 또는 객체**를 전달하여 뮤테이션 함수에 변수를 전달할 수 있다.

뮤테이션은 그 자체로는 그다지 특별하지 않지만, `onSuccess` 옵션, **Query Client**의 `invalidateQueries` 메서드, `setQueryData` 메서드와 함께 사용하면 뮤테이션은 매우 강력한 도구가 된다.

:::important
**React 16 이하** 버전에서는 **이벤트 풀링(event pooling)** 이라는 기술을 사용한다. 이벤트 풀링은 성능 최적화를 위해 React가 이벤트 객체를 재사용하는 것을 의미한다. 이벤트 핸들러가 실행된 후에 React는 이벤트 객체를 null로 설정하고 나중에 다시 사용할 수 있도록 풀(pool)에 반환한다.

문제는 `mutate` 함수가 비동기로 동작한다는 것이다. `mutate` 함수가 실행되는 동안 React는 이미 이벤트 객체를 풀에 반환했을 수 있다. 따라서 `mutate` 함수 내부에서 이벤트 객체에 접근하려고 하면 이미 null이 되어 있어 접근할 수 없게 된다.

이 문제를 해결하기 위해서는 `mutate` 함수를 다른 함수로 감싸야 한다. 이렇게 하면 `mutate` 함수가 호출되는 시점에 이벤트 객체가 아직 유효한 상태이므로 이벤트 객체에 접근할 수 있다.

React 17부터는 이벤트 풀링이 제거되었으므로 이러한 문제가 발생하지 않는다. 하지만 이전 버전의 React를 사용하는 경우에는 `mutate` 함수를 래핑하는 것이 안전한 방법이다.
:::

```tsx
// This will not work in React 16 and earlier
const CreateTodo = () => {
  const mutation = useMutation({
    mutationFn: (event) => {
      event.preventDefault();
      return fetch('/api', new FormData(event.target));
    },
  });

  return <form onSubmit={mutation.mutate}>...</form>;
};

// This will work
const CreateTodo = () => {
  const mutation = useMutation({
    mutationFn: (formData) => {
      return fetch('/api', formData);
    },
  });
  const onSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(new FormData(event.target));
  };

  return <form onSubmit={onSubmit}>...</form>;
};
```

## 뮤테이션 상태 리셋하기 {#resetting-mutation-state}

때로는 뮤테이션 요청의 `error` 또는 `data` 를 초기화해야 하는 경우가 있다. 이를 위해 `reset` 함수를 사용할 수 있다:

```tsx
const CreateTodo = () => {
  const [title, setTitle] = useState('');
  const mutation = useMutation({ mutationFn: createTodo });

  const onCreateTodo = (e) => {
    e.preventDefault();
    mutation.mutate({ title });
  };

  return (
    <form onSubmit={onCreateTodo}>
      {mutation.error && (
        <h5 onClick={() => mutation.reset()}>{mutation.error}</h5>
      )}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <button type="submit">Create Todo</button>
    </form>
  );
};
```

## 뮤테이션 사이드 이펙트 {#mutation-side-effects}

`useMutation` 은 뮤테이션 생명주기 동안 어느 단계에서든 빠르고 쉽게 사이드 이펙트를 처리할 수 있는 몇 가지 도우미 옵션을 제공한다. 이는 **뮤테이션 후에 쿼리를 무효화하고 다시 fetch는 것**과 심지어 **낙관적 업데이트**에도 유용하다.

```tsx
useMutation({
  mutationFn: addTodo,
  onMutate: (variables) => {
    // 뮤테이션이 곧 일어난다!

    // 롤백 등의 경우에 사용할 데이터가 포함된 컨텍스트를 선택적으로 반환한다.
    return { id: 1 };
  },
  onError: (error, variables, context) => {
    // 에러가 발생했다!
    console.log(`rolling back optimistic update with id ${context.id}`);
  },
  onSuccess: (data, variables, context) => {
    // 성공!
  },
  onSettled: (data, error, variables, context) => {
    // 에러든 성공이든 중요하지 않다!
  },
});
```

콜백 함수 중 어느 것이라도 프로미스를 반환하면 다음 콜백이 호출되기 전에 먼저 해당 프로미스가 대기(await)한다.

```tsx
useMutation({
  mutationFn: addTodo,
  onSuccess: async () => {
    console.log("I'm first!");
  },
  onSettled: async () => {
    console.log("I'm second!");
  },
});
```

`mutate` 를 호출할 때 `useMutation` 에 정의된 콜백 외에 **추가적인 콜백을 트리거**하고 싶을 수 있다. 이는 컴포넌트-특정 사이드 이펙트를 트리거하는 데 사용할 수 있다. 이를 위해 `mutate` 함수의 뮤테이션 변수 다음에 useMutation과 동일한 형태의 콜백 옵션을 제공할 수 있다. 지원되는 옵션으로는 `onSuccess`, `onError`, `onSettled`가 있다. 컴포넌트가 뮤테이션이 완료되기 _전에_ 마운트 해제되면 해당 추가 콜백은 실행되지 않는다.

```tsx
useMutation({
  mutationFn: addTodo,
  onSuccess: (data, variables, context) => {
    // I will fire first
  },
  onError: (error, variables, context) => {
    // I will fire first
  },
  onSettled: (data, error, variables, context) => {
    // I will fire first
  },
});

mutate(todo, {
  onSuccess: (data, variables, context) => {
    // I will fire second!
  },
  onError: (error, variables, context) => {
    // I will fire second!
  },
  onSettled: (data, error, variables, context) => {
    // I will fire second!
  },
});
```

### 연속적인 뮤테이션 {#consecutive-mutations}

연속적인 뮤테이션의 경우 `onSuccess`, `onError`, `onSettled` 콜백이 처리된은 방식에 약간의 차이가 있다. 이들이 `mutate` 함수에 전달되면, 컴포넌트가 마운트되어 있는 경우에만 _한 번_ 실행된다. 이는 `mutate` 함수가 호출될 때마다 뮤테이션 옵저버가 제거되고 다시 구독되기 때문이다. 반면에 `useMutation` 핸들러는 각 `mutate` 호출에 대해 실행된다.

> **`useMutation` 에 전달된 `mutationFn` 은 대부분 비동기일 가능성이 높다는 점에 유의한다.** 이 경우, 뮤테이션이 이행되는 순서는 `mutate` 함수 호출 순서와 다를 수 있다.

```tsx
useMutation({
  mutationFn: addTodo,
  onSuccess: (data, error, variables, context) => {
    // 3번 호출될 것이다.
  },
});

const todos = ['Todo 1', 'Todo 2', 'Todo 3'];
todos.forEach((todo) => {
  mutate(todo, {
    onSuccess: (data, error, variables, context) => {
      // 어떤 뮤테이션이 먼저 리졸브되든 상관없이 마지막 뮤테이션(Todo 3)에 대해 한 번만 실행된다.
    },
  });
});
```

## 프로미스 {#promise}

성공시 리졸브 하거나 오류를 발생시키는 프로미스를 얻으려면 `mutate` 대신 `mutateAsync` 를 사용한다. 예를 들어 사이드 이펙트를 처리하는 데 사용할 수 있다.

```tsx
const mutation = useMutation({ mutationFn: addTodo });

try {
  const todo = await mutation.mutateAsync(todo);
  console.log(todo);
} catch (error) {
  console.error(error);
} finally {
  console.log('done');
}
```

## 재시도 {#retry}

기본적으로 TanStack Query는 오류 발생 시 뮤테이션을 다시 시도하지 않지만 `retry` 옵션을 사용하면 가능하다:

```tsx
const mutation = useMutation({
  mutationFn: addTodo,
  retry: 3,
});
```

디바이스가 오프라인 상태여서 뮤테이션이 실패한 경우 디바이스가 다시 연결되면 동일한 순서로 뮤테이션이 다시 시도된다.

## 뮤테이션 지속하기 {#persist-mutations}

필요한 경우 뮤테이션을 스토리지에 지속시키고 나중에 다시 이어서 진행할 수 있다. 이는 하이드레이션 함수를 사용하여 수행할 수 있다:

```tsx
const queryClient = new QueryClient();

// "addTodo" 뮤테이션을 정의한다.
queryClient.setMutationDefaults(['addTodo'], {
  mutationFn: addTodo,
  onMutate: async (variables) => {
    // todos에 대한 현재 쿼리 취소
    await queryClient.cancelQueries({ queryKey: ['todos'] });

    // optimistic todo 생성
    const optimisticTodo = { id: uuid(), title: variables.title };

    // todos에 optimistic todo 추가
    queryClient.setQueryData(['todos'], (old) => [...old, optimisticTodo]);

    // optimistic todo 컨텍스트 리턴
    return { optimisticTodo };
  },
  onSuccess: (result, variables, context) => {
    // todos에서 optimistic todo를 result로 바꾼다.
    queryClient.setQueryData(['todos'], (old) =>
      old.map((todo) =>
        todo.id === context.optimisticTodo.id ? result : todo,
      ),
    );
  },
  onError: (error, variables, context) => {
    // todos에서 optimistic todo를 제거한다.
    queryClient.setQueryData(['todos'], (old) =>
      old.filter((todo) => todo.id !== context.optimisticTodo.id),
    );
  },
  retry: 3,
});

// 일부 컴포넌트에서 뮤테이션을 시작한다:
const mutation = useMutation({ mutationKey: ['addTodo'] });
mutation.mutate({ title: 'title' });

// 예를 들어 디바이스가 오프라인 상태여서 뮤테이션이 일시 중지된 경우,
// 그런 다음 애플리케이션이 종료되면 일시 중지된 뮤테이션이 삭제될 수 있다:
const state = dehydrate(queryClient);

// 애플리케이션이 다시 시작될 때 돌연변이를 다시 하이드레이션할 수 있다:
hydrate(queryClient, state);

// 중단된 뮤테이션을 다시 시작한다:
queryClient.resumePausedMutations();
```

### 오프라인 뮤테이션 지속하기 {#persisting-offline-mutations}

[persistQueryClient 플러그인](https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient)을 사용하여 오프라인 뮤테이션을 지속시키는 경우, 기본 뮤테이션 함수를 제공하지 않으면 페이지를 다시 로드할 때 뮤테이션을 재개할 수 없다.

이는 기술적인 제한 사항이다. 외부 스토리지에 지속할 때는 함수는 직렬화할 수 없기 때문에 뮤테이션의 상태만 지속된다. 하이드레이션 후에는 뮤테이션을 트리거하는 컴포넌트가 마운트되지 않을 수 있으므로 `resumePausedMutations` 를 호출하면 `No mutationFn found` 에러가 발생할 수 있다.

```tsx
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

// 페이지 재로드 후 일시 중지된 뮤테이션이 다시 시작될 수 있도록 기본 뮤테이션 함수가 필요하다.
queryClient.setMutationDefaults(['todos'], {
  mutationFn: ({ id, data }) => {
    return api.updateTodo(id, data);
  },
});

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        // 로컬 스토리지에서 초기 복원이 성공한 후 뮤테이션 재개
        queryClient.resumePausedMutations();
      }}
    >
      <RestOfTheApp />
    </PersistQueryClientProvider>
  );
}
```

쿼리와 뮤테이션을 모두 다루는 광범위한 오프라인 [예시](https://tanstack.com/query/latest/docs/framework/react/examples/offline)도 있다.
