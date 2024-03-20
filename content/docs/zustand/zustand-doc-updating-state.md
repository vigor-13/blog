---
title: 상태 업데이트하기
description:
date: 2024-03-18
tags: []
references:
  [
    {
      key: 'Zustand 공식 문서',
      value: 'https://docs.pmnd.rs/zustand/guides/updating-state',
    },
  ]
---

## Flat 업데이트 {#flat-updates}

Zustand로 상태를 업데이트하는 것은 간단하다! 새 상태와 함께 제공된 `set` 함수를 호출하면 스토어에 있는 기존 상태와 얕게 병합된다.

```tsx
import { create } from 'zustand';

type State = {
  firstName: string;
  lastName: string;
};

type Action = {
  updateFirstName: (firstName: State['firstName']) => void;
  updateLastName: (lastName: State['lastName']) => void;
};

// 상태 및 (선택 사항) 액션을 모두 포함하는 스토어를 생성한다.
const usePersonStore = create<State & Action>((set) => ({
  firstName: '',
  lastName: '',
  updateFirstName: (firstName) => set(() => ({ firstName: firstName })),
  updateLastName: (lastName) => set(() => ({ lastName: lastName })),
}));

function App() {
  // 필요한 상태 및 액션을 선택한다. 이 경우 firstName 과 updateFirstName 이다.
  const firstName = usePersonStore((state) => state.firstName);
  const updateFirstName = usePersonStore((state) => state.updateFirstName);

  return (
    <main>
      <label>
        First name
        <input
          // "firstName" 상태를 업데이트한다.
          onChange={(e) => updateFirstName(e.currentTarget.value)}
          value={firstName}
        />
      </label>

      <p>
        Hello, <strong>{firstName}!</strong>
      </p>
    </main>
  );
}
```

## 깊게 중첩된 객체 {#deeply-nested-object}

다음과 같은 깁게 중첩된 객체가 있는 경우:

```ts
type State = {
  deep: {
    nested: {
      obj: { count: number };
    };
  };
};
```

중첩 상태를 업데이트하려면 프로세스가 불변으로 완료되도록 하기 위해 약간의 노력이 필요하다.

### 일반적인 접근법 {#normal-approach}

React나 Redux와 유사하게, 일반적인 접근 방식은 상태 객체의 각 레벨을 복사하는 것이다. 이는 스프레드 연산자 `...` 를 사용하여 새 상태 값과 수동으로 병합하여 수행된다.

```ts
normalInc: () =>
  set((state) => ({
    deep: {
      ...state.deep,
      nested: {
        ...state.deep.nested,
        obj: {
          ...state.deep.nested.obj,
          count: state.deep.nested.obj.count + 1
        }
      }
    }
  })),
```

너무 번거롭다! 삶을 더 편하게 만들어줄 몇 가지 대안을 살펴보자.

### Immer {#with-immer}

많은 사람들이 중첩된 값을 업데이트할 때 [Immer](https://github.com/immerjs/immer)를 사용한다. Immer는 React, Redux는 물론 Zustand에서도 중첩된 상태를 업데이트해야 할 때 언제든지 사용할 수 있다!

Immer를 사용하면 깊게 중첩된 객체에 대한 상태 업데이트 시간을 단축할 수 있다.

```ts
immerInc: () =>
  set(produce((state: State) => { ++state.deep.nested.obj.count })),
```

코드가 많이 간소화 되었다! 하지만 [여기](https://docs.pmnd.rs/zustand/integrations/immer-middleware)에 나열된 문제점에 유의한다.

### optics-ts {#with-optics-ts}

[optics-ts](https://github.com/akheron/optics-ts/)를 사용하는 방법도 있다.

```ts
opticsInc: () =>
  set(O.modify(O.optic<State>().path("deep.nested.obj.count"))((c) => c + 1)),
```

Immer와 달리 optics-ts는 프록시나 뮤테이션 구문을 사용하지 않는다.

### Ramda {#with-ramda}

[Ramda](https://ramdajs.com/)를 사용하는 방법도 있다.

```ts
ramdaInc: () =>
  set(R.over(R.lensPath(["deep", "nested", "obj", "count"]), (c) => c + 1)),
```
