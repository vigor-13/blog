---
title: 불변 상태와 병합
description:
date: 2024-03-18
tags: []
references:
  [
    {
      key: 'Zustand 공식 문서',
      value: 'https://docs.pmnd.rs/zustand/guides/immutable-state-and-merging',
    },
  ]
---

React의 `useState` 와 마찬가지로 상태를 불변으로 업데이트해야 한다.

다음은 일반적인 예시다:

```ts
import { create } from 'zustand';

const useCountStore = create((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));
```

`set` 함수는 스토어에서 상태를 업데이트한다. 상태는 불변이므로 다음과 같아야 한다:

```ts
set((state) => ({ ...state, count: state.count + 1 }));
```

그러나 일반적인 상황에서는 `set` 함수가 상태를 병합하므로 `...state` 부분을 건너뛸 수 있다:

```ts
set((state) => ({ count: state.count + 1 }));
```

## 중첩된 객체 {#nested-object}

`set` 함수는 하나의 레벨에서만 상태를 병합한다. 중첩된 객체가 있는 경우 명시적으로 병합해야 한다. 다음과 같이 스프레드 연산자 패턴을 사용한다:

```ts
import { create } from 'zustand';

const useCountStore = create((set) => ({
  nested: { count: 0 },
  inc: () =>
    set((state) => ({
      nested: { ...state.nested, count: state.nested.count + 1 },
    })),
}));
```

복잡한 사용 사례의 경우 불변 업데이트에 도움이 되는 일부 라이브러리를 사용하는 것이 좋다.

## 플래그 교체하기 {#replace-flag}

병합 동작을 비활성화하려면 다음과 같이 `set` 에 `replace` 부울 값을 지정하면 된다:

```ts
set((state) => newState, true);
```
