---
title: 추천 패턴 - Flux
description:
date: 2024-03-18
tags: []
references:
  [
    {
      key: 'Zustand 공식 문서',
      value: 'https://docs.pmnd.rs/zustand/guides/flux-inspired-practice',
    },
  ]
---

Zustand는 강제적인 패턴이 없는 라이브러리이지만 몇 가지 패턴을 권장한다. 이러한 패턴은 원래 Flux와 최근에는 Redux에서 발견한 사례에서 영감을 얻은 것이므로 다른 라이브러리에서 사용 중이더라도 편안하게 사용할 수 있다.

하지만 Zustand는 몇 가지 근본적인 방식이 다르므로 일부 용어가 다른 라이브러리와 완벽하게 일치하지 않을 수 있다.

## 추천 패턴 {#recommended-patterns}

### 단일 스토어 {#single-store}

애플리케이션의 전역 상태는 단일 Zustand 스토어에 있어야 한다.

대규모 애플리케이션을 사용하는 경우 Zustand는 [스토어를 슬라이스로 분할하는 기능](https://docs.pmnd.rs/zustand/guides/slices-pattern)을 지원한다.

### set / setState 를 사용하여 스토어를 업데이트한다 {#use-set-setstate-to-update-the-store}

스토어 업데이트를 수행하려면 항상 `set` (또는 `setState` )를 사용한다. `set` (및 `setState` )는 설명된 업데이트가 올바르게 병합되고 수신자에게 적절하게 알림이 전송되도록 한다.

### 스토어와 함께 위치하는 액션

Zustand에서는 다른 Flux 라이브러리에서 볼 수 있는 디스패치 액션과 리듀서를 사용하지 않고도 상태를 업데이트할 수 있다. 이러한 스토어 액션은 아래와 같이 스토어에 직접 추가할 수 있다.

선택적으로 `setState` 를 사용하여 [스토어 외부에 위치시킬 수도 있다.](https://docs.pmnd.rs/zustand/guides/practice-with-no-store-actions)

```ts
const useBoundStore = create((set) => ({
  storeSliceA: ...,
  storeSliceB: ...,
  storeSliceC: ...,
  updateX: () => set(...),
  updateY: () => set(...),
}))
```

## Redux 유사 패턴 {#redux-like-patterns}

Redux에서처럼 리듀서 없이 살 수 없다면 스토어의 루트 수준에서 `dispatch` 함수를 정의할 수 있다:

```ts
const types = { increase: 'INCREASE', decrease: 'DECREASE' };

const reducer = (state, { type, by = 1 }) => {
  switch (type) {
    case types.increase:
      return { grumpiness: state.grumpiness + by };
    case types.decrease:
      return { grumpiness: state.grumpiness - by };
  }
};

const useGrumpyStore = create((set) => ({
  grumpiness: 0,
  dispatch: (args) => set((state) => reducer(state, args)),
}));

const dispatch = useGrumpyStore((state) => state.dispatch);
dispatch({ type: types.increase, by: 2 });
```

리덕스 미들웨어를 사용할 수도 있다. 메인 리듀서를 연결하고, 초기 상태를 설정하고, 상태 자체와 바닐라 API에 디스패치 함수를 추가한다.

```ts
import { redux } from 'zustand/middleware';

const useReduxStore = create(redux(reducer, initialState));
```

스토어를 업데이트하는 또 다른 방법은 상태 함수를 래핑하는 함수를 사용하는 것이다. 이러한 함수는 액션의 부작용을 처리할 수도 있다. 예를 들어 HTTP 호출을 사용할 수 있다. 비반응적인 방식으로 Zustand를 사용하려면 [readme](https://github.com/pmndrs/zustand#readingwriting-state-and-reacting-to-changes-outside-of-components)를 참조한다.
