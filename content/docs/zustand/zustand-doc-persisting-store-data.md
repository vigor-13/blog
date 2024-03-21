---
title: 스토어 데이터 유지하기
description:
date: 2024-03-19
tags: ['middleware']
references:
  [
    {
      key: 'Zustand 공식 문서',
      value: 'https://docs.pmnd.rs/zustand/integrations/persisting-store-data',
    },
  ]
---

Persist 미들웨어를 사용하면 Zustand 상태를 스토리지(예: `localStorage` , `AsyncStorage` , `IndexedDB` 등)에 저장하여 데이터를 지속시킬 수 있다.

이 미들웨어는 `localStorage` 와 같은 동기식 스토리지와 비동기식 스토리지인 `AsyncStorage` 를 모두 지원하지만 비동기식 스토리지를 사용하면 비용이 발생한다는 점에 유의한다.

## 간단한 예제 {#simple-example}

```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useBearStore = create(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
```

## 옵션 {#options}

### name {#option-name}

이것은 유일한 필수 옵션이다. 주어진 이름은 스토리지에 Zustand 상태를 저장하는 데 사용되는 키가 되므로 고유한 이름이어야 한다.

### storage {#option-storage}

## API {#api}

```

```
