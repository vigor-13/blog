---
title: Zustand 소개
description:
date: 2024-03-18
tags: []
references:
  [
    {
      key: 'Zustand 공식 문서',
      value: 'https://docs.pmnd.rs/zustand/getting-started/introduction',
    },
  ]
---

![](https://github.com/pmndrs/zustand/raw/main/bear.jpg)

작고 빠르며 확장 가능한 베어본 상태 관리 솔루션이다. Zustand는 훅(Hook)을 기반으로 하는 간편한 API를 제공한다. 보일러플레이트나 강압적인 규칙이 없고, 명시적이고 Flux와 유사한 규칙을 갖추고 있다.

귀엽다고 무시하면 안된다, 발톱이 있다!

끔찍한 [좀비 차일드 문제](https://react-redux.js.org/api/hooks#stale-props-and-zombie-children), [React 동시성](https://github.com/bvaughn/rfcs/blob/useMutableSource/text/0000-use-mutable-source.md), 혼합 렌더러 간의 [컨텍스트 손실](https://github.com/facebook/react/issues/13332)과 같은 일반적인 이 모든 함정들을 제대로 처리하는 유일한 상태 관리자 일지도 모른다.

## 설치 {#installation}

Zustand는 NPM 패키지로 사용할 수 있다:

```bash
npm install zustand
```

## 첫 스토어 만들기 {#first-create-a-store}

스토어는 훅(Hook)이다! 프리미티브, 객체, 함수 등 무엇이든 넣을 수 있다. `set` 함수는 상태를 병합한다.

```ts
import { create } from 'zustand';

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}));
```

## 컴포넌트에 바인딩하기 {#bind-your-components}

프로바이더가 없어도 어디서나 훅을 사용할 수 있다.상태를 선택하고 해당 상태가 변경될 때 상태를 사용하는 컴포넌트가 리렌더링된다.

```tsx
function BearCounter() {
  const bears = useStore((state) => state.bears);
  return <h1>{bears} around here...</h1>;
}

function Controls() {
  const increasePopulation = useStore((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
}
```
