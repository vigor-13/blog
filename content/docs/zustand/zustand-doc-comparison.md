---
title: 비교
description: 다른 라이브러리와 비교해 보기
date: 2024-03-18
tags: []
references:
  [
    {
      key: 'Zustand 공식 문서',
      value: 'https://docs.pmnd.rs/zustand/getting-started/comparison',
    },
  ]
---

Zustand는 React 생태계의 많은 상태 관리 라이브러리 중 하나다. 이 페이지에서는 Redux, Valtio, Zotal, Recoil 등 몇몇 라이브러리와 비교하여 Zustand에 대해 설명한다.

각 라이브러리에는 고유한 장단점이 있으며, 각각의 주요 차이점과 유사점을 비교해 본다.

## Redux {#redux}

### 상태 모델 {#state-model-vs-redux}

개념적으로 Zustand와 Redux는 매우 유사하며, 둘 다 **불변 상태 모델**을 기반으로 한다. 하지만 **Redux는 앱이 컨텍스트 프로바이더로 래핑되어야 하지만 Zustand는 그렇지 않다.**

:::tabs

@tab:active zustand#zustand

```ts
import { create } from 'zustand';

type State = {
  count: number;
};

type Actions = {
  increment: (qty: number) => void;
  decrement: (qty: number) => void;
};

const useCountStore = create<State & Actions>((set) => ({
  count: 0,
  increment: (qty: number) => set((state) => ({ count: state.count + qty })),
  decrement: (qty: number) => set((state) => ({ count: state.count - qty })),
}));
```

```ts
import { create } from 'zustand';

type State = {
  count: number;
};

type Actions = {
  increment: (qty: number) => void;
  decrement: (qty: number) => void;
};

type Action = {
  type: keyof Actions;
  qty: number;
};

const countReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + action.qty };
    case 'decrement':
      return { count: state.count - action.qty };
    default:
      return state;
  }
};

const useCountStore = create<State & Actions>((set) => ({
  count: 0,
  dispatch: (action: Action) => set((state) => countReducer(state, action)),
}));
```

@tab redux#redux

```ts
import { createStore } from 'redux';
import { useSelector, useDispatch } from 'react-redux';

type State = {
  count: number;
};

type Action = {
  type: 'increment' | 'decrement';
  qty: number;
};

const countReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + action.qty };
    case 'decrement':
      return { count: state.count - action.qty };
    default:
      return state;
  }
};

const countStore = createStore(countReducer);
```

```ts
import { createSlice, configureStore } from '@reduxjs/toolkit';

const countSlice = createSlice({
  name: 'count',
  initialState: { value: 0 },
  reducers: {
    incremented: (state, qty: number) => {
      // Redux 툴킷은 상태를 변경하지 않고 백그라운드에서 Immer 라이브러리를 사용하여 "드래프트 상태" 개념을 사용한다.
      state.value += qty;
    },
    decremented: (state, qty: number) => {
      state.value -= qty;
    },
  },
});

const countStore = configureStore({ reducer: countSlice.reducer });
```

:::

### 렌더 최적화 {#render-optimization-vs-redux}

앱 내 렌더링 최적화와 관련하여 Zustand와 Redux의 접근 방식에는 큰 차이가 없다. 두 라이브러리 모두 선택기를 사용하여 렌더링 최적화를 수동으로 적용하는 것이 좋다.

:::tabs

@tab:active zustand#zustand

```ts
import { create } from 'zustand';

type State = {
  count: number;
};

type Actions = {
  increment: (qty: number) => void;
  decrement: (qty: number) => void;
};

const useCountStore = create<State & Actions>((set) => ({
  count: 0,
  increment: (qty: number) => set((state) => ({ count: state.count + qty })),
  decrement: (qty: number) => set((state) => ({ count: state.count - qty })),
}));

const Component = () => {
  const count = useCountStore((state) => state.count);
  const increment = useCountStore((state) => state.increment);
  const decrement = useCountStore((state) => state.decrement);
  // ...
};
```

@tab redux#redux

```ts
import { createStore } from 'redux';
import { useSelector, useDispatch } from 'react-redux';

type State = {
  count: number;
};

type Action = {
  type: 'increment' | 'decrement';
  qty: number;
};

const countReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + action.qty };
    case 'decrement':
      return { count: state.count - action.qty };
    default:
      return state;
  }
};

const countStore = createStore(countReducer);

const Component = () => {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();
  // ...
};
```

```ts
import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { createSlice, configureStore } from '@reduxjs/toolkit';

const countSlice = createSlice({
  name: 'count',
  initialState: { value: 0 },
  reducers: {
    incremented: (state, qty: number) => {
      state.value += qty;
    },
    decremented: (state, qty: number) => {
      state.value -= qty;
    },
  },
});

const countStore = configureStore({ reducer: countSlice.reducer });

const useAppSelector: TypedUseSelectorHook<typeof countStore.getState> =
  useSelector;

const useAppDispatch: () => typeof countStore.dispatch = useDispatch;

const Component = () => {
  const count = useAppSelector((state) => state.count.value);
  const dispatch = useAppDispatch();
  // ...
};
```

:::
